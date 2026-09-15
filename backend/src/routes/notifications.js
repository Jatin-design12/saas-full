const express = require('express');
const router = express.Router();
const db = require('../db');

// Ensure notifications table exists
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(100) PRIMARY KEY,
        mobile VARCHAR(50),
        rider_id VARCHAR(100),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'system',
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await db.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS mobile VARCHAR(50)`);
    await db.query(`ALTER TABLE notifications ADD COLUMN IF NOT EXISTS rider_id VARCHAR(100)`);
  } catch (e) {
    console.warn('Notifications table init notice:', e.message);
  }
})();

// General system broadcast fallback announcements
const GENERAL_BROADCASTS = [
  {
    id: 'notif-offer-04',
    title: '🎁 Special Offer Alert: 25% OFF',
    message: 'Use code EVEGAH25 to get 25% off on your next weekly package booking!',
    type: 'promo',
    read: false,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'notif-announce-05',
    title: '📢 System Announcement',
    message: 'EVegah 24x7 Stations are active across Gotri, Alkapuri & Subhanpura zones.',
    type: 'system',
    read: true,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

// GET /api/notifications — Rider-specific notifications
router.get('/', async (req, res) => {
  try {
    const rawMobile = req.query.mobile || req.headers['x-user-mobile'] || '';
    const cleanMobile = rawMobile.replace(/\D/g, '').slice(-10);

    const riderNotifications = [];

    if (cleanMobile) {
      // 1. Fetch DB notifications specifically for this mobile or general broadcast
      try {
        const result = await db.query(`
          SELECT * FROM notifications 
          WHERE (mobile LIKE $1 OR mobile IS NULL OR mobile = '')
          ORDER BY created_at DESC 
          LIMIT 30
        `, [`%${cleanMobile}%`]);
        if (result.rows.length > 0) {
          riderNotifications.push(...result.rows);
        }
      } catch (dbErr) {
        console.warn('Error reading notifications table:', dbErr.message);
      }

      // 2. Synthesize real rider-specific notifications from recent wallet transactions
      try {
        const walletTx = await db.query(`
          SELECT transaction_id, title, subtitle, amount, type, created_at
          FROM wallet_transactions
          WHERE mobile LIKE $1
          ORDER BY created_at DESC
          LIMIT 5
        `, [`%${cleanMobile}%`]);

        walletTx.rows.forEach(w => {
          const isCredit = (w.type || '').toLowerCase() === 'credit';
          riderNotifications.push({
            id: `notif-wlt-${w.transaction_id}`,
            title: isCredit ? `💳 Wallet Credited (+₹${w.amount})` : `⚡ Wallet Debited (-₹${w.amount})`,
            message: `${w.title || 'Transaction'}: ${w.subtitle || `₹${w.amount} processed`}`,
            type: 'payment',
            read: false,
            created_at: w.created_at
          });
        });
      } catch (_) {}

      // 3. Synthesize real rider-specific notifications from recent ride reservations
      try {
        const resTx = await db.query(`
          SELECT reservation_id, package_type, pickup_zone, status, fare, created_at
          FROM reservations
          WHERE mobile LIKE $1
          ORDER BY created_at DESC
          LIMIT 5
        `, [`%${cleanMobile}%`]);

        resTx.rows.forEach(r => {
          riderNotifications.push({
            id: `notif-res-${r.reservation_id}`,
            title: `🛵 EV Ride ${r.status || 'Confirmed'} (${r.reservation_id})`,
            message: `Your ${r.package_type || 'EV'} booking in ${r.pickup_zone || 'station'} is ${r.status || 'Confirmed'}.`,
            type: 'booking',
            read: false,
            created_at: r.created_at
          });
        });
      } catch (_) {}

      // Add general broadcast offers
      riderNotifications.push(...GENERAL_BROADCASTS);
    } else {
      // Unauthenticated or general viewer: only show general broadcasts
      try {
        const result = await db.query(`
          SELECT * FROM notifications 
          WHERE (mobile IS NULL OR mobile = '')
          ORDER BY created_at DESC 
          LIMIT 10
        `);
        if (result.rows.length > 0) {
          riderNotifications.push(...result.rows);
        } else {
          riderNotifications.push(...GENERAL_BROADCASTS);
        }
      } catch (_) {
        riderNotifications.push(...GENERAL_BROADCASTS);
      }
    }

    // Sort by created_at DESC & deduplicate by ID
    const seen = new Set();
    const unique = [];
    riderNotifications
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .forEach(n => {
        if (!seen.has(n.id)) {
          seen.add(n.id);
          unique.push(n);
        }
      });

    const unreadCount = unique.filter(r => !r.read).length;
    res.json({ status: 'success', data: unique, unreadCount });
  } catch (err) {
    console.error('Failed to get notifications:', err);
    res.json({ status: 'success', data: GENERAL_BROADCASTS, unreadCount: 1 });
  }
});

// POST /api/notifications (Create notification)
const createNotification = async (title, message, type = 'booking', mobile = null) => {
  const notif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    mobile: mobile || null,
    title,
    message,
    type,
    read: false,
    created_at: new Date().toISOString()
  };
  try {
    await db.query(`
      INSERT INTO notifications (id, mobile, title, message, type, read, created_at)
      VALUES ($1, $2, $3, $4, $5, false, NOW())
    `, [notif.id, notif.mobile, notif.title, notif.message, notif.type]);
  } catch (_) {}
  return notif;
};

router.post('/', async (req, res) => {
  const { title, message, type, mobile } = req.body;
  const notif = await createNotification(title || 'System Notification', message || '', type, mobile);
  res.json({ status: 'success', data: notif });
});

// POST /api/notifications/mark-read
router.post('/mark-read', async (req, res) => {
  try {
    const rawMobile = req.body.mobile || req.query.mobile || req.headers['x-user-mobile'] || '';
    const cleanMobile = rawMobile.replace(/\D/g, '').slice(-10);

    if (cleanMobile) {
      await db.query(
        "UPDATE notifications SET read = true WHERE mobile LIKE $1 OR mobile IS NULL OR mobile = ''",
        [`%${cleanMobile}%`]
      );
    } else {
      await db.query('UPDATE notifications SET read = true');
    }
  } catch (_) {}
  res.json({ status: 'success', message: 'Notifications marked as read' });
});

module.exports = router;
module.exports.createNotification = createNotification;

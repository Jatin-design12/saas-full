const express = require('express');
const router = express.Router();
const db = require('../db');

// In-memory notifications telemetry list
let MOCK_NOTIFICATIONS = [
  {
    id: 'notif-wallet-01',
    title: '💳 Wallet Top-Up Successful',
    message: '₹500.00 successfully added to your EVegah Wallet.',
    type: 'payment',
    read: false,
    created_at: new Date(Date.now() - 180000).toISOString()
  },
  {
    id: 'notif-booking-02',
    title: '🛵 EV Ride Booking Alert',
    message: 'Your EV Scooter reservation in Gotri Zone is confirmed & ready for pickup.',
    type: 'booking',
    read: false,
    created_at: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: 'notif-bms-03',
    title: '⚡ BMS Alert: Low Battery (18% SOC)',
    message: 'Vehicle battery is low (18% SOC). Swap at the nearest EVegah Swap Station.',
    type: 'alert',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
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

// GET /api/notifications
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 20');
    res.json({ status: 'success', data: result.rows, unreadCount: result.rows.filter(r => !r.read).length });
  } catch (err) {
    const unreadCount = MOCK_NOTIFICATIONS.filter(r => !r.read).length;
    res.json({ status: 'success', data: MOCK_NOTIFICATIONS, unreadCount });
  }
});

// POST /api/notifications (Create notification — helper function exported)
const createNotification = async (title, message, type = 'booking') => {
  const notif = {
    id: `notif-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    title,
    message,
    type,
    read: false,
    created_at: new Date().toISOString()
  };
  try {
    await db.query(`
      INSERT INTO notifications (id, title, message, type, read, created_at)
      VALUES ($1, $2, $3, $4, false, NOW())
    `, [notif.id, notif.title, notif.message, notif.type]);
  } catch (_) {}
  MOCK_NOTIFICATIONS.unshift(notif);
  return notif;
};

router.post('/', async (req, res) => {
  const { title, message, type } = req.body;
  const notif = await createNotification(title || 'New System Alert', message || '', type);
  res.json({ status: 'success', data: notif });
});

// POST /api/notifications/mark-read
router.post('/mark-read', async (req, res) => {
  try {
    await db.query('UPDATE notifications SET read = true');
  } catch (_) {}
  MOCK_NOTIFICATIONS.forEach(n => n.read = true);
  res.json({ status: 'success', message: 'All notifications marked as read' });
});

module.exports = router;
module.exports.createNotification = createNotification;

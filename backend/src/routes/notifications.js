const express = require('express');
const router = express.Router();
const db = require('../db');

// In-memory notifications telemetry list
let MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: '🎉 New Ride Reservation Confirmed',
    message: 'Rohit Sharma reserved E-Scooter EVM1024001 in Gotri Zone.',
    type: 'booking',
    read: false,
    created_at: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 'notif-2',
    title: '⚡ Low Battery SOC Alert',
    message: 'Battery BAT-GOTRI-09 dropped below 20% SOC in Gotri Station.',
    type: 'alert',
    read: false,
    created_at: new Date(Date.now() - 1200000).toISOString()
  },
  {
    id: 'notif-3',
    title: '📅 New Booking Request',
    message: 'Ananya Verma created a weekly booking request in Gotri Zone.',
    type: 'booking',
    read: false,
    created_at: new Date(Date.now() - 2400000).toISOString()
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

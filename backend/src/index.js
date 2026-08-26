require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-mobile', 'x-requested-with', 'Accept']
}));
app.options('*', cors());
app.use(express.json({ limit: '150mb' }));
app.use(express.urlencoded({ limit: '150mb', extended: true }));

const path = require('path');
app.use('/assets', express.static(path.join(__dirname, '../../frontend/public/assets')));
app.use('/assets', express.static(path.join(__dirname, '../../frontend/public')));

// Routes
app.use('/api/stats', require('./routes/stats'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/today-summary', require('./routes/todaySummary'));
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/batteries', require('./routes/batteries'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/renters', require('./routes/renters'));
app.use('/api/zones', require('./routes/zones'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/users', require('./routes/users'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/audit-logs', require('./routes/auditLogs'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/referral', require('./routes/referral'));
app.use('/api/wallet', require('./routes/wallet'));


// API endpoints for the Rider App
app.get('/api/v1/getzoneDetailWithBikeCountList', async (req, res) => {
  try {
    const result = await require('./db').query('SELECT * FROM zones ORDER BY created_at DESC');
    const formattedZones = await Promise.all(result.rows.map(async (z) => {
      let pts = [];
      try {
        pts = Array.isArray(z.points) ? z.points : JSON.parse(z.points || '[]');
      } catch(e) {}
      
      let center = { lat: 28.6315, lng: 77.2197 };
      if (pts.length > 0) {
        let sumLat = 0, sumLng = 0;
        pts.forEach(p => { sumLat += p.lat; sumLng += p.lng; });
        center = { lat: sumLat / pts.length, lng: sumLng / pts.length };
      }
      
      // Query real available vehicles count for this zone
      const bikeCountRes = await require('./db').query(
        "SELECT COUNT(*) FROM vehicles WHERE zone = $1 AND vehicle_status = 'Available'",
        [z.name]
      );
      const bikeCount = parseInt(bikeCountRes.rows[0].count) || 0;
      
      return {
        id: z.id,
        name: z.name,
        code: z.code,
        locality: z.locality,
        city: z.city,
        state: z.state,
        country: z.country,
        type: z.type,
        address: z.address || z.locality || `${z.name}, Vadodara, Gujarat`,
        image_url: z.image_url || 'assets/ev_vadodara.png',
        phone: z.phone || z.contact_number || '+91 98765 43210',
        map_link: z.map_link || `https://maps.google.com/?q=${encodeURIComponent(z.name + ', Vadodara')}`,
        open_time: z.open_time || '06:00 AM',
        close_time: z.close_time || '11:00 PM',
        is_24_hours: z.is_24_hours ?? true,
        pricing: z.pricing || {}
      };
    }));
    res.json({
      status: 'success',
      data: formattedZones
    });
  } catch (err) {
    console.error('Failed to get live zones for Rider App:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.post('/api/qrDecrypted', (req, res) => {
  const { qrString, lockNumber } = req.body;
  const resolvedLock = lockNumber || qrString || 'LCK-EVE-5678';
  res.json({
    status: 'success',
    data: [
      {
        lockNumber: resolvedLock,
        status: 'decrypted'
      }
    ]
  });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Evegah Backend running on http://localhost:${PORT}`);
});

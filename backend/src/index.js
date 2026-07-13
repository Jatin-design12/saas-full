require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow mobile apps (no origin)
    if (!origin) return callback(null, true);
    
    // Check if it's local or local network
    const isLocal = origin.startsWith('http://localhost') || 
                    origin.startsWith('http://127.0.0.1') ||
                    origin.startsWith('http://192.168.') ||
                    origin.startsWith('http://10.') ||
                    origin.startsWith('http://172.');
                    
    if (isLocal || origin === process.env.FRONTEND_URL) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback to allow in dev/local environments
    }
  },
  credentials: true
}));
app.use(express.json());

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
        status: z.status,
        max_vehicles: z.max_vehicles,
        bikeCount: bikeCount,
        center: center,
        points: pts,
        address: z.address || '',
        image_url: z.image_url || '',
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

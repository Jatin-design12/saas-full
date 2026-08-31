const express = require('express');
const router = express.Router();
const db = require('../db');

// Ensure zone schema columns exist
(async () => {
  try {
    await db.query('ALTER TABLE zones ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT \'+91 98765 43210\'');
    await db.query('ALTER TABLE zones ADD COLUMN IF NOT EXISTS open_time VARCHAR(20) DEFAULT \'06:00 AM\'');
    await db.query('ALTER TABLE zones ADD COLUMN IF NOT EXISTS close_time VARCHAR(20) DEFAULT \'11:00 PM\'');
    await db.query('ALTER TABLE zones ADD COLUMN IF NOT EXISTS is_24_hours BOOLEAN DEFAULT false');
    await db.query('ALTER TABLE zones ALTER COLUMN image_url TYPE TEXT');
  } catch (e) {
    console.error('Migration error for zones columns:', e);
  }
})();

const MOCK_ZONES = [
  {
    id: 1,
    name: 'Manjalpur Zone - Vadodara',
    code: 'ZONE-MJ-001',
    locality: 'Manjalpur',
    city: 'Vadodara',
    address: 'Manjalpur, Vadodara, Gujarat',
    phone: '+91 8980966677',
    lat: 22.2684,
    lng: 73.1952,
    image_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=60',
    center: { lat: 22.2684, lng: 73.1952 },
    points: [{ lat: 22.2684, lng: 73.1952 }],
    pricing: {
      pricingModel: 'Package Based',
      packages: [
        { id: 1, name: '3 Days Package', duration: 3, price: 899 },
        { id: 2, name: '5 Days Package', duration: 5, price: 1399 },
        { id: 3, name: '7 Days Package', duration: 7, price: 1899 },
        { id: 4, name: '10 Days Package', duration: 10, price: 2499 }
      ]
    }
  },
  {
    id: 2,
    name: 'Gotri Zone',
    code: 'ZONE-GT-002',
    locality: 'Gotri',
    city: 'Vadodara',
    address: 'Gotri Main Road, Vadodara, Gujarat',
    phone: '+91 98765 43210',
    lat: 22.3168,
    lng: 73.1415,
    image_url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&auto=format&fit=crop&q=60',
    center: { lat: 22.3168, lng: 73.1415 },
    points: [{ lat: 22.3168, lng: 73.1415 }],
    pricing: {
      pricingModel: 'Package Based',
      packages: [
        { id: 1, name: '3 Days Package', duration: 3, price: 899 },
        { id: 2, name: '5 Days Package', duration: 5, price: 1399 },
        { id: 3, name: '7 Days Package', duration: 7, price: 1899 },
        { id: 4, name: '10 Days Package', duration: 10, price: 2499 }
      ]
    }
  },
  {
    id: 3,
    name: 'Aatapi Zone',
    code: 'ZONE-AT-003',
    locality: 'Ajwa Road',
    city: 'Vadodara',
    address: 'Evegah Aatapi Wonderland, Ajwa Rd, Vadodara',
    phone: '+91 8980966098',
    lat: 22.3615,
    lng: 73.3524,
    image_url: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=60',
    center: { lat: 22.3615, lng: 73.3524 },
    points: [{ lat: 22.3615, lng: 73.3524 }],
    pricing: {
      pricingModel: 'Hourly Based',
      hourlyPricing: [{ id: 1, model: 'Evegah City', basePrice: 80, extraPrice: 10 }],
      packages: [
        { id: 1, name: 'Day Pass', duration: 1, price: 350 },
        { id: 2, name: 'Weekend Pass', duration: 2, price: 650 }
      ]
    }
  },
  {
    id: 4,
    name: 'KPGU Zone',
    code: 'ZONE-KPG-004',
    locality: 'KPGU Campus',
    city: 'Vadodara',
    address: 'KPGU, Manjalpur, Vadodara, Gujarat',
    phone: '+91 98765 43210',
    lat: 22.2510,
    lng: 73.2140,
    image_url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&auto=format&fit=crop&q=60',
    center: { lat: 22.2510, lng: 73.2140 },
    points: [{ lat: 22.2510, lng: 73.2140 }],
    pricing: {
      pricingModel: 'Package Based',
      packages: [
        { id: 1, name: '3 Days Starter', duration: 3, price: 799 },
        { id: 2, name: '7 Days Value', duration: 7, price: 1699 }
      ]
    }
  },
  {
    id: 5,
    name: 'Moti Daman Zone',
    code: 'ZONE-DMN-005',
    locality: 'Moti Daman',
    city: 'Daman',
    address: 'Moti Daman, Daman, Dadra Nagar & Haveli',
    phone: '+91 98765 43210',
    lat: 20.4075,
    lng: 72.8335,
    image_url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=60',
    center: { lat: 20.4075, lng: 72.8335 },
    points: [{ lat: 20.4075, lng: 72.8335 }],
    pricing: {
      pricingModel: 'Hourly Based',
      packages: [
        { id: 1, name: 'Coastal Day Pass', duration: 1, price: 450 },
        { id: 2, name: 'Beach Weekend 3D', duration: 3, price: 1199 }
      ]
    }
  }
];

// GET /api/zones
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM zones ORDER BY created_at DESC');
    if (result.rows && result.rows.length > 0) {
      res.json({
        status: 'success',
        data: result.rows
      });
    } else {
      res.json({
        status: 'success',
        data: MOCK_ZONES
      });
    }
  } catch (err) {
    console.warn('Failed to get zones from DB, returning MOCK_ZONES fallback:', err.message);
    res.json({
      status: 'success',
      data: MOCK_ZONES
    });
  }
});

// POST /api/zones (Save newly drawn zone)
router.post('/', async (req, res) => {
  const {
    name,
    code,
    country,
    state,
    city,
    locality,
    type,
    priority,
    status,
    timezone,
    description,
    start_date,
    end_date,
    max_vehicles,
    notes,
    map_link,
    points,
    address,
    image_url,
    phone,
    pricing
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO zones (name, code, country, state, city, locality, type, priority, status, timezone, description, start_date, end_date, max_vehicles, notes, map_link, points, address, image_url, phone, pricing)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *
    `, [name, code, country, state, city, locality, type, priority, status || 'active', timezone, description, start_date || null, end_date || null, max_vehicles || 0, notes, map_link, JSON.stringify(points), address || '', image_url || '', phone || '+91 98765 43210', JSON.stringify(pricing || {})]);

    res.json({
      status: 'success',
      message: 'Zone added successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to insert zone into DB:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// PUT /api/zones/:id (Edit zone)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    code,
    country,
    state,
    city,
    locality,
    type,
    priority,
    status,
    timezone,
    description,
    start_date,
    end_date,
    max_vehicles,
    notes,
    map_link,
    points,
    address,
    image_url,
    phone,
    pricing
  } = req.body;

  try {
    const result = await db.query(`
      UPDATE zones 
      SET name = $1, code = $2, country = $3, state = $4, city = $5, locality = $6, type = $7, priority = $8, status = $9, timezone = $10, description = $11, start_date = $12, end_date = $13, max_vehicles = $14, notes = $15, map_link = $16, points = $17, address = $18, image_url = $19, phone = $20, pricing = $21
      WHERE id = $22
      RETURNING *
    `, [name, code, country, state, city, locality, type, priority, status || 'active', timezone, description, start_date || null, end_date || null, max_vehicles || 0, notes, map_link, JSON.stringify(points), address || '', image_url || '', phone || '+91 98765 43210', JSON.stringify(pricing || {}), id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Zone not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Zone updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to update zone in DB:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// DELETE /api/zones/:id (Delete zone)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM zones WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Zone not found'
      });
    }
    res.json({
      status: 'success',
      message: 'Zone deleted successfully'
    });
  } catch (err) {
    console.error('Failed to delete zone from DB:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

module.exports = router;

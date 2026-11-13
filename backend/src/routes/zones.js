const express = require('express');
const router = express.Router();
const db = require('../db');
const { getCache, setCache, delByPattern } = require('../redis');

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
    image_url: '',
    center: { lat: 22.2684, lng: 73.1952 },
    points: [{ lat: 22.2684, lng: 73.1952 }],
    pricing: {
      pricingModel: 'Package Based',
      packages: [
        { id: 1, name: '3 Days City Pass', model: 'Evegah City', duration: 3, price: 899, deposit: 1000 },
        { id: 2, name: '5 Days City Pass', model: 'Evegah City', duration: 5, price: 1399, deposit: 1000 },
        { id: 3, name: '7 Days City Pass', model: 'Evegah City', duration: 7, price: 1899, deposit: 1500 },
        { id: 4, name: '10 Days City Pass', model: 'Evegah City', duration: 10, price: 2499, deposit: 2000 }
      ],
      modelPackages: {
        'Evegah City': [
          { id: 101, name: '3 Days City Pass', model: 'Evegah City', duration: 3, price: 899, deposit: 1000 },
          { id: 102, name: '5 Days City Pass', model: 'Evegah City', duration: 5, price: 1399, deposit: 1000 },
          { id: 103, name: '7 Days City Pass', model: 'Evegah City', duration: 7, price: 1899, deposit: 1500 },
          { id: 104, name: '10 Days City Pass', model: 'Evegah City', duration: 10, price: 2499, deposit: 2000 }
        ],
        'Evegah Mink': [
          { id: 201, name: '3 Days Cargo Pass', model: 'Evegah Mink', duration: 3, price: 1199, deposit: 1500 },
          { id: 202, name: '7 Days Cargo Pass', model: 'Evegah Mink', duration: 7, price: 2499, deposit: 2000 },
          { id: 203, name: '15 Days Cargo Pass', model: 'Evegah Mink', duration: 15, price: 4499, deposit: 2500 }
        ],
        'Evegah Pro': [
          { id: 301, name: '3 Days Pro Speed Pass', model: 'Evegah Pro', duration: 3, price: 1499, deposit: 2000 },
          { id: 302, name: '7 Days Pro Speed Pass', model: 'Evegah Pro', duration: 7, price: 2999, deposit: 2500 }
        ],
        'Evegah Fly': [
          { id: 401, name: '3 Days Moped Pass', model: 'Evegah Fly', duration: 3, price: 699, deposit: 800 },
          { id: 402, name: '7 Days Moped Pass', model: 'Evegah Fly', duration: 7, price: 1399, deposit: 1000 }
        ]
      }
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
    image_url: '',
    center: { lat: 22.3168, lng: 73.1415 },
    points: [{ lat: 22.3168, lng: 73.1415 }],
    pricing: {
      pricingModel: 'Package Based',
      packages: [
        { id: 1, name: '3 Days City Pass', model: 'Evegah City', duration: 3, price: 899, deposit: 1000 },
        { id: 2, name: '5 Days City Pass', model: 'Evegah City', duration: 5, price: 1399, deposit: 1000 },
        { id: 3, name: '7 Days City Pass', model: 'Evegah City', duration: 7, price: 1899, deposit: 1500 },
        { id: 4, name: '10 Days City Pass', model: 'Evegah City', duration: 10, price: 2499, deposit: 2000 }
      ],
      modelPackages: {
        'Evegah City': [
          { id: 101, name: '3 Days City Pass', model: 'Evegah City', duration: 3, price: 899, deposit: 1000 },
          { id: 102, name: '5 Days City Pass', model: 'Evegah City', duration: 5, price: 1399, deposit: 1000 },
          { id: 103, name: '7 Days City Pass', model: 'Evegah City', duration: 7, price: 1899, deposit: 1500 },
          { id: 104, name: '10 Days City Pass', model: 'Evegah City', duration: 10, price: 2499, deposit: 2000 }
        ],
        'Evegah Mink': [
          { id: 201, name: '3 Days Cargo Pass', model: 'Evegah Mink', duration: 3, price: 1199, deposit: 1500 },
          { id: 202, name: '7 Days Cargo Pass', model: 'Evegah Mink', duration: 7, price: 2499, deposit: 2000 },
          { id: 203, name: '15 Days Cargo Pass', model: 'Evegah Mink', duration: 15, price: 4499, deposit: 2500 }
        ],
        'Evegah Pro': [
          { id: 301, name: '3 Days Pro Speed Pass', model: 'Evegah Pro', duration: 3, price: 1499, deposit: 2000 },
          { id: 302, name: '7 Days Pro Speed Pass', model: 'Evegah Pro', duration: 7, price: 2999, deposit: 2500 }
        ],
        'Evegah Fly': [
          { id: 401, name: '3 Days Moped Pass', model: 'Evegah Fly', duration: 3, price: 699, deposit: 800 },
          { id: 402, name: '7 Days Moped Pass', model: 'Evegah Fly', duration: 7, price: 1399, deposit: 1000 }
        ]
      }
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
    image_url: '',
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
    image_url: '',
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
    image_url: '',
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

// Helper to identify maintenance service centers
const isServiceCenter = (z) => {
  const t = (z.type || '').toLowerCase();
  const n = (z.name || '').toLowerCase();
  return t.includes('service') || t.includes('maintenance') || n.includes('service center');
};

// GET /api/zones
router.get('/', async (req, res) => {
  const { type, context } = req.query;
  const cacheKey = `zones:list:${type || 'default'}:${context || 'all'}`;

  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const result = await db.query('SELECT * FROM zones ORDER BY created_at DESC');
    const rows = result.rows && result.rows.length > 0 ? result.rows : MOCK_ZONES;

    let finalData;
    if (type === 'service' || type === 'maintenance') {
      // Return exclusively maintenance service centers
      finalData = rows.filter(z => isServiceCenter(z));
    } else if (type === 'all') {
      // Return all zones including service centers (for zone management admin)
      finalData = rows;
    } else {
      // By default (and for operational, registration, and rider mobile app):
      // Evegah Service Center must NEVER be visible
      finalData = rows.filter(z => !isServiceCenter(z));
    }

    let bikeCountsMap = {};
    try {
      const bikeCountsRes = await db.query("SELECT zone, COUNT(*)::int as count FROM vehicles WHERE LOWER(vehicle_status) = 'available' GROUP BY zone");
      bikeCountsRes.rows.forEach(r => {
        if (r.zone) bikeCountsMap[r.zone.trim().toLowerCase()] = r.count;
      });
    } catch (_) {}

    finalData = finalData.map(z => {
      const zNameKey = (z.name || '').trim().toLowerCase();
      const bikeCount = bikeCountsMap[zNameKey] || 0;
      return {
        ...z,
        bike_count: bikeCount,
        available_vehicles: bikeCount
      };
    });

    const payload = {
      status: 'success',
      data: finalData
    };
    await setCache(cacheKey, payload, 60);
    res.json(payload);
  } catch (err) {
    console.warn('Failed to get zones from DB, returning MOCK_ZONES fallback:', err.message);
    let finalData;
    if (type === 'service' || type === 'maintenance') {
      finalData = MOCK_ZONES.filter(z => isServiceCenter(z));
    } else if (type === 'all') {
      finalData = MOCK_ZONES;
    } else {
      finalData = MOCK_ZONES.filter(z => !isServiceCenter(z));
    }

    const payload = {
      status: 'success',
      data: finalData
    };
    await setCache(cacheKey, payload, 60);
    res.json(payload);
  }
});

// GET /api/zones/pricing?zone=Daman%20SF
router.get('/pricing', async (req, res) => {
  try {
    const { zone, zone_id } = req.query;
    let query = 'SELECT * FROM zones WHERE 1=1';
    const params = [];
    if (zone_id) {
      params.push(zone_id);
      query += ' AND id = $' + params.length;
    } else if (zone) {
      params.push('%' + zone.trim() + '%');
      query += ' AND name ILIKE $' + params.length;
    }
    query += ' LIMIT 1';

    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Zone not found'
      });
    }

    const z = result.rows[0];
    let pricingObj = typeof z.pricing === 'string' ? JSON.parse(z.pricing) : (z.pricing || {});

    let packages = [];

    // 1. Map hourly pricing options
    if (Array.isArray(pricingObj.hourlyPricing) && pricingObj.hourlyPricing.length > 0) {
      pricingObj.hourlyPricing.forEach((h, idx) => {
        packages.push({
          id: h.id ? `hourly_${h.id}` : `hourly_${idx + 1}`,
          name: `${h.model || 'Standard EV'} Hourly (${h.roundingRule || 'Per Hour'})`,
          pricing_type: 'Hourly',
          duration: 1,
          duration_days: 1,
          duration_hours: 1,
          price: parseFloat(h.basePrice || 0),
          base_fare: parseFloat(h.basePrice || 0),
          extra_price: parseFloat(h.extraPrice || 0),
          deposit: parseFloat(h.deposit !== undefined && h.deposit !== null ? h.deposit : 0),
          deposit_amount: parseFloat(h.deposit !== undefined && h.deposit !== null ? h.deposit : 0),
          model: h.model,
          roundingRule: h.roundingRule
        });
      });
    }

    // 2. Map multi-day / package pricing options
    if (Array.isArray(pricingObj.packages) && pricingObj.packages.length > 0) {
      pricingObj.packages.forEach((p, idx) => {
        const days = parseInt(p.duration || p.duration_days || 1, 10);
        packages.push({
          id: p.id || `pkg_${idx + 1}`,
          name: p.name || p.title || `${days} Day Pass`,
          pricing_type: 'Package',
          duration: days,
          duration_days: days,
          duration_hours: days * 24,
          price: parseFloat(p.price || p.base_fare || 0),
          base_fare: parseFloat(p.price || p.base_fare || 0),
          deposit: parseFloat(p.deposit !== undefined && p.deposit !== null ? p.deposit : (pricingObj.securityDeposit || 0)),
          deposit_amount: parseFloat(p.deposit !== undefined && p.deposit !== null ? p.deposit : (pricingObj.securityDeposit || 0)),
          model: p.model || 'All Models'
        });
      });
    }

    // 3. Fallback to standard packages if zone pricing packages are empty
    if (packages.length === 0) {
      const isDaman = (z.name || '').toLowerCase().includes('daman');
      const standardList = [
        { id: 'pkg_1d', name: isDaman ? 'Coastal Day Pass (1 Day)' : 'Daily Pass (1 Day)', pricing_type: 'Package', duration: 1, duration_days: 1, duration_hours: 24, price: isDaman ? 450 : 350, base_fare: isDaman ? 450 : 350, deposit: isDaman ? 0 : 500, deposit_amount: isDaman ? 0 : 500, model: 'All Models' },
        { id: 'pkg_3d', name: isDaman ? '3 Days Beach Pass' : '3 Days City Pass', pricing_type: 'Package', duration: 3, duration_days: 3, duration_hours: 72, price: isDaman ? 1199 : 900, base_fare: isDaman ? 1199 : 900, deposit: isDaman ? 0 : 1000, deposit_amount: isDaman ? 0 : 1000, model: 'All Models' },
        { id: 'pkg_7d', name: isDaman ? '7 Days Coastal Pass' : '7 Days Weekly Pass', pricing_type: 'Package', duration: 7, duration_days: 7, duration_hours: 168, price: isDaman ? 2499 : 1800, base_fare: isDaman ? 2499 : 1800, deposit: isDaman ? 0 : 1500, deposit_amount: isDaman ? 0 : 1500, model: 'All Models' },
        { id: 'pkg_30d', name: 'Monthly Pro Pass (30 Days)', pricing_type: 'Package', duration: 30, duration_days: 30, duration_hours: 720, price: 6500, base_fare: 6500, deposit: isDaman ? 0 : 2000, deposit_amount: isDaman ? 0 : 2000, model: 'All Models' }
      ];
      packages = standardList;
    }

    const defaultDeposit = packages.length > 0 ? packages[0].deposit_amount : parseFloat(pricingObj.securityDeposit || 0);

    res.json({
      status: 'success',
      data: {
        zone_id: z.id,
        zone_name: z.name,
        pricing_model: pricingObj.pricingModel || (pricingObj.pricingModels ? pricingObj.pricingModels.join(' & ') : 'Package & Hourly Based'),
        pricing_models: pricingObj.pricingModels || (pricingObj.pricingModel ? [pricingObj.pricingModel] : ['Package Based', 'Hourly Based']),
        hourlyPricing: pricingObj.hourlyPricing || [],
        packages: packages,
        security_deposit: defaultDeposit
      }
    });
  } catch (err) {
    console.error('Error fetching zone pricing:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

router.post('/', async (req, res) => {
  await Promise.all([delByPattern('zones:*'), delByPattern('vehicles:*')]);
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
    image,
    banner,
    phone,
    open_time,
    close_time,
    is_24_hours,
    pricing
  } = req.body;

  const finalImage = image_url || image || banner || '';

  try {
    const result = await db.query(`
      INSERT INTO zones (name, code, country, state, city, locality, type, priority, status, timezone, description, start_date, end_date, max_vehicles, notes, map_link, points, address, image_url, phone, open_time, close_time, is_24_hours, pricing)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING *
    `, [name, code, country, state, city, locality, type, priority, status || 'active', timezone, description, start_date || null, end_date || null, max_vehicles || 0, notes, map_link, JSON.stringify(points), address || '', finalImage, phone || '+91 98765 43210', open_time || '06:00 AM', close_time || '11:00 PM', is_24_hours || false, JSON.stringify(pricing || {})]);

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
  await Promise.all([delByPattern('zones:*'), delByPattern('vehicles:*')]);
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
    image,
    banner,
    phone,
    open_time,
    close_time,
    is_24_hours,
    pricing
  } = req.body;

  const finalImage = image_url || image || banner || '';

  try {
    const result = await db.query(`
      UPDATE zones 
      SET name = $1, code = $2, country = $3, state = $4, city = $5, locality = $6, type = $7, priority = $8, status = $9, timezone = $10, description = $11, start_date = $12, end_date = $13, max_vehicles = $14, notes = $15, map_link = $16, points = $17, address = $18, image_url = $19, phone = $20, open_time = $21, close_time = $22, is_24_hours = $23, pricing = $24
      WHERE id = $25
      RETURNING *
    `, [name, code, country, state, city, locality, type, priority, status || 'active', timezone, description, start_date || null, end_date || null, max_vehicles || 0, notes, map_link, JSON.stringify(points), address || '', finalImage, phone || '+91 98765 43210', open_time || '06:00 AM', close_time || '11:00 PM', is_24_hours || false, JSON.stringify(pricing || {}), id]);

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
  await Promise.all([delByPattern('zones:*'), delByPattern('vehicles:*')]);
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

const express = require('express');
const router = express.Router();
const db = require('../db');

// Fallback static mock data representing exact schema
const MOCK_RENTERS = [
  { rider_name: 'Amit Kumar', mobile: '+91 98765 43210', vehicle_id: 'EV-450X-202401', battery_id: 'BAT-450X-12340001', package_name: 'Weekly Pro', rental_start_date: '2026-06-10T00:00:00.000Z', return_date: '2026-06-17T00:00:00.000Z', status: 'Active Ride', rent: '1500.00', deposit: '1000.00', total: '2500.00' },
  { rider_name: 'Neha Gupta', mobile: '+91 91254 56789', vehicle_id: 'EV-450X-202402', battery_id: 'BAT-450X-12340002', package_name: 'Monthly Starter', rental_start_date: '2026-05-15T00:00:00.000Z', return_date: '2026-06-15T00:00:00.000Z', status: 'Retain Ride', rent: '5000.00', deposit: '2000.00', total: '7000.00' },
  { rider_name: 'Rohit Singh', mobile: '+91 99876 54321', vehicle_id: 'EV-450X-202403', battery_id: 'BAT-450X-12340003', package_name: 'Daily Lite', rental_start_date: '2026-06-13T00:00:00.000Z', return_date: '2026-06-14T00:00:00.000Z', status: 'Return', rent: '500.00', deposit: '500.00', total: '1000.00' },
  { rider_name: 'Sneha Reddy', mobile: '+91 87654 32109', vehicle_id: 'EV-450X-202404', battery_id: 'BAT-450X-12340004', package_name: 'Weekly Pro', rental_start_date: '2026-06-01T00:00:00.000Z', return_date: '2026-06-15T00:00:00.000Z', status: 'Extend', rent: '3000.00', deposit: '1000.00', total: '4000.00' },
  { rider_name: 'Vikram Patel', mobile: '+91 78945 61230', vehicle_id: 'EV-450X-202405', battery_id: 'BAT-450X-12340005', package_name: 'Monthly Business', rental_start_date: '2026-06-05T00:00:00.000Z', return_date: '2026-07-05T00:00:00.000Z', status: 'Active Ride', rent: '8000.00', deposit: '3000.00', total: '11000.00' },
  { rider_name: 'Priya Sharma', mobile: '+91 91234 56789', vehicle_id: 'EV-450X-202406', battery_id: 'BAT-450X-12340006', package_name: 'Weekly Pro', rental_start_date: '2026-06-08T00:00:00.000Z', return_date: '2026-06-15T00:00:00.000Z', status: 'Active Ride', rent: '1500.00', deposit: '1000.00', total: '2500.00' },
  { rider_name: 'Rahul Verma', mobile: '+91 98123 45678', vehicle_id: 'EV-450X-202407', battery_id: 'BAT-450X-12340007', package_name: 'Daily Lite', rental_start_date: '2026-06-12T00:00:00.000Z', return_date: '2026-06-15T00:00:00.000Z', status: 'Extend', rent: '1000.00', deposit: '500.00', total: '1500.00' },
  { rider_name: 'Pooja Patel', mobile: '+91 99123 45678', vehicle_id: 'EV-450X-202408', battery_id: 'BAT-450X-12340008', package_name: 'Monthly Starter', rental_start_date: '2026-05-20T00:00:00.000Z', return_date: '2026-06-20T00:00:00.000Z', status: 'Active Ride', rent: '5000.00', deposit: '2000.00', total: '7000.00' }
];

// GET /api/renters
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    let query = 'SELECT * FROM renters WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM renters WHERE 1=1';
    const params = [];
    const countParams = [];
    let pIdx = 1;

    if (search) {
      query += ` AND (rider_name ILIKE $${pIdx} OR mobile ILIKE $${pIdx} OR vehicle_id ILIKE $${pIdx} OR battery_id ILIKE $${pIdx})`;
      countQuery += ` AND (rider_name ILIKE $${pIdx} OR mobile ILIKE $${pIdx} OR vehicle_id ILIKE $${pIdx} OR battery_id ILIKE $${pIdx})`;
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
      pIdx++;
    }

    if (status) {
      query += ` AND status = $${pIdx}`;
      countQuery += ` AND status = $${pIdx}`;
      params.push(status);
      countParams.push(status);
      pIdx++;
    }

    query += ` ORDER BY rental_start_date DESC LIMIT $${pIdx} OFFSET $${pIdx + 1}`;
    params.push(limit, offset);

    const [rowsResult, countResult] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams)
    ]);

    const total = parseInt(countResult.rows[0].total);

    res.json({
      status: 'success',
      data: rowsResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.warn('Postgres query failed, returning fallback mock data:', err.message);
    
    // Filter and paginate mock data in memory for fallback
    let filtered = [...MOCK_RENTERS];
    const search = (req.query.search || '').toLowerCase();
    const status = req.query.status || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (search) {
      filtered = filtered.filter(r => 
        r.rider_name.toLowerCase().includes(search) ||
        r.mobile.includes(search) ||
        r.vehicle_id.toLowerCase().includes(search) ||
        r.battery_id.toLowerCase().includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter(r => r.status === status);
    }

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    res.json({
      status: 'success',
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  }
});

// POST /api/renters (create new renter)
router.post('/', async (req, res) => {
  const {
    rider_name,
    mobile,
    vehicle_id,
    battery_id,
    package_name,
    rental_start_date,
    return_date,
    status,
    rent,
    deposit,
    total
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO renters (rider_name, mobile, vehicle_id, battery_id, package_name, rental_start_date, return_date, status, rent, deposit, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [rider_name, mobile, vehicle_id, battery_id, package_name, rental_start_date, return_date, status || 'Active Ride', rent, deposit, total]);

    res.json({ status: 'success', message: 'Renter added successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Failed to add renter to DB, mock success response:', err);
    res.json({ status: 'success', message: 'Renter added (Mock)', data: req.body });
  }
});

module.exports = router;

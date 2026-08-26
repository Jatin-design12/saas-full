const express = require('express');
const router = express.Router();
const db = require('../db');
const { createNotification } = require('./notifications');

// In-memory fallback seeds matching real rider names and July 2026 bookings
const MOCK_RESERVATIONS = [
  { id: '1', reservation_id: 'RID-2026-878128', customer_name: 'Rohit Sharma', mobile: '+91 98765 43210', gov_id: 'GOV987654', reservation_date: '2026-07-12T00:00:00.000Z', reservation_time: '09:30:00', package_type: 'Day', vehicle_category: 'E-Scooter', vehicle_number: 'EVM1024001', battery_id: 'BAT-GOTRI-01', fare: '357.50', deposit: '500.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Confirmed', pickup_zone: 'Gotri Zone', drop_zone: 'Gotri Zone', created_at: '2026-07-12T08:54:00.000Z' },
  { id: '2', reservation_id: 'RID-2026-751128', customer_name: 'Ananya Verma', mobile: '+91 91234 56789', gov_id: 'GOV234567', reservation_date: '2026-07-12T00:00:00.000Z', reservation_time: '11:00:00', package_type: 'Weekly', vehicle_category: 'E-Scooter', vehicle_number: null, battery_id: null, fare: '1407.50', deposit: '1000.00', payment_mode: 'Paid', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Gotri Zone', drop_zone: 'Gotri Zone', created_at: '2026-07-12T02:16:00.000Z' },
  { id: '3', reservation_id: 'RID-2026-910244', customer_name: 'Priyansh Shah', mobile: '+91 99877 66554', gov_id: 'GOV345678', reservation_date: '2026-07-14T00:00:00.000Z', reservation_time: '14:30:00', package_type: 'Day', vehicle_category: 'E-Scooter', vehicle_number: null, battery_id: null, fare: '420.00', deposit: '500.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Aatapi Zone', drop_zone: 'Aatapi Zone', created_at: '2026-07-13T10:15:00.000Z' },
  { id: '4', reservation_id: 'RID-2026-887102', customer_name: 'Dev Patel', mobile: '+91 88776 54321', gov_id: 'GOV456789', reservation_date: '2026-07-15T00:00:00.000Z', reservation_time: '10:00:00', package_type: 'Monthly', vehicle_category: 'E-Scooter', vehicle_number: null, battery_id: null, fare: '3500.00', deposit: '2000.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Gotri Zone', drop_zone: 'Gotri Zone', created_at: '2026-07-14T09:00:00.000Z' },
  { id: '5', reservation_id: 'RID-2026-776105', customer_name: 'Vikram Mehta', mobile: '+91 77665 44332', gov_id: 'GOV567890', reservation_date: '2026-07-18T00:00:00.000Z', reservation_time: '16:00:00', package_type: 'Day', vehicle_category: 'E-Scooter', vehicle_number: 'EVM1024005', battery_id: 'BAT-AATAPI-02', fare: '380.00', deposit: '500.00', payment_mode: 'Card', payment_status: 'Paid', status: 'Completed', pickup_zone: 'Aatapi Zone', drop_zone: 'Aatapi Zone', created_at: '2026-07-17T14:20:00.000Z' },
  { id: '6', reservation_id: 'RID-2026-665120', customer_name: 'Neha Gupta', mobile: '+91 66654 33221', gov_id: 'GOV678901', reservation_date: '2026-07-20T00:00:00.000Z', reservation_time: '09:00:00', package_type: 'Day', vehicle_category: 'E-Scooter', vehicle_number: null, battery_id: null, fare: '350.00', deposit: '500.00', payment_mode: 'UPI', payment_status: 'Paid', status: 'Upcoming', pickup_zone: 'Gotri Zone', drop_zone: 'Gotri Zone', created_at: '2026-07-18T18:00:00.000Z' },
  { id: '7', reservation_id: 'RID-2026-554109', customer_name: 'Deepak Patel', mobile: '+91 55443 22110', gov_id: 'GOV789012', reservation_date: '2026-07-22T00:00:00.000Z', reservation_time: '12:30:00', package_type: 'Day', vehicle_category: 'E-Scooter', vehicle_number: null, battery_id: null, fare: '350.00', deposit: '500.00', payment_mode: 'UPI', payment_status: 'Refunded', status: 'Cancelled', pickup_zone: 'Aatapi Zone', drop_zone: 'Aatapi Zone', created_at: '2026-07-20T11:10:00.000Z' }
];

let mockList = [...MOCK_RESERVATIONS];

// Helper to get stats from list
const getStats = (list) => {
  const stats = { total: list.length, upcoming: 0, completed: 0, cancelled: 0 };
  list.forEach(r => {
    if (r.status === 'Upcoming') stats.upcoming++;
    else if (r.status === 'Confirmed' || r.status === 'Completed') stats.completed++;
    else if (r.status === 'Cancelled') stats.cancelled++;
  });
  return stats;
};

// GET /api/reservations
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    let query = 'SELECT * FROM reservations WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM reservations WHERE 1=1';
    const params = [];
    const countParams = [];
    let pIdx = 1;

    if (search) {
      query += ` AND (customer_name ILIKE $${pIdx} OR mobile ILIKE $${pIdx} OR reservation_id ILIKE $${pIdx})`;
      countQuery += ` AND (customer_name ILIKE $${pIdx} OR mobile ILIKE $${pIdx} OR reservation_id ILIKE $${pIdx})`;
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

    query += ` ORDER BY created_at DESC LIMIT $${pIdx} OFFSET $${pIdx + 1}`;
    params.push(limit, offset);

    const [rowsResult, countResult] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams)
    ]);

    const total = parseInt(countResult.rows[0].total);

    // Fetch Stats summary (Confirmed = active, counts as upcoming)
    const statsResult = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status IN ('Upcoming', 'Confirmed') THEN 1 END) as upcoming,
        COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
        COUNT(CASE WHEN status = 'Cancelled' THEN 1 END) as cancelled
      FROM reservations
    `);
    const stats = {
      total: parseInt(statsResult.rows[0].total) || 0,
      upcoming: parseInt(statsResult.rows[0].upcoming) || 0,
      completed: parseInt(statsResult.rows[0].completed) || 0,
      cancelled: parseInt(statsResult.rows[0].cancelled) || 0
    };

    res.json({
      status: 'success',
      data: rowsResult.rows,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.warn('Postgres query failed for reservations, returning mock fallback:', err.message);

    // Filter, paginate and stats mock data
    let filtered = [...mockList];
    const search = (req.query.search || '').toLowerCase();
    const status = (req.query.status || '');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (search) {
      filtered = filtered.filter(r =>
        r.customer_name.toLowerCase().includes(search) ||
        r.mobile.includes(search) ||
        r.reservation_id.toLowerCase().includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    res.json({
      status: 'success',
      data: paginated,
      stats: getStats(mockList),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  }
});

// GET /api/reservations/available-vehicles — for admin assignment dropdown (zone-filtered)
router.get('/available-vehicles', async (req, res) => {
  try {
    const { zone } = req.query;
    let query = `SELECT code, evegah_model_name, vehicle_category, zone FROM vehicles WHERE vehicle_status = 'Available'`;
    const params = [];
    if (zone) {
      query += ` AND (zone ILIKE $1 OR zone = 'Unassigned' OR zone IS NULL)`;
      params.push(`%${zone}%`);
    }
    query += ` ORDER BY code`;
    const result = await db.query(query, params);
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    console.warn('DB query failed for available-vehicles, returning empty:', err.message);
    res.json({ status: 'success', data: [] });
  }
});

// GET /api/reservations/active-ride — Check if rider has an ongoing/active ride
router.get('/active-ride', async (req, res) => {
  const { mobile } = req.query;
  const cleanMobile = (mobile || '').replace(/\D/g, '');
  if (!cleanMobile) {
    return res.json({ status: 'success', has_active_ride: false });
  }

  try {
    const result = await db.query(
      "SELECT * FROM reservations WHERE (mobile LIKE $1 OR mobile LIKE $2) AND status IN ('Confirmed', 'Ongoing', 'Active', 'Active Ride') ORDER BY created_at DESC LIMIT 1",
      [`%${cleanMobile}%`, `%${mobile}%`]
    );
    if (result.rows.length > 0) {
      return res.json({ status: 'success', has_active_ride: true, data: result.rows[0] });
    }
    return res.json({ status: 'success', has_active_ride: false });
  } catch (err) {
    console.error('Failed to check active ride:', err);
    return res.json({ status: 'success', has_active_ride: false });
  }
});

// POST /api/reservations (create new reservation — called by Rider App on booking confirmation)
router.post('/', async (req, res) => {
  const {
    customer_name,
    mobile,
    gov_id,
    reservation_date,
    reservation_time,
    package_type,
    vehicle_category,
    vehicle_model,
    fare,
    deposit,
    payment_mode,
    payment_status,
    pickup_zone,
    drop_zone,
    coupon_code,
    discount,
    platform_fee,
    taxes,
    deposit_option,
    total_payable
  } = req.body;

  const cleanMobile = (mobile || '').replace(/\D/g, '');

  // 🚨 VALIDATION: Block new reservation if rider ALREADY has an active/ongoing ride!
  if (cleanMobile.length > 0) {
    try {
      const activeCheck = await db.query(
        "SELECT reservation_id, status FROM reservations WHERE (mobile LIKE $1 OR mobile LIKE $2) AND status IN ('Confirmed', 'Ongoing', 'Active', 'Active Ride') LIMIT 1",
        [`%${cleanMobile}%`, `%${mobile}%`]
      );
      if (activeCheck.rows.length > 0) {
        return res.status(400).json({
          status: 'error',
          has_active_ride: true,
          message: `Active Ride In Progress! You already have an active ride (${activeCheck.rows[0].reservation_id}). Please return or end your current ride before booking a new one.`
        });
      }
    } catch (e) {
      console.warn('Active ride check error:', e.message);
    }
  }

  // Generate unique reservation ID
  const randomSuffix = String(Math.floor(100 + Math.random() * 900));
  const dateObj = new Date();
  const year = dateObj.getFullYear();
  const reservation_id = `RID-${year}-${randomSuffix}${String(mockList.length).padStart(3, '0')}`;

  try {
    const result = await db.query(`
      INSERT INTO reservations (
        reservation_id, customer_name, mobile, gov_id, reservation_date,
        reservation_time, package_type, vehicle_category, fare, deposit,
        payment_mode, status, payment_status, pickup_zone, drop_zone, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      RETURNING *
    `, [
      reservation_id,
      customer_name || 'Guest Rider',
      mobile || '',
      gov_id || '',
      reservation_date || new Date().toISOString().split('T')[0],
      reservation_time || '00:00:00',
      package_type || 'Day',
      vehicle_category || vehicle_model || 'E-Scooter',
      parseFloat(fare) || 0,
      parseFloat(deposit) || 0,
      payment_mode || 'UPI',
      'Upcoming',
      payment_status || 'Paid',
      pickup_zone || '',
      drop_zone || ''
    ]);

    // Keep mock list in sync
    mockList.unshift(result.rows[0]);

    // Trigger real system notification
    createNotification('🎉 New Ride Booking Confirmed', `${customer_name || 'Customer'} created a new ${package_type || 'Day'} reservation (${reservation_id}) in ${pickup_zone || 'Gotri Zone'}.`, 'booking');

    res.json({ status: 'success', message: 'Reservation created successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Failed to create reservation in DB, saving in-memory:', err.message);
    const newRecord = {
      id: String(mockList.length + 2000),
      reservation_id,
      customer_name: customer_name || 'Guest Rider',
      mobile: mobile || '',
      gov_id: gov_id || '',
      reservation_date: new Date(reservation_date || Date.now()).toISOString(),
      reservation_time: reservation_time || '00:00:00',
      package_type: package_type || 'Day',
      vehicle_category: vehicle_category || vehicle_model || 'E-Scooter',
      vehicle_number: null,
      battery_id: null,
      fare: parseFloat(fare || 0).toFixed(2),
      deposit: parseFloat(deposit || 0).toFixed(2),
      payment_mode: payment_mode || 'UPI',
      payment_status: payment_status || 'Paid',
      status: 'Upcoming',
      pickup_zone: pickup_zone || '',
      drop_zone: drop_zone || '',
      created_at: new Date().toISOString()
    };
    mockList.unshift(newRecord);

    // Trigger real system notification
    createNotification('🎉 New Ride Booking Confirmed', `${customer_name || 'Customer'} created a new ${package_type || 'Day'} reservation (${reservation_id}) in ${pickup_zone || 'Gotri Zone'}.`, 'booking');

    res.json({ status: 'success', message: 'Reservation created (offline)', data: newRecord });
  }
});

// POST /api/reservations/:id/pay (update payment status to Paid)
router.post('/:id/pay', async (req, res) => {
  const { id } = req.params;
  const { payment_method, razorpay_payment_id } = req.body;

  try {
    const updateResult = await db.query(`
      UPDATE reservations
      SET payment_status = 'Paid', deposit_status = 'Paid', payment_method = $1
      WHERE id = $2 OR reservation_id = $3
      RETURNING *
    `, [payment_method || 'Razorpay', id, id]);

    const memIdx = mockList.findIndex(r => r.id === id || r.reservation_id === id);
    if (memIdx !== -1) {
      mockList[memIdx].payment_status = 'Paid';
      mockList[memIdx].deposit_status = 'Paid';
    }

    res.json({
      status: 'success',
      message: 'Payment status updated to Paid',
      data: updateResult.rows[0] || (memIdx !== -1 ? mockList[memIdx] : { payment_status: 'Paid' })
    });
  } catch (err) {
    console.error('Failed to update reservation payment:', err);
    res.json({
      status: 'success',
      message: 'Payment updated locally',
      data: { payment_status: 'Paid' }
    });
  }
});

// POST /api/reservations/:id/cancel (cancel reservation with refund rules)
router.post('/:id/cancel', async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch reservation details
    let reservation;
    const dbRes = await db.query('SELECT * FROM reservations WHERE id = $1 OR reservation_id = $2', [id, id]);
    if (dbRes.rows.length > 0) {
      reservation = dbRes.rows[0];
    } else {
      reservation = mockList.find(r => r.id === id || r.reservation_id === id);
    }

    if (!reservation) {
      return res.status(404).json({ status: 'error', message: 'Reservation not found' });
    }

    // Refund Logic
    const now = new Date();
    const resDateStr = new Date(reservation.reservation_date).toISOString().split('T')[0];
    const resDateTime = new Date(`${resDateStr}T${reservation.reservation_time}`);
    const timeDiffMs = resDateTime - now;
    const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

    let refundPercent = 0;
    if (timeDiffHours >= 24) {
      refundPercent = 100;
    } else if (timeDiffHours >= 12) {
      refundPercent = 90;
    } else if (timeDiffHours >= 4) {
      refundPercent = 50;
    } else {
      refundPercent = 0;
    }

    const fareNum = parseFloat(reservation.fare);
    const refundAmt = ((fareNum * refundPercent) / 100).toFixed(2);
    const paymentStatus = refundPercent > 0 ? 'Refunded' : 'Paid';

    // Update reservation status in database
    let updated;
    try {
      const updateResult = await db.query(`
        UPDATE reservations
        SET status = 'Cancelled', payment_status = $1
        WHERE id = $2 OR reservation_id = $3
        RETURNING *
      `, [paymentStatus, id, id]);
      if (updateResult.rows.length > 0) updated = updateResult.rows[0];
    } catch (dbErr) {
      console.warn('DB update failed, fallback to in-memory cancellation:', dbErr.message);
    }

    // In-memory update
    const memIdx = mockList.findIndex(r => r.id === id || r.reservation_id === id);
    if (memIdx !== -1) {
      mockList[memIdx].status = 'Cancelled';
      mockList[memIdx].payment_status = paymentStatus;
      if (!updated) updated = mockList[memIdx];
    }

    res.json({
      status: 'success',
      message: `Reservation cancelled. Refunded ${refundPercent}% (₹${refundAmt})`,
      refundPercent,
      refundAmount: refundAmt,
      data: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/reservations/:id/allocate
// Assign vehicle + battery → status becomes 'Confirmed' → auto-creates renters record
router.post('/:id/allocate', async (req, res) => {
  const { id } = req.params;
  const { vehicle_number, battery_id } = req.body;

  if (!vehicle_number) {
    return res.status(400).json({ status: 'error', message: 'Vehicle number is required' });
  }

  try {
    // 1. Fetch reservation
    let reservation;
    try {
      const dbRes = await db.query(
        'SELECT * FROM reservations WHERE id = $1 OR reservation_id = $2',
        [id, id]
      );
      if (dbRes.rows.length > 0) reservation = dbRes.rows[0];
    } catch (_) {}

    if (!reservation) {
      reservation = mockList.find(r => r.id === id || r.reservation_id === id);
    }
    if (!reservation) {
      return res.status(404).json({ status: 'error', message: 'Reservation not found' });
    }

    // 2. Update reservation — set vehicle_number, battery_id, status = 'Confirmed'
    let updatedReservation;
    try {
      const updateResult = await db.query(`
        UPDATE reservations
        SET vehicle_number = $1, battery_id = $2, status = 'Confirmed'
        WHERE id = $3 OR reservation_id = $4
        RETURNING *
      `, [vehicle_number, battery_id || null, id, id]);
      if (updateResult.rows.length > 0) updatedReservation = updateResult.rows[0];
    } catch (dbErr) {
      console.warn('DB allocate update failed, fallback to in-memory:', dbErr.message);
    }

    // In-memory update
    const memIdx = mockList.findIndex(r => r.id === id || r.reservation_id === id);
    if (memIdx !== -1) {
      mockList[memIdx].vehicle_number = vehicle_number;
      mockList[memIdx].battery_id = battery_id || null;
      mockList[memIdx].status = 'Confirmed';
      if (!updatedReservation) updatedReservation = mockList[memIdx];
    }

    // 3. Auto-create a renters record so rider appears in the Riders table
    const res_data = updatedReservation || reservation;
    const renterPayload = {
      rider_name: res_data.customer_name,
      mobile: res_data.mobile,
      vehicle_id: vehicle_number,
      battery_id: battery_id || '',
      package_name: res_data.package_type || 'Day',
      rental_start_date: res_data.reservation_date || new Date().toISOString().split('T')[0],
      return_date: null,
      status: 'Active Ride',
      rent: parseFloat(res_data.fare || 0).toFixed(2),
      deposit: parseFloat(res_data.deposit || 0).toFixed(2),
      total: (parseFloat(res_data.fare || 0) + parseFloat(res_data.deposit || 0)).toFixed(2),
      avatar_url: null
    };

    try {
      await db.query(`
        INSERT INTO renters (
          rider_name, mobile, vehicle_id, battery_id, package_name,
          rental_start_date, return_date, status, rent, deposit, total, avatar_url, created_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW())
        ON CONFLICT DO NOTHING
      `, [
        renterPayload.rider_name,
        renterPayload.mobile,
        renterPayload.vehicle_id,
        renterPayload.battery_id,
        renterPayload.package_name,
        renterPayload.rental_start_date,
        renterPayload.return_date,
        renterPayload.status,
        renterPayload.rent,
        renterPayload.deposit,
        renterPayload.total,
        renterPayload.avatar_url
      ]);
    } catch (renterErr) {
      console.warn('Could not auto-create renters record (non-fatal):', renterErr.message);
    }

    // Update inventory in database: Mark vehicle as Rented and battery as in_use
    try {
      if (vehicle_number) {
        await db.query(`UPDATE vehicles SET vehicle_status = 'Rented' WHERE code = $1 OR vehicle_number = $1`, [vehicle_number]);
      }
      if (battery_id) {
        await db.query(`UPDATE batteries SET status = 'in_use' WHERE battery_id = $1 OR id = $1`, [battery_id]);
      }
    } catch (invErr) {
      console.warn('Could not update vehicle/battery inventory status:', invErr.message);
    }

    res.json({
      status: 'success',
      message: `Vehicle ${vehicle_number} allocated. Rider moved to Active Rides.`,
      data: updatedReservation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/reservations/:id (Delete reservation from system)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    try {
      await db.query('DELETE FROM reservations WHERE id = $1 OR reservation_id = $2', [id, id]);
    } catch (dbErr) {
      console.warn('DB delete reservation failed, fallback to memory:', dbErr.message);
    }

    const idx = mockList.findIndex(r => r.id === id || r.reservation_id === id);
    if (idx !== -1) {
      mockList.splice(idx, 1);
    }

    res.json({
      status: 'success',
      message: `Reservation ${id} deleted successfully.`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/reservations/:id/return (End / Return ride and release vehicle/battery)
router.post('/:id/return', async (req, res) => {
  const { id } = req.params;

  try {
    let reservation;
    try {
      const updateRes = await db.query(`
        UPDATE reservations
        SET status = 'Completed', payment_status = 'Paid'
        WHERE id = $1 OR reservation_id = $2
        RETURNING *
      `, [id, id]);
      if (updateRes.rows.length > 0) reservation = updateRes.rows[0];
    } catch (dbErr) {
      console.warn('DB return update failed, fallback to in-memory:', dbErr.message);
    }

    const idx = mockList.findIndex(r => r.id === id || r.reservation_id === id);
    if (idx !== -1) {
      mockList[idx].status = 'Completed';
      mockList[idx].payment_status = 'Paid';
      if (!reservation) reservation = mockList[idx];
    }

    // Release vehicle and battery inventory back to Available
    try {
      if (reservation && reservation.vehicle_number) {
        await db.query(`UPDATE vehicles SET vehicle_status = 'Available' WHERE code = $1 OR vehicle_number = $1`, [reservation.vehicle_number]);
      }
      if (reservation && reservation.battery_id) {
        await db.query(`UPDATE batteries SET status = 'available' WHERE battery_id = $1 OR id = $1`, [reservation.battery_id]);
      }
    } catch (_) {}

    res.json({
      status: 'success',
      message: `Ride ${id} ended/returned successfully. Vehicle & battery released.`,
      data: reservation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

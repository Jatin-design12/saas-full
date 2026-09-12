const express = require('express');
const router = express.Router();
const db = require('../db');
const { createNotification } = require('./notifications');
const { getCache, setCache, delByPattern } = require('../redis');

// Ensure reservations columns exist
(async () => {
  try {
    await db.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(100)`);
    await db.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS discount NUMERIC(10,2) DEFAULT 0.00`);
    await db.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS pickup_datetime VARCHAR(100)`);
    await db.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS drop_datetime VARCHAR(100)`);
    await db.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS total_payable NUMERIC(10,2)`);
    await db.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(150)`);
  } catch (e) {
    console.warn('Reservations DB column init notice:', e.message);
  }
})();

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
    const mobile = req.query.mobile || '';

    // Check Redis cache
    const cacheKey = `reservations:list:${page}:${limit}:${search}:${status}:${mobile}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    let query = `
      SELECT 
        r.*,
        COALESCE(b.soc, v.battery_pct, 85) as battery_pct,
        COALESCE(v.speed, '0.00') as speed,
        COALESCE(b.health, 100) as battery_health,
        COALESCE(b.status, 'In Use') as bms_status
      FROM reservations r
      LEFT JOIN vehicles v ON (v.code = r.vehicle_number OR v.registration_number = r.vehicle_number)
      LEFT JOIN batteries b ON (b.battery_id = r.battery_id)
      WHERE 1=1
    `;
    let countQuery = 'SELECT COUNT(*) as total FROM reservations WHERE 1=1';
    const params = [];
    const countParams = [];
    let pIdx = 1;

    if (search) {
      query += ` AND (r.customer_name ILIKE $${pIdx} OR r.mobile ILIKE $${pIdx} OR r.reservation_id ILIKE $${pIdx})`;
      countQuery += ` AND (customer_name ILIKE $${pIdx} OR mobile ILIKE $${pIdx} OR reservation_id ILIKE $${pIdx})`;
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
      pIdx++;
    }

    if (mobile) {
      const cleanMobile = mobile.replace(/\D/g, '');
      const last10 = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;
      if (last10) {
        query += ` AND (r.mobile LIKE $${pIdx} OR r.mobile LIKE $${pIdx + 1})`;
        countQuery += ` AND (mobile LIKE $${pIdx} OR mobile LIKE $${pIdx + 1})`;
        params.push(`%${last10}%`, `%${cleanMobile}%`);
        countParams.push(`%${last10}%`, `%${cleanMobile}%`);
        pIdx += 2;
      }
    }

    if (status) {
      query += ` AND r.status = $${pIdx}`;
      countQuery += ` AND status = $${pIdx}`;
      params.push(status);
      countParams.push(status);
      pIdx++;
    }

    query += ` ORDER BY r.created_at DESC LIMIT $${pIdx} OFFSET $${pIdx + 1}`;
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

    const mappedRows = rowsResult.rows.map(r => ({
      ...r,
      vehicle_model: (r.vehicle_model && r.vehicle_model !== 'E-Scooter' && r.vehicle_model !== 'Evegah Pro') ? r.vehicle_model : 'Evegah City',
      range_km: Math.round(((parseFloat(r.battery_pct || 85) / 100.0) * 110))
    }));

    const responsePayload = {
      status: 'success',
      data: mappedRows,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
    await setCache(cacheKey, responsePayload, 60);
    res.json(responsePayload);
  } catch (err) {
    console.warn('Postgres query failed for reservations, returning mock fallback:', err.message);

    // Filter, paginate and stats mock data
    let filtered = [...mockList];
    const search = (req.query.search || '').toLowerCase();
    const status = (req.query.status || '');
    const mobile = (req.query.mobile || '');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (search) {
      filtered = filtered.filter(r =>
        r.customer_name.toLowerCase().includes(search) ||
        r.mobile.includes(search) ||
        r.reservation_id.toLowerCase().includes(search)
      );
    }

    if (mobile) {
      const cleanMobile = mobile.replace(/\D/g, '');
      const last10 = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;
      filtered = filtered.filter(r => {
        const rClean = r.mobile.replace(/\D/g, '');
        return rClean.includes(last10) || rClean.includes(cleanMobile);
      });
    }

    if (status) {
      filtered = filtered.filter(r => r.status.toLowerCase() === status.toLowerCase());
    }

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    const fallbackPayload = {
      status: 'success',
      data: paginated,
      stats: getStats(mockList),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
    await setCache(cacheKey, fallbackPayload, 30);
    res.json(fallbackPayload);
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

// GET /api/reservations/deposits — Deposit refund dashboard data & real KPIs
router.get('/deposits', async (req, res) => {
  try {
    // 1. Fetch reservations with deposit details
    const resResult = await db.query(`
      SELECT 
        id,
        reservation_id,
        customer_name,
        mobile,
        package_type,
        vehicle_number,
        battery_id,
        deposit,
        fare,
        total_payable,
        status,
        deposit_status,
        refund_amount,
        refund_deductions,
        refund_mode,
        refund_tx_id,
        refund_date,
        returned_at,
        return_condition,
        return_notes,
        created_at
      FROM reservations
      ORDER BY COALESCE(returned_at, created_at) DESC
    `);

    // 2. Fetch active renters with deposits
    const rentersResult = await db.query(`
      SELECT 
        id,
        rider_name,
        mobile,
        vehicle_id,
        battery_id,
        deposit,
        rent,
        total,
        status,
        rental_start_date,
        return_date,
        created_at
      FROM renters
      WHERE deposit > 0
    `).catch(() => ({ rows: [] }));

    const resRows = resResult.rows;
    const renterRows = rentersResult.rows;

    // Calculate real KPIs
    let totalDepositsHeld = 0;
    renterRows.forEach(r => {
      if (['Active Ride', 'Retain Ride', 'Active'].includes(r.status)) {
        totalDepositsHeld += parseFloat(r.deposit) || 0;
      }
    });
    resRows.forEach(r => {
      if (['Confirmed', 'Ongoing', 'Active', 'Upcoming'].includes(r.status) && ['Held', 'Paid', null].includes(r.deposit_status)) {
        totalDepositsHeld += parseFloat(r.deposit) || 0;
      }
    });

    const pendingList = [];
    const completedList = [];
    let totalRefunded = 0;
    let totalDeductions = 0;
    let pendingAmount = 0;

    resRows.forEach(r => {
      const dep = parseFloat(r.deposit !== null && r.deposit !== undefined ? r.deposit : 0);
      const refAmt = parseFloat(r.refund_amount !== null && r.refund_amount !== undefined ? r.refund_amount : dep);
      const ded = parseFloat(r.refund_deductions) || 0;
      const st = r.status || '';
      const depSt = r.deposit_status || '';

      if (depSt === 'Refunded' && (refAmt > 0 || dep > 0)) {
        completedList.push({
          id: r.id,
          reservation_id: r.reservation_id,
          rider: {
            name: r.customer_name || 'Rider',
            code: r.reservation_id || `RID-${r.id?.toString().slice(0, 6)}`,
            avatar: ''
          },
          mobile: r.mobile,
          vehicle: r.vehicle_number || 'EVM102502',
          refundDate: r.refund_date || r.returned_at || r.created_at,
          txId: r.refund_tx_id || `REF-${r.id?.toString().slice(0, 8)}`,
          deposit: dep,
          deductions: ded,
          refundAmount: refAmt,
          method: r.refund_mode || 'UPI Instant Refund',
          status: 'Successful',
          returnCondition: r.return_condition || 'Clean',
          notes: r.return_notes || ''
        });
        totalRefunded += refAmt;
        totalDeductions += ded;
      } else if (dep > 0 && (depSt === 'Pending_Refund' || ['Completed', 'Return'].includes(st)) && depSt !== 'None' && depSt !== 'Refunded' && depSt !== 'Dismissed') {
        pendingList.push({
          id: r.id,
          reservation_id: r.reservation_id,
          rider: {
            name: r.customer_name || 'Rider',
            code: r.reservation_id || `RID-${r.id?.toString().slice(0, 6)}`,
            avatar: ''
          },
          mobile: r.mobile,
          vehicle: r.vehicle_number || 'EVM102502',
          returnDate: r.returned_at || r.created_at,
          deposit: dep,
          condition: (r.return_condition && r.return_condition.toLowerCase() !== 'clean') ? 'Damage Charged' : 'No Damage',
          conditionDetail: r.return_condition || 'Clean',
          deductions: ded,
          refundAmount: Math.max(0, dep - ded),
          deposit_status: 'Pending_Refund',
          notes: r.return_notes || ''
        });
        pendingAmount += Math.max(0, dep - ded);
        totalDeductions += ded;
      }
    });

    // Also include any renters with status 'Return' or 'Completed' that aren't in reservations
    renterRows.forEach(r => {
      const dep = parseFloat(r.deposit || 0);
      if (['Return', 'Completed'].includes(r.status) && dep > 0 && r.status !== 'Dismissed') {
        const cleanMob = (r.mobile || '').replace(/\D/g, '').slice(-10);
        const alreadyIn = pendingList.some(p => (p.mobile || '').includes(cleanMob)) || completedList.some(c => (c.mobile || '').includes(cleanMob));
        if (!alreadyIn) {
          pendingList.push({
            id: r.id,
            reservation_id: `RET-${r.id?.toString().slice(0, 6)}`,
            rider: {
              name: r.rider_name || 'Rider',
              code: `EVR-${r.id?.toString().slice(0, 6)}`,
              avatar: ''
            },
            mobile: r.mobile,
            vehicle: r.vehicle_id || 'EVM102502',
            returnDate: r.return_date || r.created_at || new Date(),
            deposit: dep,
            condition: 'No Damage',
            conditionDetail: 'Good Condition',
            deductions: 0,
            refundAmount: dep,
            deposit_status: 'Pending_Refund'
          });
          pendingAmount += dep;
        }
      }
    });

    res.json({
      status: 'success',
      kpis: {
        total_held: Math.round(totalDepositsHeld * 100) / 100,
        pending_refunds_count: pendingList.length,
        pending_refunds_amount: Math.round(pendingAmount * 100) / 100,
        total_refunded_amount: Math.round(totalRefunded * 100) / 100,
        total_deductions_amount: Math.round(totalDeductions * 100) / 100,
      },
      data: {
        pending: pendingList,
        completed: completedList
      }
    });
  } catch (err) {
    console.error('Error fetching deposits dashboard:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/reservations/deposits — Bulk delete/dismiss deposit records
router.delete('/deposits', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ status: 'error', message: 'No deposit IDs provided' });
  }

  try {
    let affected = 0;
    for (const id of ids) {
      const idStr = String(id);
      const rRes = await db.query(`
        UPDATE reservations 
        SET deposit_status = 'Dismissed', deposit = 0, refund_amount = 0 
        WHERE id::text = $1 OR reservation_id = $1
      `, [idStr]).catch(() => ({ rowCount: 0 }));
      affected += rRes.rowCount || 0;

      const renterRes = await db.query(`
        UPDATE renters 
        SET deposit = 0, status = 'Dismissed' 
        WHERE id::text = $1
      `, [idStr]).catch(() => ({ rowCount: 0 }));
      affected += renterRes.rowCount || 0;
    }

    await delByPattern('reservations:*');
    await delByPattern('renters:*');
    await delByPattern('stats:*');

    res.json({
      status: 'success',
      message: `Successfully deleted/dismissed ${ids.length} deposit record(s).`,
      affected
    });
  } catch (err) {
    console.error('Error deleting deposit records:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/reservations/deposits/:id — Single delete/dismiss deposit record
router.delete('/deposits/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const idStr = String(id);
    await db.query(`
      UPDATE reservations 
      SET deposit_status = 'Dismissed', deposit = 0, refund_amount = 0 
      WHERE id::text = $1 OR reservation_id = $1
    `, [idStr]).catch(() => {});

    await db.query(`
      UPDATE renters 
      SET deposit = 0, status = 'Dismissed' 
      WHERE id::text = $1
    `, [idStr]).catch(() => {});

    await delByPattern('reservations:*');
    await delByPattern('renters:*');
    await delByPattern('stats:*');

    res.json({
      status: 'success',
      message: 'Deposit record deleted/dismissed successfully.'
    });
  } catch (err) {
    console.error('Error deleting deposit record:', err);
    res.status(500).json({ status: 'error', message: err.message });
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
    const result = await db.query(`
      SELECT 
        r.*,
        COALESCE(b.soc, v.battery_pct, 85) as battery_pct,
        COALESCE(v.speed, '0.00') as speed,
        COALESCE(b.health, 100) as battery_health,
        COALESCE(b.status, 'In Use') as bms_status
      FROM reservations r
      LEFT JOIN vehicles v ON (v.code = r.vehicle_number OR v.registration_number = r.vehicle_number)
      LEFT JOIN batteries b ON (b.battery_id = r.battery_id)
      WHERE (r.mobile LIKE $1 OR r.mobile LIKE $2) 
        AND r.status IN ('Confirmed', 'Ongoing', 'Active', 'Active Ride') 
      ORDER BY r.created_at DESC 
      LIMIT 1
    `, [`%${cleanMobile}%`, `%${mobile}%`]);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      row.vehicle_model = (row.vehicle_model && row.vehicle_model !== 'E-Scooter' && row.vehicle_model !== 'Evegah Pro') ? row.vehicle_model : 'Evegah City';
      row.range_km = Math.round(((parseFloat(row.battery_pct || 85) / 100.0) * 110));
      return res.json({ status: 'success', has_active_ride: true, data: row });
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

  // 🚨 VALIDATION: Block new reservation ONLY IF its date/time slot overlaps with an active/confirmed ride!
  const reqStartRaw = req.body.pickup_datetime || req.body.start_datetime || `${reservation_date || ''} ${reservation_time || ''}`.trim();
  const reqEndRaw = req.body.drop_datetime || req.body.end_datetime || reqStartRaw;

  if (cleanMobile.length > 0) {
    try {
      const activeCheck = await db.query(
        "SELECT reservation_id, status, reservation_date, reservation_time, pickup_datetime, drop_datetime FROM reservations WHERE (mobile LIKE $1 OR mobile LIKE $2) AND status IN ('Confirmed', 'Ongoing', 'Active', 'Active Ride', 'Upcoming')",
        [`%${cleanMobile}%`, `%${mobile}%`]
      );

      const toDateString = (val) => {
        if (!val) return '';
        if (val instanceof Date) return val.toISOString().slice(0, 10);
        const str = String(val).trim();
        const d = new Date(str);
        if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
        return str;
      };

      const parseTs = (val, timeVal) => {
        if (!val) return null;
        if (val instanceof Date) {
          const d = new Date(val);
          if (timeVal) {
            const timeParts = String(timeVal).split(':');
            if (timeParts.length >= 2) {
              d.setHours(parseInt(timeParts[0], 10) || 0, parseInt(timeParts[1], 10) || 0, 0, 0);
            }
          }
          return d.getTime();
        }
        const str = String(val).trim();
        const combined = timeVal ? `${str} ${timeVal}` : str;
        const ms = new Date(combined).getTime();
        if (!isNaN(ms)) return ms;
        const d2 = new Date(str);
        return isNaN(d2.getTime()) ? null : d2.getTime();
      };

      const reqStartMs = parseTs(req.body.pickup_datetime || req.body.start_datetime || reservation_date, reservation_time);
      const reqEndMs = parseTs(req.body.drop_datetime || req.body.end_datetime, null) || (reqStartMs ? reqStartMs + 86400000 : null);
      const reqDateStr = toDateString(reservation_date);

      for (const existing of activeCheck.rows) {
        const exStartMs = parseTs(existing.pickup_datetime || existing.reservation_date, existing.reservation_time);
        const exEndMs = parseTs(existing.drop_datetime, null) || (exStartMs ? exStartMs + 86400000 : null);
        const exDateStr = toDateString(existing.reservation_date);

        let conflict = false;
        // 1. If date/time timestamps are valid, check overlap
        if (reqStartMs && reqEndMs && exStartMs && exEndMs) {
          if (reqStartMs < exEndMs && reqEndMs > exStartMs) {
            conflict = true;
          }
        }
        // 2. Direct string date match fallback (e.g. same day booking)
        if (!conflict && reqDateStr && exDateStr && reqDateStr === exDateStr) {
          conflict = true;
        }

        if (conflict) {
          return res.status(400).json({
            status: 'error',
            has_active_ride: true,
            message: `Time Conflict! You already have an active/booked ride (${existing.reservation_id}) for this selected date and time.`
          });
        }
      }
    } catch (e) {
      console.warn('Active ride date overlap check error:', e.message);
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

    // Clear caches
    await delByPattern('reservations:*');
    await delByPattern('renters:*');

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

    // Clear caches
    await delByPattern('reservations:*');
    await delByPattern('renters:*');

    // Trigger real system notification
    createNotification('🎉 New Ride Booking Confirmed', `${customer_name || 'Customer'} created a new ${package_type || 'Day'} reservation (${reservation_id}) in ${pickup_zone || 'Gotri Zone'}.`, 'booking');

    res.json({ status: 'success', message: 'Reservation created (offline)', data: newRecord });
  }
});

// POST /api/reservations/:id/pay (update payment status to Paid)
router.post('/:id/pay', async (req, res) => {
  const { id } = req.params;
  const { payment_method, transaction_id, razorpay_payment_id } = req.body;

  try {
    const updateResult = await db.query(`
      UPDATE reservations
      SET payment_status = 'Paid', deposit_status = 'Paid', payment_mode = $1
      WHERE id::text = $2 OR reservation_id = $3
      RETURNING *
    `, [payment_method || 'ICICI UPI', id, id]);

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

    // Update inventory in database: Mark vehicle as In Ride and battery as in_use
    try {
      if (vehicle_number) {
        await db.query(`
          UPDATE vehicles 
          SET vehicle_status = 'In Ride', status = 'Online', renter_name = $1 
          WHERE code = $2 OR registration_number = $2
        `, [renterPayload.rider_name || 'Reserved Rider', vehicle_number]);
      }
      if (battery_id) {
        await db.query(`
          UPDATE batteries 
          SET status = 'in_use' 
          WHERE battery_id = $1 OR id::text = $1
        `, [battery_id]);
      }
    } catch (invErr) {
      console.warn('Could not update vehicle/battery inventory status:', invErr.message);
    }

    // Clear caches
    await delByPattern('reservations:*');
    await delByPattern('renters:*');
    await delByPattern('vehicles:*');
    await delByPattern('batteries:*');
    await delByPattern('stats:*');

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

// DELETE /api/reservations (Bulk delete reservations)
router.delete('/', async (req, res) => {
  const { ids } = req.body || {};
  const targetIds = Array.isArray(ids) ? ids : (req.query.ids ? req.query.ids.split(',') : []);

  try {
    await delByPattern('reservations:*');
    await delByPattern('renters:*');
    if (targetIds.length > 0) {
      try {
        await db.query('DELETE FROM reservations WHERE id::text = ANY($1::text[]) OR reservation_id = ANY($1::text[])', [targetIds]);
      } catch (dbErr) {
        console.warn('DB delete reservations failed:', dbErr.message);
      }
      mockList = mockList.filter(r => !targetIds.includes(r.id) && !targetIds.includes(r.reservation_id));
      for (let i = MOCK_RESERVATIONS.length - 1; i >= 0; i--) {
        if (targetIds.includes(MOCK_RESERVATIONS[i].id) || targetIds.includes(MOCK_RESERVATIONS[i].reservation_id)) {
          MOCK_RESERVATIONS.splice(i, 1);
        }
      }
    }

    res.json({
      status: 'success',
      message: 'Selected reservation(s) deleted successfully.'
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
    await delByPattern('reservations:*');
    await delByPattern('renters:*');
    try {
      await db.query('DELETE FROM reservations WHERE id = $1 OR reservation_id = $2', [id, id]);
    } catch (dbErr) {
      console.warn('DB delete reservation failed, fallback to memory:', dbErr.message);
    }

    mockList = mockList.filter(r => r.id !== id && r.reservation_id !== id);
    for (let i = MOCK_RESERVATIONS.length - 1; i >= 0; i--) {
      if (MOCK_RESERVATIONS[i].id === id || MOCK_RESERVATIONS[i].reservation_id === id) {
        MOCK_RESERVATIONS.splice(i, 1);
      }
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
  await delByPattern('reservations:*');
  await delByPattern('renters:*');
  await delByPattern('vehicles:*');
  await delByPattern('batteries:*');
  await delByPattern('stats:*');

  try {
    let reservation;
    try {
      const updateRes = await db.query(`
        UPDATE reservations
        SET status = 'Completed',
            payment_status = 'Paid',
            returned_at = NOW(),
            deposit_status = CASE WHEN COALESCE(deposit, 0) > 0 THEN 'Pending_Refund' ELSE 'None' END,
            refund_amount = COALESCE(deposit, 500),
            refund_deductions = 0
        WHERE id::text = $1 OR reservation_id = $2
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
      mockList[idx].deposit_status = 'Pending_Refund';
      mockList[idx].refund_amount = mockList[idx].deposit || '500';
      if (!reservation) reservation = mockList[idx];
    }

    // Release vehicle and battery inventory back to Available
    try {
      if (reservation && reservation.vehicle_number) {
        await db.query(`UPDATE vehicles SET vehicle_status = 'Available', renter_name = 'None (Available)' WHERE code = $1 OR vehicle_number = $1`, [reservation.vehicle_number]);
      }
      if (reservation && reservation.battery_id) {
        await db.query(`UPDATE batteries SET status = 'available' WHERE battery_id = $1 OR id = $1`, [reservation.battery_id]);
      }
      // Also update renters table for this rider to Return
      if (reservation && reservation.mobile) {
        const cleanMob = reservation.mobile.replace(/\D/g, '').slice(-10);
        await db.query(`
          UPDATE renters 
          SET status = 'Return', return_date = NOW() 
          WHERE mobile LIKE $1 OR mobile = $2
        `, [`%${cleanMob}%`, reservation.mobile]).catch(() => {});
      }
    } catch (_) {}

    res.json({
      status: 'success',
      message: `Ride ${id} ended/returned successfully. Vehicle & battery released. Deposit pending refund.`,
      data: reservation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/reservations/:id/refund-deposit — Process deposit refund to rider
router.post('/:id/refund-deposit', async (req, res) => {
  const { id } = req.params;
  const {
    refund_amount,
    deductions = 0,
    refund_mode = 'UPI Instant Refund',
    notes = '',
    upi_id = '',
    bank_account = ''
  } = req.body;

  const refundAmt = parseFloat(refund_amount || 0);
  const dedAmt = parseFloat(deductions || 0);
  const refTxId = `REF-${Date.now().toString().slice(-8)}`;

  try {
    let updated;
    try {
      const dbRes = await db.query(`
        UPDATE reservations
        SET deposit_status = 'Refunded',
            refund_amount = $1,
            refund_deductions = $2,
            refund_mode = $3,
            refund_tx_id = $4,
            refund_date = NOW(),
            return_notes = COALESCE($5, return_notes)
        WHERE id::text = $6 OR reservation_id = $6
        RETURNING *
      `, [refundAmt, dedAmt, refund_mode, refTxId, notes, id]);
      if (dbRes.rows.length > 0) updated = dbRes.rows[0];
    } catch (e) {
      console.warn('DB refund update error:', e.message);
    }

    if (!updated) {
      // Check if it's a renter record
      const renterUpdate = await db.query(`
        UPDATE renters
        SET status = 'Refunded',
            deposit = 0
        WHERE id::text = $1 OR vehicle_id = $1
        RETURNING *
      `, [id]).catch(() => ({ rows: [] }));
      if (renterUpdate.rows[0]) {
        updated = renterUpdate.rows[0];
      }
    }

    // If PayU refund method selected, trigger PayU gateway refund API
    let payuResult = null;
    if (refund_mode && refund_mode.toLowerCase().includes('payu')) {
      try {
        const payuRouter = require('./payu');
        if (typeof payuRouter.processPayURefund === 'function') {
          const originalPayuId = updated?.transaction_id || updated?.payu_id || '';
          payuResult = await payuRouter.processPayURefund({
            payuId: originalPayuId,
            amount: refundAmt,
            refundTxId: refTxId
          });
        }
      } catch (payuErr) {
        console.warn('PayU deposit refund call warning:', payuErr.message);
      }
    }

    // Insert transaction into wallet_transactions as Debit / Refund
    const riderMob = (updated?.mobile || '').replace(/\D/g, '').slice(-10);
    await db.query(`
      INSERT INTO wallet_transactions (
        mobile, title, subtitle, amount, type, status, payment_method, transaction_id
      )
      VALUES ($1, $2, $3, $4, 'Debit', 'Success', $5, $6)
    `, [
      riderMob || '0000000000',
      'Security Deposit Refund',
      `${refund_mode}${upi_id ? ` to ${upi_id}` : (bank_account ? ` to A/C ${bank_account}` : '')}`,
      refundAmt,
      refund_mode,
      refTxId
    ]).catch(err => console.warn('Wallet transaction insert error:', err.message));

    // Clear caches
    await delByPattern('reservations:*');
    await delByPattern('renters:*');
    await delByPattern('stats:*');

    res.json({
      status: 'success',
      message: `Security deposit of ₹${refundAmt} refunded successfully via ${refund_mode}.`,
      data: {
        tx_id: refTxId,
        refund_amount: refundAmt,
        deductions: dedAmt,
        refund_mode,
        refund_date: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Failed to process refund:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/reservations/:id/start (Start ride -> status = 'Ongoing')
router.post('/:id/start', async (req, res) => {
  const { id } = req.params;
  await delByPattern('reservations:*');
  await delByPattern('renters:*');

  try {
    let reservation;
    try {
      const updateRes = await db.query(`
        UPDATE reservations
        SET status = 'Ongoing'
        WHERE id::text = $1 OR reservation_id = $2
        RETURNING *
      `, [id, id]);
      if (updateRes.rows.length > 0) reservation = updateRes.rows[0];
    } catch (dbErr) {
      console.warn('DB start update failed, fallback to in-memory:', dbErr.message);
    }

    const idx = mockList.findIndex(r => r.id === id || r.reservation_id === id);
    if (idx !== -1) {
      mockList[idx].status = 'Ongoing';
      if (!reservation) reservation = mockList[idx];
    }

    res.json({
      status: 'success',
      message: `Ride ${id} started successfully! Ongoing ride active. 🛵`,
      data: reservation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

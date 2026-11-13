const express = require('express');
const router = express.Router();
const db = require('../db');
const { getCache, setCache, delByPattern } = require('../redis');

// Ensure maintenance_orders table and modern schema columns exist
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS maintenance_orders (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(100) UNIQUE NOT NULL,
        job_card_number VARCHAR(100),
        vehicle_code VARCHAR(100),
        vehicle_model VARCHAR(100),
        vehicle_category VARCHAR(100) DEFAULT 'Electric Scooter',
        issue_category VARCHAR(100) DEFAULT 'General Service',
        description TEXT,
        assigned_technician VARCHAR(100),
        service_center VARCHAR(150),
        priority VARCHAR(50) DEFAULT 'Medium',
        status VARCHAR(50) DEFAULT 'Scheduled',
        estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
        parts_cost NUMERIC(10, 2) DEFAULT 0.00,
        labor_cost NUMERIC(10, 2) DEFAULT 0.00,
        total_cost NUMERIC(10, 2) DEFAULT 0.00,
        zone VARCHAR(100) DEFAULT 'Gotri Zone',
        rider_name VARCHAR(150),
        rider_mobile VARCHAR(50),
        reservation_id VARCHAR(100),
        fault_type VARCHAR(100) DEFAULT 'Rider Damage',
        liability VARCHAR(100) DEFAULT 'Rider Liable',
        rider_charge_amount NUMERIC(10, 2) DEFAULT 0.00,
        rider_payment_status VARCHAR(50) DEFAULT 'Pending Recovery',
        km_reading VARCHAR(50),
        scheduled_date TIMESTAMPTZ,
        due_date TIMESTAMPTZ,
        last_service_date TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
  } catch (e) {
    console.warn('Maintenance DB init notice:', e.message);
  }
})();

// GET /api/maintenance/stats - Enterprise Rental Fleet Maintenance KPIs
router.get('/stats', async (req, res) => {
  try {
    const [
      totalRes,
      riderDamageRes,
      recoveryRes,
      underMaintRes,
      completedRes,
      financialsRes,
      breakdownRes
    ] = await Promise.all([
      db.query(`SELECT COUNT(*)::int as count FROM maintenance_orders`),
      db.query(`SELECT COUNT(*)::int as count FROM maintenance_orders WHERE fault_type ILIKE '%Rider%' OR rider_name IS NOT NULL`),
      db.query(`SELECT COALESCE(SUM(rider_charge_amount), 0)::numeric as total_charged FROM maintenance_orders`),
      db.query(`SELECT COUNT(*)::int as count FROM maintenance_orders WHERE status IN ('Under Maintenance', 'In Progress', 'Scheduled', 'Due Soon')`),
      db.query(`SELECT COUNT(*)::int as count FROM maintenance_orders WHERE status IN ('Completed', 'Resolved')`),
      db.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN rider_payment_status IN ('Deducted from Deposit', 'Paid via UPI', 'Paid via Cash') THEN rider_charge_amount ELSE 0 END), 0)::numeric as recovered_amount,
          COALESCE(SUM(CASE WHEN rider_payment_status ILIKE '%Pending%' THEN rider_charge_amount ELSE 0 END), 0)::numeric as pending_recovery,
          COALESCE(SUM(CASE WHEN liability ILIKE '%Company%' OR liability ILIKE '%Fleet%' THEN estimated_cost ELSE 0 END), 0)::numeric as fleet_expense,
          COALESCE(SUM(estimated_cost), 0)::numeric as total_maintenance_cost
        FROM maintenance_orders
      `),
      db.query(`
        SELECT issue_category as name, COUNT(*)::int as count, COALESCE(SUM(estimated_cost), 0)::numeric as cost
        FROM maintenance_orders 
        GROUP BY issue_category 
        ORDER BY count DESC
      `)
    ]);

    const total = totalRes.rows[0]?.count || 0;
    const riderDamage = riderDamageRes.rows[0]?.count || 0;
    const riderRecoveryTotal = parseFloat(recoveryRes.rows[0]?.total_charged || 0);
    const underMaint = underMaintRes.rows[0]?.count || 0;
    const completed = completedRes.rows[0]?.count || 0;

    const fin = financialsRes.rows[0] || {};

    const payload = {
      status: 'success',
      data: {
        total_jobs: total,
        rider_damage_jobs: riderDamage,
        rider_recovery_total: Math.round(riderRecoveryTotal),
        under_maintenance: underMaint,
        completed_resolved: completed,
        // Legacy keys mapping for compatibility
        total_vehicles: total,
        due_for_service: underMaint,
        serviced_vehicles: completed,
        overdue: 0,
        // Detailed Financials
        recovered_from_riders: Math.round(parseFloat(fin.recovered_amount || 0)),
        pending_recovery_from_riders: Math.round(parseFloat(fin.pending_recovery || 0)),
        fleet_absorbed_expense: Math.round(parseFloat(fin.fleet_expense || 0)),
        total_maintenance_cost: Math.round(parseFloat(fin.total_maintenance_cost || 0)),
        breakdown: breakdownRes.rows
      }
    };

    res.json(payload);
  } catch (err) {
    console.error('Error fetching maintenance stats:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/maintenance/overview-metrics - Detailed KPIs, Upcoming, Top Costs & Recent History
router.get('/overview-metrics', async (req, res) => {
  try {
    const [upcomingRes, topCostsRes, historyRes, costSumRes] = await Promise.all([
      db.query(`
        SELECT id, ticket_id, job_card_number, vehicle_code, vehicle_model, issue_category, scheduled_date, status, estimated_cost, zone, description, rider_name, rider_mobile, fault_type, liability, rider_payment_status, rider_charge_amount
        FROM maintenance_orders
        WHERE status IN ('Scheduled', 'Due Soon', 'In Progress', 'Under Maintenance')
        ORDER BY COALESCE(scheduled_date, created_at) ASC
        LIMIT 6
      `).catch(() => ({ rows: [] })),

      db.query(`
        SELECT 
          issue_category,
          COUNT(*)::int as count,
          COALESCE(SUM(estimated_cost), 0)::numeric as total_cost
        FROM maintenance_orders
        GROUP BY issue_category
        ORDER BY total_cost DESC
        LIMIT 5
      `).catch(() => ({ rows: [] })),

      db.query(`
        SELECT id, ticket_id, job_card_number, vehicle_code, vehicle_model, issue_category, assigned_technician, created_at, status, estimated_cost, zone, rider_name, rider_mobile, fault_type, liability, rider_payment_status, rider_charge_amount
        FROM maintenance_orders
        WHERE status IN ('Completed', 'Resolved')
        ORDER BY updated_at DESC, created_at DESC
        LIMIT 6
      `).catch(() => ({ rows: [] })),

      db.query(`
        SELECT 
          COALESCE(SUM(estimated_cost), 0)::numeric as total_cost,
          COALESCE(AVG(estimated_cost), 0)::numeric as avg_cost
        FROM maintenance_orders
      `).catch(() => ({ rows: [{ total_cost: 0, avg_cost: 0 }] }))
    ]);

    const totalCost = parseFloat(costSumRes.rows[0]?.total_cost || 0);
    const avgCost = parseFloat(costSumRes.rows[0]?.avg_cost || 0);

    res.json({
      status: 'success',
      data: {
        upcoming_services: upcomingRes.rows,
        top_costs: topCostsRes.rows,
        recent_history: historyRes.rows,
        total_cost: Math.round(totalCost),
        avg_cost: Math.round(avgCost)
      }
    });
  } catch (err) {
    console.error('Error fetching maintenance overview metrics:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/maintenance - Fetch all maintenance work orders / job cards with filters
router.get('/', async (req, res) => {
  try {
    const { status, type, fault_type, search, vehicle_code, rider_name } = req.query;

    let query = 'SELECT * FROM maintenance_orders WHERE 1=1';
    const params = [];
    let pIdx = 1;

    if (status && status !== 'All Status' && status !== 'all') {
      query += ` AND status ILIKE $${pIdx}`;
      params.push(status);
      pIdx++;
    }

    if (type && type !== 'All Service Types') {
      query += ` AND issue_category ILIKE $${pIdx}`;
      params.push(type);
      pIdx++;
    }

    if (fault_type && fault_type !== 'All') {
      query += ` AND fault_type ILIKE $${pIdx}`;
      params.push(fault_type);
      pIdx++;
    }

    if (vehicle_code) {
      query += ` AND vehicle_code ILIKE $${pIdx}`;
      params.push(`%${vehicle_code}%`);
      pIdx++;
    }

    if (rider_name) {
      query += ` AND rider_name ILIKE $${pIdx}`;
      params.push(`%${rider_name}%`);
      pIdx++;
    }

    if (search) {
      query += ` AND (ticket_id ILIKE $${pIdx} OR job_card_number ILIKE $${pIdx} OR vehicle_code ILIKE $${pIdx} OR vehicle_model ILIKE $${pIdx} OR rider_name ILIKE $${pIdx} OR issue_category ILIKE $${pIdx} OR assigned_technician ILIKE $${pIdx})`;
      params.push(`%${search}%`);
      pIdx++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json({ status: 'success', data: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('Error fetching maintenance orders:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/maintenance/:id - Fetch single job card by ID or ticket_id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT * FROM maintenance_orders WHERE id::text = $1 OR ticket_id = $1 OR job_card_number = $1 LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Job card / maintenance record not found' });
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching single maintenance record:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/maintenance - Create new job card / maintenance order
router.post('/', async (req, res) => {
  try {
    const {
      vehicle_code,
      vehicle_model,
      vehicle_category,
      issue_category,
      description,
      assigned_technician,
      service_center,
      priority,
      status,
      estimated_cost,
      parts_cost,
      labor_cost,
      total_cost,
      zone,
      rider_name,
      rider_mobile,
      reservation_id,
      fault_type,
      liability,
      rider_charge_amount,
      rider_payment_status,
      km_reading,
      scheduled_date,
      due_date
    } = req.body;

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const ticket_id = `MAIN-2026-${randomNum}`;
    const job_card_number = `JC-2026-${randomNum}`;

    const estCost = parseFloat(estimated_cost || total_cost || 0);
    const prtCost = parseFloat(parts_cost || 0);
    const lbrCost = parseFloat(labor_cost || 0);
    const totCost = parseFloat(total_cost || estCost || prtCost + lbrCost);
    const rdrCharge = parseFloat(rider_charge_amount || (liability === 'Rider Liable' ? totCost : 0));

    const result = await db.query(`
      INSERT INTO maintenance_orders (
        ticket_id, job_card_number, vehicle_code, vehicle_model, vehicle_category, 
        issue_category, description, assigned_technician, service_center, 
        priority, status, estimated_cost, parts_cost, labor_cost, total_cost, 
        zone, rider_name, rider_mobile, reservation_id, fault_type, liability, 
        rider_charge_amount, rider_payment_status, km_reading, scheduled_date, due_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
      ) RETURNING *
    `, [
      ticket_id,
      job_card_number,
      vehicle_code || 'EVM5025006',
      vehicle_model || 'Evegah City',
      vehicle_category || 'Electric Scooter',
      issue_category || 'General Service',
      description || '',
      assigned_technician || 'Ramesh Patel',
      service_center || 'Gotri Service Hub',
      priority || 'Medium',
      status || 'Scheduled',
      estCost,
      prtCost,
      lbrCost,
      totCost,
      zone || 'Gotri Zone',
      rider_name || null,
      rider_mobile || null,
      reservation_id || null,
      fault_type || (rider_name ? 'Rider Damage' : 'Normal Wear & Tear'),
      liability || (rider_name ? 'Rider Liable' : 'Company / Fleet'),
      rdrCharge,
      rider_payment_status || (rider_name ? 'Pending Recovery' : 'N/A (Fleet Expense)'),
      km_reading || '5,000 km',
      scheduled_date || new Date(),
      due_date || new Date(Date.now() + 2 * 86400000)
    ]);

    delByPattern('maintenance:*');
    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating maintenance order:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/maintenance/:id - Update job card / maintenance order
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      assigned_technician,
      description,
      priority,
      estimated_cost,
      parts_cost,
      labor_cost,
      total_cost,
      rider_name,
      rider_mobile,
      fault_type,
      liability,
      rider_charge_amount,
      rider_payment_status
    } = req.body;

    const result = await db.query(`
      UPDATE maintenance_orders
      SET status = COALESCE($1, status),
          assigned_technician = COALESCE($2, assigned_technician),
          description = COALESCE($3, description),
          priority = COALESCE($4, priority),
          estimated_cost = COALESCE($5, estimated_cost),
          parts_cost = COALESCE($6, parts_cost),
          labor_cost = COALESCE($7, labor_cost),
          total_cost = COALESCE($8, total_cost),
          rider_name = COALESCE($9, rider_name),
          rider_mobile = COALESCE($10, rider_mobile),
          fault_type = COALESCE($11, fault_type),
          liability = COALESCE($12, liability),
          rider_charge_amount = COALESCE($13, rider_charge_amount),
          rider_payment_status = COALESCE($14, rider_payment_status),
          updated_at = NOW()
      WHERE id::text = $15 OR ticket_id = $15 OR job_card_number = $15
      RETURNING *
    `, [
      status,
      assigned_technician,
      description,
      priority,
      estimated_cost,
      parts_cost,
      labor_cost,
      total_cost,
      rider_name,
      rider_mobile,
      fault_type,
      liability,
      rider_charge_amount,
      rider_payment_status,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Work order not found' });
    }

    delByPattern('maintenance:*');
    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating maintenance order:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/maintenance/bulk-delete - Bulk delete maintenance orders
router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No IDs provided for bulk delete' });
    }

    await db.query(`DELETE FROM maintenance_orders WHERE id::text = ANY($1::text[]) OR ticket_id = ANY($1::text[]) OR job_card_number = ANY($1::text[])`, [ids.map(String)]);
    delByPattern('maintenance:*');
    res.json({ status: 'success', message: `${ids.length} maintenance record(s) deleted successfully.` });
  } catch (err) {
    console.error('Error bulk deleting maintenance records:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/maintenance/:id - Delete single record
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM maintenance_orders WHERE id::text = $1 OR ticket_id = $1 OR job_card_number = $1`, [id]);
    delByPattern('maintenance:*');
    res.json({ status: 'success', message: 'Maintenance record deleted' });
  } catch (err) {
    console.error('Error deleting maintenance record:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

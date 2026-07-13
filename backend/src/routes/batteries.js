const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/batteries - List batteries
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let queryText = 'SELECT * FROM batteries WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status && status !== 'all') {
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      queryText += ` AND battery_id ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    queryText += ' ORDER BY battery_id ASC';

    const result = await db.bmsQuery(queryText, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch batteries error:', err);
    res.json([]);
  }
});

// GET /api/batteries/:battery_id - Detail view
router.get('/:battery_id', async (req, res) => {
  const { battery_id } = req.params;
  try {
    const result = await db.bmsQuery('SELECT * FROM batteries WHERE battery_id = $1', [battery_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Battery not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fetch battery detail error:', err);
    res.json(null);
  }
});

// GET /api/batteries/:battery_id/logs - Historical logs
router.get('/:battery_id/logs', async (req, res) => {
  const { battery_id } = req.params;
  try {
    const result = await db.bmsQuery(`
      SELECT * FROM battery_logs 
      WHERE battery_id = $1 
      ORDER BY created_at ASC 
      LIMIT 100
    `, [battery_id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch battery logs error:', err);
    res.json([]);
  }
});

// POST /api/batteries - Upsert battery telemetry and log it
router.post('/', async (req, res) => {
  const {
    battery_id,
    status,
    soc,
    voltage,
    current,
    temp,
    cycles,
    health,
    lat,
    lng,
    serial_number,
    battery_type,
    capacity,
    make,
    model,
    location,
    zone,
    assigned_to,
    vehicle_number,
    rider_name,
    purchase_date,
    warranty_valid_till,
    supplier,
    cost,
    invoice_number,
    notes,
    cells
  } = req.body;

  if (!battery_id) {
    return res.status(400).json({ error: 'battery_id is required' });
  }

  try {
    const cellsJson = cells ? JSON.stringify(cells) : '[]';

    // 1. Upsert battery
    const upsertQuery = `
      INSERT INTO batteries (
        battery_id, status, soc, voltage, current, temp, cycles, health, lat, lng,
        serial_number, battery_type, capacity, make, model, location, zone, assigned_to,
        vehicle_number, rider_name, purchase_date, warranty_valid_till, supplier, cost,
        invoice_number, notes, cells
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24,
        $25, $26, $27
      )
      ON CONFLICT (battery_id) DO UPDATE SET
        status = COALESCE(EXCLUDED.status, batteries.status),
        soc = COALESCE(EXCLUDED.soc, batteries.soc),
        voltage = COALESCE(EXCLUDED.voltage, batteries.voltage),
        current = COALESCE(EXCLUDED.current, batteries.current),
        temp = COALESCE(EXCLUDED.temp, batteries.temp),
        cycles = COALESCE(EXCLUDED.cycles, batteries.cycles),
        health = COALESCE(EXCLUDED.health, batteries.health),
        lat = COALESCE(EXCLUDED.lat, batteries.lat),
        lng = COALESCE(EXCLUDED.lng, batteries.lng),
        serial_number = COALESCE(EXCLUDED.serial_number, batteries.serial_number),
        battery_type = COALESCE(EXCLUDED.battery_type, batteries.battery_type),
        capacity = COALESCE(EXCLUDED.capacity, batteries.capacity),
        make = COALESCE(EXCLUDED.make, batteries.make),
        model = COALESCE(EXCLUDED.model, batteries.model),
        location = COALESCE(EXCLUDED.location, batteries.location),
        zone = COALESCE(EXCLUDED.zone, batteries.zone),
        assigned_to = COALESCE(EXCLUDED.assigned_to, batteries.assigned_to),
        vehicle_number = COALESCE(EXCLUDED.vehicle_number, batteries.vehicle_number),
        rider_name = COALESCE(EXCLUDED.rider_name, batteries.rider_name),
        purchase_date = COALESCE(EXCLUDED.purchase_date, batteries.purchase_date),
        warranty_valid_till = COALESCE(EXCLUDED.warranty_valid_till, batteries.warranty_valid_till),
        supplier = COALESCE(EXCLUDED.supplier, batteries.supplier),
        cost = COALESCE(EXCLUDED.cost, batteries.cost),
        invoice_number = COALESCE(EXCLUDED.invoice_number, batteries.invoice_number),
        notes = COALESCE(EXCLUDED.notes, batteries.notes),
        cells = COALESCE(EXCLUDED.cells, batteries.cells),
        updated_at = NOW()
      RETURNING *
    `;

    const batteryResult = await db.bmsQuery(upsertQuery, [
      battery_id,
      status || 'idle',
      soc !== undefined && soc !== null ? parseInt(soc) : 100,
      voltage !== undefined && voltage !== null ? parseFloat(voltage) : null,
      current !== undefined && current !== null ? parseFloat(current) : null,
      temp !== undefined && temp !== null ? parseFloat(temp) : null,
      cycles !== undefined && cycles !== null ? parseInt(cycles) : 0,
      health !== undefined && health !== null ? parseInt(health) : 100,
      lat !== undefined && lat !== null ? parseFloat(lat) : null,
      lng !== undefined && lng !== null ? parseFloat(lng) : null,
      serial_number || null,
      battery_type || 'Li-ion',
      capacity || null,
      make || null,
      model || null,
      location || null,
      zone || null,
      assigned_to || null,
      vehicle_number || null,
      rider_name || null,
      purchase_date || null,
      warranty_valid_till || null,
      supplier || null,
      cost !== undefined && cost !== null && cost !== '' ? parseFloat(cost) : null,
      invoice_number || null,
      notes || null,
      cellsJson
    ]);

    // 2. Insert telemetry log
    const logQuery = `
      INSERT INTO battery_logs (battery_id, soc, voltage, current, temp, lat, lng, status, cells)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    await db.bmsQuery(logQuery, [
      battery_id,
      soc !== undefined && soc !== null ? parseInt(soc) : null,
      voltage !== undefined && voltage !== null ? parseFloat(voltage) : null,
      current !== undefined && current !== null ? parseFloat(current) : null,
      temp !== undefined && temp !== null ? parseFloat(temp) : null,
      lat !== undefined && lat !== null ? parseFloat(lat) : null,
      lng !== undefined && lng !== null ? parseFloat(lng) : null,
      status || 'idle',
      cellsJson
    ]);

    res.status(201).json({
      message: 'Telemetry stored successfully',
      battery: batteryResult.rows[0]
    });
  } catch (err) {
    console.error('Store battery telemetry error:', err);
    res.status(500).json({ error: 'Database update failed', details: err.message });
  }
});

// PATCH /api/batteries/:battery_id/zone - Update battery zone assignment
router.patch('/:battery_id/zone', async (req, res) => {
  const { battery_id } = req.params;
  const { zone } = req.body;
  try {
    const result = await db.bmsQuery(
      'UPDATE batteries SET zone = $1 WHERE battery_id = $2 RETURNING *',
      [zone || 'Unassigned', battery_id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Battery not found' });
    }
    res.json({
      status: 'success',
      message: 'Battery zone updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to update battery zone:', err);
    res.status(500).json({ error: 'Database update failed', details: err.message });
  }
});

module.exports = router;

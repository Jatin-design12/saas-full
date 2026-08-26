const express = require('express');
const router = express.Router();
const db = require('../db');

// Ensure phone column exists
(async () => {
  try {
    await db.query('ALTER TABLE zones ADD COLUMN IF NOT EXISTS phone VARCHAR(50) DEFAULT \'+91 98765 43210\'');
  } catch (e) {
    console.error('Migration error for zones.phone:', e);
  }
})();

// GET /api/zones
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM zones ORDER BY created_at DESC');
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (err) {
    console.error('Failed to get zones from DB, returning empty list:', err);
    res.json({
      status: 'success',
      data: []
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

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all coupons
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM coupons ORDER BY created_at DESC');
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    console.error('Error fetching coupons:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST a new coupon
router.post('/', async (req, res) => {
  const {
    code,
    title,
    description,
    discount_type,
    discount_value,
    min_order,
    redemption_limit,
    per_user_limit,
    start_date,
    end_date,
    status,
    applicable_on,
    selected_zones
  } = req.body;

  try {
    const result = await db.query(`
      INSERT INTO coupons (
        code, title, description, discount_type, discount_value, min_order, 
        redemption_limit, per_user_limit, start_date, end_date, status, 
        applicable_on, selected_zones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      code,
      title || '',
      description || '',
      discount_type || 'Flat',
      parseFloat(discount_value) || 0.0,
      parseFloat(min_order) || 0.0,
      parseInt(redemption_limit) || 100,
      parseInt(per_user_limit) || 1,
      start_date || new Date().toISOString(),
      end_date || null,
      status || 'Active',
      applicable_on || 'All Rentals',
      JSON.stringify(selected_zones || [])
    ]);

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating coupon:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT update coupon
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    code,
    title,
    description,
    discount_type,
    discount_value,
    min_order,
    redemption_limit,
    per_user_limit,
    start_date,
    end_date,
    status,
    applicable_on,
    selected_zones
  } = req.body;

  try {
    const result = await db.query(`
      UPDATE coupons SET 
        code = $1, title = $2, description = $3, discount_type = $4, 
        discount_value = $5, min_order = $6, redemption_limit = $7, 
        per_user_limit = $8, start_date = $9, end_date = $10, status = $11, 
        applicable_on = $12, selected_zones = $13
      WHERE id = $14 OR code = $14
      RETURNING *
    `, [
      code,
      title || '',
      description || '',
      discount_type || 'Flat',
      parseFloat(discount_value) || 0.0,
      parseFloat(min_order) || 0.0,
      parseInt(redemption_limit) || 100,
      parseInt(per_user_limit) || 1,
      start_date || null,
      end_date || null,
      status || 'Active',
      applicable_on || 'All Rentals',
      JSON.stringify(selected_zones || []),
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Coupon not found' });
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating coupon:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE a coupon
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM coupons WHERE id = $1 OR code = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Coupon not found' });
    }
    res.json({ status: 'success', message: 'Coupon deleted successfully' });
  } catch (err) {
    console.error('Error deleting coupon:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

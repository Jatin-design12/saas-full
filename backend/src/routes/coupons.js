const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all coupons with real live utilization & total discount calculated from reservations
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.*,
        GREATEST(COALESCE(u.used_count, 0), COALESCE(c.current_usage, 0))::int as current_usage,
        CASE 
          WHEN COALESCE(u.total_discount, 0) > 0 THEN u.total_discount::numeric
          ELSE (GREATEST(COALESCE(u.used_count, 0), COALESCE(c.current_usage, 0)) * COALESCE(c.discount_value, 0))::numeric
        END as total_discount_given
      FROM coupons c
      LEFT JOIN (
        SELECT 
          coupon_code, 
          COUNT(*)::int as used_count, 
          SUM(COALESCE(discount::numeric, 0)) as total_discount
        FROM reservations
        WHERE coupon_code IS NOT NULL AND coupon_code != ''
        GROUP BY coupon_code
      ) u ON LOWER(c.code) = LOWER(u.coupon_code)
      ORDER BY c.created_at DESC
    `);

    const now = new Date();
    const updatedRows = [];
    for (const c of result.rows) {
      let dynamicStatus = c.status;
      const usage = parseInt(c.current_usage) || 0;
      const limit = parseInt(c.redemption_limit) || 0;

      if (c.end_date && new Date(c.end_date) < now) {
        dynamicStatus = 'Expired';
      } else if (limit > 0 && usage >= limit) {
        dynamicStatus = 'Utilized';
      } else if (c.start_date && new Date(c.start_date) > now) {
        dynamicStatus = 'Scheduled';
      } else if (c.status !== 'Inactive') {
        dynamicStatus = 'Active';
      }

      if (dynamicStatus !== c.status || usage !== (c.current_usage || 0)) {
        await db.query('UPDATE coupons SET status = $1, current_usage = $2 WHERE id = $3', [dynamicStatus, usage, c.id]).catch(e => console.error(e));
        c.status = dynamicStatus;
      }
      c.current_usage = usage;
      updatedRows.push(c);
    }

    res.json({ status: 'success', data: updatedRows });
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
        applicable_on, selected_zones, current_usage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 0)
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
      WHERE id::text = $14 OR code = $14
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
    const result = await db.query('DELETE FROM coupons WHERE id::text = $1 OR code = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Coupon not found' });
    }
    res.json({ status: 'success', message: 'Coupon deleted successfully' });
  } catch (err) {
    console.error('Error deleting coupon:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/coupons/validate - Validate a coupon for checkout
router.post('/validate', async (req, res) => {
  try {
    const { code, amount, zone } = req.body;
    if (!code) {
      return res.status(400).json({ status: 'error', message: 'Coupon code is required' });
    }
    const result = await db.query(
      'SELECT * FROM coupons WHERE LOWER(code) = LOWER($1)',
      [code.trim()]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Invalid coupon code' });
    }
    const coupon = result.rows[0];
    const now = new Date();
    if (coupon.status !== 'Active') {
      return res.status(400).json({ status: 'error', message: `Coupon is ${coupon.status.toLowerCase()}` });
    }
    if (coupon.start_date && new Date(coupon.start_date) > now) {
      return res.status(400).json({ status: 'error', message: 'Coupon is not yet active' });
    }
    if (coupon.end_date && new Date(coupon.end_date) < now) {
      return res.status(400).json({ status: 'error', message: 'Coupon has expired' });
    }
    const orderAmt = parseFloat(amount || 0);
    const minOrder = parseFloat(coupon.min_order || 0);
    if (minOrder > 0 && orderAmt < minOrder) {
      return res.status(400).json({ status: 'error', message: `Minimum order amount of ₹${minOrder} required` });
    }
    const curUsage = parseInt(coupon.current_usage || 0);
    const redLimit = parseInt(coupon.redemption_limit || 0);
    if (redLimit > 0 && curUsage >= redLimit) {
      return res.status(400).json({ status: 'error', message: 'Coupon redemption limit has been reached' });
    }

    let discount = 0;
    const discVal = parseFloat(coupon.discount_value || 0);
    if (coupon.discount_type === 'Percentage') {
      discount = (orderAmt * discVal) / 100;
    } else {
      discount = discVal;
    }
    if (discount > orderAmt && orderAmt > 0) discount = orderAmt;

    return res.json({
      status: 'success',
      valid: true,
      data: {
        code: coupon.code,
        discount: parseFloat(discount.toFixed(2)),
        discount_type: coupon.discount_type,
        discount_value: discVal,
        title: coupon.title
      }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/coupons/redeem - Mark coupon as used & increment usage count
router.post('/redeem', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ status: 'error', message: 'Coupon code is required' });
    }
    const result = await db.query(
      `UPDATE coupons 
       SET current_usage = COALESCE(current_usage, 0) + 1,
           status = CASE WHEN redemption_limit > 0 AND (COALESCE(current_usage, 0) + 1) >= redemption_limit THEN 'Utilized' ELSE status END
       WHERE LOWER(code) = LOWER($1)
       RETURNING *`,
      [code.trim()]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Coupon not found' });
    }
    return res.json({ status: 'success', message: 'Coupon redeemed successfully', data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

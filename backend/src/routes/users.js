const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/users - List all users
router.get('/', async (req, res) => {
  try {
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';
    const zone = req.query.zone || '';

    let query = 'SELECT id, name, email, role, mobile, zone, status, last_login, avatar_url, created_at FROM users WHERE 1=1';
    const params = [];
    let pIdx = 1;

    if (search) {
      query += ` AND (name ILIKE $${pIdx} OR email ILIKE $${pIdx} OR mobile ILIKE $${pIdx})`;
      params.push(`%${search}%`);
      pIdx++;
    }

    if (role && role !== 'All Roles') {
      query += ` AND role = $${pIdx}`;
      params.push(role);
      pIdx++;
    }

    if (status && status !== 'All Status') {
      query += ` AND status = $${pIdx}`;
      params.push(status);
      pIdx++;
    }

    if (zone && zone !== 'All Zones') {
      query += ` AND zone = $${pIdx}`;
      params.push(zone);
      pIdx++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/users/:id - Get single user
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT id, name, email, role, mobile, zone, status, last_login, avatar_url, created_at FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  try {
    const { name, email, role, mobile, zone, status, password, avatar_url } = req.body;

    if (!name || !email) {
      return res.status(400).json({ status: 'error', message: 'Name and email are required fields' });
    }

    const checkEmail = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Email already registered' });
    }

    const result = await db.query(`
      INSERT INTO users (name, email, role, mobile, zone, status, password, avatar_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, email, role, mobile, zone, status, avatar_url, created_at
    `, [
      name,
      email,
      role || 'Employee',
      mobile || '',
      zone || '',
      status || 'Active',
      password || 'temp123',
      avatar_url || null
    ]);

    // increment users_count in roles table for this role
    if (role) {
      await db.query(
        'UPDATE roles SET users_count = users_count + 1, last_updated = NOW() WHERE name = $1 OR code = $1',
        [role]
      );
    }

    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/users/:id - Update user details
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, mobile, zone, status, password, avatar_url } = req.body;

    // Check if user exists
    const userCheck = await db.query('SELECT role FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const oldRole = userCheck.rows[0].role;

    let updateQuery = `
      UPDATE users 
      SET name = $1, email = $2, role = $3, mobile = $4, zone = $5, status = $6, avatar_url = $7
    `;
    const params = [name, email, role, mobile, zone, status, avatar_url];
    let pIdx = 8;

    if (password) {
      updateQuery += `, password = $${pIdx}`;
      params.push(password);
      pIdx++;
    }

    updateQuery += ` WHERE id = $${pIdx} RETURNING id, name, email, role, mobile, zone, status, avatar_url, created_at`;
    params.push(id);

    const result = await db.query(updateQuery, params);

    // Adjust user counts for roles if the role changed
    if (role && oldRole !== role) {
      // decrement old role count
      await db.query(
        'UPDATE roles SET users_count = GREATEST(0, users_count - 1), last_updated = NOW() WHERE name = $1 OR code = $1',
        [oldRole]
      );
      // increment new role count
      await db.query(
        'UPDATE roles SET users_count = users_count + 1, last_updated = NOW() WHERE name = $1 OR code = $1',
        [role]
      );
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PATCH /api/users/:id/zone - Update user zone assignment
router.patch('/:id/zone', async (req, res) => {
  const { id } = req.params;
  const { zone } = req.body;
  try {
    const result = await db.query(
      'UPDATE users SET zone = $1 WHERE id = $2 RETURNING id, name, email, role, mobile, zone, status',
      [zone || 'Unassigned', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({
      status: 'success',
      message: 'User zone updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to update user zone:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // get role to decrement users_count
    const userResult = await db.query('SELECT role FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }

    const userRole = userResult.rows[0].role;

    await db.query('DELETE FROM users WHERE id = $1', [id]);

    if (userRole) {
      await db.query(
        'UPDATE roles SET users_count = GREATEST(0, users_count - 1), last_updated = NOW() WHERE name = $1 OR code = $1',
        [userRole]
      );
    }

    res.json({ status: 'success', message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

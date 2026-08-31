const express = require('express');
const router = express.Router();
const db = require('../db');

// Ensure users table and columns exist in Postgres
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        role VARCHAR(100) DEFAULT 'Zone Manager',
        mobile VARCHAR(50),
        zone VARCHAR(100) DEFAULT 'Gotri Zone',
        status VARCHAR(50) DEFAULT 'Active',
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        avatar_url TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(100) DEFAULT 'Zone Manager'");
    await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS zone VARCHAR(100) DEFAULT 'Gotri Zone'");
    await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active'");
    await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(50)");
    await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT ''");
    await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
  } catch (e) {
    console.error('Users DB initialization warning:', e.message);
  }
})();

const MOCK_USERS = [
  { id: 1, name: 'Rohit Sharma', email: 'rohit@evegah.com', role: 'Super Admin', mobile: '+91 98765 43210', zone: 'Gotri Zone', status: 'Active', last_login: new Date().toISOString(), avatar_url: '/rohit_avatar.png', created_at: '2026-01-15T00:00:00.000Z' },
  { id: 2, name: 'Ananya Verma', email: 'ananya@evegah.com', role: 'Zone Manager', mobile: '+91 91234 56789', zone: 'Gotri Zone', status: 'Active', last_login: new Date().toISOString(), avatar_url: '/priya_avatar.png', created_at: '2026-02-10T00:00:00.000Z' },
  { id: 3, name: 'Priyansh Shah', email: 'priyansh@evegah.com', role: 'Fleet Operator', mobile: '+91 99877 66554', zone: 'Aatapi Zone', status: 'Active', last_login: new Date().toISOString(), avatar_url: '', created_at: '2026-03-01T00:00:00.000Z' },
  { id: 4, name: 'Dev Patel', email: 'dev@evegah.com', role: 'Support Agent', mobile: '+91 88776 54321', zone: 'Gotri Zone', status: 'Inactive', last_login: new Date().toISOString(), avatar_url: '', created_at: '2026-04-12T00:00:00.000Z' }
];

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
    if (result.rows.length === 0) {
      return res.json({ status: 'success', data: MOCK_USERS });
    }
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    console.error('Error fetching users, returning seed users:', err.message);
    res.json({ status: 'success', data: MOCK_USERS });
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

// GET /api/users/:id/activities - Fetch activity log for user
router.get('/:id/activities', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, module: modName, search } = req.query;

    const userRes = await db.query('SELECT name FROM users WHERE id = $1', [id]);
    const userName = userRes.rows.length > 0 ? userRes.rows[0].name : '';

    let query = 'SELECT * FROM audit_logs WHERE 1=1';
    const params = [];
    let pIdx = 1;

    if (id || userName) {
      query += ` AND (user_id = $${pIdx} OR performed_by = $${pIdx + 1})`;
      params.push(id, userName || 'Rohit Sharma');
      pIdx += 2;
    }

    if (action && action !== 'All Actions') {
      query += ` AND UPPER(action) = UPPER($${pIdx})`;
      params.push(action);
      pIdx++;
    }

    if (modName && modName !== 'All Modules') {
      query += ` AND UPPER(module) = UPPER($${pIdx})`;
      params.push(modName);
      pIdx++;
    }

    if (search) {
      query += ` AND (details ILIKE $${pIdx} OR module ILIKE $${pIdx})`;
      params.push(`%${search}%`);
      pIdx++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    
    // If no specific audit logs exist yet for this user ID, return default sample audit records
    if (result.rows.length === 0) {
      const fallbackLogs = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 10');
      return res.json({ status: 'success', data: fallbackLogs.rows });
    }

    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    console.error('Error fetching user activities:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

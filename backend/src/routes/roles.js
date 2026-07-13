const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/roles - List all roles with dynamic user counts
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT r.id, r.name, r.code, r.description, r.reporting_to, r.status, 
             r.permissions, r.custom_permissions, r.created_at, r.last_updated,
             COUNT(u.id)::int as users_count
      FROM roles r
      LEFT JOIN users u ON u.role = r.name OR u.role = r.code
      GROUP BY r.id
      ORDER BY r.created_at ASC
    `;
    const result = await db.query(query);
    res.json({ status: 'success', data: result.rows });
  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/roles/:id - Get single role
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT id, name, code, description, reporting_to, status, permissions, custom_permissions, created_at, last_updated FROM roles WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Role not found' });
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching role:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/roles - Create new role
router.post('/', async (req, res) => {
  try {
    const { name, code, description, reporting_to, status, permissions, custom_permissions } = req.body;

    if (!name || !code) {
      return res.status(400).json({ status: 'error', message: 'Name and code are required' });
    }

    // Check if role name or code exists
    const checkExist = await db.query(
      'SELECT id FROM roles WHERE name = $1 OR code = $2',
      [name, code.toUpperCase()]
    );
    if (checkExist.rows.length > 0) {
      return res.status(400).json({ status: 'error', message: 'Role name or code already exists' });
    }

    const result = await db.query(`
      INSERT INTO roles (name, code, description, reporting_to, status, permissions, custom_permissions)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, code, description, reporting_to, status, permissions, custom_permissions, created_at
    `, [
      name,
      code.toUpperCase(),
      description || '',
      reporting_to || null,
      status || 'Active',
      JSON.stringify(permissions || {}),
      JSON.stringify(custom_permissions || [])
    ]);

    res.status(201).json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error creating role:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/roles/:id - Update existing role
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, reporting_to, status, permissions, custom_permissions } = req.body;

    // Check if role exists
    const checkRole = await db.query('SELECT name FROM roles WHERE id = $1', [id]);
    if (checkRole.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Role not found' });
    }

    const oldName = checkRole.rows[0].name;

    const result = await db.query(`
      UPDATE roles
      SET name = $1, code = $2, description = $3, reporting_to = $4, status = $5, 
          permissions = $6, custom_permissions = $7, last_updated = NOW()
      WHERE id = $8
      RETURNING id, name, code, description, reporting_to, status, permissions, custom_permissions, last_updated
    `, [
      name,
      code.toUpperCase(),
      description || '',
      reporting_to || null,
      status || 'Active',
      JSON.stringify(permissions || {}),
      JSON.stringify(custom_permissions || []),
      id
    ]);

    // If role name changed, update the user roles in users table
    if (name && oldName !== name) {
      await db.query('UPDATE users SET role = $1 WHERE role = $2', [name, oldName]);
    }

    res.json({ status: 'success', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating role:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/roles/:id - Delete a role
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if role exists
    const checkRole = await db.query('SELECT name, code FROM roles WHERE id = $1', [id]);
    if (checkRole.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Role not found' });
    }

    const { name, code } = checkRole.rows[0];

    // Check if any users are assigned to this role
    const checkUsers = await db.query(
      'SELECT id FROM users WHERE role = $1 OR role = $2 LIMIT 1',
      [name, code]
    );
    if (checkUsers.rows.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete role because it is currently assigned to users'
      });
    }

    await db.query('DELETE FROM roles WHERE id = $1', [id]);
    res.json({ status: 'success', message: 'Role deleted successfully' });
  } catch (err) {
    console.error('Error deleting role:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

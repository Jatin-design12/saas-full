const express = require('express');
const router = express.Router();
const db = require('../db');

// Ensure table exists with 24-hour expiration support
let tableInitialized = false;
async function ensureTable() {
  if (tableInitialized) return;
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS registration_drafts (
        id SERIAL PRIMARY KEY,
        draft_id VARCHAR(64) UNIQUE NOT NULL,
        rider_name VARCHAR(255) DEFAULT '',
        mobile VARCHAR(64) DEFAULT '',
        current_step INT NOT NULL DEFAULT 1,
        step_name VARCHAR(128) NOT NULL DEFAULT 'KYC Verification',
        form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_by VARCHAR(255) DEFAULT 'Staff',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 HOURS')
      );
      CREATE INDEX IF NOT EXISTS idx_reg_drafts_expires_at ON registration_drafts(expires_at);
      CREATE INDEX IF NOT EXISTS idx_reg_drafts_mobile ON registration_drafts(mobile);
    `);
    tableInitialized = true;
  } catch (err) {
    console.error('Error ensuring registration_drafts table:', err.message);
  }
}

// Background cleanup helper: delete drafts expired past 24 hours
async function cleanExpiredDrafts() {
  try {
    await db.query("DELETE FROM registration_drafts WHERE expires_at <= NOW()");
  } catch (_) {}
}

/**
 * GET /api/drafts
 * Returns all active, unexpired registration drafts (within 24 hours)
 */
router.get('/', async (req, res) => {
  try {
    await ensureTable();
    // Run lazy cleanup of expired drafts
    cleanExpiredDrafts().catch(() => {});

    const result = await db.query(`
      SELECT 
        id,
        draft_id,
        rider_name,
        mobile,
        current_step,
        step_name,
        form_data,
        created_by,
        created_at,
        updated_at,
        expires_at,
        ROUND(EXTRACT(EPOCH FROM (expires_at - NOW())) / 60) AS minutes_remaining,
        ROUND(EXTRACT(EPOCH FROM (expires_at - NOW())) / 3600, 1) AS hours_remaining
      FROM registration_drafts
      WHERE expires_at > NOW()
      ORDER BY updated_at DESC
    `);

    return res.json({
      status: 'success',
      total: result.rows.length,
      drafts: result.rows
    });
  } catch (err) {
    console.error('Error fetching drafts:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/drafts/:id
 * Fetch a single draft by draft_id or numeric id
 */
router.get('/:id', async (req, res) => {
  try {
    await ensureTable();
    const idParam = req.params.id;

    const result = await db.query(`
      SELECT 
        id,
        draft_id,
        rider_name,
        mobile,
        current_step,
        step_name,
        form_data,
        created_by,
        created_at,
        updated_at,
        expires_at,
        ROUND(EXTRACT(EPOCH FROM (expires_at - NOW())) / 60) AS minutes_remaining
      FROM registration_drafts
      WHERE (draft_id = $1 OR id::text = $1)
        AND expires_at > NOW()
      LIMIT 1
    `, [idParam]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Draft application not found or has expired (24h retention limit exceeded).'
      });
    }

    return res.json({
      status: 'success',
      draft: result.rows[0]
    });
  } catch (err) {
    console.error('Error fetching draft by id:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * POST /api/drafts
 * Create or update a registration draft with 24-hour expiration
 */
router.post('/', async (req, res) => {
  try {
    await ensureTable();
    const {
      draft_id,
      rider_name,
      mobile,
      current_step = 1,
      step_name = 'KYC Verification',
      form_data = {},
      created_by = 'Staff'
    } = req.body;

    // Determine rider name & mobile if not supplied directly
    const computedName = rider_name || (form_data.kyc && form_data.kyc.fullName) || form_data.fullName || 'Draft Rider';
    const computedMobile = mobile || (form_data.kyc && form_data.kyc.mobile) || form_data.mobile || '';

    // If draft_id is given and exists, update it and renew the 24-hour expiration window
    if (draft_id) {
      const existing = await db.query(
        "SELECT id FROM registration_drafts WHERE draft_id = $1 LIMIT 1",
        [draft_id]
      );

      if (existing.rows.length > 0) {
        const updateResult = await db.query(`
          UPDATE registration_drafts
          SET 
            rider_name = COALESCE(NULLIF($1, ''), rider_name),
            mobile = COALESCE(NULLIF($2, ''), mobile),
            current_step = $3,
            step_name = $4,
            form_data = $5,
            updated_at = NOW(),
            expires_at = NOW() + INTERVAL '24 HOURS'
          WHERE draft_id = $6
          RETURNING *
        `, [computedName, computedMobile, current_step, step_name, JSON.stringify(form_data), draft_id]);

        return res.json({
          status: 'success',
          message: 'Draft application updated successfully (saved for 24 hours)',
          draft: updateResult.rows[0]
        });
      }
    }

    // Generate fresh unique draft ID: e.g. DRF-20261108-9842
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const newDraftId = draft_id || `DRF-${datePart}-${randPart}`;

    const insertResult = await db.query(`
      INSERT INTO registration_drafts (
        draft_id,
        rider_name,
        mobile,
        current_step,
        step_name,
        form_data,
        created_by,
        created_at,
        updated_at,
        expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW() + INTERVAL '24 HOURS')
      RETURNING *
    `, [newDraftId, computedName, computedMobile, current_step, step_name, JSON.stringify(form_data), created_by]);

    return res.status(201).json({
      status: 'success',
      message: 'Application drafted successfully (saved for 24 hours)',
      draft: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Error saving draft:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * DELETE /api/drafts/:id
 * Remove draft once application is completed or manually discarded
 */
router.delete('/:id', async (req, res) => {
  try {
    await ensureTable();
    const idParam = req.params.id;

    await db.query(
      "DELETE FROM registration_drafts WHERE draft_id = $1 OR id::text = $1",
      [idParam]
    );

    return res.json({
      status: 'success',
      message: 'Draft application removed successfully'
    });
  } catch (err) {
    console.error('Error deleting draft:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

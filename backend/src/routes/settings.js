const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all settings
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT category, values FROM settings');
    const settingsObj = {};
    
    // Group settings by category
    result.rows.forEach(row => {
      settingsObj[row.category] = row.values;
    });

    res.json({ status: 'success', data: settingsObj });
  } catch (err) {
    console.error('Error fetching settings:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT settings for a specific category
router.put('/:category', async (req, res) => {
  const { category } = req.params;
  const newValues = req.body;

  try {
    // Check if category is valid
    const validCategories = ['general', 'ride_rental', 'payments', 'notifications', 'system', 'battery_swapping', 'documents', 'security', 'mobile_app', 'app_slider', 'mobile_app_settings'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ status: 'error', message: `Invalid settings category: ${category}` });
    }

    // Insert or update settings in database
    await db.query(`
      INSERT INTO settings (category, values)
      VALUES ($1, $2)
      ON CONFLICT (category) DO UPDATE SET values = EXCLUDED.values
    `, [category, JSON.stringify(newValues)]);

    res.json({ status: 'success', message: `Settings updated for category: ${category}`, data: newValues });
  } catch (err) {
    console.error(`Error saving settings for ${category}:`, err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

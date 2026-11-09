const express = require('express');
const router = express.Router();
const db = require('../db');
const { getCache, setCache } = require('../redis');

// Master default packages matching real production zone pricing
const MASTER_PACKAGES = [
  { id: 'city_3d', name: '3 Days City Pass', model: 'Evegah City', duration: 3, duration_unit: 'days', price: 899, deposit: 1000, badge: 'Popular' },
  { id: 'city_5d', name: '5 Days City Pass', model: 'Evegah City', duration: 5, duration_unit: 'days', price: 1399, deposit: 1000, badge: null },
  { id: 'city_7d', name: '7 Days City Pass', model: 'Evegah City', duration: 7, duration_unit: 'days', price: 1899, deposit: 1500, badge: 'Best Value' },
  { id: 'city_10d', name: '10 Days City Pass', model: 'Evegah City', duration: 10, duration_unit: 'days', price: 2499, deposit: 2000, badge: null },
  { id: 'mink_3d', name: '3 Days Cargo Pass', model: 'Evegah Mink', duration: 3, duration_unit: 'days', price: 1199, deposit: 1500, badge: 'Cargo' },
  { id: 'mink_7d', name: '7 Days Cargo Pass', model: 'Evegah Mink', duration: 7, duration_unit: 'days', price: 2499, deposit: 2000, badge: 'Commercial' },
  { id: 'mink_15d', name: '15 Days Cargo Pass', model: 'Evegah Mink', duration: 15, duration_unit: 'days', price: 4499, deposit: 2500, badge: 'Save 15%' },
  { id: 'pro_3d', name: '3 Days Pro Speed Pass', model: 'Evegah Pro', duration: 3, duration_unit: 'days', price: 1499, deposit: 2000, badge: 'High Speed' },
  { id: 'pro_7d', name: '7 Days Pro Speed Pass', model: 'Evegah Pro', duration: 7, duration_unit: 'days', price: 2999, deposit: 2500, badge: 'Top Performance' },
  { id: 'fly_3d', name: '3 Days Moped Pass', model: 'Evegah Fly', duration: 3, duration_unit: 'days', price: 699, deposit: 800, badge: 'Economical' },
  { id: 'fly_7d', name: '7 Days Moped Pass', model: 'Evegah Fly', duration: 7, duration_unit: 'days', price: 1399, deposit: 1000, badge: null },
  { id: 'coastal_1d', name: 'Coastal Day Pass', model: 'Evegah City', duration: 1, duration_unit: 'days', price: 450, deposit: 500, badge: 'Daman Special' },
  { id: 'beach_3d', name: 'Beach Weekend 3D', model: 'Evegah City', duration: 3, duration_unit: 'days', price: 1199, deposit: 1000, badge: 'Weekend' },
];

// GET /api/packages - List active packages with optional ?zone= and ?model=
router.get('/', async (req, res) => {
  try {
    const { zone, model } = req.query;
    const cacheKey = `packages:list:${zone || 'all'}:${model || 'all'}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    let packages = [...MASTER_PACKAGES];

    // If zone provided, check zone-specific packages
    if (zone && zone !== 'All' && zone !== 'All Zones') {
      const zLower = zone.toLowerCase();
      if (zLower.includes('daman')) {
        packages = packages.filter(p => p.id.includes('coastal') || p.id.includes('beach') || p.model === 'Evegah City');
      } else if (zLower.includes('aatapi')) {
        packages = packages.filter(p => p.duration <= 3);
      }
    }

    // Filter by model if requested
    if (model && model !== 'All') {
      const mLower = model.toLowerCase();
      const modelPkgs = packages.filter(p => (p.model || '').toLowerCase().includes(mLower));
      if (modelPkgs.length > 0) {
        packages = modelPkgs;
      }
    }

    const result = {
      status: 'success',
      data: packages,
      count: packages.length,
      rates: {
        perDayRate: 350,
        perHourRate: 45
      }
    };

    await setCache(cacheKey, result, 300);
    return res.json(result);
  } catch (err) {
    console.error('Error fetching packages:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/packages/calculate-extension
router.post('/calculate-extension', async (req, res) => {
  try {
    const { package_id, extension_days = 0, extension_hours = 0, zone } = req.body;

    let fare = 0;
    let selectedPackage = null;

    if (package_id) {
      selectedPackage = MASTER_PACKAGES.find(p => p.id === package_id || String(p.id) === String(package_id));
      if (selectedPackage) {
        fare = selectedPackage.price;
      }
    }

    if (!selectedPackage) {
      const days = parseInt(extension_days) || 0;
      const hours = parseInt(extension_hours) || 0;
      fare = (days * 350) + (hours * 45);
    }

    return res.json({
      status: 'success',
      data: {
        fare,
        package: selectedPackage,
        extension_days,
        extension_hours
      }
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

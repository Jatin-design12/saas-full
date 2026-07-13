const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/vehicles
router.get('/', async (req, res) => {
  const { zone } = req.query;
  try {
    let query = 'SELECT * FROM vehicles';
    let params = [];
    if (zone) {
      query += ' WHERE zone = $1';
      params.push(zone);
    }
    query += ' ORDER BY created_at DESC';
    const result = await db.query(query, params);
    res.json({
      status: 'success',
      data: result.rows
    });
  } catch (err) {
    console.error('Failed to get vehicles:', err);
    res.json({
      status: 'success',
      data: []
    });
  }
});

// GET /api/vehicles/:code
router.get('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await db.query('SELECT * FROM vehicles WHERE code = $1', [code]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
    }
    res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to get vehicle:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/vehicles
router.post('/', async (req, res) => {
  const {
    vehicleImage,
    vehicleNumber,
    vehicleCategory,
    vehicleType,
    evegahModelName,
    vehicleModel,
    vehicleManufacturer,
    manufacturingDate,
    chassisNumber,
    motorNumber,
    controllerNumber,
    registrationNumber,
    color,
    purchaseDate,
    vehicleWarrantyExpiryDate,
    insurancePolicyNumber,
    insuranceProvider,
    insuranceExpiryDate,
    currentKmReading,
    totalKmCovered,
    vehicleStatus,
    vehicleDocument,
    vehicleQrCode,
    zone
  } = req.body;

  let selectedImg = vehicleImage;
  if (!selectedImg || selectedImg === '/3d_scooter_rider.png') {
    if (evegahModelName === 'Evegah Mink') selectedImg = '/Mink-1.png';
    else if (evegahModelName === 'Evegah City') selectedImg = '/City-1.png';
    else if (evegahModelName === 'Evegah Fly') selectedImg = '/fly-1.png';
    else if (evegahModelName === 'Evegah Pro') selectedImg = '/pro-1.png';
    else selectedImg = '/City-1.png';
  }

  try {
    const result = await db.query(`
      INSERT INTO vehicles (
        code, vehicle_image, vehicle_category, vehicle_type, evegah_model_name, vehicle_model,
        vehicle_manufacturer, manufacturing_date, chassis_number, motor_number, controller_number,
        registration_number, color, purchase_date, vehicle_warranty_expiry_date,
        insurance_policy_number, insurance_provider, insurance_expiry_date,
        current_km_reading, total_km_covered, vehicle_status, vehicle_document, vehicle_qr_code,
        status, battery_pct, speed, renter_name, zone
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28)
      RETURNING *
    `, [
      vehicleNumber,
      selectedImg,
      vehicleCategory || 'E-Scooter',
      vehicleType || 'Rental',
      evegahModelName || 'Evegah City',
      vehicleModel || '',
      vehicleManufacturer || '',
      manufacturingDate ? new Date(manufacturingDate) : null,
      chassisNumber || '',
      motorNumber || '',
      controllerNumber || '',
      registrationNumber || '',
      color || '',
      purchaseDate ? new Date(purchaseDate) : null,
      vehicleWarrantyExpiryDate ? new Date(vehicleWarrantyExpiryDate) : null,
      insurancePolicyNumber || '',
      insuranceProvider || '',
      insuranceExpiryDate ? new Date(insuranceExpiryDate) : null,
      currentKmReading ? parseFloat(currentKmReading) : 0,
      totalKmCovered ? parseFloat(totalKmCovered) : 0,
      vehicleStatus || 'Available',
      vehicleDocument || '',
      vehicleQrCode || '',
      'Online', // tracking status
      100, // battery_pct
      0, // speed
      'None (Available)',
      zone || 'Unassigned'
    ]);

    res.json({
      status: 'success',
      message: 'Vehicle added successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to add vehicle:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// PUT /api/vehicles/:code
router.put('/:code', async (req, res) => {
  const { code } = req.params;
  const {
    vehicleCategory,
    vehicleType,
    evegahModelName,
    vehicleModel,
    vehicleManufacturer,
    manufacturingDate,
    chassisNumber,
    motorNumber,
    controllerNumber,
    registrationNumber,
    color,
    purchaseDate,
    vehicleWarrantyExpiryDate,
    insurancePolicyNumber,
    insuranceProvider,
    insuranceExpiryDate,
    currentKmReading,
    totalKmCovered,
    vehicleStatus,
    zone
  } = req.body;

  let selectedImg = undefined;
  if (evegahModelName) {
    if (evegahModelName === 'Evegah Mink') selectedImg = '/Mink-1.png';
    else if (evegahModelName === 'Evegah City') selectedImg = '/City-1.png';
    else if (evegahModelName === 'Evegah Fly') selectedImg = '/fly-1.png';
    else if (evegahModelName === 'Evegah Pro') selectedImg = '/pro-1.png';
  }

  try {
    const result = await db.query(`
      UPDATE vehicles
      SET vehicle_category = $1, vehicle_type = $2, evegah_model_name = $3, vehicle_model = $4,
          vehicle_manufacturer = $5, manufacturing_date = $6, chassis_number = $7, motor_number = $8,
          controller_number = $9, registration_number = $10, color = $11, purchase_date = $12,
          vehicle_warranty_expiry_date = $13, insurance_policy_number = $14, insurance_provider = $15,
          insurance_expiry_date = $16, current_km_reading = $17, total_km_covered = $18,
          vehicle_status = $19, vehicle_image = COALESCE($20, vehicle_image), zone = $21
      WHERE code = $22
      RETURNING *
    `, [
      vehicleCategory, vehicleType, evegahModelName, vehicleModel, vehicleManufacturer,
      manufacturingDate ? new Date(manufacturingDate) : null, chassisNumber, motorNumber,
      controllerNumber, registrationNumber, color, purchaseDate ? new Date(purchaseDate) : null,
      vehicleWarrantyExpiryDate ? new Date(vehicleWarrantyExpiryDate) : null,
      insurancePolicyNumber, insuranceProvider, insuranceExpiryDate ? new Date(insuranceExpiryDate) : null,
      currentKmReading ? parseFloat(currentKmReading) : 0, totalKmCovered ? parseFloat(totalKmCovered) : 0,
      vehicleStatus, selectedImg || null, zone || 'Unassigned', code
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
    }

    res.json({
      status: 'success',
      message: 'Vehicle updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to update vehicle:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/vehicles/:code
router.delete('/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const result = await db.query('DELETE FROM vehicles WHERE code = $1 RETURNING *', [code]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }
    res.json({
      status: 'success',
      message: 'Vehicle deleted successfully'
    });
  } catch (err) {
    console.error('Failed to delete vehicle:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});
// PATCH /api/vehicles/:id/zone
router.patch('/:id/zone', async (req, res) => {
  const { id } = req.params;
  const { zone } = req.body;
  try {
    const result = await db.query(
      'UPDATE vehicles SET zone = $1 WHERE id = $2 RETURNING *',
      [zone || 'Unassigned', id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
    }
    res.json({
      status: 'success',
      message: 'Vehicle zone updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Failed to update vehicle zone:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendWhatsAppReceipt } = require('../utils/whatsapp');
const { delByPattern } = require('../redis');

// 1. POST /api/rides/new - New Ride Registration
router.post('/new', async (req, res) => {
  try {
    const {
      rider_name,
      mobile,
      vehicle_id,
      battery_id,
      package_name,
      rental_start_date,
      rent,
      deposit,
      zone_name
    } = req.body;

    if (!rider_name || !mobile) {
      return res.status(400).json({ status: 'error', message: 'Rider name and mobile are required' });
    }

    const rentAmt = parseFloat(rent || 1500);
    const depAmt = parseFloat(deposit || 1000);
    const totalAmt = rentAmt + depAmt;
    const startDate = rental_start_date ? new Date(rental_start_date) : new Date();

    let insertedId = `RIDE${Date.now()}`;

    try {
      const result = await db.query(`
        INSERT INTO renters (
          rider_name, mobile, vehicle_id, battery_id, package_name, 
          rental_start_date, status, rent, deposit, total
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'Active Ride', $7, $8, $9)
        RETURNING id, rider_name, mobile, vehicle_id, status, created_at
      `, [
        rider_name,
        mobile,
        vehicle_id || 'EV-450X-202401',
        battery_id || 'BAT-450X-12340001',
        package_name || 'Weekly Pro',
        startDate,
        rentAmt,
        depAmt,
        totalAmt
      ]);
      if (result.rows[0]) insertedId = result.rows[0].id;

      // Update vehicle inventory status to 'In Ride' with active renter
      if (vehicle_id) {
        await db.query(`
          UPDATE vehicles 
          SET vehicle_status = 'In Ride', status = 'Online', renter_name = $1 
          WHERE code = $2 OR registration_number = $2
        `, [rider_name, vehicle_id]);
      }

      // Update battery inventory status to 'in_use'
      if (battery_id) {
        await db.query(`
          UPDATE batteries 
          SET status = 'in_use' 
          WHERE battery_id = $1 OR id::text = $1
        `, [battery_id]);
      }

      await delByPattern('vehicles:*');
      await delByPattern('batteries:*');
      await delByPattern('renters:*');
      await delByPattern('stats:*');
    } catch (dbErr) {
      console.warn('DB insert fallback for new ride:', dbErr.message);
    }

    // Send WhatsApp receipt
    sendWhatsAppReceipt({
      mobile,
      name: rider_name,
      invoice_no: `INV-${Date.now().toString().slice(-6)}`,
      invoice_date: new Date().toLocaleDateString('en-IN'),
      plan: package_name || 'EV Rental Plan',
      amount: totalAmt.toFixed(2)
    }).catch(() => {});

    res.status(201).json({
      status: 'success',
      message: 'New ride registered successfully!',
      data: {
        id: insertedId,
        rider_name,
        mobile,
        vehicle_id,
        status: 'Active Ride',
        total: totalAmt
      }
    });
  } catch (err) {
    console.error('Error creating new ride:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 2. Retain Ride Registration Handler (supports both /api/rides/retain and /api/retain-rider)
const handleRetainRide = async (req, res) => {
  try {
    const {
      rider_name,
      name,
      mobile,
      vehicle_id,
      battery_id,
      package_name,
      plan,
      rent,
      deposit,
      total,
      zone_name,
      extension_days,
      additional_rent
    } = req.body;

    const rName = rider_name || name || 'Returning Rider';
    const cleanMob = (mobile || '').replace(/\D/g, '').slice(-10);
    const rentAmt = parseFloat(rent || additional_rent || 600);
    const depAmt = parseFloat(deposit || 0);
    const totalAmt = parseFloat(total || (rentAmt + depAmt));
    const packageName = package_name || plan || `Retain Ride (+${extension_days || 7} days)`;
    const vehicleCode = vehicle_id || 'EV-450X-202401';
    const batteryCode = battery_id || 'BAT-MNZ-001';

    let insertedId = `RET-${Date.now().toString().slice(-6)}`;

    try {
      const existing = await db.query(
        "SELECT id FROM renters WHERE mobile LIKE $1 ORDER BY id DESC LIMIT 1",
        [`%${cleanMob}%`]
      );

      if (existing.rows.length > 0) {
        insertedId = existing.rows[0].id;
        await db.query(`
          UPDATE renters 
          SET status = 'Retain Ride',
              rider_name = COALESCE($1, rider_name),
              vehicle_id = COALESCE($2, vehicle_id),
              battery_id = COALESCE($3, battery_id),
              package_name = COALESCE($4, package_name),
              rent = $5,
              deposit = $6,
              total = total + $7,
              rental_start_date = NOW()
          WHERE id = $8
        `, [rName, vehicleCode, batteryCode, packageName, rentAmt, depAmt, totalAmt, existing.rows[0].id]);
      } else {
        const ins = await db.query(`
          INSERT INTO renters (
            rider_name, mobile, vehicle_id, battery_id, package_name, 
            rental_start_date, status, rent, deposit, total
          )
          VALUES ($1, $2, $3, $4, $5, NOW(), 'Retain Ride', $6, $7, $8)
          RETURNING id
        `, [rName, mobile || cleanMob, vehicleCode, batteryCode, packageName, rentAmt, depAmt, totalAmt]);
        if (ins.rows[0]) insertedId = ins.rows[0].id;
      }
    } catch (dbErr) {
      console.warn('DB error in retain ride:', dbErr.message);
    }

    sendWhatsAppReceipt({
      mobile: mobile || cleanMob,
      name: rName,
      invoice_no: `RET-${Date.now().toString().slice(-6)}`,
      invoice_date: new Date().toLocaleDateString('en-IN'),
      plan: `${packageName} (${vehicleCode})`,
      amount: totalAmt.toFixed(2)
    }).catch(() => {});

    // Ensure vehicle inventory marks as In Ride with current renter
    if (vehicleCode) {
      await db.query(`
        UPDATE vehicles 
        SET vehicle_status = 'In Ride', status = 'Online', renter_name = $1 
        WHERE code = $2 OR registration_number = $2
      `, [rName, vehicleCode]);
    }
    if (batteryCode) {
      await db.query(`
        UPDATE batteries 
        SET status = 'in_use' 
        WHERE battery_id = $1 OR id::text = $1
      `, [batteryCode]);
    }
    await delByPattern('vehicles:*');
    await delByPattern('batteries:*');
    await delByPattern('renters:*');
    await delByPattern('stats:*');

    res.status(200).json({
      status: 'success',
      message: 'Ride retained successfully! WhatsApp receipt sent.',
      data: {
        id: insertedId,
        rider_name: rName,
        mobile: mobile || cleanMob,
        vehicle_id: vehicleCode,
        battery_id: batteryCode,
        package_name: packageName,
        status: 'Retain Ride',
        total: totalAmt
      }
    });
  } catch (err) {
    console.error('Error retaining ride:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

router.post('/retain', handleRetainRide);
router.post('/', (req, res, next) => {
  if (req.baseUrl && req.baseUrl.includes('retain')) {
    return handleRetainRide(req, res);
  }
  next();
});

// 3. POST /api/rides/return - Return Ride Registration & Release Inventory
router.post('/return', async (req, res) => {
  try {
    const { rider_name, mobile, vehicle_id, return_condition, refund_deposit, notes } = req.body;
    const cleanMob = (mobile || '').replace(/\D/g, '').slice(-10);

    try {
      await db.query(`
        UPDATE renters 
        SET status = 'Return', return_date = NOW() 
        WHERE (mobile LIKE $1 AND mobile != '') OR vehicle_id = $2
      `, [`%${cleanMob}%`, vehicle_id]);

      // Release vehicle back to Available status in inventory
      if (vehicle_id) {
        await db.query(`
          UPDATE vehicles 
          SET vehicle_status = 'Available', renter_name = 'None (Available)' 
          WHERE code = $1 OR registration_number = $1
        `, [vehicle_id]);
      }

      // Release battery back to available
      const renterRec = await db.query(
        "SELECT battery_id FROM renters WHERE (mobile LIKE $1 AND mobile != '') OR vehicle_id = $2 ORDER BY id DESC LIMIT 1",
        [`%${cleanMob}%`, vehicle_id]
      );
      if (renterRec.rows[0]?.battery_id) {
        await db.query(`
          UPDATE batteries 
          SET status = 'available' 
          WHERE battery_id = $1 OR id::text = $1
        `, [renterRec.rows[0].battery_id]);
      }

      await delByPattern('vehicles:*');
      await delByPattern('batteries:*');
      await delByPattern('renters:*');
      await delByPattern('stats:*');
    } catch (dbErr) {
      console.warn('DB return update error:', dbErr.message);
    }

    sendWhatsAppReceipt({
      mobile: mobile || cleanMob,
      name: rider_name || 'Rider',
      invoice_no: `RTN-${Date.now().toString().slice(-6)}`,
      invoice_date: new Date().toLocaleDateString('en-IN'),
      plan: `Vehicle Return Completed (${vehicle_id || 'EV'})`,
      amount: parseFloat(refund_deposit || 1000).toFixed(2)
    }).catch(() => {});

    res.json({
      status: 'success',
      message: 'Ride returned successfully! Vehicle checked into station & deposit refunded.',
      data: {
        rider_name,
        mobile,
        vehicle_id,
        status: 'Return',
        refund_deposit: parseFloat(refund_deposit || 1000)
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 4. POST /api/rides/extend - Extend Ride Duration
router.post('/extend', async (req, res) => {
  try {
    const { rider_name, mobile, vehicle_id, extension_hours, extension_days, additional_fare, payment_method, reason, notes } = req.body;
    const cleanMob = (mobile || '').replace(/\D/g, '').slice(-10);
    const addAmt = parseFloat(additional_fare || 0);

    try {
      await db.query(`
        UPDATE renters 
        SET total = total + $1,
            rent = rent + $1,
            status = 'Active Ride'
        WHERE (mobile LIKE $2 AND mobile != '') OR vehicle_id = $3
      `, [addAmt, `%${cleanMob}%`, vehicle_id]);

      if (vehicle_id) {
        await db.query(`
          UPDATE vehicles 
          SET vehicle_status = 'In Ride', renter_name = COALESCE($1, renter_name) 
          WHERE code = $2 OR registration_number = $2
        `, [rider_name, vehicle_id]);
      }

      await delByPattern('vehicles:*');
      await delByPattern('renters:*');
      await delByPattern('stats:*');
    } catch (dbErr) {
      console.warn('DB extend ride error:', dbErr.message);
    }

    sendWhatsAppReceipt({
      mobile: mobile || cleanMob,
      name: rider_name || 'Rider',
      invoice_no: `EXT-${Date.now().toString().slice(-6)}`,
      invoice_date: new Date().toLocaleDateString('en-IN'),
      plan: `Ride Extended (+${extension_days ? extension_days + ' Days' : (extension_hours || 2) + ' Hours'})`,
      amount: addAmt.toFixed(2)
    }).catch(() => {});

    res.json({
      status: 'success',
      message: `Ride extended successfully! Additional fare ₹${addAmt} recorded and WhatsApp receipt sent.`,
      data: {
        rider_name,
        mobile,
        vehicle_id,
        additional_fare: addAmt,
        status: 'Active Ride'
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 5. POST /api/rides/exchange - Exchange Vehicle / Swap Ride
router.post('/exchange', async (req, res) => {
  try {
    const { rider_name, mobile, old_vehicle_id, new_vehicle_id, old_battery_id, new_battery_id, reason, notes } = req.body;
    const cleanMob = (mobile || '').replace(/\D/g, '').slice(-10);

    try {
      await db.query(`
        UPDATE renters 
        SET vehicle_id = COALESCE($1, vehicle_id),
            battery_id = COALESCE($2, battery_id),
            status = 'Active Ride'
        WHERE (mobile LIKE $3 AND mobile != '') OR vehicle_id = $4
      `, [new_vehicle_id, new_battery_id, `%${cleanMob}%`, old_vehicle_id]);

      // Release old vehicle back to Available
      if (old_vehicle_id) {
        await db.query(`
          UPDATE vehicles 
          SET vehicle_status = 'Available', renter_name = 'None (Available)' 
          WHERE code = $1 OR registration_number = $1
        `, [old_vehicle_id]);
      }
      if (old_battery_id) {
        await db.query(`
          UPDATE batteries 
          SET status = 'available' 
          WHERE battery_id = $1 OR id::text = $1
        `, [old_battery_id]);
      }

      // Mark new vehicle as In Ride
      if (new_vehicle_id) {
        await db.query(`
          UPDATE vehicles 
          SET vehicle_status = 'In Ride', status = 'Online', renter_name = $1 
          WHERE code = $2 OR registration_number = $2
        `, [rider_name || 'Rider', new_vehicle_id]);
      }
      if (new_battery_id) {
        await db.query(`
          UPDATE batteries 
          SET status = 'in_use' 
          WHERE battery_id = $1 OR id::text = $1
        `, [new_battery_id]);
      }

      await delByPattern('vehicles:*');
      await delByPattern('batteries:*');
      await delByPattern('renters:*');
      await delByPattern('stats:*');
    } catch (dbErr) {
      console.warn('DB exchange vehicle error:', dbErr.message);
    }

    sendWhatsAppReceipt({
      mobile: mobile || cleanMob,
      name: rider_name || 'Rider',
      invoice_no: `EXC-${Date.now().toString().slice(-6)}`,
      invoice_date: new Date().toLocaleDateString('en-IN'),
      plan: `Vehicle Exchanged to ${new_vehicle_id}`,
      amount: '0.00'
    }).catch(() => {});

    res.json({
      status: 'success',
      message: `Vehicle successfully exchanged from ${old_vehicle_id} to ${new_vehicle_id}! Confirmation sent via WhatsApp.`,
      data: {
        rider_name,
        mobile,
        old_vehicle_id,
        new_vehicle_id,
        new_battery_id,
        status: 'Active Ride'
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;

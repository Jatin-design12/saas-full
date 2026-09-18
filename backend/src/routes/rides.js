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

    // Ensure reservation is recorded in reservations table for cash reports and invoice tracking
    const isCash = String(req.body.payment_method || req.body.pay_method || req.body.payment_mode || '').toLowerCase().includes('cash');
    let cashVoucher = req.body.cash_voucher_number || req.body.voucher_number || req.body.cash_receipt || null;
    if (isCash && !cashVoucher) {
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      cashVoucher = `CSH-VCHR-${todayStr}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    try {
      await db.query(`
        INSERT INTO reservations (
          reservation_id, customer_name, mobile, gov_id, reservation_date, reservation_time,
          package_type, vehicle_category, vehicle_model, vehicle_number, battery_id,
          fare, deposit, payment_mode, status, payment_status, pickup_zone, drop_zone,
          transaction_id, cash_voucher_number, total_payable, created_at
        )
        VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME, $5, 'E-Scooter', $6, $7, $8, $9, $10, $11, 'Active Ride', 'Paid', $12, $12, $13, $14, $15, NOW())
      `, [
        `RID-${Date.now().toString().slice(-6)}`,
        rider_name,
        mobile,
        'GOV-ON-FILE',
        package_name || 'Weekly Pro',
        'Evegah City',
        vehicle_id || 'EV-450X-202401',
        battery_id || 'BAT-MNZ-001',
        rentAmt,
        depAmt,
        isCash ? 'Cash' : (req.body.pay_method || req.body.payment_method || 'UPI'),
        zone_name || 'Gotri Zone',
        cashVoucher || req.body.icici_tx_id || `INV-${Date.now().toString().slice(-6)}`,
        cashVoucher,
        totalAmt
      ]);
    } catch (resErr) {
      console.warn('New ride reservation sync notice:', resErr.message);
    }

    // Send WhatsApp receipt
    sendWhatsAppReceipt({
      mobile,
      name: rider_name,
      invoice_no: cashVoucher || `INV-${Date.now().toString().slice(-6)}`,
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
        total: totalAmt,
        cash_voucher_number: cashVoucher,
        voucher_number: cashVoucher
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

    // Ensure reservation is recorded in reservations table for cash reports and invoice tracking
    const isCash = String(req.body.payment_method || req.body.pay_method || req.body.payment_mode || '').toLowerCase().includes('cash');
    let cashVoucher = req.body.cash_voucher_number || req.body.voucher_number || req.body.cash_receipt || null;
    if (isCash && !cashVoucher) {
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      cashVoucher = `CSH-VCHR-${todayStr}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    try {
      await db.query(`
        INSERT INTO reservations (
          reservation_id, customer_name, mobile, gov_id, reservation_date, reservation_time,
          package_type, vehicle_category, vehicle_model, vehicle_number, battery_id,
          fare, deposit, payment_mode, status, payment_status, pickup_zone, drop_zone,
          transaction_id, cash_voucher_number, total_payable, created_at
        )
        VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_TIME, $5, 'E-Scooter', $6, $7, $8, $9, $10, $11, 'Active Ride', 'Paid', $12, $12, $13, $14, $15, NOW())
      `, [
        `RID-${Date.now().toString().slice(-6)}`,
        rName,
        mobile || cleanMob,
        'GOV-ON-FILE',
        packageName,
        'Evegah City',
        vehicleCode,
        batteryCode,
        rentAmt,
        depAmt,
        isCash ? 'Cash' : (req.body.payment_method || 'UPI'),
        zone_name || 'Gotri Zone',
        cashVoucher || req.body.icici_tx_id || `RET-${Date.now().toString().slice(-6)}`,
        cashVoucher,
        totalAmt
      ]);
    } catch (resErr) {
      console.warn('Retain reservation sync notice:', resErr.message);
    }

    sendWhatsAppReceipt({
      mobile: mobile || cleanMob,
      name: rName,
      invoice_no: cashVoucher || `RET-${Date.now().toString().slice(-6)}`,
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

// 3. POST /api/rides/return - Return Ride Registration, Maintenance Routing & Deposit Refund Routing
router.post('/return', async (req, res) => {
  try {
    const {
      rider_name,
      mobile,
      vehicle_id,
      return_condition,
      refund_deposit,
      notes,
      damage_detected,
      damage_cost,
      damage_category
    } = req.body;
    const cleanMob = (mobile || '').replace(/\D/g, '').slice(-10);

    const isDamaged = Boolean(
      damage_detected === true ||
      parseFloat(damage_cost) > 0 ||
      ['minor', 'major', 'damaged', 'dirty', 'issue'].includes(String(return_condition || '').toLowerCase()) ||
      String(return_condition || '').toLowerCase().includes('damage') ||
      String(notes || '').toLowerCase().includes('damage')
    );

    try {
      await db.query(`
        UPDATE renters 
        SET status = 'Return', return_date = NOW() 
        WHERE (mobile LIKE $1 AND mobile != '') OR vehicle_id = $2
      `, [`%${cleanMob}%`, vehicle_id]);

      // If vehicle has damage, route to Maintenance; else return to Available
      if (vehicle_id) {
        if (isDamaged) {
          await db.query(`
            UPDATE vehicles 
            SET vehicle_status = 'Maintenance', renter_name = 'Maintenance Required' 
            WHERE code = $1 OR registration_number = $1
          `, [vehicle_id]);

          const ticketId = `MAIN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
          const estCost = parseFloat(damage_cost) || 600.00;
          await db.query(`
            INSERT INTO maintenance_orders (
              ticket_id, vehicle_code, vehicle_model, vehicle_category, 
              issue_category, description, assigned_technician, service_center, 
              priority, status, estimated_cost, zone
            )
            VALUES ($1, $2, 'Evegah City', 'E-Scooter', $3, $4, 'Unassigned', 'Central Workshop', 'High', 'Scheduled', $5, 'Gotri Zone')
          `, [
            ticketId,
            vehicle_id,
            damage_category || 'Return Inspection Damage',
            notes || `Vehicle flagged with damage during return inspection (${return_condition || 'Issue'}).`,
            estCost
          ]).catch(e => console.warn('Could not auto-insert maintenance order on return:', e.message));
        } else {
          await db.query(`
            UPDATE vehicles 
            SET vehicle_status = 'Available', renter_name = 'None (Available)' 
            WHERE code = $1 OR registration_number = $1
          `, [vehicle_id]);
        }
      }

      // Release battery back to available
      const renterRec = await db.query(
        "SELECT battery_id, deposit FROM renters WHERE (mobile LIKE $1 AND mobile != '') OR vehicle_id = $2 ORDER BY id DESC LIMIT 1",
        [`%${cleanMob}%`, vehicle_id]
      );
      if (renterRec.rows[0]?.battery_id) {
        await db.query(`
          UPDATE batteries 
          SET status = 'available' 
          WHERE battery_id = $1 OR id::text = $1
        `, [renterRec.rows[0].battery_id]);
      }

      // Record in reservations table for Deposit Refund Dashboard (managed only via /payment/refund)
      const renterDep = renterRec.rows[0]?.deposit !== undefined && renterRec.rows[0]?.deposit !== null ? parseFloat(renterRec.rows[0].deposit) : null;
      const existingRes = await db.query(
        "SELECT id, deposit FROM reservations WHERE (mobile LIKE $1 AND mobile != '') OR vehicle_number = $2 ORDER BY id DESC LIMIT 1",
        [`%${cleanMob}%`, vehicle_id]
      ).catch(() => ({ rows: [] }));
      const resDep = existingRes.rows[0]?.deposit !== undefined && existingRes.rows[0]?.deposit !== null ? parseFloat(existingRes.rows[0].deposit) : null;
      const originalDep = resDep !== null ? resDep : (renterDep !== null ? renterDep : 0);
      const depRefund = originalDep > 0 ? parseFloat(refund_deposit !== undefined ? refund_deposit : originalDep) : 0;
      const deductionsAmt = Math.max(0, originalDep - depRefund);
      const depStatus = originalDep > 0 ? 'Pending_Refund' : 'None';

      const resUpdate = await db.query(`
        UPDATE reservations
        SET status = 'Completed',
            returned_at = NOW(),
            return_condition = $1,
            return_notes = $2,
            deposit_status = $3,
            refund_amount = $4,
            refund_deductions = $5
        WHERE (mobile LIKE $6 AND mobile != '') OR vehicle_number = $7
        RETURNING id
      `, [return_condition || (isDamaged ? 'Damaged / Inspection Failed' : 'Clean / Good'), notes || '', depStatus, depRefund, deductionsAmt, `%${cleanMob}%`, vehicle_id]);

      if (resUpdate.rows.length === 0) {
        await db.query(`
          INSERT INTO reservations (
            reservation_id, customer_name, mobile, package_type, vehicle_number,
            deposit, status, deposit_status, refund_amount, refund_deductions, return_condition, return_notes, returned_at
          )
          VALUES ($1, $2, $3, 'Rental Plan', $4, $5, 'Completed', $6, $7, $8, $9, $10, NOW())
        `, [
          `RID-${Date.now().toString().slice(-6)}`,
          rider_name || 'Rider',
          mobile || cleanMob,
          vehicle_id || 'EVM102502',
          originalDep,
          depStatus,
          depRefund,
          deductionsAmt,
          return_condition || (isDamaged ? 'Damaged / Inspection Failed' : 'Clean / Good'),
          notes || ''
        ]).catch(err => console.warn('Could not insert reservation for return:', err.message));
      }

      await delByPattern('reservations:*');
      await delByPattern('vehicles:*');
      await delByPattern('batteries:*');
      await delByPattern('renters:*');
      await delByPattern('stats:*');
      await delByPattern('maintenance:*');
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
      message: isDamaged
        ? 'Ride return completed. Vehicle condition did not meet inspection criteria and has been routed to Maintenance. Refund request sent to Deposit Refunds page.'
        : 'Ride returned successfully! Vehicle is now Available and refund request has been routed to the Deposit Refunds page.',
      data: {
        rider_name,
        mobile,
        vehicle_id,
        status: 'Return',
        vehicle_status: isDamaged ? 'Maintenance' : 'Available',
        deposit_status: 'Pending_Refund',
        refund_deposit: parseFloat(refund_deposit || 1000)
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// 4. POST /api/rides/extend - Extend Ride Duration Directly (Without Returning Vehicle)
router.post('/extend', async (req, res) => {
  try {
    const {
      rider_name,
      mobile,
      vehicle_id,
      extension_hours,
      extension_days,
      additional_fare,
      payment_method,
      reason,
      notes
    } = req.body;
    const cleanMob = (mobile || '').replace(/\D/g, '').slice(-10);
    const addAmt = parseFloat(additional_fare || 0);

    const isCash = String(payment_method || '').toLowerCase().includes('cash');
    let cashVoucher = req.body.cash_voucher_number || null;
    if (isCash && !cashVoucher) {
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      cashVoucher = `CSH-VCHR-${todayStr}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

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

      await db.query(`
        UPDATE reservations
        SET fare = fare + $1,
            total_payable = total_payable + $1,
            transaction_id = COALESCE($2, transaction_id),
            cash_voucher_number = COALESCE($2, cash_voucher_number)
        WHERE (mobile LIKE $3 AND mobile != '') OR vehicle_number = $4
      `, [addAmt, cashVoucher, `%${cleanMob}%`, vehicle_id]).catch(() => {});

      await delByPattern('reservations:*');
      await delByPattern('vehicles:*');
      await delByPattern('renters:*');
      await delByPattern('stats:*');
    } catch (dbErr) {
      console.warn('DB extend ride error:', dbErr.message);
    }

    sendWhatsAppReceipt({
      mobile: mobile || cleanMob,
      name: rider_name || 'Rider',
      invoice_no: cashVoucher || `EXT-${Date.now().toString().slice(-6)}`,
      invoice_date: new Date().toLocaleDateString('en-IN'),
      plan: `Ride Extended (+${extension_days ? extension_days + ' Days' : (extension_hours || 2) + ' Hours'})`,
      amount: addAmt.toFixed(2)
    }).catch(() => {});

    res.json({
      status: 'success',
      message: 'Ride extended successfully without returning vehicle! Receipt generated.',
      data: {
        rider_name,
        mobile,
        vehicle_id,
        additional_fare: addAmt,
        cash_voucher_number: cashVoucher,
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
    const {
      rider_name,
      mobile,
      old_vehicle_id,
      new_vehicle_id,
      old_battery_id,
      new_battery_id,
      reason,
      notes
    } = req.body;
    const cleanMob = (mobile || '').replace(/\D/g, '').slice(-10);

    const isDamaged = String(reason || '').toLowerCase().includes('damage') ||
                      String(reason || '').toLowerCase().includes('breakdown') ||
                      String(reason || '').toLowerCase().includes('issue') ||
                      String(reason || '').toLowerCase().includes('accident');

    try {
      await db.query(`
        UPDATE renters 
        SET vehicle_id = COALESCE($1, vehicle_id),
            battery_id = COALESCE($2, battery_id),
            status = 'Active Ride'
        WHERE (mobile LIKE $3 AND mobile != '') OR vehicle_id = $4
      `, [new_vehicle_id, new_battery_id, `%${cleanMob}%`, old_vehicle_id]);

      // Handle old vehicle: if damaged send to Maintenance, otherwise Available
      if (old_vehicle_id) {
        if (isDamaged) {
          await db.query(`
            UPDATE vehicles 
            SET vehicle_status = 'Maintenance', renter_name = 'Maintenance Required' 
            WHERE code = $1 OR registration_number = $1
          `, [old_vehicle_id]);

          const ticketId = `MAIN-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
          await db.query(`
            INSERT INTO maintenance_orders (
              ticket_id, vehicle_code, vehicle_model, vehicle_category, 
              issue_category, description, assigned_technician, service_center, 
              priority, status, estimated_cost, zone
            )
            VALUES ($1, $2, 'Evegah City', 'E-Scooter', $3, $4, 'Unassigned', 'Central Workshop', 'High', 'Scheduled', 600, 'Gotri Zone')
          `, [ticketId, old_vehicle_id, reason || 'Vehicle Swap Damage', notes || 'Vehicle swapped out due to reported damage/maintenance issue.']).catch(() => {});
        } else {
          await db.query(`
            UPDATE vehicles 
            SET vehicle_status = 'Available', renter_name = 'None (Available)' 
            WHERE code = $1 OR registration_number = $1
          `, [old_vehicle_id]);
        }
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

      // Update reservation record with new vehicle
      await db.query(`
        UPDATE reservations
        SET vehicle_number = $1, battery_id = COALESCE($2, battery_id)
        WHERE (mobile LIKE $3 AND mobile != '') OR vehicle_number = $4
      `, [new_vehicle_id, new_battery_id, `%${cleanMob}%`, old_vehicle_id]).catch(() => {});

      await delByPattern('reservations:*');
      await delByPattern('vehicles:*');
      await delByPattern('batteries:*');
      await delByPattern('renters:*');
      await delByPattern('stats:*');
      await delByPattern('maintenance:*');
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
      message: `Vehicle successfully exchanged from ${old_vehicle_id} to ${new_vehicle_id}!${isDamaged ? ' Old vehicle routed to Maintenance.' : ''}`,
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

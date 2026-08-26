const db = require('./index');
const { v4: uuidv4 } = require('uuid');

async function seedProductionData() {
  try {
    console.log('Seeding real production test data into PostgreSQL database...');

    // 1. Seed Real Renters (Rider App users)
    const riders = [
      { id: uuidv4(), name: 'Himanshu Chavda', mobile: '+91 81282 51172', vehicle: 'EVM1024001', pkg: 'Weekly Package', rent: 1500, deposit: 2000, status: 'Active Ride' },
      { id: uuidv4(), name: 'Amit Kumar', mobile: '+91 98765 43210', vehicle: 'EVM1024004', pkg: 'Daily Package', rent: 450, deposit: 1000, status: 'Active Ride' },
      { id: uuidv4(), name: 'Neha Gupta', mobile: '+91 91254 56789', vehicle: 'EVM1024005', pkg: 'Monthly Package', rent: 4500, deposit: 2000, status: 'Active Ride' },
      { id: uuidv4(), name: 'Rohit Singh', mobile: '+91 99876 54321', vehicle: 'EVM1024006', pkg: 'Daily Package', rent: 450, deposit: 1000, status: 'Payment Due' },
      { id: uuidv4(), name: 'Priya Sharma', mobile: '+91 98123 45678', vehicle: 'EVM1024007', pkg: 'Weekly Package', rent: 1800, deposit: 2000, status: 'Confirmed' },
      { id: uuidv4(), name: 'Vikram Patel', mobile: '+91 78945 61230', vehicle: 'EVM1024008', pkg: 'Monthly Package', rent: 5000, deposit: 2000, status: 'Active Ride' },
      { id: uuidv4(), name: 'Pooja Patel', mobile: '+91 99123 45678', vehicle: 'EVM1024023', pkg: 'Daily Package', rent: 500, deposit: 1000, status: 'Completed' },
      { id: uuidv4(), name: 'Suresh Mehta', mobile: '+91 97234 56789', vehicle: 'EVM1024024', pkg: 'Weekly Package', rent: 1600, deposit: 2000, status: 'Overdue' }
    ];

    for (const r of riders) {
      await db.query(`
        INSERT INTO renters (id, rider_name, mobile, vehicle_id, battery_id, package_name, rental_start_date, return_date, status, rent, deposit, total, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW() + INTERVAL '7 days', $7, $8, $9, $10, NOW())
        ON CONFLICT (id) DO NOTHING
      `, [r.id, r.name, r.mobile, r.vehicle, 'BAT-' + r.vehicle, r.pkg, r.status, r.rent, r.deposit, r.rent + r.deposit]);
    }

    // 2. Seed Real Reservations
    const reservations = [
      { res_id: 'RID-2026-901101', name: 'Himanshu Chavda', mobile: '+91 81282 51172', vehicle: 'EVM1024001', pkg: 'Weekly Package', fare: 1500, deposit: 2000, p_mode: 'UPI', p_status: 'Paid', status: 'Active Ride', zone: 'Gotri Zone' },
      { res_id: 'RID-2026-901102', name: 'Amit Kumar', mobile: '+91 98765 43210', vehicle: 'EVM1024004', pkg: 'Daily Package', fare: 450, deposit: 1000, p_mode: 'Razorpay', p_status: 'Paid', status: 'Active Ride', zone: 'Aatapi Zone' },
      { res_id: 'RID-2026-901103', name: 'Neha Gupta', mobile: '+91 91254 56789', vehicle: 'EVM1024005', pkg: 'Monthly Package', fare: 4500, deposit: 2000, p_mode: 'Razorpay', p_status: 'Paid', status: 'Active Ride', zone: 'Gotri Zone' },
      { res_id: 'RID-2026-901104', name: 'Rohit Singh', mobile: '+91 99876 54321', vehicle: 'EVM1024006', pkg: 'Daily Package', fare: 450, deposit: 1000, p_mode: 'UPI', p_status: 'Pending', status: 'Payment Due', zone: 'Gotri Zone' },
      { res_id: 'RID-2026-901105', name: 'Priya Sharma', mobile: '+91 98123 45678', vehicle: 'EVM1024007', pkg: 'Weekly Package', fare: 1800, deposit: 2000, p_mode: 'Razorpay', p_status: 'Paid', status: 'Confirmed', zone: 'Daman Zone' },
      { res_id: 'RID-2026-901106', name: 'Vikram Patel', mobile: '+91 78945 61230', vehicle: 'EVM1024008', pkg: 'Monthly Package', fare: 5000, deposit: 2000, p_mode: 'Card', p_status: 'Paid', status: 'Active Ride', zone: 'Gotri Zone' },
      { res_id: 'RID-2026-901107', name: 'Suresh Mehta', mobile: '+91 97234 56789', vehicle: 'EVM1024024', pkg: 'Weekly Package', fare: 1600, deposit: 2000, p_mode: 'UPI', p_status: 'Unpaid', status: 'Overdue', zone: 'Aatapi Zone' }
    ];

    for (const res of reservations) {
      await db.query(`
        INSERT INTO reservations (id, reservation_id, customer_name, mobile, gov_id, reservation_date, reservation_time, package_type, vehicle_category, vehicle_number, fare, deposit, payment_mode, payment_status, status, pickup_zone, drop_zone, created_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, '10:00:00', $6, 'E-Scooter', $7, $8, $9, $10, $11, $12, $13, $13, NOW())
        ON CONFLICT (reservation_id) DO UPDATE SET
          customer_name = EXCLUDED.customer_name,
          mobile = EXCLUDED.mobile,
          package_type = EXCLUDED.package_type,
          vehicle_number = EXCLUDED.vehicle_number,
          fare = EXCLUDED.fare,
          deposit = EXCLUDED.deposit,
          payment_mode = EXCLUDED.payment_mode,
          payment_status = EXCLUDED.payment_status,
          status = EXCLUDED.status,
          pickup_zone = EXCLUDED.pickup_zone,
          drop_zone = EXCLUDED.drop_zone
      `, [uuidv4(), res.res_id, res.name, res.mobile, 'AADHAAR-812825', res.pkg, res.vehicle, res.fare, res.deposit, res.p_mode, res.p_status, res.status, res.zone]);
    }

    // 3. Update vehicle status to match
    await db.query(`UPDATE vehicles SET vehicle_status = 'In Ride', status = 'Online', renter_name = 'Himanshu Chavda', battery_pct = 85, current_km_reading = '120.5', total_km_covered = '450.0' WHERE code = 'EVM1024001'`);
    await db.query(`UPDATE vehicles SET vehicle_status = 'In Ride', status = 'Online', renter_name = 'Amit Kumar', battery_pct = 72, current_km_reading = '85.0', total_km_covered = '320.0' WHERE code = 'EVM1024004'`);
    await db.query(`UPDATE vehicles SET vehicle_status = 'In Ride', status = 'Online', renter_name = 'Neha Gupta', battery_pct = 90, current_km_reading = '210.0', total_km_covered = '680.0' WHERE code = 'EVM1024005'`);
    await db.query(`UPDATE vehicles SET vehicle_status = 'In Ride', status = 'Online', renter_name = 'Vikram Patel', battery_pct = 65, current_km_reading = '340.0', total_km_covered = '890.0' WHERE code = 'EVM1024008'`);
    await db.query(`UPDATE vehicles SET vehicle_status = 'Available', status = 'Online', renter_name = 'None (Available)', battery_pct = 95, current_km_reading = '15.0', total_km_covered = '150.0' WHERE code IN ('EVM1024006', 'EVM1024007', 'EVM1024023', 'EVM1024024')`);

    console.log('Seeded production data successfully!');
    process.exit(0);
  } catch (e) {
    console.error('Seed error:', e);
    process.exit(1);
  }
}

seedProductionData();

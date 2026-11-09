const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const res = await pool.query(`
    SELECT id, rider_name, mobile, email, date_of_birth, address, present_address, gender,
           vehicle_id, battery_id, package_name, rental_start_date, return_date,
           status, rent, deposit, total, avatar_url, wallet_balance, zone, kyc_status, booking_source, created_at
    FROM renters
    ORDER BY created_at DESC
  `);
  console.log('ALL RENTERS IN DB:', res.rows);

  const resvs = await pool.query(`
    SELECT id, reservation_id, customer_name, mobile, package_type, vehicle_number, status, pickup_zone, created_at
    FROM reservations
    ORDER BY created_at DESC
    LIMIT 10
  `);
  console.log('RESERVATIONS:', resvs.rows);

  await pool.end();
}
check().catch(console.error);

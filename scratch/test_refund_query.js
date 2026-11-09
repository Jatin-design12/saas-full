const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const q = await pool.query(`
    SELECT 
      ri.id,
      ri.reservation_key,
      ri.refund_amount,
      ri.result,
      ri.created_at,
      r.customer_name,
      r.mobile,
      r.vehicle_number,
      r.deposit
    FROM refund_idempotency ri
    LEFT JOIN reservations r ON (r.id::text = ri.reservation_key OR r.reservation_id = ri.reservation_key)
  `);
  console.log(q.rows);
  await pool.end();
}
check();

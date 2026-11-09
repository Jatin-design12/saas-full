const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const r = await pool.query(`SELECT id, rider_name, mobile, status, deposit, rent, total FROM renters`);
  console.log('Renters:', r.rows);

  const res = await pool.query(`SELECT id, reservation_id, customer_name, mobile, status, deposit_status, deposit, fare, refund_amount, refund_deductions FROM reservations`);
  console.log('Reservations:', res.rows);

  const ref = await pool.query(`SELECT * FROM refund_idempotency`);
  console.log('Refund idempotency:', ref.rows);

  await pool.end();
}
check();

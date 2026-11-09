const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const pp = await pool.query(`
    SELECT id, tx_id, amount, status, mobile, rider_name, reservation_id, created_at 
    FROM payu_payments 
    ORDER BY created_at DESC 
    LIMIT 10
  `);
  console.log('PayU payments sample:', pp.rows);

  const ic = await pool.query(`
    SELECT id, tx_id, amount, status, mobile, rider_name, reservation_id, created_at 
    FROM icici_payments 
    ORDER BY created_at DESC 
    LIMIT 10
  `);
  console.log('ICICI payments sample:', ic.rows);

  await pool.end();
}
check();

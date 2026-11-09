const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const cols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'wallet_transactions'
  `);
  console.log('Columns:', cols.rows);

  const sample = await pool.query(`SELECT * FROM wallet_transactions LIMIT 2`);
  console.log('Sample row:', sample.rows);

  await pool.end();
}
check();

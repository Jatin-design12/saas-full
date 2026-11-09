const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const tables = await pool.query(`
    SELECT relname as table_name, n_live_tup as row_count 
    FROM pg_stat_user_tables 
    ORDER BY n_live_tup DESC
  `);
  console.log(tables.rows);
  await pool.end();
}
check();

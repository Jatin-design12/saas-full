const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const v = await pool.query(`
    SELECT id, code, registration_number, evegah_model_name, zone 
    FROM vehicles 
    WHERE zone ILIKE '%Daman%'
    LIMIT 10
  `);
  console.log('Daman vehicles:', v.rows);
  await pool.end();
}
check();

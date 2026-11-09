const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const cols = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'vehicles'
  `);
  console.log('Vehicles columns:', cols.rows.map(c => c.column_name));

  const sample = await pool.query(`SELECT * FROM vehicles LIMIT 2`);
  console.log('Sample vehicle:', sample.rows);

  await pool.end();
}
check();

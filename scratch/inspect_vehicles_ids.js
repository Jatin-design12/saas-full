const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const v = await pool.query(`
    SELECT id, vehicle_number, registration_number, vehicle_name, model, zone_id 
    FROM vehicles 
    LIMIT 10
  `);
  console.log('Vehicles sample:', v.rows);
  await pool.end();
}
check();

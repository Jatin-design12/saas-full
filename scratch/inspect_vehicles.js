const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const vehs = await pool.query("SELECT id, code, registration_number, evegah_model_name, zone, battery_pct, vehicle_status, status FROM vehicles LIMIT 20");
  console.log('VEHICLES:', vehs.rows);
  await pool.end();
}
check().catch(console.error);

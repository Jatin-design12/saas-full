const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const ridersCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'riders'");
  console.log('RIDERS COLS:', ridersCols.rows.map(c => c.column_name));
  
  const riders = await pool.query("SELECT * FROM riders LIMIT 5");
  console.log('RIDERS ROWS:', riders.rows);
  
  const testUsers = await pool.query("SELECT id, name, email, role, created_at FROM users WHERE name ILIKE '%test%' OR email ILIKE '%test%'");
  console.log('TEST USERS IN users:', testUsers.rows);

  const testRenters = await pool.query("SELECT id, rider_name, email, mobile, created_at, booking_source FROM renters WHERE rider_name ILIKE '%test%' OR email ILIKE '%test%' OR mobile ILIKE '%test%'");
  console.log('TEST RENTERS IN renters:', testRenters.rows);

  const allRenters = await pool.query("SELECT id, rider_name, email, mobile, created_at, booking_source, status FROM renters ORDER BY created_at DESC");
  console.log('ALL RENTERS COUNT:', allRenters.rows.length);
  console.log('ALL RENTERS:', allRenters.rows);

  await pool.end();
}
check().catch(console.error);

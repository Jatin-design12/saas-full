const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const r = await pool.query("SELECT * FROM renters WHERE id = '43a7ec8f-703e-4577-8baa-5f16d3fc19bf'");
  console.log('TEST USER RECORD:', r.rows[0]);
  
  const docs = await pool.query("SELECT * FROM documents WHERE rider_id = '43a7ec8f-703e-4577-8baa-5f16d3fc19bf' OR mobile LIKE '%7676976769%'");
  console.log('DOCUMENTS:', docs.rows);

  const logs = await pool.query("SELECT * FROM audit_logs WHERE details LIKE '%7676976769%' OR details LIKE '%Test User%' LIMIT 10");
  console.log('AUDIT LOGS:', logs.rows);

  await pool.end();
}
check().catch(console.error);

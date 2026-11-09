const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const docs = await pool.query("SELECT * FROM documents WHERE rider_id = '2c1cf7bb-95ac-4b0b-9c47-698f293ca213' OR mobile LIKE '%8238961974%'");
  console.log('DOCUMENTS FOR GANAVA:', docs.rows);
  
  const allDocs = await pool.query("SELECT * FROM documents ORDER BY created_at DESC LIMIT 20");
  console.log('RECENT DOCUMENTS IN DB:', allDocs.rows);
  
  await pool.end();
}
check().catch(console.error);

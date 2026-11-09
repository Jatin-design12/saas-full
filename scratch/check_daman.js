const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const z = await pool.query("SELECT id, name, pricing FROM zones WHERE name ILIKE '%daman%'");
  console.log('DAMAN ZONES:', JSON.stringify(z.rows, null, 2));

  const allZ = await pool.query("SELECT id, name, pricing FROM zones");
  console.log('ALL ZONES:', allZ.rows.map(x => ({ id: x.id, name: x.name, pricing: x.pricing })));

  const p = await pool.query("SELECT * FROM settings WHERE key LIKE '%deposit%' OR key LIKE '%pricing%' OR key LIKE '%payment%'");
  console.log('SETTINGS:', p.rows);

  await pool.end();
}
check();

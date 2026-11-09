const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function migrate() {
  try {
    // 1. Add rider_id column to renters if not exists
    await pool.query('ALTER TABLE renters ADD COLUMN IF NOT EXISTS rider_id VARCHAR(64)');
    console.log('Added rider_id to renters');

    // 2. Populate rider_id for existing renters
    const renters = await pool.query('SELECT id, rider_name, created_at, booking_source FROM renters ORDER BY created_at ASC');
    let seq = 1;
    for (const r of renters.rows) {
      const d = r.created_at ? new Date(r.created_at) : new Date();
      const dateStr = d.toISOString().slice(0, 10).replace(/-/g, '');
      const isRR = (r.booking_source && r.booking_source.toLowerCase().includes('retain'));
      const typeCode = isRR ? 'RR' : 'NR';
      const seqStr = String(seq++).padStart(3, '0');
      const formattedId = `EVR-${dateStr}-${typeCode}-${seqStr}`;
      await pool.query('UPDATE renters SET rider_id = $1 WHERE id = $2', [formattedId, r.id]);
      console.log(`Updated renter ${r.rider_name} -> ${formattedId}`);
    }

    // 3. Ensure zones codes start with EVZ-
    const zones = await pool.query('SELECT id, name, code FROM zones ORDER BY id ASC');
    for (const z of zones.rows) {
      const currentCode = (z.code || '').trim();
      let newCode = currentCode;
      if (!newCode.startsWith('EVZ-')) {
        newCode = `EVZ-${String(z.id).padStart(3, '0')}`;
        await pool.query('UPDATE zones SET code = $1 WHERE id = $2', [newCode, z.id]);
        console.log(`Updated zone ${z.name} -> ${newCode}`);
      }
    }

    // 4. Ensure vehicles have code starting with EV- or EVM-
    const vehs = await pool.query('SELECT id, code, registration_number FROM vehicles ORDER BY created_at ASC');
    let vSeq = 1001;
    for (const v of vehs.rows) {
      let code = (v.code || '').trim();
      if (!code || code === '000' || code.includes('-')) {
        code = `EVM${vSeq++}`;
        await pool.query('UPDATE vehicles SET code = $1 WHERE id = $2', [code, v.id]);
        console.log(`Updated vehicle ${v.id} -> ${code}`);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}
migrate();

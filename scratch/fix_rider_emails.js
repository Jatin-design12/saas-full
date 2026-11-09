const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

function cleanEmailFromParts(fullName) {
  const parts = (fullName || 'Rider')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(p => p && p !== 'mr' && p !== 'mrs' && p !== 'ms');

  if (parts.length === 1) {
    return parts[0];
  } else if (parts.length >= 2) {
    // firstname.lastname (if first part is surname in Gujarati/Indian format, use first & last)
    return `${parts[0]}.${parts[parts.length - 1]}`;
  }
  return 'rider';
}

async function fixEmails() {
  const renters = await pool.query("SELECT id, rider_name, mobile, email FROM renters ORDER BY created_at ASC");
  console.log('Current Renters:', renters.rows);

  const usedEmails = new Map();

  for (const r of renters.rows) {
    const basePrefix = cleanEmailFromParts(r.rider_name);
    let candidate = `${basePrefix}@evegah.com`;
    let seq = 1;
    while (usedEmails.has(candidate) && usedEmails.get(candidate) !== r.id) {
      candidate = `${basePrefix}${seq}@evegah.com`;
      seq++;
    }
    usedEmails.set(candidate, r.id);

    console.log(`Updating ${r.rider_name} (${r.mobile}): ${r.email} -> ${candidate}`);
    await pool.query("UPDATE renters SET email = $1 WHERE id = $2", [candidate, r.id]);
  }

  const updated = await pool.query("SELECT id, rider_name, mobile, email FROM renters ORDER BY created_at ASC");
  console.log('Updated Renters:', updated.rows);

  await pool.end();
}

fixEmails().catch(console.error);

require('dotenv').config({ path: './backend/.env' });
const db = require('./backend/src/db');

(async () => {
  try {
    const z = await db.query("SELECT id, name, status, pricing FROM zones WHERE name ILIKE '%Manjalpur%'");
    console.log('MANJALPUR ZONE:');
    console.log(JSON.stringify(z.rows[0], null, 2));

    const v = await db.query("SELECT id, code, zone, status, vehicle_status, evegah_model_name, vehicle_model FROM vehicles WHERE zone ILIKE '%Manjalpur%'");
    console.log(`VEHICLES IN MANJALPUR (${v.rows.length}):`);
    console.log(v.rows.map(x => ({ code: x.code, zone: x.zone, status: x.status, vehicle_status: x.vehicle_status, model: x.evegah_model_name })));

    const models = await db.query("SELECT * FROM vehicle_models");
    console.log('VEHICLE MODELS COUNT:', models.rows.length);
    console.log('VEHICLE MODELS:', models.rows.map(m => m.name || m.evegah_model_name));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();


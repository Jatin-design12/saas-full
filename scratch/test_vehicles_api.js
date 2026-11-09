const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  const http = require('http');
  http.get('http://localhost:5000/api/vehicles?zone=Daman%20SF&limit=5', res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => console.log('Vehicles API response:', JSON.parse(d).data?.slice(0, 2)));
  });
}
check();

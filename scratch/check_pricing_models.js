const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/zones/pricing/new/page.tsx', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('Evegah City') || l.includes('Evegah Fly') || l.includes('models') || l.includes('vehicle_models') || l.includes('api/vehicles/models')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

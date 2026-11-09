const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/vehicles.js', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('models') || l.includes('vehicle_models') || l.includes('/models')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

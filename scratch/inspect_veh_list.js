const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/Rider-app/screens/VehicleListScreen.js', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('apiGet') || l.includes('/vehicles') || l.includes('models') || l.includes('fetch')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

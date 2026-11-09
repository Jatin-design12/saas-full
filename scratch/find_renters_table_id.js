const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/renters/page.tsx', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('rider.id') || l.includes('r.id') || l.includes('r.rider_id') || l.includes('EVR-')) {
    if (idx > 1000 && idx < 1200) console.log((idx+1) + ': ' + l.trim());
  }
});

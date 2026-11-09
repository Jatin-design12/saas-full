const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/renters.js', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('EVR-') || l.includes('rider_id') || l.includes('RID-')) {
    if (idx < 200 || idx > 2300) console.log((idx+1) + ': ' + l.trim());
  }
});

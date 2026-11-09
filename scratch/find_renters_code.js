const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/renters.js', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('EVR') || l.includes('code:') || l.includes('code =') || l.includes('rider_id:')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

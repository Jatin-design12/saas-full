const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/reservations.js', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('reqStartRaw') || l.includes('reqEndRaw')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

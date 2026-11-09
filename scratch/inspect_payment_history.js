const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/paymentHistory.js', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('SELECT') || l.includes('status') || l.includes('Pending') || l.includes('GROUP BY') || l.includes('DISTINCT')) {
    if (idx < 150) console.log((idx+1) + ': ' + l.trim());
  }
});

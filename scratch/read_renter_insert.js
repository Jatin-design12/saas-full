const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/renters.js', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (idx > 340 && idx < 370) console.log((idx+1) + ': ' + l.trim());
});

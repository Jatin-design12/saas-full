const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/renters/page.tsx', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('<table') || l.includes('<tbody>') || l.includes('r.rider_name') || l.includes('r.mobile')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

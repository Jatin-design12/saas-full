const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/renters/profile/page.tsx', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('setRiderAvatar') || l.includes('riderAvatar')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

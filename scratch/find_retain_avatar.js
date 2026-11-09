const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/retain-rider/page.tsx', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('avatar') || l.includes('initials') || l.includes('avatarUrl')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

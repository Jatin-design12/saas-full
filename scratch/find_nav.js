const fs = require('fs');
const txt = fs.readFileSync('C:/Users/Himanshu/Documents/Evegah/saas-full/Rider-app/screens/RentScreen.js', 'utf8');
const lines = txt.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('navigation.navigate')) {
    console.log((idx+1) + ': ' + l.trim());
  }
});

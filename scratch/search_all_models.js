const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === '.next') continue;
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      search(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const txt = fs.readFileSync(full, 'utf8');
      if (txt.includes('VEHICLE_MODELS') || txt.includes("['Evegah City'") || txt.includes('["Evegah City"')) {
        console.log(full);
      }
    }
  }
}
search('C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src');

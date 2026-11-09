const fs = require('fs');
const path = require('path');

function search(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f === 'node_modules' || f === '.git' || f === '.expo') continue;
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      search(full);
    } else if (f.endsWith('.js') || f.endsWith('.jsx')) {
      const txt = fs.readFileSync(full, 'utf8');
      if (txt.includes('VEHICLES') || txt.includes("Evegah City") || txt.includes("Evegah Mink") || txt.includes("models")) {
        if (txt.includes("['Evegah") || txt.includes('["Evegah') || txt.includes('name: \'Evegah')) {
          console.log(full);
        }
      }
    }
  }
}
search('C:/Users/Himanshu/Documents/Evegah/saas-full/Rider-app');

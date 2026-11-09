const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/zones.js';
let content = fs.readFileSync(filePath, 'utf8');

const targetExport = 'module.exports = router;';
const idx = content.indexOf(targetExport);
if (idx !== -1) {
  content = content.slice(0, idx + targetExport.length) + '\n';
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Cleaned trailing debris from zones.js');
}

const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

const startStr = '{/* Clickable Interactive Date Box */}';
const startIndex = content.indexOf(startStr);
if (startIndex !== -1) {
  // Let's just find the exact end strings
  const endStr1 = 'Apply Custom Range</button>';
  const endIdx1 = content.indexOf(endStr1, startIndex);
  if (endIdx1 !== -1) {
    const endStr2 = ')}';
    const endIdx2 = content.indexOf(endStr2, endIdx1);
    if (endIdx2 !== -1) {
      content = content.slice(0, startIndex) + content.slice(endIdx2 + 2);
    }
  }
}

content = content.replace(/className="sa-table"/g, 'className="ev-table"');

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Removed date popover and converted sa-table to ev-table.');

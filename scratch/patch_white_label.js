const fs = require('fs');
const filePath = 'frontend/src/app/settings/white-label/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldCode = `  const handleSave = () => {
    alert('White-label portal configuration details successfully saved and deployed!');
  };`;

const newCode = `  const handleSave = () => {
    if (activeTab === 'mobile') {
      handleSaveSliders();
    } else {
      alert('White-label portal configuration details successfully saved and deployed!');
    }
  };`;

content = content.replace(oldCode.replace(/\n/g, '\r\n'), newCode.replace(/\n/g, '\r\n'));
fs.writeFileSync(filePath, content, 'utf8');
console.log('white-label page.tsx patched!');


const fs = require('fs');

const filePath = 'frontend/src/app/page.tsx';
const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

// Find line index for {/* Clickable Interactive Date Box */}
const startIndex = lines.findIndex(l => l.includes('{/* Clickable Interactive Date Box */}'));
if (startIndex !== -1) {
  // Find closing of popover block: looking for 'Apply Custom Filter' then the next line with ')}'
  const filterBtnIndex = lines.findIndex((l, i) => i > startIndex && l.includes('Apply Custom Filter'));
  if (filterBtnIndex !== -1) {
    let closingIndex = -1;
    for (let i = filterBtnIndex; i < lines.length; i++) {
      if (lines[i].includes(')}')) {
        closingIndex = i;
        break;
      }
    }
    if (closingIndex !== -1) {
      console.log(`Removing redundant date popup block: lines ${startIndex + 1} to ${closingIndex + 1}`);
      lines.splice(startIndex, closingIndex - startIndex + 1);
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log('Successfully removed redundant date popup filter.');
    } else {
      console.error('Could not find closing )}');
    }
  } else {
    console.error('Could not find Apply Custom Filter button');
  }
} else {
  console.log('No Clickable Interactive Date Box found');
}

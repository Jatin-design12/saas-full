const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

// The block to remove starts from {/* Clickable Interactive Date Box */}
// and goes all the way down to the closing div of the `sa-sub-right` container.
const startIndex = content.indexOf('{/* Clickable Interactive Date Box */}');
if (startIndex !== -1) {
  // Let's use string manipulation to find the end of the `sa-sub-right` div or just find the exact block
  // The block ends around the end of the popover modal.
  const endMarker = '{/* End Popover */}'; // Wait, let's see if there is a marker.
  // We can just use a regex.
  const regex = /\{\/\* Clickable Interactive Date Box \*\/\}[\s\S]*?A-\s*<\/button>[\s\S]*?Apply Custom Range<\/button>\s*<\/div>\s*<\/div>\s*\)\}/g;
  content = content.replace(regex, '');
}

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Removed ZoneManagerRoleDashboard date dropdown');

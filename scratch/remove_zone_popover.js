const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

const startStr = '{/* Clickable Interactive Date Box */}';
const endStr = 'Apply Custom Range</button>\\n                    </div>\\n                  </div>\\n                )}';

const startIndex = content.indexOf(startStr);
if (startIndex !== -1) {
  // we want to find the endStr index from startIndex
  const endIndexPattern = content.indexOf('Apply Custom Range</button>', startIndex);
  if (endIndexPattern !== -1) {
    // find the closing `)}`
    const finalIndex = content.indexOf(')}', endIndexPattern);
    if (finalIndex !== -1) {
      const part1 = content.slice(0, startIndex);
      const part2 = content.slice(finalIndex + 2);
      content = part1 + part2;
    }
  }
}

// Remove `const [isDateMenuOpen, setIsDateMenuOpen] = useState<boolean>(false);`
content = content.replace(/const \[isDateMenuOpen, setIsDateMenuOpen\] = useState<boolean>\(false\);\s*/g, '');

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Removed isDateMenuOpen successfully.');

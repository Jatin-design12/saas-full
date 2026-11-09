const fs = require('fs');
const file = 'C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/settings/white-label/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const marker = '{/* Button Only Position (X & Y Offsets) */}';
const markerIdx = content.indexOf(marker);

if (markerIdx !== -1) {
  const beforeMarker = content.substring(0, markerIdx);
  const afterMarker = content.substring(markerIdx);

  // find the last '<input' in beforeMarker
  const inputIdx = beforeMarker.lastIndexOf('<input');
  const cleanBefore = beforeMarker.substring(0, inputIdx);

  const correctInput = `<input
                          type="range"
                          min="0"
                          max="30"
                          value={activeSlide.ctaRadius !== undefined ? activeSlide.ctaRadius : 20}
                          onChange={e => handleUpdateSlide(selectedSlideIdx, 'ctaRadius', Number(e.target.value))}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>

                      `;

  content = cleanBefore + (content.includes('\r\n') ? correctInput.replace(/\n/g, '\r\n') : correctInput) + afterMarker;
  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed input tag properly');
} else {
  console.error('Marker not found');
}

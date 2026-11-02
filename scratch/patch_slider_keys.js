const fs = require('fs');

// Patch RentScreen.js
const rentPath = 'Rider-app/screens/RentScreen.js';
let rentContent = fs.readFileSync(rentPath, 'utf8');
rentContent = rentContent.replace(
  '<MergeSlide key={index} index={index} slide={slide} scrollX={slideScrollX} />',
  '<MergeSlide key={`${slide.id || index}-${slide.bg || \'\'}-${slide.front || \'\'}-${index}`} index={index} slide={slide} scrollX={slideScrollX} />'
);
fs.writeFileSync(rentPath, rentContent, 'utf8');
console.log('RentScreen.js patched!');

// Patch HomeScreen.js
const homePath = 'Rider-app/screens/HomeScreen.js';
let homeContent = fs.readFileSync(homePath, 'utf8');
homeContent = homeContent.replace(
  '<MergeSlide key={index} index={index} slide={slide} scrollX={scrollX} />',
  '<MergeSlide key={`${slide.id || index}-${slide.bg || \'\'}-${slide.front || \'\'}-${index}`} index={index} slide={slide} scrollX={scrollX} />'
);
fs.writeFileSync(homePath, homeContent, 'utf8');
console.log('HomeScreen.js patched!');


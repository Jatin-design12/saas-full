const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function cropPng(srcPath, destPath, { x, y, width, height }) {
  const data = fs.readFileSync(srcPath);
  const srcPng = PNG.sync.read(data);

  // Clamp boundaries
  const startX = Math.max(0, Math.min(x, srcPng.width - 1));
  const startY = Math.max(0, Math.min(y, srcPng.height - 1));
  const cropW = Math.min(width, srcPng.width - startX);
  const cropH = Math.min(height, srcPng.height - startY);

  const destPng = new PNG({ width: cropW, height: cropH });

  for (let destY = 0; destY < cropH; destY++) {
    for (let destX = 0; destX < cropW; destX++) {
      const srcIdx = ((startY + destY) * srcPng.width + (startX + destX)) << 2;
      const destIdx = (destY * cropW + destX) << 2;

      destPng.data[destIdx] = srcPng.data[srcIdx];
      destPng.data[destIdx + 1] = srcPng.data[srcIdx + 1];
      destPng.data[destIdx + 2] = srcPng.data[srcIdx + 2];
      destPng.data[destIdx + 3] = srcPng.data[srcIdx + 3];
    }
  }

  const outBuffer = PNG.sync.write(destPng);
  fs.writeFileSync(destPath, outBuffer);
  console.log(`Saved: ${destPath} (${cropW}x${cropH})`);
}

const designDir = path.join(__dirname, '../assets/design_ref');
const outDir = path.join(__dirname, '../assets');

// 1. Rider purple header from onboarding screen (media_1791172439955.png: 472 x 1024)
cropPng(
  path.join(designDir, 'media_1791172439955.png'),
  path.join(outDir, 'rider_purple_header.png'),
  { x: 0, y: 0, width: 472, height: 310 }
);

// 2. Explore Vadodara EV hero banner (media_1791171603618.png: 305 x 674)
cropPng(
  path.join(designDir, 'media_1791171603618.png'),
  path.join(outDir, 'explore_vadodara_banner.png'),
  { x: 12, y: 92, width: 281, height: 124 }
);

// 3. Map Background (media_1791171609750.png: 471 x 1024)
cropPng(
  path.join(designDir, 'media_1791171609750.png'),
  path.join(outDir, 'live_map_canvas.png'),
  { x: 0, y: 0, width: 471, height: 680 }
);

// 4. Purple scooter cutout from Daily Plan (media_1791171603618.png)
cropPng(
  path.join(designDir, 'media_1791171603618.png'),
  path.join(outDir, 'scooter_daily_purple.png'),
  { x: 92, y: 450, width: 56, height: 64 }
);

// 5. Black scooter cutout from Monthly Plan (media_1791171603618.png)
cropPng(
  path.join(designDir, 'media_1791171603618.png'),
  path.join(outDir, 'scooter_monthly_black.png'),
  { x: 236, y: 450, width: 56, height: 64 }
);

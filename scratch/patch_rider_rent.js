const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/Rider-app/screens/RentScreen.js';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\r\n/g, '\n');

// 1. Initial dropTime state
const oldInit = "  const [dropTime, setDropTime] = useState(nowTimeStr);";
const newInit = "  const [dropTime, setDropTime] = useState('08:00 PM');";

// 2. choosePickupTime
const oldChoose = `    if (!isHourlyZone) {
      const pkg = zonePackageOptions.find((p) => p.id === rentPackageId);
      if (pkg && pkg.days) {
        setDropTime(time);
      }
    }`;

const newChoose = `    if (!isHourlyZone) {
      const pkg = zonePackageOptions.find((p) => p.id === rentPackageId);
      if (pkg && pkg.days) {
        const closeT = dropPlace?.close_time || pickupZone?.close_time || '08:00 PM';
        setDropTime(closeT);
      }
    }`;

// 3. onConfirm in DatePopup
const oldConfirm = `            const pkg = zonePackageOptions.find((p) => p.id === (chosenPkgId || rentPackageId));
            if (!isHourlyZone && pkg && pkg.days) {
              setDropTime(pickupTime);
            }`;

const newConfirm = `            const pkg = zonePackageOptions.find((p) => p.id === (chosenPkgId || rentPackageId));
            if (!isHourlyZone && pkg && pkg.days) {
              const closeT = dropPlace?.close_time || pickupZone?.close_time || '08:00 PM';
              setDropTime(closeT);
            }`;

if (content.includes(oldInit)) content = content.replace(oldInit, newInit);
if (content.includes(oldChoose)) content = content.replace(oldChoose, newChoose);
if (content.includes(oldConfirm)) content = content.replace(oldConfirm, newConfirm);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched Rider-app RentScreen.js');

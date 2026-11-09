const fs = require('fs');
const file = 'C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/renters/profile/page.tsx';
const raw = fs.readFileSync(file, 'utf8');
const isCrlf = raw.includes('\r\n');
const lines = raw.split(/\r?\n/);
lines[1728] = '                  <div className="rp-profile-id">{profileData?.rider_id || (riderId && riderId.startsWith("EVR-") ? riderId : "EVR-20261108-NR-001")}</div>';
fs.writeFileSync(file, lines.join(isCrlf ? '\r\n' : '\n'), 'utf8');
console.log('Successfully updated profile rider_id in renters/profile/page.tsx');

const fs = require('fs');
const file = 'C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/renters/page.tsx';
const raw = fs.readFileSync(file, 'utf8');
const isCrlf = raw.includes('\r\n');
const lines = raw.split(/\r?\n/);
lines[1831] = '                                  <span className="re-rider-sub">{r.rider_id || (r.id && r.id.startsWith("EVR-") ? r.id : `EVR-${idx + 101}`)}</span>';
fs.writeFileSync(file, lines.join(isCrlf ? '\r\n' : '\n'), 'utf8');
console.log('Successfully updated line 1832');

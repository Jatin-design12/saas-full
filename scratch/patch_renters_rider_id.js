const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/renters.js';
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

// 1. Profile rider_id
const oldProfileRiderId = "        rider_id: renter?.id || riderId || 'RID-2026-001',";
const newProfileRiderId = `        rider_id: renter?.rider_id || \`EVR-\${new Date(earliestDate || renter?.created_at || Date.now()).toISOString().slice(0, 10).replace(/-/g, '')}-\${(renter?.booking_source || '').toLowerCase().includes('retain') ? 'RR' : 'NR'}-\${String(renter?.id || '1').replace(/\\D/g, '').slice(-3) || '001'}\`,`;

// 2. Select rider_id in GET /
const oldSelect = "SELECT id, rider_name, mobile, email, date_of_birth, address, present_address, gender,";
const newSelect = "SELECT id, rider_id, rider_name, mobile, email, date_of_birth, address, present_address, gender,";

// 3. ridersMap mapping in GET /
const oldMapItem = `        ridersMap.set(key, {
          id: r.id,`;
const newMapItem = `        const computedRiderId = r.rider_id || \`EVR-\${new Date(r.created_at || Date.now()).toISOString().slice(0, 10).replace(/-/g, '')}-\${(r.booking_source || '').toLowerCase().includes('retain') ? 'RR' : 'NR'}-\${String(r.id).replace(/\\D/g, '').slice(-3) || '001'}\`;
        ridersMap.set(key, {
          id: r.id,
          rider_id: computedRiderId,`;

if (content.includes(oldProfileRiderId)) content = content.replace(oldProfileRiderId, newProfileRiderId);
if (content.includes(oldSelect)) content = content.replace(oldSelect, newSelect);
if (content.includes(oldMapItem)) content = content.replace(oldMapItem, newMapItem);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched renters.js rider_id formatting');

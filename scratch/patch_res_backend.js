const fs = require('fs');

// 1. Update reservations.js
const resFile = 'C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/reservations.js';
let resContent = fs.readFileSync(resFile, 'utf8').replace(/\r\n/g, '\n');

// Drop datetime auto-calculation if same or missing
const oldEndLogic = "  const reqEndRaw = req.body.drop_datetime || req.body.end_datetime || reqStartRaw;";
const newEndLogic = `  const reqStartRaw = req.body.pickup_datetime || req.body.start_datetime || \`\${reservation_date || ''} \${reservation_time || ''}\`.trim();
  let reqEndRaw = req.body.drop_datetime || req.body.end_datetime;
  if (!reqEndRaw || reqEndRaw === reqStartRaw) {
    const pkgLower = String(package_type || '').toLowerCase();
    let daysToAdd = 1;
    if (pkgLower.includes('week') || pkgLower.includes('7 day')) daysToAdd = 7;
    else if (pkgLower.includes('month') || pkgLower.includes('30 day')) daysToAdd = 30;
    else if (pkgLower.match(/(\\d+)\\s*day/)) daysToAdd = parseInt(pkgLower.match(/(\\d+)\\s*day/)[1], 10);
    else if (pkgLower.includes('hour')) daysToAdd = 0;

    if (daysToAdd > 0) {
      const startDt = new Date(reqStartRaw && !isNaN(new Date(reqStartRaw).getTime()) ? reqStartRaw : Date.now());
      startDt.setDate(startDt.getDate() + daysToAdd);
      startDt.setHours(20, 0, 0, 0);
      reqEndRaw = startDt.toISOString();
    } else {
      const startDt = new Date(reqStartRaw && !isNaN(new Date(reqStartRaw).getTime()) ? reqStartRaw : Date.now());
      startDt.setHours(startDt.getHours() + 1);
      reqEndRaw = startDt.toISOString();
    }
  }`;

// Reservation ID generation
const oldResId = `  // Generate unique reservation ID
  const randomSuffix = String(Math.floor(100 + Math.random() * 900));
  const year = new Date().getFullYear();
  const reservation_id = \`RID-\${year}-\${randomSuffix}\${String(Date.now()).slice(-3)}\`;`;

const newResId = `  // Generate formatted Rider / Reservation ID: EVR-{YYYYMMDD}-{NR/RR}-{seq}
  const todayDateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const isRetain = Boolean(req.body.is_retain_ride || (req.body.booking_source || '').toLowerCase().includes('retain'));
  const typeCode = isRetain ? 'RR' : 'NR';
  const seqRes = await db.query("SELECT COUNT(*) FROM reservations WHERE DATE(created_at) = CURRENT_DATE").catch(() => ({ rows: [{ count: 0 }] }));
  const seqNum = String(parseInt(seqRes.rows[0]?.count || 0, 10) + 1).padStart(3, '0');
  const reservation_id = \`EVR-\${todayDateStr}-\${typeCode}-\${seqNum}\`;`;

if (resContent.includes(oldEndLogic)) {
  resContent = resContent.replace(oldEndLogic, newEndLogic);
}
if (resContent.includes(oldResId)) {
  resContent = resContent.replace(oldResId, newResId);
}

fs.writeFileSync(resFile, resContent, 'utf8');
console.log('Successfully updated reservations.js with drop calculation and formatted EVR ID');

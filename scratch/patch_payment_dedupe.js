const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/paymentHistory.js';
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const target = `    // Query all records for accurate KPI metrics
    const allRecordsRes = await db.query(unionQuery);
    const allRecords = allRecordsRes.rows;

    // Compute live KPI metrics over all records`;

const replacement = `    // Query all records for accurate KPI metrics
    const allRecordsRes = await db.query(unionQuery);
    const rawAllRecords = allRecordsRes.rows;

    // Deduplicate transactions:
    // 1. If a transaction/booking is Successful, suppress any Pending attempts for it.
    // 2. Collapse rapid repeated Pending attempts for the same mobile and amount to 1 single pending record.
    const successfulKeys = new Set();
    rawAllRecords.forEach(rec => {
      if ((rec.status || '').toLowerCase() === 'successful') {
        if (rec.reference_id && rec.reference_id !== 'ICICI-UPI') successfulKeys.add(rec.reference_id);
        if (rec.tx_id) successfulKeys.add(rec.tx_id);
        const cleanMob = (rec.mobile || '').replace(/\\D/g, '').slice(-10);
        if (cleanMob) {
          const dateDay = new Date(rec.created_at).toISOString().slice(0, 10);
          successfulKeys.add(\`\${cleanMob}_\${parseFloat(rec.amount)}_\${dateDay}\`);
        }
      }
    });

    const seenPendingKeys = new Set();
    const allRecords = [];

    for (const rec of rawAllRecords) {
      const st = (rec.status || '').toLowerCase();
      const cleanMob = (rec.mobile || '').replace(/\\D/g, '').slice(-10);
      const dateDay = new Date(rec.created_at).toISOString().slice(0, 10);
      const mobAmtDayKey = \`\${cleanMob}_\${parseFloat(rec.amount)}_\${dateDay}\`;

      if (st === 'pending') {
        // If payment was completed successfully, hide redundant pending records
        if (successfulKeys.has(rec.reference_id) || successfulKeys.has(rec.tx_id) || successfulKeys.has(mobAmtDayKey)) {
          continue;
        }
        // If multiple pending attempts exist for same mobile and amount within same day, keep only the latest single one
        if (cleanMob && seenPendingKeys.has(mobAmtDayKey)) {
          continue;
        }
        seenPendingKeys.add(mobAmtDayKey);
      }
      allRecords.push(rec);
    }

    // Compute live KPI metrics over all records`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully patched paymentHistory.js deduplication');
} else {
  console.log('Target not found in paymentHistory.js');
}

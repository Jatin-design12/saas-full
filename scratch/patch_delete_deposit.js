const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/reservations.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = `    if (txnIdToSave) {
      await db.query(
        "UPDATE payu_payments SET reservation_id = $1, status = 'Success', updated_at = NOW() WHERE tx_id = $2 OR payu_id = $2",
        [reservation_id, txnIdToSave]
      ).catch(() => {});
    }`;

content = content.replace(/\r\n/g, '\n');
const normalizedTarget = target.replace(/\r\n/g, '\n');

if (content.includes(normalizedTarget)) {
  content = content.replace(normalizedTarget, '');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully removed txnIdToSave block from delete route in reservations.js');
} else {
  console.log('Target not found in reservations.js');
}

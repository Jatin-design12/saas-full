const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/stats.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = "deposit: `₹${parseFloat(r.deposit || 1000).toLocaleString('en-IN')}`,";
const replacement = "deposit: `₹${parseFloat(r.deposit !== null && r.deposit !== undefined ? r.deposit : 0).toLocaleString('en-IN')}`,";

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated stats.js deposit calculation');
} else {
  console.log('Target not found in stats.js');
}

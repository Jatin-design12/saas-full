const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

// The block to remove starts from {/* Clickable Interactive Date Box */}
const regex = /\{\/\* Clickable Interactive Date Box \*\/\}[\s\S]*?Apply Custom Range<\/button>\s*<\/div>\s*<\/div>\s*\)\}/g;
content = content.replace(regex, '');

// There is also `const [isDateMenuOpen, setIsDateMenuOpen] = useState<boolean>(false);`
content = content.replace(/const \[isDateMenuOpen, setIsDateMenuOpen\] = useState<boolean>\(false\);\s*/g, '');

// Fix dates in tables:
// 1. `req.created_at ? new Date(req.created_at).toLocaleDateString() : 'Today'` => `'—'`
content = content.replace(/: 'Today'\}/g, ": '—'}");

// 2. Dummy reservations
const dummyReservations = /\{\s*id:\s*'RES-2024-098'[\s\S]*?'sa-badge-green'\s*\}/g;
content = content.replace(dummyReservations, "");
const dummyReservations2 = /\{\s*id:\s*'RES-2024-097'[\s\S]*?'sa-badge-orange'\s*\},\s*/g;
content = content.replace(dummyReservations2, "");
const dummyReservations3 = /\{\s*id:\s*'RES-2024-096'[\s\S]*?'sa-badge-green'\s*\}/g;
content = content.replace(dummyReservations3, "");

// Dummy invoices
const dummyInvoices = /\{\s*id:\s*'#INV-2024-089'[\s\S]*?'sa-badge-green'\s*\},\s*/g;
content = content.replace(dummyInvoices, "");
const dummyInvoices2 = /\{\s*id:\s*'#INV-2024-088'[\s\S]*?'sa-badge-green'\s*\},\s*/g;
content = content.replace(dummyInvoices2, "");
const dummyInvoices3 = /\{\s*id:\s*'#INV-2024-087'[\s\S]*?'sa-badge-blue'\s*\}/g;
content = content.replace(dummyInvoices3, "");

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Removed date popover and dummy tables.');

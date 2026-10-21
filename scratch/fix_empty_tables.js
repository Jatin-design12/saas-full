const fs = require('fs');

const filePath = 'frontend/src/app/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace empty reservation table map with an empty state row
content = content.replace(
  /<tbody>\s*\[\s*,\s*\]\.map\(r => \([\s\S]*?<\/tr>\s*\)\)\s*<\/tbody>/,
  `<tbody>
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                        No reservations found
                      </td>
                    </tr>
                  </tbody>`
);

// Replace empty work orders table map with empty state row
content = content.replace(
  /<tbody>\s*\[\s*\]\.map\(w => \([\s\S]*?<\/tr>\s*\)\)\s*<\/tbody>/,
  `<tbody>
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                        No active work orders
                      </td>
                    </tr>
                  </tbody>`
);

// Replace empty invoices table map with empty state row
content = content.replace(
  /<tbody>\s*\[\s*\]\.map\(inv => \([\s\S]*?<\/tr>\s*\)\)\s*<\/tbody>/,
  `<tbody>
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>
                        No recent invoices found
                      </td>
                    </tr>
                  </tbody>`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed empty mapped table bodies with proper empty state rows.');

const fs = require('fs');

const filePath = 'frontend/src/app/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

function replaceTableBody(headerMatch, colCount, emptyMsg) {
  let foundIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(headerMatch)) {
      foundIdx = i;
      break;
    }
  }

  if (foundIdx !== -1) {
    let tbodyStart = -1;
    let tbodyEnd = -1;
    for (let j = foundIdx; j < lines.length; j++) {
      if (lines[j].includes('<tbody>')) {
        tbodyStart = j;
      }
      if (lines[j].includes('</tbody>')) {
        tbodyEnd = j;
        break;
      }
    }

    if (tbodyStart !== -1 && tbodyEnd !== -1) {
      const replacement = [
        '                  <tbody>',
        '                    <tr>',
        `                      <td colSpan={${colCount}} style={{ textAlign: 'center', padding: '24px', color: '#64748B' }}>`,
        `                        ${emptyMsg}`,
        '                      </td>',
        '                    </tr>',
        '                  </tbody>'
      ];
      lines.splice(tbodyStart, tbodyEnd - tbodyStart + 1, ...replacement);
      console.log(`Replaced table body for ${headerMatch}`);
    }
  }
}

replaceTableBody('<th>Ticket ID</th><th>Vehicle Plate</th>', 6, 'No active work orders');
replaceTableBody('<th>Invoice No</th><th>Tenant / Customer</th>', 5, 'No recent invoices found');

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Finished updating work orders and invoices tables.');

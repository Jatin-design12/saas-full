const fs = require('fs');

const filePath = 'frontend/src/app/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const targetBlock = `                  <tbody>
                    {[
                      ,
                      
                    ].map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: '800', fontFamily: 'Outfit' }}>{r.id}</td>
                        <td style={{ fontWeight: '700' }}>{r.name}</td>
                        <td>{r.type}</td>
                        <td><span className={r.bg}>{r.st}</span></td>
                      </tr>
                    ))}
                  </tbody>`;

// Normalize search by line array
const lines = content.split(/\r?\n/);
let foundIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<tr><th>Reservation ID</th><th>Customer Name</th><th>Vehicle Type</th><th>Status</th></tr>')) {
    foundIdx = i;
    break;
  }
}

if (foundIdx !== -1) {
  let endTbodyIdx = -1;
  for (let j = foundIdx; j < lines.length; j++) {
    if (lines[j].includes('</tbody>')) {
      endTbodyIdx = j;
      break;
    }
  }
  if (endTbodyIdx !== -1) {
    const replacement = [
      '                  <tbody>',
      '                    <tr>',
      '                      <td colSpan={4} style={{ textAlign: \'center\', padding: \'24px\', color: \'#64748B\' }}>',
      '                        No reservations found',
      '                      </td>',
      '                    </tr>',
      '                  </tbody>'
    ];
    // replace from foundIdx + 2 (the tbody tag) to endTbodyIdx
    lines.splice(foundIdx + 2, endTbodyIdx - (foundIdx + 2) + 1, ...replacement);
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log('Successfully replaced broken reservation table body with clean empty state row.');
  }
} else {
  console.error('Could not find reservation table header');
}

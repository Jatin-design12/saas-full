const fs = require('fs');
const filePath = 'Rider-app/services/api.js';
let content = fs.readFileSync(filePath, 'utf8');

const regex = /export function resolveMediaUrl[\s\S]*?return `\${host}\${clean}`;\s*}/;

const newResolveMedia = `export function resolveMediaUrl(mediaPath) {
  if (!mediaPath) return null;
  let s = String(mediaPath).trim();
  if (!s) return null;

  // If already an absolute URL
  if (s.startsWith('http://') || s.startsWith('https://')) {
    if (s.includes('evegah.cloud/uploads/')) {
      return s.replace('evegah.cloud/uploads/', 'evegah.cloud/api/uploads/');
    }
    // If local dev base is active, keep and route local images to active local host
    if (cachedWorkingLocalBase && (s.includes('192.168.') || s.includes('10.0.2.2') || s.includes('localhost:5000'))) {
      const activeHost = cachedWorkingLocalBase.replace(/\\/api\\/?$/, '');
      return s.replace(/https?:\\/\\/[^/]+(?:\\/api)?(\\/uploads\\/[^\\s?#]+)/, \`\${activeHost}/api$1\`);
    }
    return s;
  }
  if (s.startsWith('data:')) return s;

  // Normalize relative path
  const clean = s.startsWith('/') ? s : \`/\${s}\`;
  const configuredBase = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL.replace(/\\/+$/, '') : null;
  const activeBase = configuredBase || cachedWorkingLocalBase || \`http://\${LAN_IP}:5000/api\`;

  if (clean.startsWith('/uploads/')) {
    const hostWithApi = activeBase.endsWith('/api') ? activeBase : \`\${activeBase}/api\`;
    return \`\${hostWithApi}\${clean}\`;
  }
  if (clean.startsWith('/api/uploads/')) {
    const host = activeBase.replace(/\\/api\\/?$/, '');
    return \`\${host}\${clean}\`;
  }

  const host = activeBase.replace(/\\/api\\/?$/, '');
  return \`\${host}\${clean}\`;
}`;

content = content.replace(regex, newResolveMedia.replace(/\n/g, '\r\n'));
fs.writeFileSync(filePath, content, 'utf8');
console.log('resolveMediaUrl patched!');


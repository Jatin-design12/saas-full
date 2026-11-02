const fs = require('fs');
const filePath = 'Rider-app/services/api.js';
let content = fs.readFileSync(filePath, 'utf8');

// Update resolveMediaUrl
const oldResolveMedia = `export function resolveMediaUrl(mediaPath) {
  if (!mediaPath) return null;
  let s = String(mediaPath).trim();
  if (!s) return null;

  // If already an absolute URL
  if (s.startsWith('http://') || s.startsWith('https://')) {
    // If it points to evegah.cloud/uploads/ (which returns 500 on Nginx), rewrite to /api/uploads/
    if (s.includes('evegah.cloud/uploads/')) {
      return s.replace('evegah.cloud/uploads/', 'evegah.cloud/api/uploads/');
    }
    // If it points to internal LAN IP or localhost on non-local environment, rewrite to live cloud
    if ((s.includes('192.168.') || s.includes('10.0.2.2') || s.includes('localhost:5000')) && !cachedWorkingLocalBase) {
      return s.replace(/https?:\/\/[^/]+(?:\/api)?(\/uploads\/[^\s?#]+)/, 'https://evegah.cloud/api$1');
    }
    return s;
  }
  if (s.startsWith('data:')) return s;

  // Normalize relative path
  const clean = s.startsWith('/') ? s : \`/\${s}\`;
  const configuredBase = process.env.EXPO_PUBLIC_API_URL ? process.env.EXPO_PUBLIC_API_URL.replace(/\\/+$/, '') : null;
  const activeBase = configuredBase || cachedWorkingLocalBase || REMOTE_BASE;

  // On evegah.cloud (and backend Express setup), uploads are reliably served under /api/uploads/
  if (clean.startsWith('/uploads/')) {
    const hostWithApi = activeBase.endsWith('/api') ? activeBase : \`\${activeBase}/api\`;
    return \`\${hostWithApi}\${clean}\`;
  }

  const host = activeBase.replace(/\\/api\\/?$/, '');
  return \`\${host}\${clean}\`;
}`;

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

content = content.replace(oldResolveMedia.replace(/\n/g, '\r\n'), newResolveMedia.replace(/\n/g, '\r\n'));

// Update isLocalPreferred in apiGet
const oldLocalPreferred = `  const isLocalPreferred = path.startsWith('/kyc') || path.startsWith('/renters') || path.startsWith('/zones') || path.startsWith('/vehicles') || path.startsWith('/coupons') || path.startsWith('/v1');`;
const newLocalPreferred = `  const isLocalPreferred =
    path.startsWith('/kyc') ||
    path.startsWith('/renters') ||
    path.startsWith('/zones') ||
    path.startsWith('/vehicles') ||
    path.startsWith('/coupons') ||
    path.startsWith('/v1') ||
    path.startsWith('/settings') ||
    path.startsWith('/app-sliders');`;

content = content.replace(oldLocalPreferred.replace(/\n/g, '\r\n'), newLocalPreferred.replace(/\n/g, '\r\n'));

// Also update candidate success to cache base if it's local
content = content.replace(
  `if (isLocalPreferred) cachedWorkingLocalBase = base;`,
  `if (isLocalPreferred || base.includes('192.168.') || base.includes('10.0.2.2') || base.includes('localhost')) cachedWorkingLocalBase = base;`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Rider-app/services/api.js updated successfully!');


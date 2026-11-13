const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backendDir = path.join(__dirname, 'backend');
const marked = require(path.join(backendDir, 'node_modules', 'marked'));

const markdownPath = path.join(__dirname, 'PROJECT_SCOPE_OF_WORK_FULL.md');
const mdContent = fs.readFileSync(markdownPath, 'utf8');

// Parse markdown to HTML
const rawHtml = marked.parse(mdContent);

const styledHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Evegah EV Mobility SaaS Platform - Full Scope of Work</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4 portrait;
    margin: 18mm 16mm 20mm 16mm;
    @bottom-center {
      content: "Page " counter(page) " of " counter(pages);
      font-family: 'Inter', sans-serif;
      font-size: 8.5pt;
      color: #64748b;
    }
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    font-size: 9.8pt;
    line-height: 1.58;
    margin: 0;
    padding: 0;
  }

  .cover-page {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 85vh;
    padding: 40px 20px;
    border-bottom: 3px solid #10b981;
  }

  .cover-badge {
    display: inline-block;
    align-self: flex-start;
    background: #ecfdf5;
    color: #059669;
    border: 1px solid #a7f3d0;
    padding: 6px 14px;
    border-radius: 9999px;
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  .cover-title {
    font-size: 32pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.15;
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
  }

  .cover-subtitle {
    font-size: 16pt;
    font-weight: 500;
    color: #475569;
    margin: 0 0 36px 0;
    line-height: 1.35;
  }

  .cover-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px;
    margin-top: 20px;
  }

  .cover-meta-item {
    font-size: 9pt;
  }

  .cover-meta-label {
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    font-size: 7.5pt;
    letter-spacing: 0.04em;
    margin-bottom: 4px;
  }

  .cover-meta-value {
    font-weight: 600;
    color: #1e293b;
    font-size: 9.5pt;
  }

  .doc-content {
    padding-top: 10px;
  }

  h1 {
    font-size: 18pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 8px;
    margin-top: 36px;
    margin-bottom: 16px;
    page-break-after: avoid;
    letter-spacing: -0.01em;
  }

  h2 {
    font-size: 13.5pt;
    font-weight: 700;
    color: #0f766e;
    margin-top: 28px;
    margin-bottom: 12px;
    page-break-after: avoid;
  }

  h3 {
    font-size: 11pt;
    font-weight: 700;
    color: #1e293b;
    margin-top: 20px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    text-align: justify;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 14px;
    padding-left: 22px;
  }

  li {
    margin-bottom: 5px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 18px 0;
    font-size: 8.8pt;
    page-break-inside: avoid;
  }

  th {
    background: #0f172a;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 8px 10px;
    border: 1px solid #1e293b;
  }

  td {
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 12px 14px;
    border-radius: 8px;
    font-family: 'JetBrains Mono', 'Cascadia Code', monospace;
    font-size: 8pt;
    line-height: 1.45;
    overflow-x: auto;
    margin: 14px 0;
    page-break-inside: avoid;
    border: 1px solid #334155;
  }

  code {
    font-family: 'JetBrains Mono', 'Cascadia Code', monospace;
    font-size: 8.5pt;
    background: #f1f5f9;
    color: #0f766e;
    padding: 1.5px 4.5px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
    border: none;
    font-size: 8pt;
  }

  blockquote {
    margin: 14px 0;
    padding: 10px 16px;
    border-left: 4px solid #10b981;
    background: #f0fdf4;
    color: #166534;
    font-style: normal;
    border-radius: 0 6px 6px 0;
  }

  hr {
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 28px 0;
  }

  .header-tag {
    color: #059669;
    font-weight: 700;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .footer-notice {
    font-size: 8pt;
    color: #94a3b8;
    text-align: center;
    margin-top: 40px;
    border-top: 1px solid #e2e8f0;
    padding-top: 12px;
  }
</style>
</head>
<body>

<div class="cover-page">
  <div class="cover-badge">Official Architecture & Engineering SOW</div>
  <h1 class="cover-title">Evegah EV Mobility SaaS Platform</h1>
  <div class="cover-subtitle">Complete Technical Scope of Work & Deliverables Specification</div>
  
  <p style="color: #64748b; font-size: 10.5pt; margin-bottom: 24px;">
    An end-to-end blueprint detailing the Super Admin Operations Web Portal, Consumer Rider Mobile Application, and On-Ground Employee/Technician Application with Smart BMS Telemetry & Battery Swapping.
  </p>

  <div class="cover-meta-grid">
    <div class="cover-meta-item">
      <div class="cover-meta-label">Document Version</div>
      <div class="cover-meta-value">2.0 (Full SaaS & Telematics Edition)</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Date & Status</div>
      <div class="cover-meta-value">November 2026 | Approved Specification</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Primary Stakeholders</div>
      <div class="cover-meta-value">Engineering, Product, Operations, QA, Management</div>
    </div>
    <div class="cover-meta-item">
      <div class="cover-meta-label">Core Tech Stack</div>
      <div class="cover-meta-value">Node.js / Next.js 14 / React Native / Flutter / PostgreSQL / BLE</div>
    </div>
  </div>
</div>

<div class="doc-content">
  ${rawHtml}
</div>

<div class="footer-notice">
  CONFIDENTIAL & PROPRIETARY &bull; &copy; 2026 Evegah Mobility Pvt. Ltd. All Rights Reserved.
</div>

</body>
</html>`;

const scratchDir = path.join(__dirname, 'scratch');
if (!fs.existsSync(scratchDir)) {
  fs.mkdirSync(scratchDir, { recursive: true });
}

const htmlPath = path.join(scratchDir, 'sow_document.html');
fs.writeFileSync(htmlPath, styledHtml, 'utf8');
console.log('HTML written to:', htmlPath);

// Output PDF path
const outputPdfPath = path.join(__dirname, 'Evegah_Scope_of_Work_Full_SOW.pdf');

// Chrome or Edge binary paths
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

let browserExe = null;
for (const p of chromePaths) {
  if (fs.existsSync(p)) {
    browserExe = p;
    break;
  }
}

if (!browserExe) {
  console.error('Neither Chrome nor Edge was found on system.');
  process.exit(1);
}

console.log('Using browser executable:', browserExe);

const cmd = `"${browserExe}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${outputPdfPath}" "file:///${htmlPath.replace(/\\\\/g, '/')}"`;

console.log('Running PDF conversion...');
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('PDF successfully generated at:', outputPdfPath);
  const stats = fs.statSync(outputPdfPath);
  console.log('PDF File Size:', stats.size, 'bytes');
} catch (err) {
  console.error('Error generating PDF:', err.message);
  process.exit(1);
}

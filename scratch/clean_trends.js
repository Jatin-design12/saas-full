const fs = require('fs');

const filePath = 'frontend/src/app/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove dummy trends from KPI cards in the entire file
// Match `change: '...', up: true` or `false`
content = content.replace(/change:\s*'[^']+',\s*up:\s*(true|false)/g, "change: '—', up: true");
// Or sometimes it's `change: '...', up: false`
content = content.replace(/change:\s*"[^"]+",\s*up:\s*(true|false)/g, "change: '—', up: true");

// Replace remaining dummy values for mrr and arr
content = content.replace(/val: liveStats \? liveStats\.mrr : '[^']+'/g, "val: liveStats ? liveStats.mrr : (isError ? '—' : 'Loading...')");
content = content.replace(/val: liveStats \? liveStats\.arr : '[^']+'/g, "val: liveStats ? liveStats.arr : (isError ? '—' : 'Loading...')");

// Doughnut legends dummy data removal
content = content.replace(/liveStats \? liveStats\.subscriptionStatus\.active\.toLocaleString\('en-US'\) : '[^']+'/g, "liveStats ? liveStats.subscriptionStatus.active.toLocaleString('en-US') : '—'");
content = content.replace(/liveStats \? liveStats\.subscriptionStatus\.trial\.toLocaleString\('en-US'\) : '[^']+'/g, "liveStats ? liveStats.subscriptionStatus.trial.toLocaleString('en-US') : '—'");
content = content.replace(/liveStats \? liveStats\.subscriptionStatus\.pastDue\.toLocaleString\('en-US'\) : '[^']+'/g, "liveStats ? liveStats.subscriptionStatus.pastDue.toLocaleString('en-US') : '—'");
content = content.replace(/liveStats \? liveStats\.subscriptionStatus\.canceled\.toLocaleString\('en-US'\) : '[^']+'/g, "liveStats ? liveStats.subscriptionStatus.canceled.toLocaleString('en-US') : '—'");
content = content.replace(/\(73\.2%\)/g, "");
content = content.replace(/\(13\.9%\)/g, "");
content = content.replace(/\(7\.7%\)/g, "");
content = content.replace(/\(5\.2%\)/g, "");

// Remove fabricated static bar graph data in Super Admin
content = content.replace(/labels: \['Enterprise', 'Business', 'Pro', 'Starter'\],\s*datasets: \[\s*\{\s*data: \[[^\]]+\]/g, "labels: liveStats?.topPlans?.labels || [],\n                        datasets: [\n                          {\n                            data: liveStats?.topPlans?.data || []");

// In FranchiseManagerRoleDashboard, there is `fStats ? fStats.mrr : '₹,117,065'`
content = content.replace(/val: fStats \? fStats\.mrr : '[^']+'/g, "val: fStats ? fStats.mrr : '—'");
content = content.replace(/val: \(\s*fStats\?\.totalRiders\s*\|\|\s*25\s*\)\.toString\(\)/g, "val: (fStats?.totalRiders || '—').toString()");
content = content.replace(/val: \(\s*fStats\?\.activeSubscriptions\s*\|\|\s*9\s*\)\.toString\(\)/g, "val: (fStats?.activeSubscriptions || '—').toString()");
content = content.replace(/val: \(\s*fStats\?\.totalVehicles\?\.value\s*\|\|\s*'8 EVs'\s*\)/g, "val: (fStats?.totalVehicles?.value || '—')");

// Also there is a static table of Active Work Order Tickets in MaintenanceTechnicianRoleDashboard.
const dummyTicketsRegex = /\{ id: '#WO-9841'[\s\S]*?bg: 'sa-badge-green' \}/g;
content = content.replace(dummyTicketsRegex, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleaned up dummy trends and data in page.tsx using Node.js');

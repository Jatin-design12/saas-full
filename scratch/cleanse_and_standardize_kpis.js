const fs = require('fs');

const filePath = 'frontend/src/app/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove fabricated '20 kg' fallback in GroundOperationsRoleDashboard
content = content.replace(
  `const co2SavedValue = co2Stats?.co2_saved_kg !== undefined ? \`\${co2Stats.co2_saved_kg} kg\` : (co2Stats?.data?.kpis?.totalCo2SavedKg !== undefined ? \`\${co2Stats.data.kpis.totalCo2SavedKg} kg\` : '20 kg');`,
  `const co2SavedValue = co2Stats?.co2_saved_kg !== undefined ? \`\${co2Stats.co2_saved_kg} kg\` : (co2Stats?.data?.kpis?.totalCo2SavedKg !== undefined ? \`\${co2Stats.data.kpis.totalCo2SavedKg} kg\` : '—');`
);

// 2. Remove fabricated Total Deposit Held in FranchiseAdminRoleDashboard: '₹,19,000' -> '—'
content = content.replace(
  `{ label: 'Total Deposit Held', val: '₹,19,000'`,
  `{ label: 'Total Deposit Held', val: '—'`
);

// 3. Remove fabricated financial metrics in FinanceAccountsRoleDashboard
content = content.replace(`{ label: 'Total Revenue', val: '₹,128,45,900'`, `{ label: 'Total Revenue', val: '—'`);
content = content.replace(`{ label: 'Monthly Collections', val: '₹,112,40,000'`, `{ label: 'Monthly Collections', val: '—'`);
content = content.replace(`{ label: 'Pending Invoices', val: '₹,11,15,000'`, `{ label: 'Pending Invoices', val: '—'`);
content = content.replace(`{ label: 'Franchise Payouts', val: '₹,18,90,000'`, `{ label: 'Franchise Payouts', val: '—'`);

// 4. Remove fabricated support metrics in SupportExecutiveRoleDashboard
content = content.replace(`{ label: 'Open Support Tickets', val: '14 Open'`, `{ label: 'Open Support Tickets', val: '—'`);
content = content.replace(`{ label: 'Resolved Today', val: '142 Tickets'`, `{ label: 'Resolved Today', val: '—'`);
content = content.replace(`{ label: 'Avg First Response', val: '1.4 min'`, `{ label: 'Avg First Response', val: '—'`);
content = content.replace(`{ label: 'Customer Satisfaction', val: '98.4%'`, `{ label: 'Customer Satisfaction', val: '—'`);
content = content.replace(`{ label: 'Active Reservations', val: '320 Active'`, `{ label: 'Active Reservations', val: '—'`);

// 5. Remove fabricated metrics in MaintenanceTechnicianRoleDashboard
content = content.replace(`{ label: 'In Workshop', val: '14'`, `{ label: 'In Workshop', val: '—'`);
content = content.replace(`{ label: 'Critical IoT Alerts', val: '3'`, `{ label: 'Critical IoT Alerts', val: '—'`);
content = content.replace(`{ label: 'Resolved Today', val: '86'`, `{ label: 'Resolved Today', val: '—'`);
content = content.replace(`{ label: 'Active Sensors', val: '1,280'`, `{ label: 'Active Sensors', val: '—'`);
content = content.replace(`{ label: 'Battery Health', val: '98.2%'`, `{ label: 'Battery Health', val: '—'`);

// 6. Migrate sa-kpi-row-5 to ev-kpi-grid-5
content = content.replace(/className="sa-kpi-row-5"/g, 'className="ev-kpi-grid-5"');

// 7. Standardize KPI card classNames to ev-kpi-card
content = content.replace(/className="sa-kpi-card"/g, 'className="ev-kpi-card"');
content = content.replace(/className="sa-kpi-card-top"/g, 'className="ev-kpi-top"');
content = content.replace(/className="sa-kpi-card-lbl"/g, 'className="ev-kpi-label"');
content = content.replace(/className="sa-kpi-card-ic"/g, 'className="ev-kpi-icon"');
content = content.replace(/className="sa-kpi-card-val"/g, 'className="ev-kpi-val"');
content = content.replace(/className="sa-kpi-card-bot"/g, 'className="ev-kpi-bottom"');
content = content.replace(/className="sa-kpi-card-trend-up"/g, 'className="ev-kpi-trend-up"');
content = content.replace(/className="sa-kpi-card-trend-dn"/g, 'className="ev-kpi-trend-dn"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully cleansed dummy values and upgraded KPI cards to standardized .ev-kpi-* system.');

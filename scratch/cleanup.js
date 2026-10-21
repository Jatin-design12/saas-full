const fs = require('fs');

let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

// We want to remove `.sa-date-box` from the `sa-sub-header` sections across all dashs.
// Also, we need to remove `hideDateFilter={true}` from TopBar so the TopBar handles the dates if needed.

// Remove `hideDateFilter={true}`
content = content.replace(/hideDateFilter=\{true\}/g, '');
// Remove `hideDateFilter={false}`
content = content.replace(/hideDateFilter=\{false\}/g, '');

// Removing the manual sa-date-box chunks. We'll use regex to target the `<div className="sa-date-box">...</div>` or `<div className="sa-date-box"[^>]*>...</div>` blocks inside `sa-sub-right` or wherever they appear as date selectors.

// A regex to match `<div className="sa-date-box" ... >...</div>` that represents the date picker.
// We must be careful because some are buttons `<a ... className="sa-date-box">` (e.g. 'Configure Subscriptions') but those are actually styling bugs (should be `sa-action-pill` or `sa-export-btn`).

const dateBoxRegex = /<div className="sa-date-box"[^>]*>[\s\S]*?<\/div>/g;
content = content.replace(dateBoxRegex, (match) => {
  if (match.includes('span') && (match.includes('May') || match.includes('Today') || match.includes('{dateRangeText}'))) {
    return ''; // Remove it
  }
  return match;
});

// There is one with onClick:
// <div className="sa-date-box" onClick={() => setIsDateMenuOpen(!isDateMenuOpen)} ...
content = content.replace(/<div\s+className="sa-date-box"\s+onClick=\{[^>]*>\s*<span[^>]*>[^<]*<\/span>\s*<svg[^>]*>[\s\S]*?<\/svg>\s*<\/div>/g, '');

// Also remove `isDateMenuOpen` conditionally rendered menu:
// {isDateMenuOpen && ( <div className="sa-date-dropdown"...> ... </div> )}
const dropdownRegex = /\{isDateMenuOpen && \([\s\S]*?<div className="sa-date-dropdown"[\s\S]*?<\/div>\s*\)\}/g;
content = content.replace(dropdownRegex, '');

// Replace specific fabricated data in SuperAdminRoleDashboard
// 1. Total Users
content = content.replace(/val: liveStats \? liveStats\.totalUsers\.toLocaleString\('en-US'\) : '28'/g, 
  "val: liveStats ? liveStats.totalUsers.toLocaleString('en-US') : (isError ? '—' : 'Loading...')");

// 2. Total Franchises
content = content.replace(/val: liveStats \? \(liveStats\.totalFranchises \|\| liveStats\.totalTenants \|\| 3\)\.toString\(\) : '3'/g, 
  "val: liveStats ? (liveStats.totalFranchises || liveStats.totalTenants || 0).toString() : (isError ? '—' : 'Loading...')");

// 3. Active Subscriptions
content = content.replace(/val: liveStats \? liveStats\.activeSubscriptions\.toLocaleString\('en-US'\) : '6'/g, 
  "val: liveStats ? liveStats.activeSubscriptions.toLocaleString('en-US') : (isError ? '—' : 'Loading...')");

// 4. MRR
content = content.replace(/val: liveStats \? liveStats\.mrr : '₹,117,065'/g, 
  "val: liveStats ? liveStats.mrr : (isError ? '—' : 'Loading...')");

// 5. ARR
content = content.replace(/val: liveStats \? liveStats\.arr : '₹,12,04,780'/g, 
  "val: liveStats ? liveStats.arr : (isError ? '—' : 'Loading...')");

// 6. Chart data
content = content.replace(/data: liveStats\?\.revenueOverview\?\.mrrData \|\| \[.*?\]/g, 
  "data: liveStats?.revenueOverview?.mrrData || []");
content = content.replace(/data: liveStats\?\.revenueOverview\?\.arrData \|\| \[.*?\]/g, 
  "data: liveStats?.revenueOverview?.arrData || []");
content = content.replace(/labels: liveStats\?\.revenueOverview\?\.labels \|\| \['01 May', '06 May', '11 May', '16 May', '21 May', '26 May', '31 May'\]/g, 
  "labels: liveStats?.revenueOverview?.labels || []");

// 7. Doughnut
content = content.replace(/data: liveStats \? \[liveStats\.subscriptionStatus\.active, liveStats\.subscriptionStatus\.trial, liveStats\.subscriptionStatus\.pastDue, liveStats\.subscriptionStatus\.canceled\] : \[6543, 1245, 687, 457\]/g, 
  "data: liveStats ? [liveStats.subscriptionStatus.active, liveStats.subscriptionStatus.trial, liveStats.subscriptionStatus.pastDue, liveStats.subscriptionStatus.canceled] : []");
content = content.replace(/liveStats \? liveStats\.subscriptionStatus\.total\.toLocaleString\('en-US'\) : '8,932'/g, 
  "liveStats ? liveStats.subscriptionStatus.total.toLocaleString('en-US') : '—'");

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Cleaned up redundant filters and dummy data in SuperAdminRoleDashboard');

const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

// Use regex to remove from "// Date Filter State" to "useEffect(() => {"
const pattern = /\/\/ Date Filter State[\s\S]*?const fetchZoneStats = async/g;
const replacement = `// Date Filter State
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [dateRangeText, setDateRangeText] = useState<string>('This Month');

    const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3500);
    };

    // Fetch Stats from Backend API
    const fetchZoneStats = async`;

content = content.replace(pattern, replacement);

// Fix TopBar in ZoneManager
const topBarRegex = /<TopBar title="Zone Admin Dashboard"[\s\S]*?\/>/;
content = content.replace(topBarRegex, `<TopBar title="Zone Admin Dashboard" subtitle="Live Zone Monitoring, Battery Swap Cabinets, Fleet Telemetry & Zone Performance" hideZone={false} onDateChange={(s, e, text) => { setStartDate(s); setEndDate(e); setDateRangeText(text); }} />`);

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Fixed ZoneManagerRoleDashboard via regex');

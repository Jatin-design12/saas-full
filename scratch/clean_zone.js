const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/page.tsx', 'utf8');

// The massive date block in ZoneManagerRoleDashboard to remove
const dateLogicBlock = `// Date Filter State
    const [datePreset, setDatePreset] = useState<string>('this_month');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [customStart, setCustomStart] = useState<string>('');
    const [customEnd, setCustomEnd] = useState<string>('');
    const [isDateMenuOpen, setIsDateMenuOpen] = useState<boolean>(false);
    const [dateRangeText, setDateRangeText] = useState<string>('This Month');

    const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3500);
    };

    // Helper date formatting
    const toYMD = (d: Date) => d.toISOString().split('T')[0];
    const toDisplay = (d: Date) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    // Handle Date Presets
    const applyPreset = (preset: string) => {
      const now = new Date();
      let s = '';
      let e = '';
      let text = 'All Time';

      if (preset === 'today') {
        s = toYMD(now);
        e = toYMD(now);
        text = \`Today (\${toDisplay(now)})\`;
      } else if (preset === 'yesterday') {
        const y = new Date(now);
        y.setDate(y.getDate() - 1);
        s = toYMD(y);
        e = toYMD(y);
        text = \`Yesterday (\${toDisplay(y)})\`;
      } else if (preset === 'last_7_days') {
        const past = new Date(now);
        past.setDate(past.getDate() - 7);
        s = toYMD(past);
        e = toYMD(now);
        text = \`\${toDisplay(past)} - \${toDisplay(now)}\`;
      } else if (preset === 'this_month') {
        const first = new Date(now.getFullYear(), now.getMonth(), 1);
        const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        s = toYMD(first);
        e = toYMD(last);
        text = \`\${toDisplay(first)} - \${toDisplay(last)}\`;
      } else if (preset === 'all_time') {
        s = '';
        e = '';
        text = 'All Time (No Date Filter)';
      }

      setDatePreset(preset);
      setStartDate(s);
      setEndDate(e);
      setDateRangeText(text);
      setIsDateMenuOpen(false);
    };

    const applyCustomDates = () => {
      if (!customStart || !customEnd) {
        showToast('Please select both start and end dates');
        return;
      }
      setDatePreset('custom');
      setStartDate(customStart);
      setEndDate(customEnd);
      setDateRangeText(\`\${toDisplay(new Date(customStart))} - \${toDisplay(new Date(customEnd))}\`);
      setIsDateMenuOpen(false);
    };

    // Initialize Default Date: This Month
    useEffect(() => {
      const now = new Date();
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const s = toYMD(first);
      const e = toYMD(last);
      setStartDate(s);
      setEndDate(e);
      setCustomStart(s);
      setCustomEnd(e);
      setDateRangeText(\`\${toDisplay(first)} - \${toDisplay(last)}\`);
    }, []);`;

const newDateLogic = `// Date Filter State
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [dateRangeText, setDateRangeText] = useState<string>('This Month');

    const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3500);
    };`;

content = content.replace(dateLogicBlock, newDateLogic);

// Then attach onDateChange to ZoneManagerRoleDashboard's TopBar
content = content.replace(
  '<TopBar title="Zone Admin Dashboard" subtitle="Live Zone Monitoring, Battery Swap Cabinets, Fleet Telemetry \\n& Zone Performance" hideZone={false}  />',
  '<TopBar title="Zone Admin Dashboard" subtitle="Live Zone Monitoring, Battery Swap Cabinets, Fleet Telemetry & Zone Performance" hideZone={false} onDateChange={(s, e, text) => { setStartDate(s); setEndDate(e); setDateRangeText(text); }} />'
);
content = content.replace(
  '<TopBar title="Zone Admin Dashboard" subtitle="Live Zone Monitoring, Battery Swap Cabinets, Fleet Telemetry & Zone Performance" hideZone={false}  />',
  '<TopBar title="Zone Admin Dashboard" subtitle="Live Zone Monitoring, Battery Swap Cabinets, Fleet Telemetry & Zone Performance" hideZone={false} onDateChange={(s, e, text) => { setStartDate(s); setEndDate(e); setDateRangeText(text); }} />'
);

fs.writeFileSync('frontend/src/app/page.tsx', content, 'utf8');
console.log('Cleaned ZoneManagerRoleDashboard');

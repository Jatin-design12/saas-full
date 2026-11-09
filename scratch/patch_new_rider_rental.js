const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/frontend/src/app/new-rider/rental/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const target1 = `    // Default fallbacks if none configured in zone pricing
    if (pkgs.length === 0) {
      if (selectedModelName === 'Evegah Mink') {
        pkgs = [
          { id: 201, name: 'Daily Pass', duration: 1, price: 250, deposit: 500 },
          { id: 202, name: 'Weekly Pass', duration: 7, price: 1500, deposit: 500 },
          { id: 203, name: 'Monthly Pass', duration: 30, price: 5500, deposit: 1500 }
        ];
      } else if (selectedModelName === 'Evegah Fly') {
        pkgs = [
          { id: 401, name: 'Daily Pass', duration: 1, price: 100, deposit: 0 },
          { id: 402, name: 'Weekly Pass', duration: 7, price: 650, deposit: 0 }
        ];
      } else if (selectedModelName === 'Evegah Pro') {
        pkgs = [
          { id: 301, name: 'Daily Pass', duration: 1, price: 200, deposit: 100 },
          { id: 302, name: 'Weekly Pass', duration: 7, price: 1200, deposit: 100 }
        ];
      } else {
        pkgs = [
          { id: 101, name: 'Daily Pass', duration: 1, price: 350, deposit: 500 },
          { id: 102, name: 'Weekly Pass', duration: 7, price: 1750, deposit: 1000 },
          { id: 103, name: 'Monthly Pass', duration: 30, price: 6500, deposit: 2500 }
        ];
      }
    }`;

// Replace returnTime = startTime
const targetTime = `    setReturnTime(startTime);
  }, [startDate, startTime, selectedPackage]);`;

const newTime = `    const isHourly = selectedPackage.duration_hours || selectedPackage.roundingRule || (selectedPackage.name && selectedPackage.name.toLowerCase().includes('hour'));
    setTotalDays(isHourly ? 1 : duration);

    const baseDate = startDate || new Date().toISOString().split('T')[0];
    const [y, m, d] = baseDate.split('-').map(Number);
    const dropDateObj = new Date(y, m - 1, d);

    if (isHourly) {
      const match = (startTime || '12:00 PM').match(/^(\\d{1,2}):(\\d{2})\\s*(AM|PM)?$/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const min = parseInt(match[2], 10);
        const ampm = match[3] ? match[3].toUpperCase() : 'AM';
        if (ampm === 'PM' && h !== 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;

        const dateWithTime = new Date(y, m - 1, d, h, min);
        dateWithTime.setHours(dateWithTime.getHours() + (Number(selectedPackage.duration_hours) || 1));

        let resH = dateWithTime.getHours();
        const resM = dateWithTime.getMinutes();
        const resAmpm = resH >= 12 ? 'PM' : 'AM';
        resH = resH % 12;
        resH = resH ? resH : 12;
        setReturnTime(\`\${resH}:\${resM < 10 ? '0' + resM : resM} \${resAmpm}\`);
        setReturnDate(dateWithTime.toISOString().split('T')[0]);
      } else {
        setReturnDate(baseDate);
        setReturnTime('08:00 PM');
      }
    } else {
      dropDateObj.setDate(dropDateObj.getDate() + duration);
      setReturnDate(dropDateObj.toISOString().split('T')[0]);
      setReturnTime(selectedZone?.close_time || '08:00 PM');
    }
  }, [startDate, startTime, selectedPackage, selectedZone]);`;

// Check hourlyPricing
const targetHourly = `    // Check modelPackages[selectedModelName]`;
const newHourly = `    // Check hourlyPricing if zone is Hourly Based
    if (zPricing.pricingModel === 'Hourly Based' && Array.isArray(zPricing.hourlyPricing)) {
      const activeHourly = zPricing.hourlyPricing.filter((h: any) => h.status !== false);
      const matchingModelHourly = activeHourly.filter((h: any) => normalizeModel(h.model || '') === selectedModelName);
      const targetHourly = matchingModelHourly.length > 0 ? matchingModelHourly : activeHourly;

      if (targetHourly.length > 0) {
        pkgs = targetHourly.map((h: any, idx: number) => ({
          id: \`hourly_\${idx + 1}\`,
          name: \`\${h.model || selectedModelName} (\${h.roundingRule || 'Per Hour'})\`,
          duration: 1,
          duration_hours: 1,
          price: parseFloat(h.basePrice || 0),
          deposit: parseFloat(h.deposit !== undefined && h.deposit !== null ? h.deposit : 0),
          roundingRule: h.roundingRule
        }));
      }
    }

    // Check modelPackages[selectedModelName]`;

const newFallbacks = `    // Fallbacks if none configured in zone pricing (strictly respect zone deposit or 0)
    const baseDep = parseFloat(zPricing.securityDeposit || 0);
    if (pkgs.length === 0) {
      if (selectedModelName === 'Evegah Mink') {
        pkgs = [
          { id: 201, name: 'Daily Pass', duration: 1, price: 250, deposit: baseDep },
          { id: 202, name: 'Weekly Pass', duration: 7, price: 1500, deposit: baseDep },
          { id: 203, name: 'Monthly Pass', duration: 30, price: 5500, deposit: baseDep }
        ];
      } else if (selectedModelName === 'Evegah Fly') {
        pkgs = [
          { id: 401, name: 'Daily Pass', duration: 1, price: 100, deposit: baseDep },
          { id: 402, name: 'Weekly Pass', duration: 7, price: 650, deposit: baseDep }
        ];
      } else if (selectedModelName === 'Evegah Pro') {
        pkgs = [
          { id: 301, name: 'Daily Pass', duration: 1, price: 200, deposit: baseDep },
          { id: 302, name: 'Weekly Pass', duration: 7, price: 1200, deposit: baseDep }
        ];
      } else {
        pkgs = [
          { id: 101, name: 'Daily Pass', duration: 1, price: 150, deposit: baseDep },
          { id: 102, name: 'Weekly Pass', duration: 7, price: 900, deposit: baseDep },
          { id: 103, name: 'Monthly Pass', duration: 30, price: 3500, deposit: baseDep }
        ];
      }
    }`;

// Normalize line endings for replacement
const normalize = s => s.replace(/\r\n/g, '\n');
content = normalize(content);

if (content.includes(normalize(targetHourly))) {
  content = content.replace(normalize(targetHourly), normalize(newHourly));
}
if (content.includes(normalize(target1))) {
  content = content.replace(normalize(target1), normalize(newFallbacks));
}
if (content.includes(normalize(targetTime))) {
  content = content.replace(normalize(targetTime), normalize(newTime));
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched new-rider/rental/page.tsx');

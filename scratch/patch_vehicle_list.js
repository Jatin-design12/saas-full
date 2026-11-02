const fs = require('fs');
const filePath = 'Rider-app/screens/VehicleListScreen.js';
let content = fs.readFileSync(filePath, 'utf8');

const helpers = `function normalizeModelKey(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/^evegah\\s+/i, '')
    .replace(/^e[\\s_-]+/i, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function modelNamesMatch(a, b) {
  if (!a || !b) return false;
  const cleanA = a.toLowerCase().trim();
  const cleanB = b.toLowerCase().trim();
  if (cleanA === cleanB || cleanA.includes(cleanB) || cleanB.includes(cleanA)) return true;
  const keyA = normalizeModelKey(a);
  const keyB = normalizeModelKey(b);
  if (!keyA || !keyB) return false;
  return keyA === keyB || keyA.includes(keyB) || keyB.includes(keyA);
}

const DEFAULT_MODELS = [`;

content = content.replace('const DEFAULT_MODELS = [', helpers);

// Replace hourly matches
content = content.replace(
  `hourlyList.some((h) => (h.model || '').toLowerCase().trim().includes(mName) || mName.includes((h.model || '').toLowerCase().trim()));`,
  `hourlyList.some((h) => modelNamesMatch(h.model, mName));`
);

// Replace hasAvail in hourly
content = content.replace(
  `const hasAvail = availableModelNames.some((avail) => avail.includes(mName) || mName.includes(avail));`,
  `const hasAvail = availableModelNames.some((avail) => modelNamesMatch(avail, mName));`
);

// Replace modelsToRender in daily/package mode
const oldDailyFilter = `    const modelsToRender = modelsPool.filter((m) => {
      const mName = (m.name || m.evegah_model_name || '').toLowerCase().trim();
      return availableModelNames.some((avail) => avail.includes(mName) || mName.includes(avail));
    });`;

const newDailyFilter = `    const modelsToRender = modelsPool.filter((m) => {
      const mName = (m.name || m.evegah_model_name || '').toLowerCase().trim();
      return availableModelNames.some((avail) => modelNamesMatch(avail, mName));
    });

    // Also synthesize any available model in the zone that might not be in modelsPool
    availableModelNames.forEach((availName) => {
      const alreadyHas = modelsToRender.some((m) => modelNamesMatch(m.name || m.evegah_model_name, availName));
      if (!alreadyHas) {
        const sampleVeh = zoneAvailableVehicles.find((v) =>
          modelNamesMatch(v.evegah_model_name || v.vehicle_model || v.name, availName)
        );
        const displayName = sampleVeh?.evegah_model_name || sampleVeh?.vehicle_model || availName;
        modelsToRender.push({
          id: \`synth_\${availName}\`,
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          category: sampleVeh?.vehicle_category || 'E-Vehicle',
          vehicle_image: sampleVeh?.vehicle_image,
          daily_rate: 249,
          deposit: 1000,
        });
      }
    });`;

content = content.replace(oldDailyFilter.replace(/\n/g, '\r\n'), newDailyFilter.replace(/\n/g, '\r\n'));

// Replace modelPkgs
content = content.replace(
  `return pMod.includes(mKey) || mKey.includes(pMod);`,
  `return modelNamesMatch(pMod, mKey);`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('VehicleListScreen.js updated successfully!');


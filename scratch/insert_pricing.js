const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/zones.js';
let content = fs.readFileSync(filePath, 'utf8');

const target = '// POST /api/zones (Save newly drawn zone)';
const pricingRoute = `// GET /api/zones/pricing?zone=Daman%20SF
router.get('/pricing', async (req, res) => {
  try {
    const { zone, zone_id } = req.query;
    let query = 'SELECT * FROM zones WHERE 1=1';
    const params = [];
    if (zone_id) {
      params.push(zone_id);
      query += ' AND id = $' + params.length;
    } else if (zone) {
      params.push('%' + zone.trim() + '%');
      query += ' AND name ILIKE $' + params.length;
    }
    query += ' LIMIT 1';

    const result = await db.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Zone not found'
      });
    }

    const z = result.rows[0];
    let pricingObj = typeof z.pricing === 'string' ? JSON.parse(z.pricing) : (z.pricing || {});

    let packages = [];
    if (pricingObj.pricingModel === 'Hourly Based' && Array.isArray(pricingObj.hourlyPricing)) {
      packages = pricingObj.hourlyPricing.map((h, idx) => ({
        id: 'hourly_' + (idx + 1),
        name: (h.model || 'Standard') + ' (' + (h.roundingRule || 'Per Hour') + ')',
        duration: 1,
        duration_days: 1,
        duration_hours: 1,
        price: parseFloat(h.basePrice || 0),
        base_fare: parseFloat(h.basePrice || 0),
        deposit: parseFloat(h.deposit !== undefined && h.deposit !== null ? h.deposit : 0),
        deposit_amount: parseFloat(h.deposit !== undefined && h.deposit !== null ? h.deposit : 0),
        model: h.model,
        roundingRule: h.roundingRule
      }));
    } else if (Array.isArray(pricingObj.packages)) {
      packages = pricingObj.packages.map((p, idx) => ({
        id: p.id || 'pkg_' + (idx + 1),
        name: p.name || p.title || 'Standard Plan',
        duration: parseInt(p.duration || p.duration_days || 1, 10),
        duration_days: parseInt(p.duration || p.duration_days || 1, 10),
        duration_hours: parseInt(p.duration || p.duration_days || 1, 10) * 24,
        price: parseFloat(p.price || p.base_fare || 0),
        base_fare: parseFloat(p.price || p.base_fare || 0),
        deposit: parseFloat(p.deposit !== undefined && p.deposit !== null ? p.deposit : (pricingObj.securityDeposit || 0)),
        deposit_amount: parseFloat(p.deposit !== undefined && p.deposit !== null ? p.deposit : (pricingObj.securityDeposit || 0))
      }));
    }

    const defaultDeposit = packages.length > 0 ? packages[0].deposit_amount : parseFloat(pricingObj.securityDeposit || 0);

    res.json({
      status: 'success',
      data: {
        zone_id: z.id,
        zone_name: z.name,
        pricing_model: pricingObj.pricingModel,
        hourlyPricing: pricingObj.hourlyPricing || [],
        packages: packages,
        security_deposit: defaultDeposit
      }
    });
  } catch (err) {
    console.error('Error fetching zone pricing:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

`;

if (!content.includes('/pricing')) {
  content = content.replace(target, pricingRoute + target);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully inserted /pricing route into zones.js');
} else {
  console.log('Already contains /pricing');
}

const express = require('express');
const router = express.Router();
const db = require('../db');
const { getCache, setCache, delByPattern } = require('../redis');
const XLSX = require('xlsx');

// ============================================================
// VEHICLE MODELS TABLE
// ============================================================

const initVehicleModelsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS vehicle_models (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        category VARCHAR(50) DEFAULT 'E-Vehicle',
        tagline VARCHAR(255) DEFAULT 'Stylish. Powerful. Eco-friendly.',
        rating DECIMAL(3, 1) DEFAULT 4.6,
        reviews_count INT DEFAULT 128,
        description TEXT,
        range VARCHAR(50) DEFAULT '90–110 km',
        top_speed VARCHAR(50) DEFAULT '60 km/h',
        battery_capacity VARCHAR(50) DEFAULT '2.3 kWh',
        brakes VARCHAR(100) DEFAULT 'Disc Brakes (Front & Rear)',
        motor_power VARCHAR(50) DEFAULT '2500 W',
        battery_type VARCHAR(50) DEFAULT 'Lithium-ion',
        wheel_size VARCHAR(50) DEFAULT '12 inch',
        water_resistance VARCHAR(50) DEFAULT 'IP67',
        charging_time VARCHAR(50) DEFAULT '4 – 5 Hours',
        load_capacity VARCHAR(50) DEFAULT '150 kg',
        warranty VARCHAR(50) DEFAULT '1 Year Warranty',
        main_image TEXT,
        gallery_images JSONB,
        video_url TEXT,
        features JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE vehicle_models ALTER COLUMN main_image TYPE TEXT;
      ALTER TABLE vehicle_models ALTER COLUMN video_url TYPE TEXT;
    `);

    // Seed default models only when the table is empty.
    const check = await db.query(
      'SELECT COUNT(*) FROM vehicle_models'
    );

    if (parseInt(check.rows[0].count, 10) === 0) {
      await db.query(`
        INSERT INTO vehicle_models (
          name,
          category,
          tagline,
          rating,
          reviews_count,
          description,
          range,
          top_speed,
          battery_capacity,
          brakes,
          motor_power,
          battery_type,
          wheel_size,
          water_resistance,
          charging_time,
          load_capacity,
          warranty,
          main_image,
          gallery_images,
          video_url,
          features
        )
        VALUES

        (
          'Evegah City',
          'E-Vehicle',
          'Stylish. Powerful. Eco-friendly.',
          4.6,
          128,
          'Evegah City is built for the modern commuter. It combines performance, comfort and style with zero emissions. Perfect for daily rides in the city.',
          '90–110 km',
          '60 km/h',
          '2.3 kWh',
          'Disc Brakes (Front & Rear)',
          '2500 W',
          'Lithium-ion',
          '12 inch',
          'IP67',
          '4 – 5 Hours',
          '150 kg',
          '1 Year Warranty',
          'assets/city.png',
          '[
            "assets/city.png",
            "assets/ev_baroda.png",
            "assets/mink_banner.png",
            "assets/Pro_Banner.png"
          ]'::jsonb,
          'assets/ev_video.mp4',
          '[
            {
              "icon": "eco",
              "title": "Eco Friendly",
              "subtitle": "Zero Emission"
            },
            {
              "icon": "rupee",
              "title": "Low Running Cost",
              "subtitle": "Save more daily"
            },
            {
              "icon": "bolt",
              "title": "Quick Charge",
              "subtitle": "4–5 Hours"
            },
            {
              "icon": "display",
              "title": "Smart Display",
              "subtitle": "Digital Console"
            },
            {
              "icon": "seat",
              "title": "Comfortable Seat",
              "subtitle": "Long ride comfort"
            },
            {
              "icon": "light",
              "title": "LED Lights",
              "subtitle": "Bright & Clear"
            },
            {
              "icon": "tyre",
              "title": "Tubeless Tyres",
              "subtitle": "Better Grip"
            },
            {
              "icon": "shield",
              "title": "Warranty",
              "subtitle": "1 Year Warranty"
            }
          ]'::jsonb
        ),

        (
          'Evegah Pro',
          'E-Scooter',
          'High Speed Performance EV Scooter.',
          4.8,
          215,
          'Evegah Pro delivers ultimate power and range for highway and long-distance commuting with ultra-fast charging capability.',
          '110–130 km',
          '75 km/h',
          '3.1 kWh',
          'CBS Brakes (Front & Rear)',
          '3200 W',
          'Advanced LiFePO4',
          '12 inch',
          'IP68',
          '3 – 4 Hours',
          '180 kg',
          '2 Years Warranty',
          'assets/Pro_Banner.png',
          '[
            "assets/Pro_Banner.png",
            "assets/fleet_bg_pro.jpg",
            "assets/city.png"
          ]'::jsonb,
          'assets/ev_video.mp4',
          '[
            {
              "icon": "bolt",
              "title": "High Torque Motor",
              "subtitle": "3200W Output"
            },
            {
              "icon": "battery",
              "title": "Ultra Fast Charge",
              "subtitle": "3-4 Hours"
            },
            {
              "icon": "shield",
              "title": "CBS Braking",
              "subtitle": "Dual Disc Safety"
            },
            {
              "icon": "display",
              "title": "Smart TFT Console",
              "subtitle": "GPS & Bluetooth"
            }
          ]'::jsonb
        ),

        (
          'Evegah Fly',
          'E-Moped',
          'Lightweight & Agile City Moped.',
          4.5,
          94,
          'Evegah Fly is engineered for effortless maneuverability, lightweight riding, and instant swappable battery support.',
          '40–60 km',
          '25 km/h',
          '1.2 kWh',
          'Front Disc & Rear Drum',
          '1200 W',
          'Swappable Li-ion',
          '10 inch',
          'IP65',
          '2.5 – 3 Hours',
          '120 kg',
          '1 Year Warranty',
          'assets/fly-1.png',
          '[
            "assets/fly-1.png",
            "assets/fleet_bg_cycle.jpg",
            "assets/city-white.png"
          ]'::jsonb,
          'assets/ev_video.mp4',
          '[
            {
              "icon": "feather",
              "title": "Ultra Lightweight",
              "subtitle": "Easy Handling"
            },
            {
              "icon": "battery",
              "title": "Swappable Battery",
              "subtitle": "Instant Swap"
            },
            {
              "icon": "eco",
              "title": "Zero Maintenance",
              "subtitle": "Brushless Motor"
            }
          ]'::jsonb
        ),

        (
          'Evegah Mink',
          'E-Cargo',
          'Heavy-Duty Cargo & Delivery EV.',
          4.7,
          156,
          'Evegah Mink is built for commercial delivery and cargo transport with high load capacity and reinforced steel chassis.',
          '70–90 km',
          '45 km/h',
          '2.0 kWh',
          'Dual Heavy Disc Brakes',
          '2000 W',
          'High-Capacity Li-ion',
          '12 inch',
          'IP67',
          '4 Hours',
          '220 kg',
          '2 Years Warranty',
          'assets/mink.png',
          '[
            "assets/mink.png",
            "assets/mink_banner.png",
            "assets/MINK.png"
          ]'::jsonb,
          'assets/ev_video.mp4',
          '[
            {
              "icon": "box",
              "title": "Heavy Cargo Deck",
              "subtitle": "Up to 220kg"
            },
            {
              "icon": "shield",
              "title": "Steel Reinforced",
              "subtitle": "Heavy Duty Frame"
            },
            {
              "icon": "battery",
              "title": "Dual Battery Bay",
              "subtitle": "Double Range"
            }
          ]'::jsonb
        );
      `);
    } else {
      // Clean up legacy image paths.
      await db.query(`
        UPDATE vehicle_models
        SET main_image = 'assets/city.png'
        WHERE (
          main_image IS NULL
          OR main_image = ''
          OR main_image = 'assets/City-1.png'
          OR main_image = '/assets/City-1.png'
        )
        AND LOWER(name) LIKE '%city%';

        UPDATE vehicle_models
        SET main_image = 'assets/Pro_Banner.png'
        WHERE (
          main_image = 'assets/Pro Banner.png'
          OR main_image = '/assets/Pro Banner.png'
        )
        AND LOWER(name) LIKE '%pro%';

        UPDATE vehicle_models
        SET main_image = 'assets/fly-1.png'
        WHERE (
          main_image = 'assets/Fly.png'
          OR main_image = '/assets/Fly.png'
        )
        AND LOWER(name) LIKE '%fly%';
      `);
    }
  } catch (err) {
    console.error(
      'Error initializing vehicle_models table:',
      err
    );
  }
};

initVehicleModelsTable();

// ============================================================
// DOWNLOAD SAMPLE READY EXCEL TEMPLATE FOR VEHICLES
// GET /api/vehicles/sample-excel
// ============================================================
router.get('/sample-excel', (req, res) => {
  try {
    const sampleVehicles = [
      {
        'Vehicle Code *': 'EVG-CT-001',
        'Model Name *': 'Evegah City 2.0',
        'Category': 'E-Scooter',
        'Vehicle Type': 'Rental',
        'Registration Number': 'GJ06-EV-2001',
        'Chassis Number': 'CHS90192841',
        'Motor Number': 'MTR440192',
        'Controller Number': 'CTL102938',
        'Color': 'Pearl White',
        'Zone': 'Gotri Zone',
        'Vehicle Status': 'Available',
        'Battery Pct': 100,
        'Current KM': 0,
        'Total KM': 0,
        'Manufacturer': 'Evegah Motors',
        'Purchase Date (YYYY-MM-DD)': '2026-01-10',
        'Warranty Expiry (YYYY-MM-DD)': '2027-01-10',
        'Insurance Policy Number': 'POL-8819201',
        'Insurance Provider': 'HDFC ERGO',
        'Insurance Expiry (YYYY-MM-DD)': '2027-01-10',
      },
      {
        'Vehicle Code *': 'EVG-CT-002',
        'Model Name *': 'Evegah City 2.0',
        'Category': 'E-Scooter',
        'Vehicle Type': 'Rental',
        'Registration Number': 'GJ06-EV-2002',
        'Chassis Number': 'CHS90192842',
        'Motor Number': 'MTR440193',
        'Controller Number': 'CTL102939',
        'Color': 'Jet Black',
        'Zone': 'Manjalpur Zone',
        'Vehicle Status': 'Available',
        'Battery Pct': 95,
        'Current KM': 15,
        'Total KM': 15,
        'Manufacturer': 'Evegah Motors',
        'Purchase Date (YYYY-MM-DD)': '2026-01-10',
        'Warranty Expiry (YYYY-MM-DD)': '2027-01-10',
        'Insurance Policy Number': 'POL-8819202',
        'Insurance Provider': 'ICICI Lombard',
        'Insurance Expiry (YYYY-MM-DD)': '2027-01-10',
      },
      {
        'Vehicle Code *': 'EVG-PR-001',
        'Model Name *': 'Evegah Pro Max',
        'Category': 'E-Bike',
        'Vehicle Type': 'Commercial',
        'Registration Number': 'GJ06-EV-3001',
        'Chassis Number': 'CHS90192843',
        'Motor Number': 'MTR440194',
        'Controller Number': 'CTL102940',
        'Color': 'Flame Red',
        'Zone': 'KPGU Zone',
        'Vehicle Status': 'Available',
        'Battery Pct': 98,
        'Current KM': 5,
        'Total KM': 5,
        'Manufacturer': 'Evegah Motors',
        'Purchase Date (YYYY-MM-DD)': '2026-02-01',
        'Warranty Expiry (YYYY-MM-DD)': '2027-02-01',
        'Insurance Policy Number': 'POL-8819203',
        'Insurance Provider': 'Bajaj Allianz',
        'Insurance Expiry (YYYY-MM-DD)': '2027-02-01',
      },
    ];

    const guideRows = [
      { 'Field Name': 'Vehicle Code *', 'Required': 'YES', 'Description': 'Unique identifier for the vehicle (e.g. EVG-CT-001)', 'Sample / Allowed Values': 'EVG-CT-001' },
      { 'Field Name': 'Model Name *', 'Required': 'YES', 'Description': 'Model name of the vehicle', 'Sample / Allowed Values': 'Evegah City 2.0, Evegah Pro, Evegah Fly' },
      { 'Field Name': 'Category', 'Required': 'NO', 'Description': 'Category of EV', 'Sample / Allowed Values': 'E-Scooter, E-Bike, E-Loader' },
      { 'Field Name': 'Vehicle Type', 'Required': 'NO', 'Description': 'Usage classification', 'Sample / Allowed Values': 'Rental, Commercial, Delivery' },
      { 'Field Name': 'Registration Number', 'Required': 'NO', 'Description': 'RTO vehicle registration plate number', 'Sample / Allowed Values': 'GJ06-EV-2001' },
      { 'Field Name': 'Chassis Number', 'Required': 'NO', 'Description': 'Chassis / VIN number', 'Sample / Allowed Values': 'CHS90192841' },
      { 'Field Name': 'Motor Number', 'Required': 'NO', 'Description': 'Motor serial number', 'Sample / Allowed Values': 'MTR440192' },
      { 'Field Name': 'Controller Number', 'Required': 'NO', 'Description': 'Controller serial number', 'Sample / Allowed Values': 'CTL102938' },
      { 'Field Name': 'Color', 'Required': 'NO', 'Description': 'Vehicle color', 'Sample / Allowed Values': 'Pearl White, Jet Black, Ocean Blue' },
      { 'Field Name': 'Zone', 'Required': 'NO', 'Description': 'Operating station / zone', 'Sample / Allowed Values': 'Gotri Zone, Manjalpur Zone, KPGU Zone, Aatapi Zone, Moti Daman Zone' },
      { 'Field Name': 'Vehicle Status', 'Required': 'NO', 'Description': 'Initial operational status', 'Sample / Allowed Values': 'Available, In Ride, Maintenance, Offline' },
      { 'Field Name': 'Battery Pct', 'Required': 'NO', 'Description': 'Initial battery percentage (0-100)', 'Sample / Allowed Values': '100' },
      { 'Field Name': 'Current KM', 'Required': 'NO', 'Description': 'Odometer current reading', 'Sample / Allowed Values': '0' },
      { 'Field Name': 'Total KM', 'Required': 'NO', 'Description': 'Total accumulated km', 'Sample / Allowed Values': '0' },
      { 'Field Name': 'Manufacturer', 'Required': 'NO', 'Description': 'Vehicle manufacturing company', 'Sample / Allowed Values': 'Evegah Motors' },
      { 'Field Name': 'Purchase Date', 'Required': 'NO', 'Description': 'Format: YYYY-MM-DD', 'Sample / Allowed Values': '2026-01-10' },
      { 'Field Name': 'Warranty Expiry', 'Required': 'NO', 'Description': 'Format: YYYY-MM-DD', 'Sample / Allowed Values': '2027-01-10' },
      { 'Field Name': 'Insurance Policy Number', 'Required': 'NO', 'Description': 'Insurance policy document id', 'Sample / Allowed Values': 'POL-8819201' },
      { 'Field Name': 'Insurance Provider', 'Required': 'NO', 'Description': 'Insurance company name', 'Sample / Allowed Values': 'HDFC ERGO, ICICI Lombard' },
      { 'Field Name': 'Insurance Expiry', 'Required': 'NO', 'Description': 'Format: YYYY-MM-DD', 'Sample / Allowed Values': '2027-01-10' },
    ];

    const wb = XLSX.utils.book_new();
    const wsTemplate = XLSX.utils.json_to_sheet(sampleVehicles);
    wsTemplate['!cols'] = [
      { wch: 18 }, { wch: 20 }, { wch: 14 }, { wch: 14 }, { wch: 22 },
      { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 14 }, { wch: 18 },
      { wch: 16 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 18 },
      { wch: 25 }, { wch: 25 }, { wch: 24 }, { wch: 18 }, { wch: 25 },
    ];

    const wsGuide = XLSX.utils.json_to_sheet(guideRows);
    wsGuide['!cols'] = [{ wch: 24 }, { wch: 10 }, { wch: 45 }, { wch: 35 }];

    XLSX.utils.book_append_sheet(wb, wsTemplate, 'Vehicles_Template');
    XLSX.utils.book_append_sheet(wb, wsGuide, 'Instructions & Reference');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="Evegah_Vehicles_Bulk_Import_Template.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buf);
  } catch (err) {
    console.error('Error generating vehicle sample excel:', err);
    return res.status(500).json({ error: 'Failed to generate vehicle sample excel' });
  }
});

// ============================================================
// BULK IMPORT VEHICLES
// POST /api/vehicles/bulk-import
// ============================================================
router.post('/bulk-import', async (req, res) => {
  try {
    const { vehicles } = req.body || {};
    if (!Array.isArray(vehicles) || vehicles.length === 0) {
      return res.status(400).json({ status: 'error', message: 'No vehicles provided for bulk import' });
    }

    let inserted = 0;
    let updated = 0;
    const errors = [];

    for (let i = 0; i < vehicles.length; i++) {
      const v = vehicles[i];
      const code = String(
        v.code ||
        v['Vehicle Code *'] ||
        v['Vehicle Code'] ||
        v['vehicle_code'] ||
        ''
      ).trim();

      if (!code) {
        errors.push({ row: i + 1, error: 'Missing Vehicle Code' });
        continue;
      }

      const modelName = String(v.evegah_model_name || v['Model Name *'] || v['Model Name'] || v['model_name'] || 'Evegah City').trim();
      const category = String(v.vehicle_category || v['Category'] || v['category'] || 'E-Scooter').trim();
      const vehicleType = String(v.vehicle_type || v['Vehicle Type'] || v['vehicle_type'] || 'Rental').trim();
      const regNo = String(v.registration_number || v['Registration Number'] || v['registration_number'] || '').trim();
      const chassisNo = String(v.chassis_number || v['Chassis Number'] || v['chassis_number'] || '').trim();
      const motorNo = String(v.motor_number || v['Motor Number'] || v['motor_number'] || '').trim();
      const ctlNo = String(v.controller_number || v['Controller Number'] || v['controller_number'] || '').trim();
      const color = String(v.color || v['Color'] || v['color'] || 'White').trim();
      const zone = String(v.zone || v['Zone'] || v['zone'] || 'Gotri Zone').trim();
      const status = String(v.vehicle_status || v['Vehicle Status'] || v['vehicle_status'] || v['status'] || 'Available').trim();
      const batteryPct = parseInt(v.battery_pct ?? v['Battery Pct'] ?? v['battery_pct'] ?? 100, 10) || 100;
      const currentKm = parseFloat(v.current_km_reading ?? v['Current KM'] ?? v['current_km'] ?? 0) || 0;
      const totalKm = parseFloat(v.total_km_covered ?? v['Total KM'] ?? v['total_km'] ?? currentKm) || currentKm;
      const manufacturer = String(v.vehicle_manufacturer || v['Manufacturer'] || v['manufacturer'] || 'Evegah Motors').trim();
      const purchaseDate = v.purchase_date || v['Purchase Date (YYYY-MM-DD)'] || v['Purchase Date'] || null;
      const warrantyDate = v.vehicle_warranty_expiry_date || v['Warranty Expiry (YYYY-MM-DD)'] || v['Warranty Expiry'] || null;
      const insPolicy = String(v.insurance_policy_number || v['Insurance Policy Number'] || v['insurance_policy'] || '').trim();
      const insProvider = String(v.insurance_provider || v['Insurance Provider'] || v['insurance_provider'] || '').trim();
      const insExpiry = v.insurance_expiry_date || v['Insurance Expiry (YYYY-MM-DD)'] || v['Insurance Expiry'] || null;

      try {
        const check = await db.query('SELECT id FROM vehicles WHERE code = $1', [code]);
        if (check.rows.length > 0) {
          await db.query(`
            UPDATE vehicles SET
              evegah_model_name = $1,
              vehicle_category = $2,
              vehicle_type = $3,
              registration_number = $4,
              chassis_number = $5,
              motor_number = $6,
              controller_number = $7,
              color = $8,
              zone = $9,
              vehicle_status = $10,
              battery_pct = $11,
              current_km_reading = $12,
              total_km_covered = $13,
              vehicle_manufacturer = $14,
              purchase_date = COALESCE($15, purchase_date),
              vehicle_warranty_expiry_date = COALESCE($16, vehicle_warranty_expiry_date),
              insurance_policy_number = COALESCE($17, insurance_policy_number),
              insurance_provider = COALESCE($18, insurance_provider),
              insurance_expiry_date = COALESCE($19, insurance_expiry_date)
            WHERE code = $20
          `, [
            modelName, category, vehicleType, regNo, chassisNo, motorNo, ctlNo, color, zone,
            status, batteryPct, currentKm, totalKm, manufacturer,
            purchaseDate || null, warrantyDate || null, insPolicy || null, insProvider || null, insExpiry || null,
            code
          ]);
          updated++;
        } else {
          await db.query(`
            INSERT INTO vehicles (
              code, evegah_model_name, vehicle_category, vehicle_type,
              registration_number, chassis_number, motor_number, controller_number,
              color, zone, vehicle_status, battery_pct,
              current_km_reading, total_km_covered, vehicle_manufacturer,
              purchase_date, vehicle_warranty_expiry_date,
              insurance_policy_number, insurance_provider, insurance_expiry_date,
              status, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW())
          `, [
            code, modelName, category, vehicleType,
            regNo, chassisNo, motorNo, ctlNo,
            color, zone, status, batteryPct,
            currentKm, totalKm, manufacturer,
            purchaseDate || null, warrantyDate || null,
            insPolicy || null, insProvider || null, insExpiry || null,
            status
          ]);
          inserted++;
        }
      } catch (rowErr) {
        errors.push({ code, error: rowErr.message });
      }
    }

    try {
      await delByPattern('vehicles:*');
    } catch (e) {}

    return res.json({
      status: 'success',
      message: `Bulk import completed: ${inserted} added, ${updated} updated`,
      inserted,
      updated,
      total: vehicles.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error('Bulk import vehicles error:', err);
    return res.status(500).json({ status: 'error', message: err.message });
  }
});

// ============================================================
// GET ALL VEHICLE MODELS
// GET /api/vehicles/models
// ============================================================

router.get('/models', async (req, res) => {
  const cacheKey = 'vehicles:models:list';
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    const result = await db.query(
      'SELECT * FROM vehicle_models ORDER BY name ASC'
    );

    const payload = {
      status: 'success',
      data: result.rows
    };
    await setCache(cacheKey, payload, 120);
    return res.json(payload);
  } catch (err) {
    console.error(
      'Failed to fetch vehicle models:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch vehicle models',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// GET SPECIFIC VEHICLE MODEL
// GET /api/vehicles/models/:modelName
// ============================================================

router.get('/models/:modelName', async (req, res) => {
  const { modelName } = req.params;

  try {
    const result = await db.query(
      `
      SELECT *
      FROM vehicle_models
      WHERE LOWER(name) = LOWER($1)
         OR LOWER(name) LIKE LOWER($2)
      ORDER BY name ASC
      LIMIT 1
      `,
      [
        modelName,
        `%${modelName}%`
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle model not found'
      });
    }

    return res.json({
      status: 'success',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(
      'Failed to fetch vehicle model details:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch vehicle model details',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// CREATE / UPDATE VEHICLE MODEL
// POST /api/vehicles/models
// ============================================================

router.post('/models', async (req, res) => {
  const {
    name,
    category,
    tagline,
    rating,
    reviewsCount,
    description,
    range,
    topSpeed,
    batteryCapacity,
    brakes,
    motorPower,
    batteryType,
    wheelSize,
    waterResistance,
    chargingTime,
    loadCapacity,
    warranty,
    mainImage,
    galleryImages,
    videoUrl,
    features
  } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'Model name is required'
    });
  }

  try {
    const result = await db.query(
      `
      INSERT INTO vehicle_models (
        name,
        category,
        tagline,
        rating,
        reviews_count,
        description,
        range,
        top_speed,
        battery_capacity,
        brakes,
        motor_power,
        battery_type,
        wheel_size,
        water_resistance,
        charging_time,
        load_capacity,
        warranty,
        main_image,
        gallery_images,
        video_url,
        features,
        updated_at
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19::jsonb,
        $20,
        $21::jsonb,
        NOW()
      )
      ON CONFLICT (name)
      DO UPDATE SET
        category = EXCLUDED.category,
        tagline = EXCLUDED.tagline,
        rating = EXCLUDED.rating,
        reviews_count = EXCLUDED.reviews_count,
        description = EXCLUDED.description,
        range = EXCLUDED.range,
        top_speed = EXCLUDED.top_speed,
        battery_capacity = EXCLUDED.battery_capacity,
        brakes = EXCLUDED.brakes,
        motor_power = EXCLUDED.motor_power,
        battery_type = EXCLUDED.battery_type,
        wheel_size = EXCLUDED.wheel_size,
        water_resistance = EXCLUDED.water_resistance,
        charging_time = EXCLUDED.charging_time,
        load_capacity = EXCLUDED.load_capacity,
        warranty = EXCLUDED.warranty,
        main_image = COALESCE(
          EXCLUDED.main_image,
          vehicle_models.main_image
        ),
        gallery_images = COALESCE(
          EXCLUDED.gallery_images,
          vehicle_models.gallery_images
        ),
        video_url = COALESCE(
          EXCLUDED.video_url,
          vehicle_models.video_url
        ),
        features = COALESCE(
          EXCLUDED.features,
          vehicle_models.features
        ),
        updated_at = NOW()
      RETURNING *
      `,
      [
        String(name).trim(),
        category || 'E-Vehicle',
        tagline || 'Stylish. Powerful. Eco-friendly.',
        rating !== undefined && rating !== null
          ? parseFloat(rating)
          : 4.6,
        reviewsCount !== undefined &&
        reviewsCount !== null
          ? parseInt(reviewsCount, 10)
          : 128,
        description || '',
        range || '90–110 km',
        topSpeed || '60 km/h',
        batteryCapacity || '2.3 kWh',
        brakes || 'Disc Brakes (Front & Rear)',
        motorPower || '2500 W',
        batteryType || 'Lithium-ion',
        wheelSize || '12 inch',
        waterResistance || 'IP67',
        chargingTime || '4 – 5 Hours',
        loadCapacity || '150 kg',
        warranty || '1 Year Warranty',
        mainImage || null,
        JSON.stringify(
          Array.isArray(galleryImages)
            ? galleryImages
            : []
        ),
        videoUrl || null,
        features
          ? JSON.stringify(features)
          : null
      ]
    );

    await delByPattern('vehicles:*');
    return res.json({
      status: 'success',
      message: 'Vehicle model saved successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(
      'Failed to save vehicle model:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to save vehicle model',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// DELETE VEHICLE MODEL BY ID
// DELETE /api/vehicles/models/:id
// ============================================================

router.delete('/models/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await delByPattern('vehicles:*');
    const result = await db.query(
      `
      DELETE FROM vehicle_models
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle model not found'
      });
    }

    return res.json({
      status: 'success',
      message: 'Vehicle model deleted successfully'
    });
  } catch (err) {
    console.error(
      'Failed to delete vehicle model:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete vehicle model',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// DELETE VEHICLE MODEL BY NAME
// DELETE /api/vehicles/models/by-name/:name
// ============================================================

router.delete(
  '/models/by-name/:name',
  async (req, res) => {
    const { name } = req.params;

    try {
      await delByPattern('vehicles:*');
      const result = await db.query(
        `
        DELETE FROM vehicle_models
        WHERE LOWER(name) = LOWER($1)
        RETURNING *
        `,
        [name]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'error',
          message: 'Vehicle model not found'
        });
      }

      return res.json({
        status: 'success',
        message: 'Vehicle model deleted successfully'
      });
    } catch (err) {
      console.error(
        'Failed to delete vehicle model by name:',
        err
      );

      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete vehicle model',
        error:
          process.env.NODE_ENV === 'development'
            ? err.message
            : undefined
      });
    }
  }
);

// ============================================================
// GET ALL VEHICLES
// GET /api/vehicles
//
// IMPORTANT:
// This route is DATABASE ONLY.
// There is NO MOCK_VEHICLES fallback.
// ============================================================

router.get('/', async (req, res) => {
  const {
    zone,
    model,
    status
  } = req.query;

  const cacheKey = `vehicles:list:${zone || 'all'}:${model || 'all'}:${status || 'all'}`;
  const cached = await getCache(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    let query = `
      SELECT 
        v.*,
        COALESCE(ar.rider_name, 'None (Available)') AS renter_name,
        CASE 
          WHEN v.vehicle_status IN ('Maintenance', 'Offline') THEN v.vehicle_status
          WHEN ar.rider_name IS NOT NULL THEN 'In Ride'
          ELSE 'Available'
        END AS vehicle_status
      FROM vehicles v
      LEFT JOIN LATERAL (
        SELECT 
          customer_name AS rider_name,
          mobile,
          status
        FROM (
          SELECT customer_name, mobile, status, vehicle_number, created_at
          FROM reservations
          WHERE status IN ('Ongoing', 'Active Ride', 'In Ride')
            AND (vehicle_number = v.code OR vehicle_number = v.registration_number)
          UNION ALL
          SELECT rider_name AS customer_name, mobile, status, vehicle_id AS vehicle_number, created_at
          FROM renters ren
          WHERE ren.status IN ('Active Ride', 'Ongoing', 'Retain Ride')
            AND (ren.vehicle_id = v.code OR ren.vehicle_id = v.registration_number)
            AND NOT EXISTS (
              SELECT 1 FROM reservations past_res
              WHERE (past_res.vehicle_number = v.code OR past_res.vehicle_number = v.registration_number)
                AND past_res.status IN ('Completed', 'Cancelled')
                AND past_res.returned_at IS NOT NULL
                AND past_res.returned_at >= ren.created_at
            )
        ) active_rides
        ORDER BY created_at DESC NULLS LAST
        LIMIT 1
      ) ar ON true
      WHERE 1 = 1
    `;

    const params = [];
    let paramIndex = 1;

    // Zone filter
    if (zone && String(zone).trim() && String(zone).trim().toLowerCase() !== 'all zones') {
      query += `
        AND v.zone ILIKE $${paramIndex}
      `;

      params.push(
        `%${String(zone).trim()}%`
      );

      paramIndex++;
    }

    // Model filter
    if (model && String(model).trim()) {
      query += `
        AND (
          v.evegah_model_name ILIKE $${paramIndex}
          OR v.vehicle_model ILIKE $${paramIndex}
        )
      `;

      params.push(
        `%${String(model).trim()}%`
      );

      paramIndex++;
    }

    // Status filter
    if (status && String(status).trim()) {
      if (String(status).trim().toLowerCase() === 'available') {
        query += `
          AND ar.rider_name IS NULL
          AND v.vehicle_status NOT IN ('Maintenance', 'Offline')
        `;
      } else if (String(status).trim().toLowerCase() === 'in ride') {
        query += `
          AND ar.rider_name IS NOT NULL
        `;
      } else {
        query += `
          AND LOWER(COALESCE(v.vehicle_status, '')) = LOWER($${paramIndex})
        `;

        params.push(
          String(status).trim()
        );

        paramIndex++;
      }
    }

    query += `
      ORDER BY v.code ASC
    `;

    const result = await db.query(
      query,
      params
    );

    const payload = {
      status: 'success',
      data: result.rows,
      count: result.rows.length
    };
    await setCache(cacheKey, payload, 60);
    return res.json(payload);
  } catch (err) {
    console.error(
      'Failed to get vehicles:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch vehicles from database',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// GET VEHICLE BY CODE
// GET /api/vehicles/:code
// ============================================================

router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const result = await db.query(
      `
      SELECT 
        v.*,
        COALESCE(ar.rider_name, 'None (Available)') AS renter_name,
        CASE 
          WHEN v.vehicle_status IN ('Maintenance', 'Offline') THEN v.vehicle_status
          WHEN ar.rider_name IS NOT NULL THEN 'In Ride'
          ELSE 'Available'
        END AS vehicle_status
      FROM vehicles v
      LEFT JOIN LATERAL (
        SELECT 
          customer_name AS rider_name,
          mobile,
          status
        FROM (
          SELECT customer_name, mobile, status, vehicle_number, created_at
          FROM reservations
          WHERE status IN ('Ongoing', 'Active Ride', 'In Ride')
            AND (vehicle_number = v.code OR vehicle_number = v.registration_number)
          UNION ALL
          SELECT rider_name AS customer_name, mobile, status, vehicle_id AS vehicle_number, created_at
          FROM renters ren
          WHERE ren.status IN ('Active Ride', 'Ongoing', 'Retain Ride')
            AND (ren.vehicle_id = v.code OR ren.vehicle_id = v.registration_number)
            AND NOT EXISTS (
              SELECT 1 FROM reservations past_res
              WHERE (past_res.vehicle_number = v.code OR past_res.vehicle_number = v.registration_number)
                AND past_res.status IN ('Completed', 'Cancelled')
                AND past_res.returned_at IS NOT NULL
                AND past_res.returned_at >= ren.created_at
            )
        ) active_rides
        ORDER BY created_at DESC NULLS LAST
        LIMIT 1
      ) ar ON true
      WHERE v.code = $1 OR v.registration_number = $1
      LIMIT 1
      `,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }

    const vehicle = result.rows[0];

    // Query active ride / renter info for this vehicle
    let activeRide = null;
    let rideHistory = [];
    try {
      const renterRes = await db.query(`
        SELECT * FROM renters 
        WHERE vehicle_id = $1 OR vehicle_id = $2
        ORDER BY id DESC LIMIT 10
      `, [vehicle.code, vehicle.registration_number || vehicle.code]);

      rideHistory = renterRes.rows;
      activeRide = renterRes.rows.find(r => ['Active Ride', 'Active', 'Ongoing', 'Retain Ride'].includes(r.status)) || null;
    } catch (e) {}

    // Query maintenance orders for this vehicle
    let maintenanceOrders = [];
    try {
      const maintRes = await db.query(`
        SELECT * FROM maintenance_orders 
        WHERE vehicle_code = $1 OR vehicle_code = $2
        ORDER BY created_at DESC LIMIT 10
      `, [vehicle.code, vehicle.registration_number || vehicle.code]);
      maintenanceOrders = maintRes.rows;
    } catch (e) {}

    // Query battery details in this zone
    let batteryDetails = null;
    try {
      const batRes = await db.query(`
        SELECT * FROM batteries 
        WHERE zone = $1 
        ORDER BY battery_id ASC LIMIT 1
      `, [vehicle.zone]);
      if (batRes.rows.length > 0) batteryDetails = batRes.rows[0];
    } catch (e) {}

    return res.json({
      status: 'success',
      data: {
        ...vehicle,
        active_ride: activeRide,
        ride_history: rideHistory,
        maintenance_orders: maintenanceOrders,
        battery_details: batteryDetails
      }
    });
  } catch (err) {
    console.error(
      'Failed to get vehicle:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch vehicle',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// DATE HELPER
// ============================================================

const parseDateOrNull = (value) => {
  if (
    !value ||
    typeof value !== 'string' ||
    value.trim() === ''
  ) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

// ============================================================
// CREATE VEHICLE
// POST /api/vehicles
// ============================================================

router.post('/', async (req, res) => {
  let {
    vehicleImage,
    vehicleNumber,
    code,
    vehicleCategory,
    vehicleType,
    evegahModelName,
    vehicleModel,
    vehicleManufacturer,
    manufacturingDate,
    chassisNumber,
    motorNumber,
    controllerNumber,
    registrationNumber,
    color,
    purchaseDate,
    vehicleWarrantyExpiryDate,
    insurancePolicyNumber,
    insuranceProvider,
    insuranceExpiryDate,
    currentKmReading,
    totalKmCovered,
    vehicleStatus,
    vehicleDocument,
    vehicleQrCode,
    zone
  } = req.body;

  const vehicleCode =
    String(
      vehicleNumber ||
      code ||
      ''
    ).trim() ||
    `EVM${Date.now()}`;

  // Keep provided image.
  // If no image is supplied, select based on model.
  let selectedImage = vehicleImage;

  if (
    !selectedImage ||
    selectedImage === '/3d_scooter_rider.png'
  ) {
    if (
      evegahModelName === 'Evegah Mink'
    ) {
      selectedImage = '/Mink-1.png';
    } else if (
      evegahModelName === 'Evegah City'
    ) {
      selectedImage = '/City-1.png';
    } else if (
      evegahModelName === 'Evegah Fly'
    ) {
      selectedImage = '/fly-1.png';
    } else if (
      evegahModelName === 'Evegah Pro'
    ) {
      selectedImage = '/pro-1.png';
    } else {
      selectedImage = '/City-1.png';
    }
  }

  try {
    const result = await db.query(
      `
      INSERT INTO vehicles (
        code,
        vehicle_image,
        vehicle_category,
        vehicle_type,
        evegah_model_name,
        vehicle_model,
        vehicle_manufacturer,
        manufacturing_date,
        chassis_number,
        motor_number,
        controller_number,
        registration_number,
        color,
        purchase_date,
        vehicle_warranty_expiry_date,
        insurance_policy_number,
        insurance_provider,
        insurance_expiry_date,
        current_km_reading,
        total_km_covered,
        vehicle_status,
        vehicle_document,
        vehicle_qr_code,
        status,
        battery_pct,
        speed,
        renter_name,
        zone
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20,
        $21,
        $22,
        $23,
        $24,
        $25,
        $26,
        $27,
        $28
      )
      ON CONFLICT (code)
      DO UPDATE SET
        vehicle_image =
          EXCLUDED.vehicle_image,

        vehicle_category =
          EXCLUDED.vehicle_category,

        vehicle_type =
          EXCLUDED.vehicle_type,

        evegah_model_name =
          EXCLUDED.evegah_model_name,

        vehicle_model =
          EXCLUDED.vehicle_model,

        vehicle_manufacturer =
          EXCLUDED.vehicle_manufacturer,

        manufacturing_date =
          EXCLUDED.manufacturing_date,

        chassis_number =
          EXCLUDED.chassis_number,

        motor_number =
          EXCLUDED.motor_number,

        controller_number =
          EXCLUDED.controller_number,

        registration_number =
          EXCLUDED.registration_number,

        color =
          EXCLUDED.color,

        purchase_date =
          EXCLUDED.purchase_date,

        vehicle_warranty_expiry_date =
          EXCLUDED.vehicle_warranty_expiry_date,

        insurance_policy_number =
          EXCLUDED.insurance_policy_number,

        insurance_provider =
          EXCLUDED.insurance_provider,

        insurance_expiry_date =
          EXCLUDED.insurance_expiry_date,

        current_km_reading =
          EXCLUDED.current_km_reading,

        total_km_covered =
          EXCLUDED.total_km_covered,

        vehicle_status =
          EXCLUDED.vehicle_status,

        vehicle_document =
          EXCLUDED.vehicle_document,

        vehicle_qr_code =
          EXCLUDED.vehicle_qr_code,

        zone =
          EXCLUDED.zone

      RETURNING *
      `,
      [
        vehicleCode,

        selectedImage,

        vehicleCategory ||
          'E-Scooter',

        vehicleType ||
          'Rental',

        evegahModelName ||
          'Evegah City',

        vehicleModel ||
          '',

        vehicleManufacturer ||
          '',

        parseDateOrNull(
          manufacturingDate
        ),

        chassisNumber ||
          '',

        motorNumber ||
          '',

        controllerNumber ||
          '',

        registrationNumber ||
          '',

        color ||
          '',

        parseDateOrNull(
          purchaseDate
        ),

        parseDateOrNull(
          vehicleWarrantyExpiryDate
        ),

        insurancePolicyNumber ||
          '',

        insuranceProvider ||
          '',

        parseDateOrNull(
          insuranceExpiryDate
        ),

        currentKmReading !== undefined &&
        currentKmReading !== null &&
        currentKmReading !== ''
          ? parseFloat(currentKmReading)
          : 0,

        totalKmCovered !== undefined &&
        totalKmCovered !== null &&
        totalKmCovered !== ''
          ? parseFloat(totalKmCovered)
          : 0,

        vehicleStatus ||
          'Available',

        vehicleDocument ||
          '',

        vehicleQrCode ||
          '',

        'Online',

        100,

        0,

        'None (Available)',

        zone ||
          'Unassigned'
      ]
    );

    return res.json({
      status: 'success',
      message: 'Vehicle saved successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(
      'Failed to add vehicle:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to save vehicle',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// UPDATE VEHICLE
// PUT /api/vehicles/:code
// ============================================================

router.put('/:code', async (req, res) => {
  const { code } = req.params;

  const {
    vehicleCategory,
    vehicleType,
    evegahModelName,
    vehicleModel,
    vehicleManufacturer,
    manufacturingDate,
    chassisNumber,
    motorNumber,
    controllerNumber,
    registrationNumber,
    color,
    purchaseDate,
    vehicleWarrantyExpiryDate,
    insurancePolicyNumber,
    insuranceProvider,
    insuranceExpiryDate,
    currentKmReading,
    totalKmCovered,
    vehicleStatus,
    zone
  } = req.body;

  let selectedImage;

  if (evegahModelName) {
    if (
      evegahModelName === 'Evegah Mink'
    ) {
      selectedImage = '/Mink-1.png';
    } else if (
      evegahModelName === 'Evegah City'
    ) {
      selectedImage = '/City-1.png';
    } else if (
      evegahModelName === 'Evegah Fly'
    ) {
      selectedImage = '/fly-1.png';
    } else if (
      evegahModelName === 'Evegah Pro'
    ) {
      selectedImage = '/pro-1.png';
    }
  }

  try {
    const result = await db.query(
      `
      UPDATE vehicles
      SET
        vehicle_category = $1,
        vehicle_type = $2,
        evegah_model_name = $3,
        vehicle_model = $4,
        vehicle_manufacturer = $5,
        manufacturing_date = $6,
        chassis_number = $7,
        motor_number = $8,
        controller_number = $9,
        registration_number = $10,
        color = $11,
        purchase_date = $12,
        vehicle_warranty_expiry_date = $13,
        insurance_policy_number = $14,
        insurance_provider = $15,
        insurance_expiry_date = $16,
        current_km_reading = $17,
        total_km_covered = $18,
        vehicle_status = $19,
        vehicle_image =
          COALESCE($20, vehicle_image),
        zone = $21
      WHERE code = $22
      RETURNING *
      `,
      [
        vehicleCategory,

        vehicleType,

        evegahModelName,

        vehicleModel,

        vehicleManufacturer,

        parseDateOrNull(
          manufacturingDate
        ),

        chassisNumber,

        motorNumber,

        controllerNumber,

        registrationNumber,

        color,

        parseDateOrNull(
          purchaseDate
        ),

        parseDateOrNull(
          vehicleWarrantyExpiryDate
        ),

        insurancePolicyNumber,

        insuranceProvider,

        parseDateOrNull(
          insuranceExpiryDate
        ),

        currentKmReading !== undefined &&
        currentKmReading !== null &&
        currentKmReading !== ''
          ? parseFloat(currentKmReading)
          : 0,

        totalKmCovered !== undefined &&
        totalKmCovered !== null &&
        totalKmCovered !== ''
          ? parseFloat(totalKmCovered)
          : 0,

        vehicleStatus,

        selectedImage || null,

        zone ||
          'Unassigned',

        code
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }

    return res.json({
      status: 'success',
      message: 'Vehicle updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(
      'Failed to update vehicle:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to update vehicle',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// DELETE VEHICLE
// DELETE /api/vehicles/:code
// ============================================================

router.delete('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const result = await db.query(
      `
      DELETE FROM vehicles
      WHERE code = $1
      RETURNING *
      `,
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }

    return res.json({
      status: 'success',
      message: 'Vehicle deleted successfully'
    });
  } catch (err) {
    console.error(
      'Failed to delete vehicle:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to delete vehicle',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// UPDATE VEHICLE ZONE
// PATCH /api/vehicles/:id/zone
// ============================================================

router.patch('/:id/zone', async (req, res) => {
  const { id } = req.params;
  const { zone } = req.body;

  if (!zone || !String(zone).trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'Zone is required'
    });
  }

  try {
    const result = await db.query(
      `
      UPDATE vehicles
      SET zone = $1
      WHERE id = $2
      RETURNING *
      `,
      [
        String(zone).trim(),
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Vehicle not found'
      });
    }

    return res.json({
      status: 'success',
      message: 'Vehicle zone updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(
      'Failed to update vehicle zone:',
      err
    );

    return res.status(500).json({
      status: 'error',
      message: 'Failed to update vehicle zone',
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : undefined
    });
  }
});

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');
const { getCache, setCache, delByPattern } = require('../redis');

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
        SELECT rider_name, mobile, status
        FROM renters
        WHERE (vehicle_id = v.code OR vehicle_id = v.registration_number)
          AND status IN ('Active Ride', 'Ongoing', 'Retain Ride')
        ORDER BY id DESC LIMIT 1
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
        SELECT rider_name, mobile, status
        FROM renters
        WHERE (vehicle_id = v.code OR vehicle_id = v.registration_number)
          AND status IN ('Active Ride', 'Ongoing', 'Retain Ride')
        ORDER BY id DESC LIMIT 1
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
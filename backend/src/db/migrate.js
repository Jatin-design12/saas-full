require('dotenv').config();
const db = require('../db');

const migrate = async () => {
  console.log('Running migrations...');

  await db.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      role VARCHAR(50) DEFAULT 'Employee',
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS riders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS requests (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      request_id VARCHAR(30) UNIQUE NOT NULL,
      type VARCHAR(50) NOT NULL,
      rider_id UUID REFERENCES riders(id),
      employee_id UUID REFERENCES users(id),
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS batteries (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      battery_id VARCHAR(50) UNIQUE NOT NULL,
      status VARCHAR(30) DEFAULT 'idle',
      soc INT DEFAULT 100,
      voltage NUMERIC(5, 2),
      current NUMERIC(5, 2),
      temp NUMERIC(4, 1),
      cycles INT DEFAULT 0,
      health INT DEFAULT 100,
      lat NUMERIC(9, 6),
      lng NUMERIC(9, 6),
      serial_number VARCHAR(100),
      battery_type VARCHAR(50) DEFAULT 'Li-ion',
      capacity VARCHAR(30),
      make VARCHAR(100),
      model VARCHAR(100),
      location VARCHAR(150),
      zone VARCHAR(150),
      assigned_to VARCHAR(100),
      vehicle_number VARCHAR(50),
      rider_name VARCHAR(100),
      purchase_date DATE,
      warranty_valid_till DATE,
      supplier VARCHAR(150),
      cost NUMERIC(10, 2),
      invoice_number VARCHAR(100),
      notes TEXT,
      cells JSONB DEFAULT '[]'::jsonb,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS battery_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      battery_id VARCHAR(50) REFERENCES batteries(battery_id) ON DELETE CASCADE,
      soc INT,
      voltage NUMERIC(5, 2),
      current NUMERIC(5, 2),
      temp NUMERIC(4, 1),
      lat NUMERIC(9, 6),
      lng NUMERIC(9, 6),
      status VARCHAR(30),
      cells JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS settings (
      category VARCHAR(50) PRIMARY KEY,
      values JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS renters (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      rider_name VARCHAR(100) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      vehicle_id VARCHAR(50) NOT NULL,
      battery_id VARCHAR(50) NOT NULL,
      package_name VARCHAR(100) NOT NULL,
      rental_start_date DATE NOT NULL,
      return_date DATE,
      status VARCHAR(30) DEFAULT 'Active Ride',
      rent NUMERIC(10, 2) NOT NULL,
      deposit NUMERIC(10, 2) NOT NULL,
      total NUMERIC(10, 2) NOT NULL,
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      reservation_id VARCHAR(50) UNIQUE NOT NULL,
      customer_name VARCHAR(100) NOT NULL,
      mobile VARCHAR(20) NOT NULL,
      gov_id VARCHAR(50) NOT NULL,
      reservation_date DATE NOT NULL,
      reservation_time TIME NOT NULL,
      package_type VARCHAR(50) NOT NULL,
      vehicle_category VARCHAR(50) NOT NULL,
      vehicle_number VARCHAR(50),
      battery_id VARCHAR(50),
      id_card_url TEXT,
      inspection_media_url TEXT,
      fare NUMERIC(10, 2) NOT NULL,
      deposit NUMERIC(10, 2) NOT NULL,
      payment_mode VARCHAR(50) NOT NULL,
      payment_status VARCHAR(30) DEFAULT 'Paid',
      status VARCHAR(30) DEFAULT 'Upcoming',
      pickup_zone VARCHAR(100),
      drop_zone VARCHAR(100),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS battery_id VARCHAR(50);
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS id_card_url TEXT;
    ALTER TABLE reservations ADD COLUMN IF NOT EXISTS inspection_media_url TEXT;

    CREATE TABLE IF NOT EXISTS zones (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      code VARCHAR(50) NOT NULL UNIQUE,
      country VARCHAR(100),
      state VARCHAR(100),
      city VARCHAR(100),
      locality VARCHAR(100),
      type VARCHAR(50),
      priority VARCHAR(50),
      status VARCHAR(30) DEFAULT 'active',
      timezone VARCHAR(50),
      description TEXT,
      start_date DATE,
      end_date DATE,
      max_vehicles INT,
      notes TEXT,
      map_link TEXT,
      points JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      code VARCHAR(50) NOT NULL UNIQUE,
      description TEXT,
      reporting_to VARCHAR(100),
      status VARCHAR(30) DEFAULT 'Active',
      permissions JSONB DEFAULT '{}'::jsonb,
      custom_permissions JSONB DEFAULT '[]'::jsonb,
      users_count INT DEFAULT 0,
      last_updated TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(20);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS zone VARCHAR(150);
    ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'Active';
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS address TEXT;
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE zones ADD COLUMN IF NOT EXISTS pricing JSONB DEFAULT '{}'::jsonb;
    CREATE TABLE IF NOT EXISTS vehicles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code VARCHAR(50) UNIQUE NOT NULL,
      vehicle_image VARCHAR(255) DEFAULT '/3d_scooter_rider.png',
      vehicle_category VARCHAR(100) DEFAULT 'E-Scooter',
      vehicle_type VARCHAR(100) DEFAULT 'Rental',
      evegah_model_name VARCHAR(100) DEFAULT 'Evegah City',
      vehicle_model VARCHAR(100),
      vehicle_manufacturer VARCHAR(100),
      manufacturing_date DATE,
      chassis_number VARCHAR(100),
      motor_number VARCHAR(100),
      controller_number VARCHAR(100),
      registration_number VARCHAR(100),
      color VARCHAR(50),
      purchase_date DATE,
      vehicle_warranty_expiry_date DATE,
      insurance_policy_number VARCHAR(100),
      insurance_provider VARCHAR(100),
      insurance_expiry_date DATE,
      current_km_reading NUMERIC(12, 2) DEFAULT 0,
      total_km_covered NUMERIC(12, 2) DEFAULT 0,
      vehicle_status VARCHAR(50) DEFAULT 'Available',
      vehicle_document VARCHAR(255),
      vehicle_qr_code TEXT,
      zone VARCHAR(150) DEFAULT 'Unassigned',
      
      -- Standard tracking fields
      status VARCHAR(30) DEFAULT 'Online',
      battery_pct INT DEFAULT 100,
      speed NUMERIC(5, 2) DEFAULT 0,
      renter_name VARCHAR(100) DEFAULT 'None (Available)',
      last_seen TIMESTAMPTZ DEFAULT NOW(),
      lat NUMERIC(9, 6) DEFAULT 28.6304,
      lng NUMERIC(9, 6) DEFAULT 77.2177,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS coupons (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      code VARCHAR(100) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      discount_type VARCHAR(50) NOT NULL,
      discount_value NUMERIC(10, 2) NOT NULL,
      min_order NUMERIC(10, 2) DEFAULT 0.00,
      redemption_limit INT DEFAULT 100,
      per_user_limit INT DEFAULT 1,
      start_date TIMESTAMPTZ DEFAULT NOW(),
      end_date TIMESTAMPTZ,
      status VARCHAR(30) DEFAULT 'Active',
      applicable_on VARCHAR(100) DEFAULT 'All Rentals',
      selected_zones JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Seed default coupons
  const existingCoupons = await db.query('SELECT COUNT(*) FROM coupons');
  if (parseInt(existingCoupons.rows[0].count) === 0) {
    await db.query(`
      INSERT INTO coupons (code, title, description, discount_type, discount_value, min_order, status, end_date)
      VALUES 
        ('GET100', 'Flat ₹100 OFF on All Rentals', 'Flat ₹100 off on your booking', 'Flat', 100.00, 300.00, 'Active', '2026-12-31'),
        ('WELCOME50', 'Flat ₹50 OFF for New Users', 'Get ₹50 off on your first ride', 'Flat', 50.00, 0.00, 'Active', '2026-12-31'),
        ('RIDER50', 'Save ₹50 on Next 3 Rides', 'Save ₹50 off on next rides', 'Flat', 50.00, 150.00, 'Active', '2026-12-31')
      ON CONFLICT DO NOTHING
    `);
  }

  // Seed default predefined roles
  const existingRoles = await db.query('SELECT COUNT(*) FROM roles');
  if (parseInt(existingRoles.rows[0].count) === 0) {
    await db.query(`
      INSERT INTO roles (name, code, description, reporting_to, status, users_count)
      VALUES 
        ('Super Admin', 'SUPER_ADMIN', 'Full system control and unrestricted platform access', NULL, 'Active', 1),
        ('Platform Admin', 'PLATFORM_ADMIN', 'System configuration, analytics, and platform oversight', 'Super Admin', 'Active', 1),
        ('Zone Admin', 'ZONE_ADMIN', 'Manages local zone operations, hub staff, and rides', 'Platform Admin', 'Active', 2),
        ('Operations Manager', 'OPERATIONS_MANAGER', 'Manages fleet dispatch, active rides, and daily logistics', 'Zone Admin', 'Active', 2),
        ('Franchise Manager', 'FRANCHISE_MANAGER', 'Manages franchise partners, hubs, and revenue logs', 'Platform Admin', 'Active', 1),
        ('Battery Technician', 'BATTERY_TECHNICIAN', 'Battery inward, charging, and BMS health monitoring', 'Operations Manager', 'Active', 1),
        ('Support Executive', 'SUPPORT_EXECUTIVE', 'Rider support, complaints, and reservation assistance', 'Zone Admin', 'Active', 1),
        ('Fleet Manager', 'FLEET_MANAGER', 'Vehicle inventory, documents, and maintenance tracking', 'Operations Manager', 'Active', 1),
        ('Field Technician', 'FIELD_TECHNICIAN', 'On-field battery swapping and roadside assistance', 'Operations Manager', 'Active', 1),
        ('Finance Manager', 'FINANCE_MANAGER', 'Revenue accounting, payouts, and deposit refunds', 'Platform Admin', 'Active', 1)
      ON CONFLICT (code) DO NOTHING
    `);
  }

  // Seed default predefined users
  const existingUsersCount = await db.query('SELECT COUNT(*) FROM users');
  if (parseInt(existingUsersCount.rows[0].count) === 0) {
    await db.query(`
      INSERT INTO users (name, email, role, mobile, zone, status, password)
      VALUES 
        ('Himanshu', 'himanshu@evegah.com', 'Super Admin', '+91 99999 88888', 'Multiple Zones', 'Active', 'admin123'),
        ('Akash', 'akash@evegah.com', 'Zone Admin', '+91 98765 43210', 'Gotri Zone', 'Active', 'zone123'),
        ('Priya Sharma', 'priya.sharma@evegah.com', 'Platform Admin', '+91 98765 11111', 'All Zones / Platform Wide', 'Active', 'pass123'),
        ('Rahul Verma', 'rahul.v@evegah.com', 'Operations Manager', '+91 98765 22222', 'Vadodara Main Zone', 'Active', 'pass123'),
        ('Vikram Patel', 'vikram.p@evegah.com', 'Franchise Manager', '+91 98765 33333', 'Alkapuri Zone', 'Active', 'pass123'),
        ('Neha Singh', 'neha.s@evegah.com', 'Battery Technician', '+91 98765 44444', 'Subhanpura Zone', 'Active', 'pass123'),
        ('Amit Kumar', 'amit.k@evegah.com', 'Support Executive', '+91 98765 55555', 'Akota Zone', 'Active', 'pass123'),
        ('Suresh Mehta', 'suresh.m@evegah.com', 'Fleet Manager', '+91 98765 66666', 'Gotri Zone', 'Active', 'pass123')
      ON CONFLICT (email) DO NOTHING
    `);
  }

  console.log('Migrations complete!');
  process.exit(0);
};

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

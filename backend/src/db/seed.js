require('dotenv').config();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

const seed = async () => {
  console.log('Seeding database - Production Clean Run...');

  // Clear existing dummy data
  console.log('Clearing existing dummy data...');
  await db.query('DELETE FROM requests');
  await db.query('DELETE FROM renters');
  await db.query('DELETE FROM reservations');
  await db.query('DELETE FROM vehicles');
  await db.query('DELETE FROM zones');
  await db.query('DELETE FROM riders');

  // Seed roles
  console.log('Seeding default roles...');
  const defaultRoles = [
    {
      name: 'Super Admin',
      code: 'SUPER_ADMIN',
      description: 'Full access to all system modules and settings.',
      reporting_to: 'Board',
      status: 'Active',
      permissions: {
        Dashboard: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Riders: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Vehicles: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Battery: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        "IoT Devices": { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Payments: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Reports: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Alerts: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        "Zone Management": { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Franchise: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Settings: { access: true, create: true, view: true, edit: true, delete: true, export: true }
      },
      custom_permissions: ['all_permissions']
    },
    {
      name: 'Platform Admin',
      code: 'PLATFORM_ADMIN',
      description: 'Administrative access to system operations.',
      reporting_to: 'Super Admin',
      status: 'Active',
      permissions: {
        Dashboard: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Riders: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Vehicles: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Battery: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        "IoT Devices": { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Payments: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Reports: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Alerts: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        "Zone Management": { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Franchise: { access: true, create: true, view: true, edit: true, delete: true, export: true },
        Settings: { access: true, create: true, view: true, edit: true, delete: true, export: true }
      },
      custom_permissions: []
    },
    {
      name: 'Zone Admin',
      code: 'ZONE_ADMIN',
      description: 'Management access for zone specific operations.',
      reporting_to: 'Platform Admin',
      status: 'Active',
      permissions: { Dashboard: { access: true, create: false, view: true, edit: true, delete: false, export: true } },
      custom_permissions: []
    },
    {
      name: 'Franchise Manager',
      code: 'FRANCHISE_MANAGER',
      description: 'Onboarding and operations access for franchise partners.',
      reporting_to: 'Platform Admin',
      status: 'Active',
      permissions: { Dashboard: { access: true, create: false, view: true, edit: false, delete: false, export: false } },
      custom_permissions: []
    },
    {
      name: 'Employee',
      code: 'EMPLOYEE',
      description: 'Standard employee access for zone operations.',
      reporting_to: 'Zone Admin',
      status: 'Active',
      permissions: { Dashboard: { access: true, create: false, view: true, edit: false, delete: false, export: false } },
      custom_permissions: []
    }
  ];

  for (const role of defaultRoles) {
    await db.query(`
      INSERT INTO roles (name, code, description, reporting_to, status, permissions, custom_permissions)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (name) DO UPDATE SET
        code = EXCLUDED.code,
        description = EXCLUDED.description,
        reporting_to = EXCLUDED.reporting_to,
        status = EXCLUDED.status,
        permissions = EXCLUDED.permissions,
        custom_permissions = EXCLUDED.custom_permissions
    `, [role.name, role.code, role.description, role.reporting_to, role.status, JSON.stringify(role.permissions), JSON.stringify(role.custom_permissions)]);
  }

  // Seed user
  const userId = uuidv4();
  await db.query(`
    INSERT INTO users (id, name, email, role) 
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (email) DO NOTHING
  `, [userId, 'Priya Sharma', 'priya@evegah.com', 'Employee']);

  const adminUserId = uuidv4();
  await db.query(`
    INSERT INTO users (id, name, email, role, mobile, zone, status, password) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (email) DO UPDATE SET
      role = EXCLUDED.role,
      name = EXCLUDED.name
  `, [adminUserId, 'Himanshu', 'himanshu@evegah.com', 'Super Admin', '+91 99999 88888', 'Multiple Zones', 'Active', 'admin123']);

  // Seed default settings
  const defaultSettings = [
    {
      category: 'general',
      values: {
        zone_name: 'Connaught Place Zone',
        time_zone: '(UTC +05:30) Asia/Kolkata',
        date_format: 'DD MMM YYYY (31 May 2024)',
        time_format: '12 Hours (AM/PM)',
        currency: 'INR (₹) - Indian Rupee',
        auto_approve_registrations: true,
        email_notifications: true,
        sms_notifications: true,
        maintenance_mode: false,
        allow_bulk_operations: true,
        items_per_page: 25,
        default_language: 'English',
        map_provider: 'Google Maps',
        session_timeout: '30 Minutes',
        min_rental_duration: 1,
        max_rental_duration: 30,
        late_return_grace_period: 15,
        security_deposit: 500.00
      }
    },
    {
      category: 'ride_rental',
      values: {
        allow_ride_booking: true,
        min_ride_distance: 1.0,
        max_ride_distance: 100,
        ride_cancellation_limit: '15 Minutes',
        auto_complete_ride: true,
        ride_grace_time: 10,
        allow_rentals: true,
        min_rental_duration_hours: 1,
        max_rental_duration_days: 30,
        security_deposit_refundable: 500.00,
        advance_payment: 'No Advance',
        auto_extend_rental: true,
        base_fare: 20.00,
        per_km_charge: 8.00,
        plan_rate_type: 'Per Day',
        late_return_fee: 50.00,
        tax_percentage: 18,
        renter_wallet_deduction: true,
        operating_hours_ride_from: '06:00 AM',
        operating_hours_ride_to: '11:00 PM',
        operating_hours_rental_from: '06:00 AM',
        operating_hours_rental_to: '10:00 PM',
        weekly_off: ['Sun'],
        pickup_outside_zone: false,
        drop_outside_zone: false,
        extended_coverage_fee: 30.00,
        allow_multiple_vehicles: true,
        enable_rating_reviews: true,
        cleaner_fee: 100.00,
        toll_charges: 'Reimburse',
        smoking_penalty: 200.00
      }
    },
    {
      category: 'payments',
      values: {
        razorpay_active: true,
        razorpay_key_id: 'rzp_live_xxxxxxxxxxxxx',
        phonepe_active: true,
        phonepe_merchant_id: 'PGTESTxxxxxxxx',
        paytm_active: false,
        paytm_merchant_id: 'Mid_xxxxxxxxxxxxx',
        default_payment_method: 'UPI',
        payment_capture: true,
        partial_payment: true,
        payment_retry: '3 Attempts',
        payment_timeout: '10 Minutes',
        auto_refund: true,
        refund_approval: true,
        refund_limit: 500.00,
        refund_processing_time: '3 - 5 Business Days',
        gst_applicable: true,
        gst_percentage: 18,
        service_fee: 10.00,
        convenience_fee: 5.00,
        methods_upi: true,
        methods_card: true,
        methods_netbanking: true,
        methods_wallets: true,
        methods_cash: false
      }
    },
    {
      category: 'notifications',
      values: {
        channels_email: true,
        channels_sms: true,
        channels_inapp: true,
        quiet_hours_enabled: true,
        quiet_hours_from: '10:00 PM',
        quiet_hours_to: '07:00 AM',
        quiet_hours_timezone: '(UTC +05:30) Asia/Kolkata',
        prefs_ride_bookings: { email: true, sms: true, inapp: true },
        prefs_rental_bookings: { email: true, sms: true, inapp: true },
        prefs_payments: { email: true, sms: false, inapp: true },
        prefs_payouts: { email: true, sms: false, inapp: true },
        prefs_battery_alerts: { email: false, sms: true, inapp: true },
        prefs_vehicle_alerts: { email: true, sms: true, inapp: true },
        prefs_system_alerts: { email: true, sms: false, inapp: true },
        prefs_promotions: { email: false, sms: false, inapp: true }
      }
    },
    {
      category: 'system',
      values: {
        system_time_zone: '(UTC +05:30) Asia/Kolkata',
        system_date_format: 'DD-MM-YYYY',
        system_time_format: '12 Hour (AM/PM)',
        system_language: 'English',
        system_automatic_updates: true,
        system_update_channel: 'Stable',
        system_last_checked: 'Today, 08:30 AM',
        system_version: 'v2.4.0',
        system_info: {
          server_name: 'evg-server-01',
          web_server: 'Nginx 1.24.0',
          environment: 'Production',
          php_version: '8.2.12',
          total_storage: 256,
          used_storage: 128,
          database_version: 'MySQL 8.0.34',
          active_users: 2,
          active_sessions: 2,
          uptime: '1 Day'
        },
        auto_backup: true,
        backup_frequency: 'Daily',
        last_backup: 'Today, 02:00 AM',
        last_backup_status: 'Success',
        backup_size: '0.1 GB'
      }
    },
    {
      category: 'battery_swapping',
      values: {
        soc_swap_threshold: 20,
        soc_alert_threshold: 15,
        max_cycles_limit: 500,
        temp_alert_threshold: 45,
        auto_station_allocation: true,
        require_swap_auth: true
      }
    },
    {
      category: 'documents',
      values: {
        require_aadhar: true,
        require_dl: true,
        require_pan: false,
        auto_verify_documents: true,
        max_file_size: 5,
        allowed_formats: 'PDF, PNG, JPG'
      }
    },
    {
      category: 'security',
      values: {
        two_factor_auth: false,
        strong_password_policy: true,
        max_login_attempts: 5,
        session_timeout_seconds: 1800,
        allow_concurrent_logins: false
      }
    }
  ];

  for (const set of defaultSettings) {
    await db.query(`
      INSERT INTO settings (category, values)
      VALUES ($1, $2)
      ON CONFLICT (category) DO UPDATE SET values = EXCLUDED.values
    `, [set.category, JSON.stringify(set.values)]);
  }

  console.log('Seed complete! Database is clean of all dummy records.');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

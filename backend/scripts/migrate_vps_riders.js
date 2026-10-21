#!/usr/bin/env node

/**
 * Migration Script: Migrate Riders Data from Source DB (5432) to evegah.cloud Target DB (5433)
 * 
 * Usage on VPS:
 *   node backend/scripts/migrate_vps_riders.js
 * 
 * Options:
 *   --dry-run      Preview actions without modifying the target database
 *   --source=URL   Custom source database URL (default: postgresql://evegah:Evegah%402026@127.0.0.1:5432/evegah)
 *   --target=URL   Custom target database URL (default: postgresql://evegah_admin:Secure_DB_Password_ChangeMe@127.0.0.1:5433/evegah_prod)
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const crypto = require('crypto');

// Parse CLI flags
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const getArgValue = (prefix) => {
  const arg = args.find((a) => a.startsWith(prefix));
  return arg ? arg.split('=')[1] : null;
};

// Database Connection URLs
const SOURCE_DB_URL =
  getArgValue('--source') ||
  process.env.SOURCE_DB_URL ||
  'postgresql://evegah:Evegah%402026@127.0.0.1:5432/evegah';

const TARGET_DB_URL =
  getArgValue('--target') ||
  process.env.TARGET_DB_URL ||
  process.env.DATABASE_URL ||
  'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@127.0.0.1:5433/evegah_prod';

function cleanPhone(raw) {
  if (!raw) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return null;
}

function formatPhoneDisplay(last10) {
  if (!last10) return null;
  return `+91 ${last10}`;
}

function escapeCsvField(val) {
  if (val === null || val === undefined) return '';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

async function run() {
  console.log('=====================================================');
  console.log('🚀 Evegah Riders Data Migration & Export Tool');
  console.log(`Source: ${SOURCE_DB_URL.replace(/:[^:@]+@/, ':****@')}`);
  console.log(`Target: ${TARGET_DB_URL.replace(/:[^:@]+@/, ':****@')}`);
  if (isDryRun) {
    console.log('⚠️  MODE: DRY-RUN (No changes will be saved to target)');
  }
  console.log('=====================================================\n');

  const sourcePool = new Pool({ connectionString: SOURCE_DB_URL, connectionTimeoutMillis: 10000 });
  const targetPool = new Pool({ connectionString: TARGET_DB_URL, connectionTimeoutMillis: 10000 });

  try {
    // 1. Connect & Test Connections
    console.log('📡 Testing connection to Source Database...');
    await sourcePool.query('SELECT 1');
    console.log('✅ Connected to Source Database (evegah:5432)');

    console.log('📡 Testing connection to Target Database (evegah.cloud)...');
    await targetPool.query('SELECT 1');
    console.log('✅ Connected to Target Database (evegah_prod:5433)\n');

    // 2. Discover Tables in Source Database
    console.log('🔍 Discovering available tables in Source Database...');
    const sourceTablesRes = await sourcePool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    const sourceTables = sourceTablesRes.rows.map((r) => r.table_name);
    console.log(`Found ${sourceTables.length} tables in source:`, sourceTables.join(', '));

    // Priority candidates for rider data: 'renters', 'riders', 'users'
    const candidateTables = ['renters', 'riders', 'users', 'rider_profiles'].filter((t) =>
      sourceTables.includes(t)
    );

    if (candidateTables.length === 0) {
      console.warn('⚠️ No default rider tables (renters, riders, users) found in source database.');
      console.log('Available tables were:', sourceTables);
      return;
    }

    console.log(`\n🎯 Candidate rider tables identified: ${candidateTables.join(', ')}`);

    // 3. Extract Riders from Candidate Tables
    let allExtractedRiders = [];
    const seenMobiles = new Set();

    for (const tableName of candidateTables) {
      console.log(`\n📦 Reading from source table '${tableName}'...`);

      // Inspect columns
      const colsRes = await sourcePool.query(
        `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1`,
        [tableName]
      );
      const cols = colsRes.rows.map((c) => c.column_name);
      console.log(`Columns in '${tableName}': ${cols.join(', ')}`);

      // Read rows
      const rowsRes = await sourcePool.query(`SELECT * FROM "${tableName}"`);
      console.log(`Found ${rowsRes.rows.length} rows in '${tableName}'.`);

      for (const row of rowsRes.rows) {
        // Find phone number field
        const rawPhone =
          row.mobile ||
          row.phone ||
          row.phone_number ||
          row.mobile_number ||
          row.contact ||
          row.contact_number;
        const phone10 = cleanPhone(rawPhone);

        if (!phone10) {
          // Skip records with no identifiable phone
          continue;
        }

        // Avoid duplicates within source extraction
        if (seenMobiles.has(phone10)) {
          continue;
        }
        seenMobiles.add(phone10);

        // Normalize fields
        const riderName =
          row.rider_name ||
          row.name ||
          row.full_name ||
          row.first_name ||
          (row.first_name && row.last_name ? `${row.first_name} ${row.last_name}` : null) ||
          'Evegah Rider';

        const email =
          row.email && !row.email.endsWith('@example.com')
            ? row.email
            : `${phone10}@evegah.com`;

        const kycStatus =
          row.kyc_status ||
          (row.is_verified || row.verified ? 'Verified' : 'Pending');

        const normalizedRider = {
          source_table: tableName,
          original_id: row.id || null,
          rider_name: riderName.trim(),
          mobile: formatPhoneDisplay(phone10),
          mobile_raw: phone10,
          email: email.trim().toLowerCase(),
          vehicle_id: row.vehicle_id || null,
          battery_id: row.battery_id || null,
          package_name: row.package_name || 'Daily Pass',
          rental_start_date: row.rental_start_date || null,
          return_date: row.return_date || null,
          status: row.status || 'Active',
          rent: Number(row.rent || 0),
          deposit: Number(row.deposit || 0),
          total: Number(row.total || 0),
          avatar_url: row.avatar_url || row.avatar || row.profile_image || null,
          date_of_birth: row.date_of_birth || row.dob || null,
          address: row.address || row.permanent_address || null,
          present_address: row.present_address || null,
          gender: row.gender || null,
          wallet_balance: Number(row.wallet_balance || row.wallet || 0),
          bonus_balance: Number(row.bonus_balance || 0),
          zone: row.zone || row.zone_name || 'Gotri Zone',
          kyc_status: kycStatus,
          aadhaar_number: row.aadhaar_number || row.aadhaar || row.aadhar_no || null,
          emergency_contact_name: row.emergency_contact_name || row.emergency_name || null,
          emergency_contact_phone: row.emergency_contact_phone || row.emergency_phone || null,
          booking_source: 'Migrated from evegah-rider-main',
          created_at: row.created_at || new Date(),
        };

        allExtractedRiders.push(normalizedRider);
      }
    }

    console.log(`\n✨ Total unique riders extracted from source: ${allExtractedRiders.length}`);

    // 4. Export to Local JSON and CSV Backup Files
    const exportDir = path.join(__dirname, '..', 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonPath = path.join(exportDir, `riders_export_${timestamp}.json`);
    const csvPath = path.join(exportDir, `riders_export_${timestamp}.csv`);

    fs.writeFileSync(jsonPath, JSON.stringify(allExtractedRiders, null, 2), 'utf8');
    console.log(`📁 Exported JSON backup to: ${jsonPath}`);

    // CSV headers
    if (allExtractedRiders.length > 0) {
      const csvKeys = Object.keys(allExtractedRiders[0]);
      const csvHeader = csvKeys.join(',');
      const csvRows = allExtractedRiders.map((r) =>
        csvKeys.map((k) => escapeCsvField(r[k])).join(',')
      );
      fs.writeFileSync(csvPath, [csvHeader, ...csvRows].join('\n'), 'utf8');
      console.log(`📁 Exported CSV backup to: ${csvPath}\n`);
    }

    // 5. Migrate Data into Target Database (evegah_prod)
    console.log('📥 Starting migration to Target Database (evegah.cloud)...');

    // Fetch existing target renters for smart deduplication
    const targetRentersRes = await targetPool.query('SELECT id, mobile, rider_name, email FROM renters');
    const existingTargetMap = new Map();
    for (const r of targetRentersRes.rows) {
      const p10 = cleanPhone(r.mobile);
      if (p10) existingTargetMap.set(p10, r);
    }
    console.log(`Currently in Target 'renters' table: ${targetRentersRes.rows.length} existing records.`);

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const rider of allExtractedRiders) {
      const phone10 = rider.mobile_raw;
      const existing = existingTargetMap.get(phone10);

      if (existing) {
        // Record already exists in evegah.cloud
        if (isDryRun) {
          console.log(`[DRY-RUN] Would update existing renter: ${rider.rider_name} (${rider.mobile})`);
          updatedCount++;
          continue;
        }

        // Update missing/empty fields without overwriting active data
        await targetPool.query(
          `UPDATE renters SET
            rider_name = COALESCE(NULLIF(rider_name, 'Evegah Rider'), $1),
            email = COALESCE(NULLIF(email, ''), $2),
            avatar_url = COALESCE(avatar_url, $3),
            date_of_birth = COALESCE(date_of_birth, $4),
            address = COALESCE(address, $5),
            present_address = COALESCE(present_address, $6),
            gender = COALESCE(gender, $7),
            kyc_status = CASE WHEN kyc_status = 'Pending' THEN $8 ELSE kyc_status END,
            aadhaar_number = COALESCE(aadhaar_number, $9),
            emergency_contact_name = COALESCE(emergency_contact_name, $10),
            emergency_contact_phone = COALESCE(emergency_contact_phone, $11),
            wallet_balance = CASE WHEN wallet_balance = 0 THEN $12 ELSE wallet_balance END
          WHERE id = $13`,
          [
            rider.rider_name,
            rider.email,
            rider.avatar_url,
            rider.date_of_birth,
            rider.address,
            rider.present_address,
            rider.gender,
            rider.kyc_status,
            rider.aadhaar_number,
            rider.emergency_contact_name,
            rider.emergency_contact_phone,
            rider.wallet_balance,
            existing.id,
          ]
        );
        updatedCount++;
      } else {
        // Brand new rider: insert into target renters
        if (isDryRun) {
          console.log(`[DRY-RUN] Would insert new renter: ${rider.rider_name} (${rider.mobile})`);
          insertedCount++;
          continue;
        }

        const newId = crypto.randomUUID();
        await targetPool.query(
          `INSERT INTO renters (
            id, rider_name, mobile, vehicle_id, battery_id, package_name,
            rental_start_date, return_date, status, rent, deposit, total,
            avatar_url, created_at, email, date_of_birth, address, present_address,
            gender, wallet_balance, bonus_balance, zone, kyc_status, aadhaar_number,
            emergency_contact_name, emergency_contact_phone, booking_source
          ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12,
            $13, $14, $15, $16, $17, $18,
            $19, $20, $21, $22, $23, $24,
            $25, $26, $27
          )`,
          [
            newId,
            rider.rider_name,
            rider.mobile,
            rider.vehicle_id,
            rider.battery_id,
            rider.package_name,
            rider.rental_start_date,
            rider.return_date,
            rider.status,
            rider.rent,
            rider.deposit,
            rider.total,
            rider.avatar_url,
            rider.created_at,
            rider.email,
            rider.date_of_birth,
            rider.address,
            rider.present_address,
            rider.gender,
            rider.wallet_balance,
            rider.bonus_balance,
            rider.zone,
            rider.kyc_status,
            rider.aadhaar_number,
            rider.emergency_contact_name,
            rider.emergency_contact_phone,
            rider.booking_source,
          ]
        );

        // Also sync to `riders` table if present
        try {
          await targetPool.query(
            `INSERT INTO riders (id, name, mobile, status, created_at)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (id) DO NOTHING`,
            [newId, rider.rider_name, rider.mobile, rider.status, rider.created_at]
          );
        } catch (_) {}

        insertedCount++;
      }
    }

    console.log('\n=====================================================');
    console.log('🎉 MIGRATION SUMMARY:');
    console.log(`- Source Total Extracted: ${allExtractedRiders.length}`);
    console.log(`- Target Newly Inserted: ${insertedCount}`);
    console.log(`- Target Existing Updated: ${updatedCount}`);
    console.log(`- Target Skipped: ${skippedCount}`);
    console.log(`- JSON Backup: ${jsonPath}`);
    console.log(`- CSV Backup: ${csvPath}`);

    const finalTargetCount = await targetPool.query('SELECT count(*) FROM renters');
    console.log(`\n📊 Final Renters Count in evegah.cloud: ${finalTargetCount.rows[0].count}`);
    console.log('=====================================================\n');
  } catch (err) {
    console.error('❌ Migration Error:', err);
  } finally {
    await sourcePool.end().catch(() => {});
    await targetPool.end().catch(() => {});
  }
}

run();

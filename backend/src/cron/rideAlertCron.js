const db = require('../db');
const {
  sendRideReminderAlert,
  sendGracePeriodAlert,
  sendOverduePenaltyAlert
} = require('../utils/whatsapp');

// In-memory set to deduplicate alerts during server uptime (resets safely or backed by reservation.alerts_sent)
const sentAlertsTracker = new Set();

// Helper to sanitize clean key
const alertKey = (resId, alertType) => `${resId}:${alertType}`;

/**
 * Resolve Grace Period (in minutes) and Late Fee for a given zone or settings fallback
 */
async function resolveZoneGracePeriod(zoneName) {
  let graceMinutes = 15;
  let penaltyRate = 50;

  try {
    // 1. Try Zone specific pricing
    if (zoneName) {
      const zRes = await db.query('SELECT pricing FROM zones WHERE LOWER(name) = LOWER($1) LIMIT 1', [zoneName.trim()]);
      if (zRes.rows.length > 0 && zRes.rows[0].pricing) {
        const p = zRes.rows[0].pricing;
        if (p.hourlyPricing && Array.isArray(p.hourlyPricing) && p.hourlyPricing.length > 0) {
          const hp = p.hourlyPricing[0];
          if (hp.gracePeriod && !isNaN(parseInt(hp.gracePeriod))) {
            graceMinutes = parseInt(hp.gracePeriod);
          }
          if (hp.extraPrice && !isNaN(parseFloat(hp.extraPrice))) {
            penaltyRate = parseFloat(hp.extraPrice);
          }
        }
      }
    }

    // 2. Try settings table
    const sRes = await db.query("SELECT values FROM settings WHERE category IN ('general', 'ride_rental')");
    sRes.rows.forEach(r => {
      if (r.values?.late_return_grace_period) graceMinutes = parseInt(r.values.late_return_grace_period);
      else if (r.values?.ride_grace_time) graceMinutes = parseInt(r.values.ride_grace_time);
      if (r.values?.late_return_fee) penaltyRate = parseFloat(r.values.late_return_fee);
    });
  } catch (e) {
    console.warn('[RideAlerts] Config lookup error:', e.message);
  }

  return { graceMinutes: Math.max(graceMinutes, 5), penaltyRate: Math.max(penaltyRate, 20) };
}

/**
 * Compute scheduled end timestamp for an active reservation
 */
function getScheduledEndTime(resv) {
  if (resv.drop_datetime) {
    const d = new Date(resv.drop_datetime);
    if (!isNaN(d.getTime())) return d;
  }

  let start = null;
  if (resv.pickup_datetime) start = new Date(resv.pickup_datetime);
  else if (resv.created_at) start = new Date(resv.created_at);

  if (!start || isNaN(start.getTime())) start = new Date();

  // Package duration addition
  const pkg = (resv.package_type || 'Day').toLowerCase();
  const end = new Date(start.getTime());

  if (pkg.includes('hour')) {
    const hrs = parseInt(pkg.replace(/\D/g, '')) || 2;
    end.setHours(end.getHours() + hrs);
  } else if (pkg.includes('week')) {
    end.setDate(end.getDate() + 7);
  } else if (pkg.includes('month')) {
    end.setDate(end.getDate() + 30);
  } else {
    // Daily / 1 Day default
    end.setDate(end.getDate() + 1);
  }

  return end;
}

/**
 * Main Check Loop
 */
async function checkActiveRidesAndSendAlerts() {
  try {
    // Ensure tracking columns exist in reservations table
    await db.query(`
      ALTER TABLE reservations 
      ADD COLUMN IF NOT EXISTS penalty_amount NUMERIC(10,2) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS penalty_otp VARCHAR(20),
      ADD COLUMN IF NOT EXISTS is_overdue BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS alerts_sent TEXT
    `).catch(() => {});

    // Query all active / ongoing rides
    const activeRidesRes = await db.query(`
      SELECT * FROM reservations 
      WHERE status IN ('Active', 'Ongoing', 'Picked Up', 'Active Ride')
      ORDER BY created_at DESC
    `);

    if (activeRidesRes.rows.length === 0) return;

    const now = new Date();

    for (const resv of activeRidesRes.rows) {
      const resId = resv.reservation_id || String(resv.id);
      const riderName = resv.customer_name || 'Rider';
      const mobile = resv.mobile;
      const vehicleNum = resv.vehicle_number || resv.vehicle_model || 'Evegah City';
      const hubName = resv.drop_zone || resv.pickup_zone || 'Gotri Hub';

      if (!mobile) continue;

      const scheduledEnd = getScheduledEndTime(resv);
      const diffMs = scheduledEnd.getTime() - now.getTime();
      const diffMin = Math.round(diffMs / 60000); // positive = remaining, negative = elapsed

      const { graceMinutes, penaltyRate } = await resolveZoneGracePeriod(hubName);

      const endTimeFormatted = scheduledEnd.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });

      // 1. Alert: 1 Hour Before End (between 60 and 45 minutes remaining)
      if (diffMin <= 60 && diffMin >= 45 && !sentAlertsTracker.has(alertKey(resId, '1hr'))) {
        sentAlertsTracker.add(alertKey(resId, '1hr'));
        await sendRideReminderAlert({
          mobile,
          name: riderName,
          vehicleNumber: vehicleNum,
          timeRemaining: '1hr',
          endTime: endTimeFormatted,
          hubName
        });
      }

      // 2. Alert: 15 Minutes Before End (between 15 and 3 minutes remaining)
      if (diffMin <= 15 && diffMin >= 3 && !sentAlertsTracker.has(alertKey(resId, '15min'))) {
        sentAlertsTracker.add(alertKey(resId, '15min'));
        await sendRideReminderAlert({
          mobile,
          name: riderName,
          vehicleNumber: vehicleNum,
          timeRemaining: '15min',
          endTime: endTimeFormatted,
          hubName
        });
      }

      // 3. Alert: Scheduled End Time (0 to -3 minutes)
      if (diffMin <= 0 && diffMin >= -3 && !sentAlertsTracker.has(alertKey(resId, 'end_time'))) {
        sentAlertsTracker.add(alertKey(resId, 'end_time'));
        await sendRideReminderAlert({
          mobile,
          name: riderName,
          vehicleNumber: vehicleNum,
          timeRemaining: 'end',
          endTime: endTimeFormatted,
          hubName
        });
      }

      // 4. Alert: Grace Period Notification (Entered Grace Period, notify remaining grace before penalty)
      if (diffMin < 0 && diffMin >= -graceMinutes && !sentAlertsTracker.has(alertKey(resId, 'grace_period'))) {
        sentAlertsTracker.add(alertKey(resId, 'grace_period'));
        const graceRemaining = graceMinutes + diffMin; // e.g. 15 + (-3) = 12 mins left
        await sendGracePeriodAlert({
          mobile,
          name: riderName,
          vehicleNumber: vehicleNum,
          graceMinutes: Math.max(graceRemaining, 1),
          penaltyRate,
          hubName
        });
      }

      // 5. Alert: Overdue Past Grace Period -> Calculate Penalty & Generate Secure OTP!
      if (diffMin < -graceMinutes && !sentAlertsTracker.has(alertKey(resId, 'overdue_penalty'))) {
        sentAlertsTracker.add(alertKey(resId, 'overdue_penalty'));

        const overdueMinutes = Math.abs(diffMin) - graceMinutes;
        const overdueHours = Math.ceil(overdueMinutes / 60);
        const penaltyAmount = overdueHours * penaltyRate;

        // Generate 4-digit secure authorization OTP
        const otp = String(Math.floor(1000 + Math.random() * 9000));

        // Save penalty & OTP in database
        await db.query(`
          UPDATE reservations
          SET is_overdue = TRUE,
              penalty_amount = $1,
              penalty_otp = $2
          WHERE id::text = $3 OR reservation_id = $3
        `, [penaltyAmount, otp, resId]).catch(() => {});

        // Send Overdue WhatsApp Alert with Penalty Amount and OTP
        await sendOverduePenaltyAlert({
          mobile,
          name: riderName,
          vehicleNumber: vehicleNum,
          overdueMinutes,
          penaltyAmount,
          otp,
          hubName
        });
      }
    }
  } catch (err) {
    console.error('[RideAlerts] Error in alert cron cycle:', err.message);
  }
}

/**
 * Start Cron Engine (runs every 60 seconds)
 */
function startRideAlertsEngine(intervalSeconds = 60) {
  console.log(`🚀 [RideAlerts] Engine initialized. Checking active rides every ${intervalSeconds}s for WhatsApp reminders and overdue penalties...`);
  // Run once immediately
  checkActiveRidesAndSendAlerts().catch(() => {});
  // Schedule recurring interval
  return setInterval(() => {
    checkActiveRidesAndSendAlerts().catch(() => {});
  }, intervalSeconds * 1000);
}

module.exports = {
  startRideAlertsEngine,
  checkActiveRidesAndSendAlerts,
  resolveZoneGracePeriod
};

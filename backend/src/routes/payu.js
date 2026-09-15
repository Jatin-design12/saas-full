const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { sendWhatsAppReceipt } = require('../utils/whatsapp');

// Default fallback credentials provided by merchant
const DEFAULT_PAYU_KEY = process.env.PAYU_MERCHANT_KEY || 'WTi3jH';
const DEFAULT_PAYU_SALT = process.env.PAYU_MERCHANT_SALT || '9dascniXrfdMW22AJBbhmh2C7kuBibwb';
const DEFAULT_PAYU_CLIENT_ID = process.env.PAYU_CLIENT_ID || '8ecdb3a31264fb5b8c0ef026846a904d9aefcef39acdfb55d61225cdc06eb543';
const DEFAULT_PAYU_CLIENT_SECRET = process.env.PAYU_CLIENT_SECRET || 'd9c50d234985c580d2ac5ea6891cfb5d7f8f12dadb5b5afb6cc565b1b28ad7e4';
const DEFAULT_ENV = process.env.PAYU_ENV || 'test'; // 'test' or 'production'

// Ensure payu_payments table exists
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS payu_payments (
        id SERIAL PRIMARY KEY,
        tx_id VARCHAR(100) UNIQUE NOT NULL,
        payu_id VARCHAR(100),
        amount NUMERIC(10, 2) NOT NULL,
        rider_name VARCHAR(100),
        mobile VARCHAR(50),
        email VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Pending',
        purpose VARCHAR(50) DEFAULT 'wallet',
        reservation_id VARCHAR(100),
        bank_ref_num VARCHAR(100),
        error_message TEXT,
        raw_response JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } catch (e) {
    console.warn('PayU DB init warning:', e.message);
  }
})();

// Helper to fetch live PayU credentials dynamically from settings table
async function getPayUCredentials() {
  try {
    const res = await db.query("SELECT values FROM settings WHERE category = 'payments' LIMIT 1");
    if (res.rows.length > 0 && res.rows[0].values) {
      const p = res.rows[0].values;
      if (Array.isArray(p.gateways)) {
        const payuGw = p.gateways.find(g => g.id === 'payu' || g.provider === 'payu');
        if (payuGw) {
          return {
            key: payuGw.key_id || DEFAULT_PAYU_KEY,
            salt: payuGw.key_secret || DEFAULT_PAYU_SALT,
            clientId: payuGw.client_id || DEFAULT_PAYU_CLIENT_ID,
            clientSecret: payuGw.client_secret || DEFAULT_PAYU_CLIENT_SECRET,
            env: payuGw.environment || DEFAULT_ENV,
            active: payuGw.active !== false
          };
        }
      }
      // Flat keys fallback
      if (p.payu_key_id) {
        return {
          key: p.payu_key_id || DEFAULT_PAYU_KEY,
          salt: p.payu_key_secret || DEFAULT_PAYU_SALT,
          clientId: p.payu_client_id || DEFAULT_PAYU_CLIENT_ID,
          clientSecret: p.payu_client_secret || DEFAULT_PAYU_CLIENT_SECRET,
          env: p.payu_env || DEFAULT_ENV,
          active: p.payu_active !== false
        };
      }
    }
  } catch (err) {
    console.warn('Could not read PayU settings from DB, using defaults:', err.message);
  }

  return {
    key: DEFAULT_PAYU_KEY,
    salt: DEFAULT_PAYU_SALT,
    clientId: DEFAULT_PAYU_CLIENT_ID,
    clientSecret: DEFAULT_PAYU_CLIENT_SECRET,
    env: DEFAULT_ENV,
    active: true
  };
}

/**
 * Generate PayU SHA-512 Hash
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
function generatePayUHash({ key, txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '', salt }) {
  const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}

/**
 * Verify PayU Response SHA-512 Hash
 */
function verifyPayUResponseHash(params, salt) {
  const {
    key, txnid, amount, productinfo, firstname, email,
    status, additionalCharges, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = ''
  } = params;

  let hashSequence;
  if (additionalCharges) {
    hashSequence = `${additionalCharges}|${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  } else {
    hashSequence = `${salt}|${status}||||||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
  }

  const calculatedHash = crypto.createHash('sha512').update(hashSequence).digest('hex');
  return calculatedHash.toLowerCase() === (params.hash || '').toLowerCase();
}

// POST /api/payments/payu/initiate - Initiate PayU Transaction
router.post('/initiate', async (req, res) => {
  try {
    const { amount, rider_name, mobile, email, purpose, reservation_id, return_url } = req.body;
    const numAmount = parseFloat(amount || 0);

    if (numAmount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Valid payment amount is required' });
    }

    const creds = await getPayUCredentials();
    if (!creds.active) {
      return res.status(403).json({ status: 'error', message: 'PayU Payment Gateway is currently disabled by Admin' });
    }

    const txnid = `EVGPAYU${Date.now()}${Math.floor(100 + Math.random() * 900)}`;
    const cleanMobile = (mobile || '').replace(/\D/g, '') || '9876543210';
    const cleanName = (rider_name || 'Evegah Rider').trim();
    let resolvedEmail = (email || '').trim();
    if (!resolvedEmail || resolvedEmail === 'rider@evegah.com') {
      try {
        const last10 = cleanMobile.slice(-10);
        const renterQuery = await db.query(
          "SELECT email FROM renters WHERE mobile LIKE $1 AND email IS NOT NULL AND email != '' AND email != 'rider@evegah.com' LIMIT 1",
          [`%${last10}%`]
        );
        if (renterQuery.rows.length > 0 && renterQuery.rows[0].email) {
          resolvedEmail = renterQuery.rows[0].email.trim();
        } else {
          const userQuery = await db.query(
            "SELECT email FROM users WHERE (mobile LIKE $1 OR phone LIKE $1) AND email IS NOT NULL AND email != '' AND email != 'rider@evegah.com' LIMIT 1",
            [`%${last10}%`]
          );
          if (userQuery.rows.length > 0 && userQuery.rows[0].email) {
            resolvedEmail = userQuery.rows[0].email.trim();
          }
        }
      } catch (_) {}
    }
    const cleanEmail = (resolvedEmail && resolvedEmail !== 'rider@evegah.com')
      ? resolvedEmail
      : `rider_${cleanMobile}@evegah.com`;
    const formattedAmount = numAmount.toFixed(2);
    const productInfo = purpose === 'ride' ? 'Evegah Ride Booking' : 'Evegah Wallet Top-Up';

    // Base callback URLs
    const host = req.get('host') || 'evegah.cloud';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const backendBase = `${protocol}://${host}/api/payments/payu`;

    const surl = `${backendBase}/response?client_redirect=${encodeURIComponent(return_url || '')}`;
    const furl = `${backendBase}/response?client_redirect=${encodeURIComponent(return_url || '')}`;

    const udf1 = purpose || 'wallet';
    const udf2 = reservation_id || '';
    const udf3 = cleanMobile;
    const udf4 = '';
    const udf5 = '';

    // Calculate official PayU SHA-512 Hash
    const hash = generatePayUHash({
      key: creds.key,
      txnid,
      amount: formattedAmount,
      productinfo: productInfo,
      firstname: cleanName,
      email: cleanEmail,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      salt: creds.salt
    });

    const payuActionUrl = creds.env === 'production'
      ? 'https://secure.payu.in/_payment'
      : 'https://test.payu.in/_payment';

    // Save pending transaction to payu_payments
    try {
      await db.query(`
        INSERT INTO payu_payments (tx_id, amount, rider_name, mobile, email, status, purpose, reservation_id)
        VALUES ($1, $2, $3, $4, $5, 'Pending', $6, $7)
      `, [txnid, numAmount, cleanName, cleanMobile, cleanEmail, purpose || 'wallet', reservation_id || null]);
    } catch (dbErr) {
      console.warn('Could not record PayU payment in DB:', dbErr.message);
    }

    res.json({
      status: 'success',
      data: {
        txnid,
        key: creds.key,
        amount: formattedAmount,
        productinfo: productInfo,
        firstname: cleanName,
        email: cleanEmail,
        phone: cleanMobile,
        surl,
        furl,
        hash,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
        action_url: payuActionUrl,
        checkout_url: `${backendBase}/checkout/${txnid}`,
        environment: creds.env
      }
    });
  } catch (err) {
    console.error('Error initiating PayU transaction:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/payments/payu/checkout/:txnid - Hosted Auto-Submitting Form for PayU
router.get('/checkout/:txnid', async (req, res) => {
  try {
    const { txnid } = req.params;
    const result = await db.query('SELECT * FROM payu_payments WHERE tx_id = $1 LIMIT 1', [txnid]);
    if (result.rows.length === 0) {
      return res.status(404).send('Transaction not found or expired');
    }
    const payment = result.rows[0];
    const creds = await getPayUCredentials();

    const formattedAmount = parseFloat(payment.amount).toFixed(2);
    const productInfo = payment.purpose === 'ride' ? 'Evegah Ride Booking' : 'Evegah Wallet Top-Up';
    const cleanMobile = (payment.mobile || '').replace(/\D/g, '') || '9876543210';
    const cleanEmail = (payment.email && payment.email.trim() !== 'rider@evegah.com')
      ? payment.email.trim()
      : `rider_${cleanMobile}@evegah.com`;

    const host = req.get('host') || 'evegah.cloud';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const backendBase = `${protocol}://${host}/api/payments/payu`;
    const surl = `${backendBase}/response`;
    const furl = `${backendBase}/response`;

    const udf1 = payment.purpose || 'wallet';
    const udf2 = payment.reservation_id || '';
    const udf3 = cleanMobile;
    const udf4 = '';
    const udf5 = '';

    const hash = generatePayUHash({
      key: creds.key,
      txnid,
      amount: formattedAmount,
      productinfo: productInfo,
      firstname: cleanName,
      email: cleanEmail,
      udf1, udf2, udf3, udf4, udf5,
      salt: creds.salt
    });

    const payuActionUrl = creds.env === 'production'
      ? 'https://secure.payu.in/_payment'
      : 'https://test.payu.in/_payment';

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Redirecting to PayU Secure Checkout...</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FAFAFA; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          .loader-box { text-align: center; background: #fff; padding: 36px 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
          .spinner { width: 44px; height: 44px; border: 4px solid #F1F5F9; border-top-color: #528900; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
          @keyframes spin { to { transform: rotate(360deg); } }
          h3 { margin: 0 0 6px; color: #0F172A; font-size: 18px; font-weight: 700; }
          p { margin: 0; color: #64748B; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="loader-box">
          <div class="spinner"></div>
          <h3>Connecting to PayU...</h3>
          <p>Please wait, redirecting securely to PayU Payment Gateway.</p>
        </div>
        <form id="payuForm" method="POST" action="${payuActionUrl}">
          <input type="hidden" name="key" value="${creds.key}" />
          <input type="hidden" name="txnid" value="${txnid}" />
          <input type="hidden" name="amount" value="${formattedAmount}" />
          <input type="hidden" name="productinfo" value="${productInfo}" />
          <input type="hidden" name="firstname" value="${cleanName}" />
          <input type="hidden" name="email" value="${cleanEmail}" />
          <input type="hidden" name="phone" value="${cleanMobile}" />
          <input type="hidden" name="surl" value="${surl}" />
          <input type="hidden" name="furl" value="${furl}" />
          <input type="hidden" name="hash" value="${hash}" />
          <input type="hidden" name="udf1" value="${udf1}" />
          <input type="hidden" name="udf2" value="${udf2}" />
          <input type="hidden" name="udf3" value="${udf3}" />
          <input type="hidden" name="udf4" value="${udf4}" />
          <input type="hidden" name="udf5" value="${udf5}" />
        </form>
        <script>
          document.getElementById("payuForm").submit();
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error rendering PayU hosted checkout:', err);
    res.status(500).send('Unable to initiate PayU payment: ' + err.message);
  }
});

// POST & GET /api/payments/payu/response - Handle PayU Callback
router.all('/response', async (req, res) => {
  try {
    const payload = { ...req.query, ...req.body };
    let {
      txnid,
      status,
      amount,
      payuMoneyId,
      mihpayid,
      bank_ref_num,
      error_Message,
      error_message,
      udf1, // purpose
      udf2, // reservation_id
      udf3, // mobile
      firstname,
      email,
      client_redirect
    } = payload;

    // Check existing payment in database if txnid exists
    let existingPayment = null;
    if (txnid) {
      try {
        const pRes = await db.query('SELECT * FROM payu_payments WHERE tx_id = $1 LIMIT 1', [txnid]);
        if (pRes.rows && pRes.rows.length > 0) {
          existingPayment = pRes.rows[0];
        }
      } catch (e) {
        console.warn('DB check for existing payment notice:', e.message);
      }
    }

    if (existingPayment) {
      if (!amount || parseFloat(amount) === 0) amount = existingPayment.amount;
      if (!udf1) udf1 = existingPayment.purpose;
      if (!udf2) udf2 = existingPayment.reservation_id;
      if (!udf3) udf3 = existingPayment.mobile;
      if (!firstname) firstname = existingPayment.rider_name;
      if (!email) email = existingPayment.email;
    }

    const creds = await getPayUCredentials();
    const isHashValid = verifyPayUResponseHash(payload, creds.salt);
    const payuTxId = mihpayid || payuMoneyId || existingPayment?.payu_id || '';
    let numAmount = parseFloat(amount || (existingPayment ? existingPayment.amount : 0));

    let isSuccess = (status || '').toLowerCase() === 'success' && (isHashValid || creds.env === 'test');

    // If status is success from PayU, but hash didn't match (due to proxy, encoding, or additionalCharges), verify with PayU server directly
    if (!isSuccess && (status || '').toLowerCase() === 'success' && txnid) {
      console.log(`PayU response hash verification fallback for ${txnid}...`);
      const verifyRes = await verifyPayUPaymentWithGateway(txnid);
      if (verifyRes.verified && verifyRes.status === 'Success') {
        isSuccess = true;
        if (verifyRes.amount) numAmount = verifyRes.amount;
      }
    }

    // If already marked as Success in DB, retain Success status
    if (!isSuccess && existingPayment && (existingPayment.status || '').toLowerCase() === 'success') {
      isSuccess = true;
      numAmount = parseFloat(existingPayment.amount || numAmount);
    }

    const cleanMobile = (udf3 || '').replace(/\D/g, '');
    const purpose = udf1 || 'wallet';
    const reservationId = udf2 || null;
    const errMsg = error_Message || error_message || null;

    // Update payu_payments record
    try {
      if (txnid) {
        await db.query(`
          UPDATE payu_payments
          SET status = $1, payu_id = COALESCE($2, payu_id), bank_ref_num = COALESCE($3, bank_ref_num), 
              error_message = $4, raw_response = $5, updated_at = NOW()
          WHERE tx_id = $6
        `, [isSuccess ? 'Success' : 'Failed', payuTxId || null, bank_ref_num || null, errMsg, JSON.stringify(payload), txnid]);
      }
    } catch (e) {
      console.warn('Failed to update payu_payments table:', e.message);
    }

    if (isSuccess) {
      // 1. If wallet top-up, credit rider wallet
      if (purpose === 'wallet' && cleanMobile && numAmount > 0) {
        try {
          await db.query(
            'UPDATE renters SET wallet_balance = COALESCE(wallet_balance, 0.00) + $1 WHERE mobile LIKE $2 OR mobile LIKE $3',
            [numAmount, `%${cleanMobile.slice(-10)}%`, `%${cleanMobile}%`]
          );

          await db.query(`
            INSERT INTO wallet_transactions (mobile, title, subtitle, amount, type, status, payment_method, transaction_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [
            cleanMobile,
            'Wallet Top-Up (PayU)',
            `PayU Ref: ${payuTxId || txnid}`,
            numAmount,
            'Credit',
            'Success',
            'PayU India',
            txnid
          ]);
        } catch (walletErr) {
          console.error('Failed to credit wallet on PayU success:', walletErr.message);
        }
      }

      // 2. If ride reservation, confirm reservation
      if (reservationId) {
        try {
          await db.query(
            `UPDATE reservations SET payment_status = 'Paid', payment_mode = 'PayU', status = 'Confirmed', transaction_id = $1 WHERE id::text = $2 OR reservation_id = $2`,
            [txnid, reservationId]
          );
        } catch (resErr) {
          console.warn('Failed to update reservation on PayU success:', resErr.message);
        }
      }

      // Send WhatsApp Receipt
      if (cleanMobile && numAmount > 0) {
        sendWhatsAppReceipt({
          mobile: cleanMobile,
          name: firstname || 'Rider',
          invoice_no: txnid,
          plan: purpose === 'ride' ? 'EV Ride Booking' : 'Wallet Top-Up',
          amount: numAmount
        }).catch((wErr) => console.error('[PayU] WhatsApp receipt notice:', wErr.message));
      }
    }

    // Redirect to client return URL if provided
    if (client_redirect && client_redirect.startsWith('http')) {
      const redirectUrl = new URL(client_redirect);
      redirectUrl.searchParams.set('status', isSuccess ? 'success' : 'failed');
      redirectUrl.searchParams.set('txnid', txnid || '');
      redirectUrl.searchParams.set('amount', numAmount.toString());
      return res.redirect(redirectUrl.toString());
    }

    // HTML response for webview / browser
    const statusColor = isSuccess ? '#22C55E' : '#EF4444';
    const statusTitle = isSuccess ? 'Payment Successful!' : 'Payment Failed';
    const statusMsg = isSuccess
      ? `Your payment of ₹${numAmount.toFixed(2)} via PayU was processed successfully.`
      : (errMsg || 'Transaction could not be completed. Please try again.');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${statusTitle} - Evegah Mobility</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F8FAFC; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
          .card { background: #FFFFFF; max-width: 420px; width: 100%; border-radius: 20px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); text-align: center; }
          .icon { width: 68px; height: 68px; border-radius: 50%; background: ${isSuccess ? '#DCFCE7' : '#FEE2E2'}; color: ${statusColor}; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 20px; }
          h2 { margin: 0 0 10px; color: #0F172A; font-size: 22px; font-weight: 800; }
          p { margin: 0 0 24px; color: #64748B; font-size: 14px; line-height: 1.5; }
          .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F1F5F9; font-size: 13px; }
          .row:last-child { border-bottom: none; }
          .lbl { color: #94A3B8; font-weight: 500; }
          .val { color: #0F172A; font-weight: 700; font-family: monospace; }
          .btn { display: inline-block; width: 100%; margin-top: 24px; padding: 14px; background: #2A195C; color: #FFF; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; box-sizing: border-box; cursor: pointer; border: none; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">${isSuccess ? '✓' : '✕'}</div>
          <h2>${statusTitle}</h2>
          <p>${statusMsg}</p>
          <div class="row"><span class="lbl">Transaction ID</span><span class="val">${txnid || '—'}</span></div>
          <div class="row"><span class="lbl">Amount</span><span class="val">₹${numAmount.toFixed(2)}</span></div>
          <div class="row"><span class="lbl">Gateway</span><span class="val">PayU India</span></div>
          <div class="row"><span class="lbl">Status</span><span class="val" style="color: ${statusColor};">${isSuccess ? 'SUCCESS' : 'FAILED'}</span></div>
          <button onclick="if(window.opener){window.close();}else{window.history.back();}" class="btn">${isSuccess ? 'Continue to App' : 'Close Window'}</button>
        </div>
        <script>
          if (${isSuccess}) {
            setTimeout(function() {
              try {
                if (window.opener) { window.close(); }
              } catch (_) {}
            }, 1500);
          }
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error handling PayU callback:', err);
    res.status(500).send('Internal payment callback error');
  }
});

/**
 * Verify payment status directly with PayU Gateway via verify_payment command
 */
async function verifyPayUPaymentWithGateway(txnid) {
  try {
    const creds = await getPayUCredentials();
    const command = 'verify_payment';
    const hashString = `${creds.key}|${command}|${txnid}|${creds.salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    const endpoint = creds.env === 'production'
      ? 'https://info.payu.in/merchant/postservice.php?form=2'
      : 'https://test.payu.in/merchant/postservice.php?form=2';

    const params = new URLSearchParams({
      key: creds.key,
      command,
      var1: txnid,
      hash
    });

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch (_) {}

    if (json && json.status == 1 && json.transaction_details && json.transaction_details[txnid]) {
      const tx = json.transaction_details[txnid];
      return {
        verified: true,
        status: (tx.status || '').toLowerCase() === 'success' ? 'Success' : 'Failed',
        payuId: tx.mihpayid,
        bankRefNum: tx.bank_ref_num,
        amount: parseFloat(tx.amt || tx.transaction_amount || 0),
        raw: tx
      };
    }
  } catch (err) {
    console.warn('PayU verify_payment error:', err.message);
  }
  return { verified: false };
}

// GET /api/payments/payu/status/:txnid - Query transaction status with auto-verification
router.get('/status/:txnid', async (req, res) => {
  try {
    const { txnid } = req.params;
    let result = await db.query('SELECT * FROM payu_payments WHERE tx_id = $1 LIMIT 1', [txnid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Transaction not found' });
    }

    let payment = result.rows[0];

    // Auto-verify with PayU if still Pending
    if (payment.status === 'Pending') {
      const verifyRes = await verifyPayUPaymentWithGateway(txnid);
      if (verifyRes.verified && verifyRes.status === 'Success') {
        const payuTxId = verifyRes.payuId || '';
        const bankRef = verifyRes.bankRefNum || '';

        await db.query(`
          UPDATE payu_payments 
          SET status = 'Success', payu_id = $1, bank_ref_num = $2, updated_at = NOW() 
          WHERE tx_id = $3
        `, [payuTxId, bankRef, txnid]);

        // If ride reservation, confirm reservation
        if (payment.reservation_id) {
          await db.query(
            `UPDATE reservations SET payment_status = 'Paid', payment_mode = 'PayU', status = 'Confirmed', transaction_id = $1 WHERE id::text = $2 OR reservation_id = $2`,
            [txnid, payment.reservation_id]
          ).catch(() => {});
        }

        // If wallet top-up, credit wallet
        if (payment.purpose === 'wallet' && payment.mobile && parseFloat(payment.amount) > 0) {
          const cleanMob = payment.mobile.replace(/\D/g, '').slice(-10);
          await db.query(
            'UPDATE renters SET wallet_balance = COALESCE(wallet_balance, 0.00) + $1 WHERE mobile LIKE $2',
            [parseFloat(payment.amount), `%${cleanMob}%`]
          ).catch(() => {});
        }

        result = await db.query('SELECT * FROM payu_payments WHERE tx_id = $1 LIMIT 1', [txnid]);
        payment = result.rows[0];
      }
    }

    res.json({
      status: 'success',
      data: payment
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/payments/payu/refund - Process Refund via PayU
router.post('/refund', async (req, res) => {
  try {
    const { payu_id, tx_id, amount, refund_tx_id, reason } = req.body;
    const numAmount = parseFloat(amount || 0);

    if (numAmount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Valid refund amount is required' });
    }

    const result = await processPayURefund({
      payuId: payu_id || tx_id,
      amount: numAmount,
      refundTxId: refund_tx_id
    });

    if (!result.success) {
      return res.status(400).json({
        status: 'error',
        message: result.error || 'PayU refund rejected by gateway',
        data: result
      });
    }

    res.json({
      status: 'success',
      message: result.message,
      data: result
    });
  } catch (err) {
    console.error('PayU refund error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * Process Live Refund via PayU Gateway (cancel_refund_transaction)
 */
async function processPayURefund({ payuId, txnid, reservationId, mobile, amount, refundTxId }) {
  const creds = await getPayUCredentials();
  const formattedAmount = parseFloat(amount).toFixed(2);
  const token = refundTxId || `REF-${Date.now()}`;

  // 1. Dynamically resolve PayU's internal payment ID (mihpayid)
  let mihpayid = '';

  // Check if payuId is already a numeric PayU ID
  if (payuId && /^\d{6,}$/.test(String(payuId).trim())) {
    mihpayid = String(payuId).trim();
  }

  // Look up in payu_payments table by tx_id (merchant transaction ID)
  if (!mihpayid) {
    const lookupTx = txnid || (payuId && String(payuId).startsWith('EVG') ? payuId : null);
    if (lookupTx) {
      const q = await db.query(
        "SELECT payu_id, tx_id FROM payu_payments WHERE tx_id = $1 AND payu_id IS NOT NULL AND payu_id != '' LIMIT 1",
        [lookupTx]
      ).catch(() => ({ rows: [] }));
      if (q.rows.length > 0 && q.rows[0].payu_id && /^\d+$/.test(q.rows[0].payu_id)) {
        mihpayid = q.rows[0].payu_id;
      }
    }
  }

  // Look up by reservation_id
  if (!mihpayid && reservationId) {
    try {
      const resRow = await db.query(
        "SELECT transaction_id, mobile FROM reservations WHERE id::text = $1 OR reservation_id = $1 LIMIT 1",
        [String(reservationId)]
      );
      if (resRow.rows.length > 0) {
        const rTx = resRow.rows[0].transaction_id;
        if (rTx && /^\d{6,}$/.test(String(rTx).trim())) {
          mihpayid = String(rTx).trim();
        } else if (rTx && String(rTx).startsWith('EVG')) {
          const q = await db.query(
            "SELECT payu_id FROM payu_payments WHERE tx_id = $1 AND payu_id IS NOT NULL AND payu_id != '' LIMIT 1",
            [rTx]
          );
          if (q.rows.length > 0 && q.rows[0].payu_id && /^\d+$/.test(q.rows[0].payu_id)) {
            mihpayid = q.rows[0].payu_id;
          }
        }
        if (!mobile && resRow.rows[0].mobile) {
          mobile = resRow.rows[0].mobile;
        }
      }
    } catch (_) {}

    if (!mihpayid) {
      const q = await db.query(
        "SELECT payu_id, tx_id FROM payu_payments WHERE (reservation_id = $1 OR tx_id LIKE $2) AND payu_id IS NOT NULL AND payu_id != '' ORDER BY id DESC LIMIT 1",
        [String(reservationId), `%${String(reservationId).slice(-6)}%`]
      ).catch(() => ({ rows: [] }));
      if (q.rows.length > 0 && q.rows[0].payu_id && /^\d+$/.test(q.rows[0].payu_id)) {
        mihpayid = q.rows[0].payu_id;
      }
    }
  }

  // Look up by mobile
  if (!mihpayid && mobile) {
    const cleanMob = String(mobile).replace(/\D/g, '').slice(-10);
    if (cleanMob.length === 10) {
      const q = await db.query(
        "SELECT payu_id, tx_id FROM payu_payments WHERE mobile LIKE $1 AND status = 'Success' AND payu_id IS NOT NULL AND payu_id != '' ORDER BY id DESC LIMIT 1",
        [`%${cleanMob}%`]
      ).catch(() => ({ rows: [] }));
      if (q.rows.length > 0 && q.rows[0].payu_id && /^\d+$/.test(q.rows[0].payu_id)) {
        mihpayid = q.rows[0].payu_id;
      }
    }
  }

  // If still not resolved, query PayU Gateway verify_payment API live using txnid
  const effectiveTxnid = txnid || (payuId && String(payuId).startsWith('EVG') ? payuId : null);
  if (!mihpayid && effectiveTxnid) {
    try {
      const verifyRes = await verifyPayUPaymentWithGateway(effectiveTxnid);
      if (verifyRes.verified && verifyRes.payuId) {
        mihpayid = String(verifyRes.payuId);
        // Save payu_id in DB for future reference
        await db.query(
          "UPDATE payu_payments SET payu_id = $1 WHERE tx_id = $2",
          [mihpayid, effectiveTxnid]
        ).catch(() => {});
      }
    } catch (e) {
      console.warn('PayU live verification during refund error:', e.message);
    }
  }

  if (!mihpayid) {
    return {
      success: false,
      error: `Could not resolve PayU Payment ID (mihpayid) for booking ${reservationId || effectiveTxnid || 'unknown'}. Only rides paid through PayU Gateway can be refunded via this live gateway API.`
    };
  }

  // 2. Compute PayU Hash for cancel_refund_transaction
  // Formula: sha512(key|command|var1|salt) where var1 is mihpayid
  const command = 'cancel_refund_transaction';
  const hashString = `${creds.key}|${command}|${mihpayid}|${creds.salt}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  const endpoint = creds.env === 'production'
    ? 'https://info.payu.in/merchant/postservice.php?form=2'
    : 'https://test.payu.in/merchant/postservice.php?form=2';

  try {
    const params = new URLSearchParams();
    params.append('key', creds.key);
    params.append('command', command);
    params.append('var1', mihpayid);
    params.append('var2', token);
    params.append('var3', formattedAmount);
    params.append('hash', hash);

    const fetchRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const textRes = await fetchRes.text();
    let jsonRes = null;
    try {
      jsonRes = JSON.parse(textRes);
    } catch (_) {}

    // PayU response format:
    // Success: { "status": 1, "msg": "Refund Request Queued", "request_id": "...", "bank_ref_num": "..." }
    // Failure: { "status": 0, "msg": "..." }
    const isSuccess = jsonRes && (
      (jsonRes.status == 1 || jsonRes.status === '1') &&
      jsonRes.status != 0 &&
      jsonRes.status !== '0'
    );

    if (isSuccess) {
      const payuRequestId = jsonRes.request_id || token;
      const bankRef = jsonRes.bank_ref_num || '';

      await db.query(`
        INSERT INTO payu_payments (tx_id, payu_id, amount, status, purpose, bank_ref_num, raw_response)
        VALUES ($1, $2, $3, 'Refunded', 'Security Deposit Refund via PayU', $4, $5)
      `, [token, mihpayid, formattedAmount, bankRef, JSON.stringify(jsonRes)]).catch(() => {});

      return {
        success: true,
        refund_tx_id: token,
        payu_request_id: payuRequestId,
        bank_ref_num: bankRef,
        gateway: 'PayU India',
        message: jsonRes.msg || `PayU refund of ₹${formattedAmount} queued successfully.`,
        raw: jsonRes
      };
    } else {
      const errMsg = jsonRes?.msg || textRes || 'PayU refund request failed or rejected by gateway.';
      console.warn('PayU Gateway rejected refund:', errMsg, 'Response:', textRes);

      await db.query(`
        INSERT INTO payu_payments (tx_id, payu_id, amount, status, purpose, error_message, raw_response)
        VALUES ($1, $2, $3, 'Refund_Failed', 'PayU Refund Attempt Rejected', $4, $5)
      `, [token, mihpayid, formattedAmount, errMsg, JSON.stringify(jsonRes || { raw: textRes })]).catch(() => {});

      return {
        success: false,
        error: errMsg,
        raw: jsonRes || textRes
      };
    }
  } catch (err) {
    console.error('PayU Refund Network error:', err.message);
    return {
      success: false,
      error: `Network error connecting to PayU Gateway: ${err.message}`
    };
  }
}

router.processPayURefund = processPayURefund;
module.exports = router;

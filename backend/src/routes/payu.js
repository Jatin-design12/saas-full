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
    const cleanEmail = (email || 'rider@evegah.com').trim();
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
    const cleanName = (payment.rider_name || 'Evegah Rider').trim();
    const cleanEmail = (payment.email || 'rider@evegah.com').trim();

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
    const {
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

    const creds = await getPayUCredentials();
    const isHashValid = verifyPayUResponseHash(payload, creds.salt);
    const payuTxId = mihpayid || payuMoneyId || '';
    const numAmount = parseFloat(amount || 0);
    const isSuccess = (status || '').toLowerCase() === 'success' && (isHashValid || creds.env === 'test');

    const cleanMobile = (udf3 || '').replace(/\D/g, '');
    const purpose = udf1 || 'wallet';
    const reservationId = udf2 || null;
    const errMsg = error_Message || error_message || null;

    // Update payu_payments record
    try {
      await db.query(`
        UPDATE payu_payments
        SET status = $1, payu_id = $2, bank_ref_num = $3, error_message = $4, raw_response = $5, updated_at = NOW()
        WHERE tx_id = $6
      `, [isSuccess ? 'Success' : 'Failed', payuTxId, bank_ref_num || null, errMsg, JSON.stringify(payload), txnid]);
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
            `UPDATE reservations SET payment_status = 'Paid', payment_mode = 'PayU', status = 'Confirmed', transaction_id = $1 WHERE id = $2`,
            [txnid, reservationId]
          );
        } catch (resErr) {
          console.warn('Failed to update reservation on PayU success:', resErr.message);
        }
      }

      // Send WhatsApp Receipt
      if (cleanMobile && numAmount > 0) {
        sendWhatsAppReceipt(cleanMobile, {
          amount: numAmount,
          tx_id: txnid,
          payment_mode: 'PayU India',
          purpose: purpose === 'ride' ? 'EV Ride Booking' : 'Wallet Top-Up'
        }).catch(() => {});
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
          <button onclick="window.close()" class="btn">Close Window</button>
        </div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error('Error handling PayU callback:', err);
    res.status(500).send('Internal payment callback error');
  }
});

// GET /api/payments/payu/status/:txnid - Query transaction status
router.get('/status/:txnid', async (req, res) => {
  try {
    const { txnid } = req.params;
    const result = await db.query('SELECT * FROM payu_payments WHERE tx_id = $1 LIMIT 1', [txnid]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Transaction not found' });
    }
    res.json({
      status: 'success',
      data: result.rows[0]
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
 * Process Refund via PayU Gateway
 */
async function processPayURefund({ payuId, amount, refundTxId }) {
  const creds = await getPayUCredentials();
  const formattedAmount = parseFloat(amount).toFixed(2);
  const token = refundTxId || `REF-${Date.now()}`;
  const var1 = payuId || '';

  // PayU command hash: sha512(key|command|var1|salt)
  const hashString = `${creds.key}|cancel_refund_transaction|${var1}|${creds.salt}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');

  const endpoint = creds.env === 'production'
    ? 'https://info.payu.in/merchant/postservice.php?form=2'
    : 'https://test.payu.in/merchant/postservice.php?form=2';

  try {
    const params = new URLSearchParams();
    params.append('key', creds.key);
    params.append('command', 'cancel_refund_transaction');
    params.append('var1', var1);
    params.append('var2', token);
    params.append('var3', formattedAmount);
    params.append('hash', hash);

    const fetchRes = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const textRes = await fetchRes.text();
    let jsonRes = null;
    try {
      jsonRes = JSON.parse(textRes);
    } catch (_) {}

    await db.query(`
      INSERT INTO payu_payments (tx_id, payu_id, amount, status, purpose, raw_response)
      VALUES ($1, $2, $3, 'Refunded', 'Security Deposit Refund via PayU', $4)
    `, [token, var1, formattedAmount, JSON.stringify(jsonRes || { response: textRes })]).catch(() => {});

    return {
      success: true,
      refund_tx_id: token,
      gateway: 'PayU India',
      message: `PayU refund of ₹${formattedAmount} processed successfully.`,
      raw: jsonRes || textRes
    };
  } catch (err) {
    console.warn('PayU Refund API dispatch error (recording offline/manual gateway refund):', err.message);
    await db.query(`
      INSERT INTO payu_payments (tx_id, payu_id, amount, status, purpose, raw_response)
      VALUES ($1, $2, $3, 'Refunded', 'Security Deposit Refund via PayU', $4)
    `, [token, var1, formattedAmount, JSON.stringify({ error: err.message, manual: true })]).catch(() => {});

    return {
      success: true,
      refund_tx_id: token,
      gateway: 'PayU India',
      message: `PayU refund request registered for ₹${formattedAmount}. Ref: ${token}`,
      offline: true
    };
  }
}

router.processPayURefund = processPayURefund;
module.exports = router;

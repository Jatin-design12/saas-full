const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { sendWhatsAppReceipt } = require('../utils/whatsapp');
const {
  encryptIciciAsymmetricPayload,
  decryptIciciAsymmetricPayload,
  getIciciCryptoStatus,
  getIciciPublicCertificateInfo,
} = require('../utils/iciciCrypto');

const ICICI_MID = process.env.ICICI_MID || '9496988';
const ICICI_TERMINAL_ID = process.env.ICICI_TERMINAL_ID || '5411';
const ICICI_VPA = process.env.ICICI_VPA || 'EVEGAHRIDE@icici';
const ICICI_API_KEY = process.env.ICICI_API_KEY || 'azLgqWskbTHg6gdGTSif2DNIA7b15MlJ';
const ICICI_PAYEE_NAME = process.env.ICICI_PAYEE_NAME || 'Evegah';
const ICICI_BASE_URL = process.env.ICICI_BASE_URL || 'https://apibankingone.icici.bank.in/api/MerchantAPI/UPI/v0';
const ICICI_QR_ENDPOINT = process.env.ICICI_QR_ENDPOINT || `/QR3/${ICICI_MID}`;
const ICICI_STATUS_ENDPOINT = process.env.ICICI_TRANSACTION_STATUS_ENDPOINT || `/TransactionStatus3/${ICICI_MID}`;

// Ensure icici_payments table exists in PostgreSQL
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS icici_payments (
        id SERIAL PRIMARY KEY,
        tx_id VARCHAR(100) UNIQUE NOT NULL,
        merchant_id VARCHAR(50) DEFAULT '${ICICI_MID}',
        terminal_id VARCHAR(50) DEFAULT '${ICICI_TERMINAL_ID}',
        ref_id VARCHAR(100),
        amount NUMERIC(10, 2) NOT NULL,
        rider_name VARCHAR(100),
        mobile VARCHAR(50),
        vpa VARCHAR(100) DEFAULT '${ICICI_VPA}',
        status VARCHAR(50) DEFAULT 'Pending',
        upi_ref_no VARCHAR(100),
        purpose VARCHAR(50) DEFAULT 'wallet',
        reservation_id VARCHAR(100),
        upstream_response TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await db.query(`ALTER TABLE icici_payments ADD COLUMN IF NOT EXISTS ref_id VARCHAR(100)`);
    await db.query(`ALTER TABLE icici_payments ADD COLUMN IF NOT EXISTS terminal_id VARCHAR(50) DEFAULT '${ICICI_TERMINAL_ID}'`);
    await db.query(`ALTER TABLE icici_payments ADD COLUMN IF NOT EXISTS upstream_response TEXT`);
    await db.query(`ALTER TABLE icici_payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW()`);
  } catch (e) {
    console.warn('ICICI DB init warning:', e.message);
  }
})();

// Helper function to decode ICICI response
function decodeIciciResponse(rawText) {
  if (!rawText) return null;
  const trimmed = String(rawText).trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  const cryptoStatus = getIciciCryptoStatus();
  if (cryptoStatus.hasPrivateKey) {
    try {
      return decryptIciciAsymmetricPayload(trimmed);
    } catch (e) {
      console.warn('Could not decrypt with client private key:', e.message);
    }
  }

  return null;
}

// Handler for generating ICICI Dynamic UPI QR
async function handleGenerateQr(req, res) {
  try {
    const {
      amount,
      rider_name,
      mobile,
      notes,
      purpose,
      reservation_id,
      merchantTranId,
      billNumber,
      terminalId,
    } = req.body || {};

    const numAmount = parseFloat(amount || 0);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const mcc = String(terminalId || ICICI_TERMINAL_ID || '5411').trim();
    const cleanMobile = (mobile || '').replace(/\D/g, '');
    const cleanRider = rider_name || 'Rider';
    const noteText = notes || (purpose === 'ride' ? 'EV Ride Booking' : 'Evegah Wallet Top-Up');

    // Dynamic unique transaction ID matching standard ICICI pattern: EVG<timestamp><hex>
    const txnId = String(merchantTranId || '').trim() ||
      String(billNumber || '').trim() ||
      `EVG${Date.now()}${crypto.randomBytes(2).toString('hex')}`;

    const payload = {
      amount: numAmount.toFixed(2),
      merchantId: String(ICICI_MID),
      subMerchantId: String(ICICI_MID),
      terminalId: mcc,
      merchantTranId: txnId,
      billNumber: txnId.slice(0, 50),
    };

    let upstream = null;
    let refId = null;
    let encryptedFallback = false;

    // Call upstream ICICI Bank Live API with asymmetric RSA encryption
    try {
      const encryptedBody = encryptIciciAsymmetricPayload(payload);
      const upstreamUrl = `${ICICI_BASE_URL}${ICICI_QR_ENDPOINT}`;

      const response = await fetch(upstreamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          Accept: '*/*',
          apikey: ICICI_API_KEY,
        },
        body: encryptedBody,
      });

      const rawText = await response.text().catch(() => '');
      const decoded = decodeIciciResponse(rawText);

      if (decoded && typeof decoded === 'object') {
        upstream = decoded;
        refId = decoded.refId || decoded.refid || decoded.RefId || decoded.refID || null;
      } else {
        encryptedFallback = true;
        upstream = {
          merchantId: String(ICICI_MID),
          terminalId: mcc,
          success: 'true',
          response: '0',
          message: 'Transaction initiated',
          refId: txnId,
        };
        refId = txnId;
      }
    } catch (callErr) {
      console.warn('ICICI API call warning:', callErr.message);
      encryptedFallback = true;
      refId = txnId;
      upstream = {
        merchantId: String(ICICI_MID),
        terminalId: mcc,
        success: 'true',
        response: '0',
        message: 'Transaction initiated (local fallback)',
        refId: txnId,
      };
    }

    if (!refId) {
      refId = txnId;
    }

    // Official NPCI / ICICI QR String format
    // upi://pay?pa=<merchant VPA>&pn=<merchant name>&tr=<Refid>&am=<amount>&cu=INR&mc=<MCC code>
    const qrString = `upi://pay?pa=${encodeURIComponent(ICICI_VPA)}&pn=${encodeURIComponent(ICICI_PAYEE_NAME)}&tr=${encodeURIComponent(refId)}&am=${numAmount.toFixed(2)}&cu=INR&mc=${mcc}`;

    // Record in PostgreSQL icici_payments table
    try {
      await db.query(`
        INSERT INTO icici_payments (
          tx_id, merchant_id, terminal_id, ref_id, amount, rider_name, mobile, status, purpose, reservation_id, upstream_response
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', $8, $9, $10)
        ON CONFLICT (tx_id) DO UPDATE SET
          amount = EXCLUDED.amount,
          ref_id = EXCLUDED.ref_id,
          updated_at = NOW()
      `, [
        txnId,
        ICICI_MID,
        mcc,
        refId,
        numAmount,
        cleanRider,
        cleanMobile,
        purpose || 'ride',
        reservation_id || null,
        JSON.stringify(upstream),
      ]);
    } catch (dbErr) {
      console.warn('Could not save ICICI transaction in DB:', dbErr.message);
    }

    // Return the response matching exact specifications
    return res.json({
      merchantId: String(ICICI_MID),
      terminalId: mcc,
      merchantTranId: txnId,
      refId: refId,
      qrString: qrString,
      paymentTransactionId: null,
      upstream: upstream,
      encryptedFallback: encryptedFallback,
      status: 'success',
      data: {
        tx_id: txnId,
        ref_id: refId,
        mid: ICICI_MID,
        vpa: ICICI_VPA,
        payee_name: ICICI_PAYEE_NAME,
        amount: numAmount.toFixed(2),
        upi_string: qrString,
        notes: noteText,
        purpose: purpose || 'ride',
        reservation_id: reservation_id || null,
      },
    });
  } catch (error) {
    console.error('ICICI QR generation error:', error);
    return res.status(500).json({ error: String(error?.message || error) });
  }
}

// POST /api/payments/icici/qr
router.post('/qr', handleGenerateQr);

// POST /api/payments/icici/generate-qr & /initiate (aliases)
router.post(['/generate-qr', '/initiate'], handleGenerateQr);

// Handler for status checking & polling
async function handleCheckStatus(req, res) {
  try {
    const merchantTranId = req.body?.merchantTranId || req.body?.tx_id || req.params?.tx_id || req.query?.merchantTranId || req.query?.tx_id;
    if (!merchantTranId) {
      return res.status(400).json({ error: 'merchantTranId or tx_id is required' });
    }

    const txId = String(merchantTranId).trim();

    // 1. Check local DB first
    let dbPayment = null;
    try {
      const q = await db.query('SELECT * FROM icici_payments WHERE tx_id = $1 OR ref_id = $1 LIMIT 1', [txId]);
      if (q.rows.length > 0) {
        dbPayment = q.rows[0];
        if (dbPayment.status === 'SUCCESS' || dbPayment.status === 'Success') {
          return res.json({
            status: 'SUCCESS',
            Status: 'SUCCESS',
            response: '0',
            success: 'true',
            message: 'Transaction Successful',
            merchantTranId: dbPayment.tx_id,
            refId: dbPayment.ref_id,
            OriginalBankRRN: dbPayment.upi_ref_no || '',
            amount: dbPayment.amount,
            paid_at: dbPayment.updated_at,
          });
        }
      }
    } catch (dbErr) {
      console.warn('DB lookup error in status check:', dbErr.message);
    }

    // 2. Query upstream ICICI TransactionStatus3 API
    try {
      const payload = {
        merchantId: String(ICICI_MID),
        subMerchantId: String(ICICI_MID),
        terminalId: String(ICICI_TERMINAL_ID),
        merchantTranId: txId,
      };

      const encryptedBody = encryptIciciAsymmetricPayload(payload);
      const upstreamUrl = `${ICICI_BASE_URL}${ICICI_STATUS_ENDPOINT}`;

      const response = await fetch(upstreamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8',
          Accept: '*/*',
          apikey: ICICI_API_KEY,
        },
        body: encryptedBody,
      });

      const rawText = await response.text().catch(() => '');
      const decoded = decodeIciciResponse(rawText);

      if (decoded && typeof decoded === 'object') {
        const iciciStatus = String(decoded.status || decoded.Status || '').toUpperCase();
        const isSuccess = iciciStatus === 'SUCCESS' || decoded.response === '0';
        const isFailed = iciciStatus === 'FAILURE' || iciciStatus === 'FAILED';

        if (isSuccess) {
          try {
            await db.query(`
              UPDATE icici_payments
              SET status = 'SUCCESS',
                  upi_ref_no = COALESCE($1, upi_ref_no),
                  updated_at = NOW()
              WHERE tx_id = $2 OR ref_id = $2
            `, [decoded.OriginalBankRRN || decoded.originalBankRRN || `ICICI${Date.now()}`, txId]);
          } catch (e) {}

          return res.json({
            status: 'SUCCESS',
            Status: 'SUCCESS',
            ...decoded,
          });
        } else if (isFailed) {
          try {
            await db.query(`
              UPDATE icici_payments
              SET status = 'FAILURE', updated_at = NOW()
              WHERE tx_id = $1 OR ref_id = $1
            `, [txId]);
          } catch (e) {}

          return res.json({
            status: 'FAILURE',
            Status: 'FAILURE',
            ...decoded,
          });
        }
      }
    } catch (iciciErr) {
      console.warn('Upstream ICICI status check error:', iciciErr.message);
    }

    // If still pending
    return res.json({
      status: dbPayment?.status === 'SUCCESS' ? 'SUCCESS' : 'PENDING',
      Status: dbPayment?.status === 'SUCCESS' ? 'SUCCESS' : 'PENDING',
      merchantTranId: txId,
      amount: dbPayment?.amount || null,
      message: 'Transaction is pending customer approval',
    });
  } catch (error) {
    console.error('Status handler error:', error);
    return res.status(500).json({ error: String(error?.message || error) });
  }
}

// POST /api/payments/icici/status
router.post('/status', handleCheckStatus);

// GET /api/payments/icici/status/:tx_id
router.get('/status/:tx_id', handleCheckStatus);

// POST /api/payments/icici/verify
router.post('/verify', async (req, res) => {
  try {
    const { tx_id, upi_ref_no, status, rider_name, mobile, amount, plan, purpose, reservation_id } = req.body;
    const finalStatus = (status || 'SUCCESS').toUpperCase();
    const numAmount = parseFloat(amount || 0);

    // Update icici_payments table
    let resolvedPurpose = purpose || 'ride';
    let resolvedResId = reservation_id;
    try {
      const existing = await db.query('SELECT purpose, reservation_id, amount, mobile FROM icici_payments WHERE tx_id = $1 OR ref_id = $1', [tx_id]);
      if (existing.rows.length > 0) {
        if (!resolvedPurpose && existing.rows[0].purpose) resolvedPurpose = existing.rows[0].purpose;
        if (!resolvedResId && existing.rows[0].reservation_id) resolvedResId = existing.rows[0].reservation_id;
      }
      await db.query(`
        UPDATE icici_payments 
        SET status = $1, upi_ref_no = $2, updated_at = NOW()
        WHERE tx_id = $3 OR ref_id = $3
      `, [finalStatus === 'SUCCESS' ? 'SUCCESS' : 'FAILURE', upi_ref_no || `UPI${Date.now()}`, tx_id]);
    } catch (e) {
      console.warn('DB update error in icici verify:', e.message);
    }

    // If payment is SUCCESS
    if (finalStatus === 'SUCCESS') {
      const cleanMobile = (mobile || '').replace(/\D/g, '');
      const last10 = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

      // Top-Up Wallet if purpose is wallet
      if (resolvedPurpose === 'wallet' && numAmount > 0) {
        try {
          if (last10.length > 0) {
            await db.query(
              `UPDATE renters 
               SET wallet_balance = COALESCE(wallet_balance, 0.00) + $1 
               WHERE mobile LIKE $2 OR mobile LIKE $3`,
              [numAmount, `%${last10}%`, `%${cleanMobile}%`]
            );
          }

          await db.query(`
            INSERT INTO wallet_transactions (mobile, title, subtitle, amount, type, status, payment_method, transaction_id)
            VALUES ($1, 'Wallet Top-Up', 'ICICI UPI Payment', $2, 'Credit', 'Success', 'ICICI UPI', $3)
          `, [cleanMobile || mobile || 'Rider', numAmount, tx_id]);
        } catch (walletDbErr) {
          console.warn('Could not credit wallet in DB:', walletDbErr.message);
        }
      }

      // Update Ride Reservation if purpose is ride
      if (resolvedResId) {
        try {
          await db.query(`
            UPDATE reservations 
            SET payment_status = 'Paid', deposit_status = 'Paid', payment_mode = 'ICICI UPI'
            WHERE id::text = $1 OR reservation_id = $1
          `, [String(resolvedResId)]);
        } catch (resvDbErr) {
          console.warn('Could not mark reservation paid in DB:', resvDbErr.message);
        }
      }

      // Send WhatsApp receipt
      if (mobile) {
        sendWhatsAppReceipt({
          mobile,
          name: rider_name || 'Rider',
          invoice_no: tx_id,
          invoice_date: new Date().toLocaleDateString('en-IN'),
          plan: plan || (resolvedPurpose === 'ride' ? 'EV Ride Booking' : 'Wallet Top-Up'),
          amount: numAmount > 0 ? numAmount.toString() : '0',
        }).catch(err => console.error('WhatsApp receipt error:', err));
      }
    }

    res.json({
      status: 'success',
      message: 'ICICI Payment verified and processed successfully',
      tx_id,
      payment_status: finalStatus,
    });
  } catch (err) {
    console.error('Error verifying ICICI payment:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/payments/icici/callback - Webhook callback from ICICI Bank
router.post('/callback', async (req, res) => {
  try {
    let body = req.body;
    console.log('ICICI Webhook Callback Received:', body);

    // If body is raw text or encrypted
    if (typeof body === 'string') {
      const decoded = decodeIciciResponse(body);
      if (decoded) body = decoded;
    }

    const { tr, merchantTranId, Status, TxnStatus, BankRRN, originalBankRRN } = body || {};
    const txnId = tr || merchantTranId;
    const rawStatus = (Status || TxnStatus || '').toUpperCase();
    const isSuccess = rawStatus === 'SUCCESS' || rawStatus === '0';

    if (txnId) {
      await db.query(`
        UPDATE icici_payments
        SET status = $1, upi_ref_no = $2, updated_at = NOW()
        WHERE tx_id = $3 OR ref_id = $3
      `, [isSuccess ? 'SUCCESS' : 'FAILED', BankRRN || originalBankRRN || '', txnId]);
    }

    res.json({ status: 'SUCCESS', responseCode: '00', message: 'Callback processed' });
  } catch (err) {
    res.status(500).json({ status: 'FAILED', message: err.message });
  }
});

module.exports = router;

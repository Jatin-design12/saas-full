const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendWhatsAppReceipt } = require('../utils/whatsapp');

const ICICI_MID = process.env.ICICI_MID || '9496988';
const ICICI_VPA = process.env.ICICI_VPA || 'EVEGAHRIDE@icici';
const ICICI_API_KEY = process.env.ICICI_API_KEY || 'azLgqWskbTHg6gdGTSif2DNIA7b15MlJ';
const ICICI_PAYEE_NAME = process.env.ICICI_PAYEE_NAME || 'Evegah';
const ICICI_BASE_URL = process.env.ICICI_BASE_URL || 'https://apibankingone.icici.bank.in/api/MerchantAPI/UPI/v0';

// Ensure icici_payments table exists
(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS icici_payments (
        id SERIAL PRIMARY KEY,
        tx_id VARCHAR(100) UNIQUE NOT NULL,
        merchant_id VARCHAR(50) DEFAULT '9496988',
        amount NUMERIC(10, 2) NOT NULL,
        rider_name VARCHAR(100),
        mobile VARCHAR(50),
        vpa VARCHAR(100) DEFAULT 'EVEGAHRIDE@icici',
        status VARCHAR(50) DEFAULT 'Pending',
        upi_ref_no VARCHAR(100),
        purpose VARCHAR(50) DEFAULT 'wallet',
        reservation_id VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    // Ensure purpose & reservation_id columns exist
    await db.query(`ALTER TABLE icici_payments ADD COLUMN IF NOT EXISTS purpose VARCHAR(50) DEFAULT 'wallet'`);
    await db.query(`ALTER TABLE icici_payments ADD COLUMN IF NOT EXISTS reservation_id VARCHAR(100)`);
  } catch (e) {
    console.warn('ICICI DB init warning:', e.message);
  }
})();

// POST /api/payments/icici/generate-qr or /initiate - Initiate ICICI UPI Transaction
router.post(['/generate-qr', '/initiate'], async (req, res) => {
  try {
    const { amount, rider_name, mobile, notes, purpose, reservation_id } = req.body;
    const numAmount = parseFloat(amount || 0);

    if (numAmount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Valid amount is required' });
    }

    const txId = `EVGICICI${Date.now()}`;
    const cleanMobile = (mobile || '').replace(/\D/g, '');
    const cleanRider = rider_name || 'Rider';
    const noteText = notes || (purpose === 'ride' ? 'EV Ride Booking' : 'Evegah Wallet Top-Up');

    // Standard NPCI UPI URI Scheme (as specified in ICICI Bank QR API documentation, Page 9)
    // upi://pay?pa=<merchant VPA>&pn=<merchant name>&tr=<Refid>&am=<amount>&cu=INR&mc=<MCC code>&tn=<note>
    const upiString = `upi://pay?pa=${encodeURIComponent(ICICI_VPA)}&pn=${encodeURIComponent(ICICI_PAYEE_NAME)}&tr=${txId}&am=${numAmount.toFixed(2)}&cu=INR&mc=5411&tn=${encodeURIComponent(noteText)}`;

    // Save transaction in database
    try {
      await db.query(`
        INSERT INTO icici_payments (tx_id, merchant_id, amount, rider_name, mobile, status, purpose, reservation_id)
        VALUES ($1, $2, $3, $4, $5, 'Pending', $6, $7)
      `, [txId, ICICI_MID, numAmount, cleanRider, cleanMobile, purpose || 'wallet', reservation_id || null]);
    } catch (dbErr) {
      console.warn('Could not record ICICI payment in DB:', dbErr.message);
    }

    res.json({
      status: 'success',
      data: {
        tx_id: txId,
        mid: ICICI_MID,
        vpa: ICICI_VPA,
        payee_name: ICICI_PAYEE_NAME,
        amount: numAmount.toFixed(2),
        upi_string: upiString,
        notes: noteText,
        purpose: purpose || 'wallet',
        reservation_id: reservation_id || null,
        api_endpoint: `${ICICI_BASE_URL}/QR3/${ICICI_MID}`
      }
    });
  } catch (err) {
    console.error('Error initiating ICICI UPI payment:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/payments/icici/status/:tx_id - Check transaction status
router.get('/status/:tx_id', async (req, res) => {
  try {
    const { tx_id } = req.params;
    const result = await db.query('SELECT * FROM icici_payments WHERE tx_id = $1 LIMIT 1', [tx_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Transaction not found' });
    }
    const payment = result.rows[0];
    res.json({
      status: 'success',
      data: {
        tx_id: payment.tx_id,
        amount: payment.amount,
        payment_status: payment.status,
        upi_ref_no: payment.upi_ref_no,
        created_at: payment.created_at
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/payments/icici/verify - Verify ICICI payment, update wallet/ride & trigger WhatsApp receipt
router.post('/verify', async (req, res) => {
  try {
    const { tx_id, upi_ref_no, status, rider_name, mobile, amount, plan, purpose, reservation_id } = req.body;
    const finalStatus = (status || 'SUCCESS').toUpperCase();
    const numAmount = parseFloat(amount || 0);

    // 1. Update icici_payments table
    let resolvedPurpose = purpose || 'wallet';
    let resolvedResId = reservation_id;
    try {
      const existing = await db.query('SELECT purpose, reservation_id, amount, mobile FROM icici_payments WHERE tx_id = $1', [tx_id]);
      if (existing.rows.length > 0) {
        if (!resolvedPurpose && existing.rows[0].purpose) resolvedPurpose = existing.rows[0].purpose;
        if (!resolvedResId && existing.rows[0].reservation_id) resolvedResId = existing.rows[0].reservation_id;
      }
      await db.query(`
        UPDATE icici_payments 
        SET status = $1, upi_ref_no = $2
        WHERE tx_id = $3
      `, [finalStatus === 'SUCCESS' ? 'SUCCESS' : 'FAILURE', upi_ref_no || `UPI${Date.now()}`, tx_id]);
    } catch (e) {
      console.warn('DB update error in icici verify:', e.message);
    }

    // 2. If payment is SUCCESS:
    if (finalStatus === 'SUCCESS') {
      const cleanMobile = (mobile || '').replace(/\D/g, '');
      const last10 = cleanMobile.length >= 10 ? cleanMobile.slice(-10) : cleanMobile;

      // (A) Top-Up Wallet
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

      // (B) Update Ride Reservation
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

      // (C) Send WhatsApp receipt if mobile is present
      if (mobile) {
        sendWhatsAppReceipt({
          mobile,
          name: rider_name || 'Rider',
          invoice_no: tx_id,
          invoice_date: new Date().toLocaleDateString('en-IN'),
          plan: plan || (resolvedPurpose === 'ride' ? 'EV Ride Booking' : 'Wallet Top-Up'),
          amount: numAmount > 0 ? numAmount.toString() : '0'
        }).catch(err => console.error('WhatsApp receipt error:', err));
      }
    }

    res.json({
      status: 'success',
      message: 'ICICI Payment verified and processed successfully',
      tx_id,
      payment_status: finalStatus
    });
  } catch (err) {
    console.error('Error verifying ICICI payment:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/payments/icici/callback - Webhook callback from ICICI Bank
router.post('/callback', async (req, res) => {
  try {
    const { tr, Status, BankRRN, PayerVPA } = req.body;
    console.log('ICICI Webhook Callback Received:', req.body);

    if (tr) {
      const finalStatus = (Status === 'SUCCESS' || Status === '0') ? 'SUCCESS' : 'FAILED';
      await db.query(`
        UPDATE icici_payments
        SET status = $1, upi_ref_no = $2
        WHERE tx_id = $3
      `, [finalStatus, BankRRN || '', tr]);
    }

    res.json({ status: 'SUCCESS', responseCode: '00', message: 'Callback processed' });
  } catch (err) {
    res.status(500).json({ status: 'FAILED', message: err.message });
  }
});

module.exports = router;

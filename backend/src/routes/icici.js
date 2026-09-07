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
        mobile VARCHAR(20),
        vpa VARCHAR(100) DEFAULT 'EVEGAHRIDE@icici',
        status VARCHAR(50) DEFAULT 'Pending',
        upi_ref_no VARCHAR(100),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } catch (e) {
    console.warn('ICICI DB init warning:', e.message);
  }
})();

// POST /api/payments/icici/generate-qr - Generate Dynamic ICICI UPI QR Code
router.post('/generate-qr', async (req, res) => {
  try {
    const { amount, rider_name, mobile, notes } = req.body;
    const numAmount = parseFloat(amount || 0);

    if (numAmount <= 0) {
      return res.status(400).json({ status: 'error', message: 'Valid amount is required' });
    }

    const txId = `EVGICICI${Date.now()}`;
    const upiString = `upi://pay?pa=${encodeURIComponent(ICICI_VPA)}&pn=${encodeURIComponent(ICICI_PAYEE_NAME)}&am=${numAmount.toFixed(2)}&tr=${txId}&tn=${encodeURIComponent(notes || 'EV Ride Payment')}&cu=INR`;

    // Save transaction
    try {
      await db.query(`
        INSERT INTO icici_payments (tx_id, merchant_id, amount, rider_name, mobile, status)
        VALUES ($1, $2, $3, $4, $5, 'Pending')
      `, [txId, ICICI_MID, numAmount, rider_name || 'Rider', mobile || '']);
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
        notes: notes || 'EV Ride Payment',
        api_endpoint: `${ICICI_BASE_URL}/QR3/${ICICI_MID}`
      }
    });
  } catch (err) {
    console.error('Error generating ICICI QR:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// POST /api/payments/icici/verify - Verify ICICI payment & trigger WhatsApp receipt
router.post('/verify', async (req, res) => {
  try {
    const { tx_id, upi_ref_no, status, rider_name, mobile, amount, plan } = req.body;
    const finalStatus = status || 'SUCCESS';

    try {
      await db.query(`
        UPDATE icici_payments 
        SET status = $1, upi_ref_no = $2
        WHERE tx_id = $3
      `, [finalStatus, upi_ref_no || `UPI${Date.now()}`, tx_id]);
    } catch (e) {}

    // Trigger WhatsApp receipt send
    if (mobile) {
      sendWhatsAppReceipt({
        mobile,
        name: rider_name || 'Rider',
        invoice_no: tx_id,
        invoice_date: new Date().toLocaleDateString('en-IN'),
        plan: plan || 'EV Ride Plan',
        amount: amount || '0'
      }).catch(err => console.error('WhatsApp receipt error:', err));
    }

    res.json({
      status: 'success',
      message: 'ICICI Payment verified successfully',
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
      await db.query(`
        UPDATE icici_payments
        SET status = $1, upi_ref_no = $2
        WHERE tx_id = $3
      `, [Status === 'SUCCESS' ? 'Success' : 'Failed', BankRRN || '', tr]);
    }

    res.json({ status: 'SUCCESS', responseCode: '00', message: 'Callback processed' });
  } catch (err) {
    res.status(500).json({ status: 'FAILED', message: err.message });
  }
});

module.exports = router;

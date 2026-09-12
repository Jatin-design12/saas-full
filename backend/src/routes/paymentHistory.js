const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to sanitize mobile
const cleanMob = (m) => (m || '').replace(/\D/g, '').slice(-10);

/**
 * GET /api/payments/history
 * Unified payment history across ICICI UPI, PayU, Wallet transactions, and Deposit Refunds.
 * Returns live records and aggregated KPI metrics.
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').trim().toLowerCase();
    const typeFilter = (req.query.type || 'all').toLowerCase();
    const statusFilter = (req.query.status || 'all').toLowerCase();
    const fromDate = req.query.from_date;
    const toDate = req.query.to_date;

    // Build unified UNION query
    const unionQuery = `
      WITH unified_transactions AS (
        -- 1. ICICI Payments
        SELECT 
          'icici_' || id::text AS id,
          tx_id,
          COALESCE(upi_ref_no, merchant_id, 'ICICI-UPI') AS reference_id,
          COALESCE(rider_name, 'Rider') AS rider_name,
          COALESCE(mobile, '') AS mobile,
          amount::numeric AS amount,
          'Credit' AS type,
          CASE 
            WHEN UPPER(status) = 'SUCCESS' THEN 'Successful'
            WHEN UPPER(status) = 'PENDING' THEN 'Pending'
            ELSE 'Failed'
          END AS status,
          'ICICI UPI' AS payment_method,
          COALESCE(purpose, 'Ride / Booking') AS purpose,
          created_at
        FROM icici_payments

        UNION ALL

        -- 2. PayU Payments
        SELECT 
          'payu_' || id::text AS id,
          tx_id,
          COALESCE(payu_id, bank_ref_num, tx_id) AS reference_id,
          COALESCE(rider_name, 'Rider') AS rider_name,
          COALESCE(mobile, '') AS mobile,
          amount::numeric AS amount,
          'Credit' AS type,
          CASE 
            WHEN UPPER(status) = 'SUCCESS' THEN 'Successful'
            WHEN UPPER(status) = 'PENDING' THEN 'Pending'
            ELSE 'Failed'
          END AS status,
          'PayU India' AS payment_method,
          COALESCE(purpose, 'Ride Payment') AS purpose,
          created_at
        FROM payu_payments

        UNION ALL

        -- 3. Wallet Transactions (Razorpay / Wallet Top-Up / Ride deductions)
        SELECT 
          'wallet_' || wt.id::text AS id,
          COALESCE(wt.transaction_id, 'TXN-W' || wt.id::text) AS tx_id,
          COALESCE(wt.transaction_id, 'WLT-' || wt.id::text) AS reference_id,
          COALESCE(
            (SELECT rider_name FROM renters WHERE mobile LIKE '%' || RIGHT(REGEXP_REPLACE(wt.mobile, '\\D', '', 'g'), 10) LIMIT 1),
            (SELECT name FROM users WHERE mobile LIKE '%' || RIGHT(REGEXP_REPLACE(wt.mobile, '\\D', '', 'g'), 10) LIMIT 1),
            'Rider (' || wt.mobile || ')'
          ) AS rider_name,
          COALESCE(wt.mobile, '') AS mobile,
          wt.amount::numeric AS amount,
          CASE 
            WHEN LOWER(wt.type) = 'debit' THEN 'Debit'
            ELSE 'Credit'
          END AS type,
          CASE 
            WHEN UPPER(wt.status) IN ('SUCCESS', 'SUCCESSFUL') THEN 'Successful'
            WHEN UPPER(wt.status) = 'PENDING' THEN 'Pending'
            ELSE 'Failed'
          END AS status,
          COALESCE(wt.payment_method, 'Wallet') AS payment_method,
          COALESCE(wt.title, wt.subtitle, 'Wallet Transaction') AS purpose,
          wt.created_at
        FROM wallet_transactions wt

        UNION ALL

        -- 4. Completed Deposit Refunds from Reservations
        SELECT 
          'refund_' || id::text AS id,
          COALESCE(refund_tx_id, 'REF-' || SUBSTRING(id::text, 1, 8)) AS tx_id,
          reservation_id AS reference_id,
          COALESCE(customer_name, 'Rider') AS rider_name,
          COALESCE(mobile, '') AS mobile,
          COALESCE(refund_amount, deposit, 0)::numeric AS amount,
          'Debit' AS type,
          'Successful' AS status,
          COALESCE(refund_mode, 'UPI Refund') AS payment_method,
          'Security Deposit Refund' AS purpose,
          COALESCE(refund_date, returned_at, created_at) AS created_at
        FROM reservations
        WHERE deposit_status = 'Refunded' AND COALESCE(refund_amount, deposit, 0) > 0

        UNION ALL

        -- 5. Direct / Booking Rental Plan Payments
        SELECT
          'res_' || id::text AS id,
          COALESCE(transaction_id, 'TXN-R' || id::text) AS tx_id,
          reservation_id AS reference_id,
          COALESCE(customer_name, 'Rider') AS rider_name,
          COALESCE(mobile, '') AS mobile,
          COALESCE(fare, 0)::numeric AS amount,
          'Credit' AS type,
          'Successful' AS status,
          COALESCE(payment_mode, 'Direct Booking') AS payment_method,
          'Ride Booking (' || COALESCE(package_type, 'Rental Plan') || ')' AS purpose,
          created_at
        FROM reservations
        WHERE payment_status = 'Paid' AND COALESCE(fare, 0) > 0
          AND NOT EXISTS (SELECT 1 FROM payu_payments pp WHERE pp.tx_id = reservations.transaction_id)
          AND NOT EXISTS (SELECT 1 FROM icici_payments ip WHERE ip.tx_id = reservations.transaction_id)
      )
      SELECT * FROM unified_transactions
    `;

    // Query all records for accurate KPI metrics
    const allRecordsRes = await db.query(unionQuery);
    const allRecords = allRecordsRes.rows;

    // Compute live KPI metrics over all records
    let totalCredit = 0;
    let totalDebit = 0;
    let successfulCount = 0;
    let pendingCount = 0;
    let failedCount = 0;

    allRecords.forEach(rec => {
      const amt = parseFloat(rec.amount) || 0;
      const st = (rec.status || '').toLowerCase();
      const tp = (rec.type || '').toLowerCase();

      if (st === 'successful') {
        successfulCount++;
        if (tp === 'credit') {
          totalCredit += amt;
        } else if (tp === 'debit') {
          totalDebit += amt;
        }
      } else if (st === 'pending') {
        pendingCount++;
      } else {
        failedCount++;
      }
    });

    const netBalance = totalCredit - totalDebit;

    // Filter records for pagination
    let filtered = allRecords.filter(rec => {
      if (search) {
        const q = search;
        const name = (rec.rider_name || '').toLowerCase();
        const mob = (rec.mobile || '').toLowerCase();
        const tx = (rec.tx_id || '').toLowerCase();
        const ref = (rec.reference_id || '').toLowerCase();
        const pm = (rec.payment_method || '').toLowerCase();
        if (!name.includes(q) && !mob.includes(q) && !tx.includes(q) && !ref.includes(q) && !pm.includes(q)) {
          return false;
        }
      }

      if (typeFilter !== 'all' && (rec.type || '').toLowerCase() !== typeFilter) {
        return false;
      }

      if (statusFilter !== 'all' && (rec.status || '').toLowerCase() !== statusFilter) {
        return false;
      }

      if (fromDate) {
        const recDate = new Date(rec.created_at);
        if (recDate < new Date(fromDate)) return false;
      }

      if (toDate) {
        const recDate = new Date(rec.created_at);
        const endDay = new Date(toDate);
        endDay.setHours(23, 59, 59, 999);
        if (recDate > endDay) return false;
      }

      return true;
    });

    // Sort by created_at DESC
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    res.json({
      status: 'success',
      kpis: {
        total_credit: Math.round(totalCredit * 100) / 100,
        total_debit: Math.round(totalDebit * 100) / 100,
        net_balance: Math.round(netBalance * 100) / 100,
        total_transactions: allRecords.length,
        successful_count: successfulCount,
        pending_count: pendingCount,
        failed_count: failedCount
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      },
      data: paginated
    });
  } catch (err) {
    console.error('Error fetching payment history:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// Helper to delete a single transaction by composite id
const deleteSingleTransaction = async (compositeId) => {
  const str = String(compositeId || '');
  if (str.startsWith('icici_')) {
    const rawId = str.replace('icici_', '');
    return db.query('DELETE FROM icici_payments WHERE id::text = $1', [rawId]).catch(() => ({ rowCount: 0 }));
  } else if (str.startsWith('payu_')) {
    const rawId = str.replace('payu_', '');
    return db.query('DELETE FROM payu_payments WHERE id::text = $1', [rawId]).catch(() => ({ rowCount: 0 }));
  } else if (str.startsWith('wallet_')) {
    const rawId = str.replace('wallet_', '');
    return db.query('DELETE FROM wallet_transactions WHERE id::text = $1', [rawId]).catch(() => ({ rowCount: 0 }));
  } else if (str.startsWith('refund_')) {
    const rawId = str.replace('refund_', '');
    return db.query("UPDATE reservations SET deposit_status = 'Dismissed', refund_amount = 0 WHERE id::text = $1 OR reservation_id = $1", [rawId]).catch(() => ({ rowCount: 0 }));
  } else if (str.startsWith('res_')) {
    const rawId = str.replace('res_', '');
    return db.query("UPDATE reservations SET payment_status = 'Cancelled' WHERE id::text = $1 OR reservation_id = $1", [rawId]).catch(() => ({ rowCount: 0 }));
  } else {
    await db.query('DELETE FROM payu_payments WHERE id::text = $1 OR tx_id = $1', [str]).catch(() => {});
    await db.query('DELETE FROM icici_payments WHERE id::text = $1 OR tx_id = $1', [str]).catch(() => {});
    await db.query('DELETE FROM wallet_transactions WHERE id::text = $1 OR transaction_id = $1', [str]).catch(() => {});
    return { rowCount: 1 };
  }
};

/**
 * DELETE /api/payments/history
 * Bulk delete payment transactions
 */
router.delete('/', async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ status: 'error', message: 'No transaction IDs provided' });
  }

  try {
    let affected = 0;
    for (const id of ids) {
      const resDel = await deleteSingleTransaction(id);
      affected += resDel?.rowCount || 0;
    }

    res.json({
      status: 'success',
      message: `Successfully deleted ${ids.length} transaction record(s).`,
      affected
    });
  } catch (err) {
    console.error('Error deleting transactions:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * DELETE /api/payments/history/:id
 * Delete a single payment transaction
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await deleteSingleTransaction(id);
    res.json({
      status: 'success',
      message: 'Transaction deleted successfully.'
    });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;


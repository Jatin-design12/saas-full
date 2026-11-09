const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function testFullQuery() {
  const unionQuery = `
    WITH unified_transactions AS (
      -- 1. ICICI Payments
      SELECT 
        'icici_' || ip.id::text AS id,
        ip.tx_id,
        COALESCE(ip.upi_ref_no, ip.merchant_id, 'ICICI-UPI') AS reference_id,
        COALESCE(
          NULLIF(ip.rider_name, 'Rider'),
          r.customer_name,
          (SELECT rider_name FROM renters WHERE mobile LIKE '%' || RIGHT(REGEXP_REPLACE(ip.mobile, '\\D', '', 'g'), 10) LIMIT 1),
          'Evegah Rider'
        ) AS rider_name,
        COALESCE(
          NULLIF(ip.mobile, ''),
          r.mobile,
          ''
        ) AS mobile,
        COALESCE(r.fare, CASE WHEN ip.amount >= 10 THEN (ip.amount - COALESCE(r.deposit, 5)) ELSE ip.amount END)::numeric AS rent_amount,
        COALESCE(r.deposit, CASE WHEN ip.amount >= 10 THEN 5 ELSE 0 END)::numeric AS deposit_amount,
        ip.amount::numeric AS amount,
        'Credit' AS type,
        CASE 
          WHEN UPPER(ip.status) = 'SUCCESS' THEN 'Successful'
          WHEN UPPER(ip.status) = 'PENDING' THEN 'Pending'
          ELSE 'Failed'
        END AS status,
        'ICICI UPI' AS payment_method,
        COALESCE(ip.purpose, 'Ride / Booking') AS purpose,
        ip.created_at
      FROM icici_payments ip
      LEFT JOIN reservations r ON (r.transaction_id = ip.tx_id OR r.reservation_id = ip.reservation_id)
      WHERE ip.mobile NOT LIKE '%1800%'
        AND ip.mobile NOT LIKE '%1820%'

      UNION ALL

      -- 2. PayU Payments
      SELECT 
        'payu_' || pp.id::text AS id,
        pp.tx_id,
        COALESCE(pp.payu_id, pp.bank_ref_num, pp.tx_id) AS reference_id,
        COALESCE(
          NULLIF(pp.rider_name, 'Rider'),
          r.customer_name,
          (SELECT rider_name FROM renters WHERE mobile LIKE '%' || RIGHT(REGEXP_REPLACE(pp.mobile, '\\D', '', 'g'), 10) LIMIT 1),
          'Evegah Rider'
        ) AS rider_name,
        COALESCE(
          NULLIF(pp.mobile, ''),
          r.mobile,
          ''
        ) AS mobile,
        COALESCE(r.fare, pp.amount)::numeric AS rent_amount,
        COALESCE(r.deposit, 0)::numeric AS deposit_amount,
        pp.amount::numeric AS amount,
        'Credit' AS type,
        CASE 
          WHEN UPPER(pp.status) = 'SUCCESS' THEN 'Successful'
          WHEN UPPER(pp.status) = 'PENDING' THEN 'Pending'
          ELSE 'Failed'
        END AS status,
        'PayU India' AS payment_method,
        COALESCE(pp.purpose, 'Ride Payment') AS purpose,
        pp.created_at
      FROM payu_payments pp
      LEFT JOIN reservations r ON (r.transaction_id = pp.tx_id OR r.reservation_id = pp.reservation_id)
      WHERE pp.status NOT IN ('Refund_Failed', 'Refunded')
        AND pp.purpose NOT ILIKE '%refund%'
        AND pp.tx_id NOT LIKE 'REF-%'
        AND pp.mobile NOT LIKE '%1800%'
        AND pp.mobile NOT LIKE '%1820%'
        AND NOT (
          COALESCE(pp.rider_name, '') IN ('Rider', 'Evegah Rider')
          AND (pp.mobile LIKE '%1800%' OR pp.mobile LIKE '%1820%' OR pp.mobile = '')
        )

      UNION ALL

      -- 3. PhonePe Payments
      SELECT
        'phonepe_' || ph.id::text AS id,
        ph.tx_id,
        COALESCE(ph.phonepe_tx_id, ph.upi_ref_no, ph.tx_id) AS reference_id,
        COALESCE(
          NULLIF(ph.rider_name, 'Rider'),
          (SELECT rider_name FROM renters WHERE mobile LIKE '%' || RIGHT(REGEXP_REPLACE(ph.mobile, '\\D', '', 'g'), 10) LIMIT 1),
          'Evegah Rider'
        ) AS rider_name,
        COALESCE(NULLIF(ph.mobile, ''), '') AS mobile,
        ph.amount::numeric AS rent_amount,
        0.00::numeric AS deposit_amount,
        ph.amount::numeric AS amount,
        'Credit' AS type,
        CASE 
          WHEN UPPER(ph.status) = 'SUCCESS' THEN 'Successful'
          WHEN UPPER(ph.status) = 'PENDING' THEN 'Pending'
          ELSE 'Failed'
        END AS status,
        'PhonePe' AS payment_method,
        COALESCE(ph.purpose, 'Ride Payment') AS purpose,
        ph.created_at
      FROM phonepe_payments ph
      WHERE ph.mobile NOT LIKE '%1800%'
        AND ph.mobile NOT LIKE '%1820%'

      UNION ALL

      -- 4. Wallet / Refund Transactions
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
        CASE 
          WHEN wt.title ILIKE '%deposit%' OR wt.subtitle ILIKE '%deposit%' THEN 0.00
          ELSE wt.amount::numeric
        END AS rent_amount,
        CASE 
          WHEN wt.title ILIKE '%deposit%' OR wt.subtitle ILIKE '%deposit%' THEN wt.amount::numeric
          ELSE 0.00
        END AS deposit_amount,
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

      -- 5. Completed Deposit Refunds from Reservations
      SELECT 
        'refund_' || id::text AS id,
        COALESCE(refund_tx_id, 'REF-' || SUBSTRING(id::text, 1, 8)) AS tx_id,
        reservation_id AS reference_id,
        COALESCE(customer_name, 'Rider') AS rider_name,
        COALESCE(mobile, '') AS mobile,
        0.00::numeric AS rent_amount,
        COALESCE(refund_amount, deposit, 0)::numeric AS deposit_amount,
        COALESCE(refund_amount, deposit, 0)::numeric AS amount,
        'Debit' AS type,
        'Successful' AS status,
        COALESCE(refund_mode, 'PayU') AS payment_method,
        'Security Deposit Refund' AS purpose,
        COALESCE(refund_date, returned_at, created_at) AS created_at
      FROM reservations
      WHERE deposit_status = 'Refunded' AND COALESCE(refund_amount, deposit, 0) > 0
        AND NOT EXISTS (
          SELECT 1 FROM wallet_transactions wt WHERE wt.transaction_id = reservations.refund_tx_id
        )

      UNION ALL

      -- 6. Direct / Cash / Offline Booking Payments
      SELECT
        'res_' || id::text AS id,
        COALESCE(cash_voucher_number, transaction_id, 'CSH-VCHR-' || SUBSTRING(id::text, 1, 8)) AS tx_id,
        COALESCE(cash_voucher_number, transaction_id, reservation_id) AS reference_id,
        COALESCE(customer_name, 'Rider') AS rider_name,
        COALESCE(mobile, '') AS mobile,
        COALESCE(fare, 0)::numeric AS rent_amount,
        COALESCE(deposit, 0)::numeric AS deposit_amount,
        COALESCE(total_payable, (COALESCE(fare, 0) + COALESCE(deposit, 0)), fare)::numeric AS amount,
        'Credit' AS type,
        'Successful' AS status,
        CASE 
          WHEN payment_mode ILIKE '%cash%' THEN 'Cash'
          ELSE COALESCE(payment_mode, 'Cash')
        END AS payment_method,
        'Ride Booking (' || COALESCE(package_type, 'Rental Plan') || ')' AS purpose,
        created_at
      FROM reservations
      WHERE payment_status = 'Paid' AND COALESCE(fare, 0) > 0
        AND (payment_mode IS NULL OR payment_mode NOT IN ('PayU', 'PayU India', 'ICICI UPI', 'UPI', 'Wallet', 'Evegah Wallet', 'PhonePe'))
        AND NOT EXISTS (
          SELECT 1 FROM payu_payments pp 
          WHERE pp.tx_id = reservations.transaction_id 
             OR pp.reservation_id = reservations.id::text 
             OR pp.reservation_id = reservations.reservation_id
        )
        AND NOT EXISTS (
          SELECT 1 FROM icici_payments ip 
          WHERE ip.tx_id = reservations.transaction_id 
             OR ip.reservation_id = reservations.id::text 
             OR ip.reservation_id = reservations.reservation_id
        )
        AND NOT EXISTS (
          SELECT 1 FROM phonepe_payments ph 
          WHERE ph.tx_id = reservations.transaction_id 
             OR ph.reservation_id = reservations.id::text 
             OR ph.reservation_id = reservations.reservation_id
        )
        AND NOT EXISTS (
          SELECT 1 FROM wallet_transactions wt 
          WHERE wt.transaction_id = reservations.transaction_id
        )
    )
    SELECT * FROM unified_transactions ORDER BY created_at DESC;
  `;

  try {
    const res = await pool.query(unionQuery);
    console.log('SUCCESS! Total rows:', res.rows.length);
    let credit = 0, debit = 0, success = 0, pending = 0;
    res.rows.forEach(r => {
      const amt = parseFloat(r.amount) || 0;
      if (r.status === 'Successful') {
        success++;
        if (r.type === 'Credit') credit += amt;
        else debit += amt;
      } else if (r.status === 'Pending') {
        pending++;
      }
    });
    console.log('KPIs:', { totalCredit: credit, totalDebit: debit, success, pending });
    console.log('Sample rows (top 5):');
    res.rows.slice(0, 5).forEach(r => console.log(r.id, r.tx_id, r.rider_name, r.amount, r.payment_method, r.status, r.purpose));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

testFullQuery();

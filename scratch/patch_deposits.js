const fs = require('fs');
const filePath = 'C:/Users/Himanshu/Documents/Evegah/saas-full/backend/src/routes/reservations.js';
let content = fs.readFileSync(filePath, 'utf8');

const targetQuery = `    const rentersResult = await db.query(\`
      SELECT 
        id,
        rider_name,
        mobile,
        vehicle_id,
        battery_id,
        deposit,
        rent,
        total,
        status,
        rental_start_date,
        return_date,
        created_at
      FROM renters
      WHERE deposit > 0
    \`).catch(() => ({ rows: [] }));`;

const replacementQuery = `    const rentersResult = await db.query(\`
      SELECT 
        id,
        rider_name,
        mobile,
        vehicle_id,
        battery_id,
        deposit,
        rent,
        total,
        status,
        rental_start_date,
        return_date,
        created_at
      FROM renters
      WHERE deposit > 0
    \`).catch(() => ({ rows: [] }));

    const refundIdemRes = await db.query(\`
      SELECT 
        ri.id,
        ri.reservation_key,
        ri.refund_amount,
        ri.result,
        ri.created_at,
        COALESCE(r.customer_name, (SELECT rider_name FROM renters WHERE id::text = ri.reservation_key LIMIT 1), 'Evegah Rider') as customer_name,
        COALESCE(r.mobile, (SELECT mobile FROM renters WHERE id::text = ri.reservation_key LIMIT 1), '') as mobile,
        COALESCE(r.vehicle_number, (SELECT vehicle_id FROM renters WHERE id::text = ri.reservation_key LIMIT 1), '') as vehicle_number,
        COALESCE(r.deposit, 0) as deposit
      FROM refund_idempotency ri
      LEFT JOIN reservations r ON (r.id::text = ri.reservation_key OR r.reservation_id = ri.reservation_key)
      ORDER BY ri.created_at DESC
    \`).catch(() => ({ rows: [] }));`;

const targetLoopEnd = `    renterRows.forEach(r => {
      const dep = parseFloat(r.deposit || 0);
      const cleanMob = (r.mobile || '').replace(/\\D/g, '').slice(-10);
      if (dep > 0 && r.status !== 'Dismissed' && (!cleanMob || !processedMobiles.has(cleanMob))) {
        if (cleanMob) processedMobiles.add(cleanMob);
        const isReturned = ['Return', 'Completed'].includes(r.status);
        const canRefund = isReturned;

        if (isReturned) {
          pendingAmount += dep;
          pendingCount++;
        } else if (['Active Ride', 'Retain Ride', 'Active'].includes(r.status)) {
          totalDepositsHeld += dep;
        }

        pendingList.push({
          id: r.id,
          reservation_id: \`RET-\${r.id?.toString().slice(0, 6)}\`,
          rider: {
            name: r.rider_name || 'Rider',
            code: \`EVR-\${r.id?.toString().slice(0, 6)}\`,
            avatar: ''
          },
          mobile: r.mobile,
          vehicle: r.vehicle_id || '',
          returnDate: isReturned ? (r.return_date || r.created_at || new Date()) : null,
          bookingDate: r.rental_start_date || r.created_at,
          deposit: dep,
          condition: isReturned ? 'No Damage' : 'Vehicle In Ride',
          conditionDetail: isReturned ? 'Good Condition' : 'Active Ride (Awaiting Return)',
          deductions: 0,
          refundAmount: dep,
          deposit_status: isReturned ? 'Pending_Refund' : 'Held',
          is_returned: isReturned,
          can_refund: canRefund,
          ride_status: r.status
        });
      }
    });`;

const replacementLoopEnd = targetLoopEnd + `

    const processedTxIds = new Set(completedList.map(c => c.txId));
    refundIdemRes.rows.forEach(ri => {
      const resObj = (typeof ri.result === 'string' ? JSON.parse(ri.result) : ri.result) || {};
      const txId = resObj.tx_id || \`REF-\${ri.id}\`;
      if (!processedTxIds.has(txId)) {
        processedTxIds.add(txId);
        const refAmt = parseFloat(ri.refund_amount || resObj.refund_amount || 0);
        const ded = parseFloat(resObj.deductions || 0);
        completedList.push({
          id: ri.id,
          reservation_id: ri.reservation_key,
          rider: {
            name: ri.customer_name || 'Evegah Rider',
            code: \`REF-\${String(ri.id).padStart(4, '0')}\`,
            avatar: ''
          },
          mobile: ri.mobile || '',
          vehicle: ri.vehicle_number || '',
          refundDate: resObj.refund_date || ri.created_at,
          txId: txId,
          deposit: parseFloat(ri.deposit || (refAmt + ded)),
          deductions: ded,
          refundAmount: refAmt,
          method: resObj.refund_mode || 'PayU',
          status: 'Successful',
          returnCondition: 'Clean',
          notes: 'Processed Refund'
        });
        totalRefunded += refAmt;
        totalDeductions += ded;
      }
    });`;

if (content.includes('WHERE deposit > 0') && !content.includes('refundIdemRes')) {
  content = content.replace(targetQuery, replacementQuery);
  content = content.replace(targetLoopEnd, replacementLoopEnd);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated reservations.js deposits dashboard endpoint');
} else {
  console.log('Already updated or target not matched');
}

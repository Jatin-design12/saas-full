const { Pool } = require('../backend/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://evegah_admin:Secure_DB_Password_ChangeMe@72.60.101.157:5433/evegah_prod' });

async function check() {
  try {
    const payu = await pool.query('SELECT count(*) FROM payu_payments');
    console.log('PAYU COUNT:', payu.rows[0].count);

    const icici = await pool.query('SELECT count(*) FROM icici_payments');
    console.log('ICICI COUNT:', icici.rows[0].count);

    const wallet = await pool.query('SELECT count(*) FROM wallet_transactions');
    console.log('WALLET COUNT:', wallet.rows[0].count);

    const resv = await pool.query('SELECT count(*) FROM reservations');
    console.log('RESERVATIONS COUNT:', resv.rows[0].count);

    const renters = await pool.query('SELECT count(*) FROM renters');
    console.log('RENTERS COUNT:', renters.rows[0].count);

    const samplePayu = await pool.query('SELECT * FROM payu_payments LIMIT 5');
    console.log('SAMPLE PAYU:', samplePayu.rows);

    const sampleIcici = await pool.query('SELECT * FROM icici_payments LIMIT 5');
    console.log('SAMPLE ICICI:', sampleIcici.rows);

    const sampleWallet = await pool.query('SELECT * FROM wallet_transactions LIMIT 5');
    console.log('SAMPLE WALLET:', sampleWallet.rows);

  } catch (e) {
    console.error('Error:', e);
  } finally {
    await pool.end();
  }
}

check();

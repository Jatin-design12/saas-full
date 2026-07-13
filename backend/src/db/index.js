require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: (process.env.DATABASE_URL && (process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1')))
    ? false
    : { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client (Main DB)', err);
});

const bmsPool = new Pool({
  connectionString: process.env.BMS_DATABASE_URL,
  ssl: (process.env.BMS_DATABASE_URL && (process.env.BMS_DATABASE_URL.includes('localhost') || process.env.BMS_DATABASE_URL.includes('127.0.0.1')))
    ? false
    : { rejectUnauthorized: false },
});

bmsPool.on('error', (err) => {
  console.error('Unexpected error on idle client (BMS DB)', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  bmsQuery: (text, params) => bmsPool.query(text, params),
  getBmsClient: () => bmsPool.connect(),
};

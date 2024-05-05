const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'upxiii',
  connectTimeout: 60000,
  connectionLimit: 3000
});

async function query(sql, params) {
  const [results] = await pool.query(sql, params).catch((e) => {
    throw e;
  });

  return results;
}

async function format(sql, params) {
  const results = await pool.format(sql, params);

  return results;
}

module.exports = {
  query,
  format
};

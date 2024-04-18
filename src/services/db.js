const mysql = require('mysql2/promise');

async function getConnection() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'upxiii',
    connectTimeout: 60000,
  });

  return connection;
}

async function query(sql, params, connection) {
  const [results] = await connection.query(sql, params);

  return results;
}

module.exports = {
  query,
  getConnection,
};

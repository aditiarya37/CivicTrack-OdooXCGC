const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'civictrack',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

// Test the connection
promisePool.execute('SELECT 1')
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    console.log('⚠️  Server will continue running without database');
  });

module.exports = promisePool;

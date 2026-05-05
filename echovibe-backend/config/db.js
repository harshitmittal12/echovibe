const mysql = require("mysql2");

// Use a connection pool instead of a single connection
// Pools handle reconnection, concurrency, and timeouts automatically
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test the connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err.message);
    console.error("   Make sure MySQL is running and the database exists.");
  } else {
    console.log("✅ MySQL Pool Connected");
    connection.release();
  }
});

module.exports = pool;
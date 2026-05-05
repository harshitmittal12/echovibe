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
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // Railway public proxy requires SSL
  ssl: { rejectUnauthorized: false },
});

// Test the connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err.message);
    console.error("   Host:", process.env.DB_HOST);
    console.error("   Port:", process.env.DB_PORT);
    console.error("   User:", process.env.DB_USER);
    console.error("   Database:", process.env.DB_NAME);
    console.error("   Full error:", err.code);
  } else {
    console.log("✅ MySQL Pool Connected");
    connection.release();
  }
});

module.exports = pool;
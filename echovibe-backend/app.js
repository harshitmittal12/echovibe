require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const songRoutes = require("./routes/songRoutes");
const recognizeRoutes = require("./routes/recognizeRoutes");

const app = express();

// ─── Security Middleware ──────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// ─── CORS (allow frontend origins) ────────────
app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
  ],
  credentials: true,
}));

// ─── Body Parsers ─────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
  message: { message: "Too many attempts. Please try again in 15 minutes." },
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: { message: "Too many requests. Please slow down." },
});

// ─── Request Logging ──────────────────────────
app.use((req, res, next) => {
  const timestamp = new Date().toISOString().slice(11, 19);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ─── Routes ───────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api", apiLimiter, songRoutes);
app.use("/api", apiLimiter, recognizeRoutes);

// ─── Health Check ─────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "running",
    name: "EchoVibe API",
    version: "1.0.0",
    endpoints: [
      "POST /api/auth/signup",
      "POST /api/auth/login",
      "GET  /api/songs/:mood",
      "GET  /api/search?q=",
      "POST /api/history",
      "GET  /api/history",
      "GET  /api/me",
      "POST /api/recognize",
    ],
  });
});

// ─── Global Error Handler ─────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ─── Start Server (Only if not running on Vercel) ─────────────
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🎵 EchoVibe API running on port ${PORT}`);
    console.log(`   http://localhost:${PORT}\n`);
  });
}

module.exports = app;
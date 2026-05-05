const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ─── Input Validation Helpers ──────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSignup(name, email, password) {
  const errors = [];
  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!email || !isValidEmail(email)) {
    errors.push("Please provide a valid email address");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  return errors;
}

// ─── Signup ────────────────────────────────────
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate inputs
  const errors = validateSignup(name, email, password);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(". ") });
  }

  try {
    // Check if email already exists
    const [results] = await db.promise().query(
      "SELECT id FROM users WHERE email = ?",
      [email.toLowerCase().trim()]
    );

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password and insert
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.promise().query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), hashedPassword]
    );

    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ 
      message: "Server error. Please try again.",
      debug_error: err.message,
      debug_code: err.code
    });
  }
};

// ─── Login ─────────────────────────────────────
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [results] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase().trim()]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

const db = require("../config/db");

// 🎵 Get Songs By Mood — reads from MySQL songs table
exports.getSongsByMood = async (req, res) => {
  const mood = req.params.mood;

  // Validate mood parameter
  const validMoods = ["happy", "sad", "chill", "romantic"];
  if (!validMoods.includes(mood)) {
    return res.status(400).json({ message: "Invalid mood. Use: " + validMoods.join(", ") });
  }

  try {
    const [results] = await db.promise().query(
      "SELECT id, name AS title, artist, mood FROM songs WHERE mood = ?",
      [mood]
    );
    res.json(results);
  } catch (err) {
    console.error("getSongsByMood error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// 🔍 Search Songs
exports.searchSongs = async (req, res) => {
  const q = req.query.q;
  if (!q || q.trim().length < 1) {
    return res.status(400).json({ message: "Missing search query" });
  }

  try {
    const searchTerm = `%${q.trim()}%`;
    const [results] = await db.promise().query(
      "SELECT id, name AS title, artist, mood FROM songs WHERE name LIKE ? OR artist LIKE ? LIMIT 20",
      [searchTerm, searchTerm]
    );
    res.json(results);
  } catch (err) {
    console.error("searchSongs error:", err);
    res.status(500).json({ message: "Database error" });
  }
};

// 💾 Save History
exports.saveHistory = async (req, res) => {
  const { song_name, mood } = req.body;
  const user_id = req.user.id;

  if (!song_name) {
    return res.status(400).json({ message: "Song name is required" });
  }

  try {
    await db.promise().query(
      "INSERT INTO history (user_id, song_name, mood) VALUES (?, ?, ?)",
      [user_id, song_name, mood || "unknown"]
    );
    res.json({ message: "Saved to history" });
  } catch (err) {
    console.error("saveHistory error:", err);
    res.status(500).json({ message: "Failed to save history" });
  }
};

// 📜 Get History
exports.getHistory = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [results] = await db.promise().query(
      "SELECT * FROM history WHERE user_id = ? ORDER BY played_at DESC LIMIT 50",
      [user_id]
    );
    res.json(results);
  } catch (err) {
    console.error("getHistory error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

// 👤 Get Current User Profile
exports.getMe = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [results] = await db.promise().query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [user_id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
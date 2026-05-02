const db = require("../config/db");

// 🎵 Get Songs By Mood — reads from MySQL songs table
exports.getSongsByMood = (req, res) => {

  const mood = req.params.mood;

  db.query(
    "SELECT * FROM songs WHERE mood = ?",
    [mood],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results);
    }
  );

};

// 💾 Save History
exports.saveHistory = (req, res) => {
  const { song_name, mood } = req.body;
  const user_id = req.user.id;

  if (!song_name || !mood) {
    return res.status(400).json({ message: "Missing data" });
  }

  db.query(
    "INSERT INTO history (user_id, song_name, mood) VALUES (?, ?, ?)",
    [user_id, song_name, mood],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Saved" });
    }
  );
};

// 📜 Get History (NEW - important)
exports.getHistory = (req, res) => {
  const user_id = req.user.id;

  db.query(
    "SELECT * FROM history WHERE user_id = ? ORDER BY played_at DESC",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};
const express = require("express");
const {
  getSongsByMood,
  searchSongs,
  saveHistory,
  getHistory,
  getMe
} = require("../controllers/songController");

const auth = require("../middleware/auth.js");

const router = express.Router();

router.get("/songs/:mood", getSongsByMood);
router.get("/search", searchSongs);
router.post("/history", auth, saveHistory);
router.get("/history", auth, getHistory);
router.get("/me", auth, getMe);

module.exports = router;
const express = require("express");
const {
  getSongsByMood,
  saveHistory,
  getHistory
} = require("../controllers/songController");

const auth = require("../middleware/auth.js");

const router = express.Router();

router.get("/songs/:mood", getSongsByMood);
router.post("/history", auth, saveHistory);
router.get("/history", auth, getHistory); 

module.exports = router;
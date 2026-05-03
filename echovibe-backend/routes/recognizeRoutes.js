const express = require("express");
const router = express.Router();
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");
const crypto = require("crypto");

// Store uploads in memory (they're small audio clips ~600KB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// ─── ACRCloud HMAC Signature Builder ────────────────
function buildACRCloudSignature(accessKey, accessSecret) {
  const httpMethod = "POST";
  const httpUri = "/v1/identify";
  const dataType = "audio";
  const signatureVersion = "1";
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const stringToSign = [
    httpMethod,
    httpUri,
    accessKey,
    dataType,
    signatureVersion,
    timestamp,
  ].join("\n");

  const signature = crypto
    .createHmac("sha1", accessSecret)
    .update(Buffer.from(stringToSign, "utf-8"))
    .digest("base64");

  return { signature, timestamp, signatureVersion, dataType };
}

// POST /api/recognize — Audio Recognition (ACRCloud primary, AudD fallback)
router.post("/recognize", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file received" });
    }

    console.log(
      `[Recognize] Received audio: ${req.file.size} bytes, type: ${req.file.mimetype}`
    );

    // ─── Strategy 1: ACRCloud (preferred — 14-day free trial) ────
    const acrHost = process.env.ACRCLOUD_HOST;
    const acrKey = process.env.ACRCLOUD_ACCESS_KEY;
    const acrSecret = process.env.ACRCLOUD_ACCESS_SECRET;

    if (acrHost && acrKey && acrSecret) {
      console.log("[Recognize] Using ACRCloud...");

      const { signature, timestamp, signatureVersion, dataType } =
        buildACRCloudSignature(acrKey, acrSecret);

      const form = new FormData();
      form.append("sample", req.file.buffer, {
        filename: "recording.wav",
        contentType: req.file.mimetype || "audio/wav",
      });
      form.append("sample_bytes", req.file.size.toString());
      form.append("access_key", acrKey);
      form.append("data_type", dataType);
      form.append("signature_version", signatureVersion);
      form.append("signature", signature);
      form.append("timestamp", timestamp);

      const acrURL = `https://${acrHost}/v1/identify`;

      const response = await axios.post(acrURL, form, {
        headers: form.getHeaders(),
        timeout: 15000,
      });

      const acrData = response.data;
      console.log("[Recognize] ACRCloud status:", acrData?.status?.msg);

      // Transform ACRCloud response to standardized format
      if (acrData.status && acrData.status.code === 0 && acrData.metadata) {
        const music = acrData.metadata.music && acrData.metadata.music[0];
        if (music) {
          return res.json({
            status: "success",
            result: {
              title: music.title || "Unknown",
              artist:
                music.artists && music.artists.length
                  ? music.artists.map((a) => a.name).join(", ")
                  : "Unknown",
              album: music.album ? music.album.name : "",
              apple_music: music.external_metadata?.apple_music || null,
              spotify: music.external_metadata?.spotify || null,
              deezer: music.external_metadata?.deezer || null,
              score: music.score || 0,
              release_date: music.release_date || "",
            },
          });
        }
      }

      // No match found
      if (acrData.status && acrData.status.code === 1001) {
        return res.json({ status: "success", result: null });
      }

      // ACRCloud error
      return res.json({
        status: "error",
        error: acrData.status
          ? acrData.status.msg
          : "ACRCloud recognition failed",
      });
    }

    // ─── Strategy 2: AudD (fallback) ────
    const auddToken = process.env.AUDD_API_TOKEN;

    if (auddToken) {
      console.log("[Recognize] Using AudD...");

      const form = new FormData();
      form.append("api_token", auddToken);
      form.append("file", req.file.buffer, {
        filename: "recording.wav",
        contentType: "audio/wav",
      });
      form.append("return", "apple_music,spotify");

      const response = await axios.post("https://api.audd.io/", form, {
        headers: form.getHeaders(),
        timeout: 15000,
      });

      console.log("[Recognize] AudD status:", response.data.status);
      return res.json(response.data);
    }

    // ─── No API configured ────
    return res.status(500).json({
      error: "No recognition API configured.",
      help: "Add ACRCloud credentials (ACRCLOUD_HOST, ACRCLOUD_ACCESS_KEY, ACRCLOUD_ACCESS_SECRET) to your .env file. Sign up free at https://console.acrcloud.com/ — 14-day trial, no credit card needed.",
    });
  } catch (err) {
    console.error("[Recognize] Error:", err.message);
    res.status(500).json({ error: "Recognition failed", message: err.message });
  }
});

module.exports = router;

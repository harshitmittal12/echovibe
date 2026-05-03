/**
 * EchoVibe — Frontend Configuration
 * Automatically detects production vs local environment
 */
const ECHOVIBE_CONFIG = {
  API_BASE_URL: window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "",  // Empty = same domain on Vercel
  JIOSAAVN_API: "https://saavn.sumit.co/api",
  ITUNES_API: "https://itunes.apple.com",
};
window.ECHOVIBE_CONFIG = ECHOVIBE_CONFIG;

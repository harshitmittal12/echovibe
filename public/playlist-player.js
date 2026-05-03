// ===================================================
// PLAYLIST PAGE PLAYER LOGIC — Real Audio via JioSaavn
// ===================================================

const JIOSAAVN_API = (window.ECHOVIBE_CONFIG && window.ECHOVIBE_CONFIG.JIOSAAVN_API) || 'https://saavn.sumit.co/api';

// Track Database — populated dynamically from API
const trackDatabase = {};

// ─── Audio Element ──────────────────────────────
const playlistAudio = new Audio();
playlistAudio.volume = 0.8;

// ─── Player State ───────────────────────────────
let currentPlaylist = 'liked';
let currentTrackIndex = 0;
let isPlaying = false;
let currentFilter = 'all';

// ─── DOM Elements ───────────────────────────────
const trackListEl = document.getElementById('trackList');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerThumb = document.getElementById('playerThumb');
const progressBar = document.getElementById('progressBar');
const createPlaylistBtn = document.getElementById('createPlaylistBtn');
const createPlaylistModal = document.getElementById('createPlaylistModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const confirmCreateBtn = document.getElementById('confirmCreateBtn');
const playlistSearch = document.getElementById('playlistSearch');

// ─── Format seconds to M:SS ────────────────────
function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

// ─── Load Playlist ──────────────────────────────
async function loadPlaylist(playlistId) {
  currentPlaylist = playlistId;

  const playlistNames = {
    'liked': 'Liked Songs',
    'phonk-energy': 'Phonk Energy',
    'midnight-drive': 'Midnight Drive',
    'focus-flow': 'Focus Flow',
    'chill-vibes': 'Chill Vibes',
    'trending-now': 'Trending Now',
    'romantic-hits': 'Romantic Hits',
    'workout-energy': 'Workout Energy',
    'bollywood-classics': 'Bollywood Classics',
    'lofi-study': 'Lofi Study',
    'party-anthems': 'Party Anthems',
    'sad-songs': 'Sad Songs',
    'browse-phonk': 'Phonk',
    'browse-lofi': 'Lo-Fi',
    'browse-synthwave': 'Synthwave',
    'browse-techno': 'Techno',
    'browse-ambient': 'Ambient'
  };

  // Search queries for each playlist — ALL are API-powered
  const apiQueries = {
    'liked': 'top hits best songs popular',
    'phonk-energy': 'phonk drift aggressive bass',
    'midnight-drive': 'midnight drive synthwave night',
    'focus-flow': 'focus study concentration instrumental',
    'chill-vibes': 'chill vibes relaxing',
    'trending-now': 'trending hits popular 2024',
    'romantic-hits': 'romantic love songs hindi',
    'workout-energy': 'gym workout motivation pump',
    'bollywood-classics': 'bollywood evergreen old classics hindi',
    'lofi-study': 'lofi chill study beats',
    'party-anthems': 'party dance hits club',
    'sad-songs': 'sad emotional heartbreak songs hindi',
    'browse-phonk': 'phonk bass music',
    'browse-lofi': 'lofi hip hop chill beats',
    'browse-synthwave': 'synthwave retro electronic',
    'browse-techno': 'techno electronic dance music',
    'browse-ambient': 'ambient calm atmospheric music'
  };

  document.getElementById('currentPlaylistTitle').innerText = playlistNames[playlistId] || playlistId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  document.querySelector('.playlist-track-count').innerText = 'Loading...';
  trackListEl.innerHTML = '<div style="text-align:center; padding:40px; color:#bc13fe;"><i class="fas fa-circle-notch fa-spin fa-2x"></i></div>';

  // Fetch from API if not already cached
  if (!trackDatabase[playlistId]) {
    try {
      const query = apiQueries[playlistId] || playlistId.replace(/-/g, ' ');
      const res = await fetch(JIOSAAVN_API + '/search/songs?query=' + encodeURIComponent(query) + '&limit=20');
      const data = await res.json();
      
      if (data.success && data.data && data.data.results) {
        trackDatabase[playlistId] = data.data.results.map((r, idx) => {
          const artists = (r.artists && r.artists.primary) 
            ? r.artists.primary.map(a => a.name).join(', ') 
            : 'Unknown';
          return {
            id: playlistId + '-' + idx,
            title: r.name || 'Unknown',
            artist: artists,
            album: (r.album && r.album.name) ? r.album.name : '',
            duration: formatTime(r.duration || 0),
            genre: playlistId.split('-')[0],
            thumb: (r.image && r.image.length) ? r.image[r.image.length - 1].url : ''
          };
        });
      } else {
        trackDatabase[playlistId] = [];
      }
    } catch(err) {
      console.error('Failed to fetch playlist:', err);
      trackDatabase[playlistId] = [];
    }
  }

  const tracks = trackDatabase[playlistId] || [];
  
  // Update UI count
  document.querySelector('.playlist-track-count').innerText = tracks.length + ' songs';
  const sidebarCount = document.querySelector('.playlist-item[data-playlist="'+playlistId+'"] .track-count');
  if (sidebarCount) sidebarCount.innerText = tracks.length;

  // Update playlist header icon
  const coverEl = document.querySelector('.playlist-cover i');
  const coverBg = document.querySelector('.playlist-cover');
  const playlistIcons = {
    'liked': 'fas fa-heart', 'phonk-energy': 'fas fa-bolt',
    'midnight-drive': 'fas fa-moon', 'focus-flow': 'fas fa-brain',
    'chill-vibes': 'fas fa-coffee', 'trending-now': 'fas fa-fire',
    'romantic-hits': 'fas fa-heart', 'workout-energy': 'fas fa-dumbbell',
    'bollywood-classics': 'fas fa-film', 'lofi-study': 'fas fa-headphones',
    'party-anthems': 'fas fa-glass-cheers', 'sad-songs': 'fas fa-cloud-rain',
    'browse-phonk': 'fas fa-bolt', 'browse-lofi': 'fas fa-headphones',
    'browse-synthwave': 'fas fa-wave-square', 'browse-techno': 'fas fa-compact-disc',
    'browse-ambient': 'fas fa-leaf'
  };
  const playlistColors = {
    'liked': '#bc13fe', 'phonk-energy': '#ff4444',
    'midnight-drive': '#4488ff', 'focus-flow': '#44ffaa',
    'chill-vibes': '#88ccff', 'trending-now': '#ff6622',
    'romantic-hits': '#ff4488', 'workout-energy': '#ff8800',
    'bollywood-classics': '#ffcc00', 'lofi-study': '#9966ff',
    'party-anthems': '#ff2288', 'sad-songs': '#6688cc',
    'browse-phonk': '#ff4444', 'browse-lofi': '#9966ff',
    'browse-synthwave': '#4488ff', 'browse-techno': '#00ccff',
    'browse-ambient': '#44ddaa'
  };
  if (coverEl) coverEl.className = playlistIcons[playlistId] || 'fas fa-music';
  const col = playlistColors[playlistId] || '#bc13fe';
  if (coverBg) coverBg.style.background = 'linear-gradient(135deg, ' + col + '44, ' + col + ')';

  // Estimate duration
  const durationEl = document.querySelector('.playlist-duration');
  if (durationEl && tracks.length) {
    const totalMin = tracks.length * 3.5; // rough 3.5 min avg
    const hrs = Math.floor(totalMin / 60);
    const mins = Math.round(totalMin % 60);
    durationEl.innerText = hrs > 0 ? hrs + 'h ' + mins + 'min' : mins + 'min';
  }

  trackListEl.innerHTML = '';
  if (tracks.length === 0) {
    trackListEl.innerHTML = '<div style="text-align:center; padding:40px; color:#888;">No tracks found.</div>';
    return;
  }

  const defaultThumb = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%231a0a2e' width='100' height='100'/%3E%3Ctext x='50' y='58' text-anchor='middle' fill='%23bc13fe' font-size='36'%3E🎵%3C/text%3E%3C/svg%3E";

  tracks.forEach(function (track, index) {
    const row = document.createElement('div');
    row.className = 'track-row';
    const thumbSrc = track.thumb || defaultThumb;
    row.innerHTML =
      '<div class="track-number">' + (index + 1) + '</div>' +
      '<div class="track-title-cell">' +
      '  <img src="' + thumbSrc + '" class="track-mini-thumb" alt="' + track.title + '" loading="lazy" onerror="this.onerror=null;this.src=\'' + defaultThumb + '\'">' +
      '  <div>' +
      '    <div class="track-title">' + track.title + '</div>' +
      '    <div class="track-subtitle text-muted small d-md-none">' + track.artist + '</div>' +
      '  </div>' +
      '</div>' +
      '<div class="track-artist">' + track.artist + '</div>' +
      '<div class="track-album">' + track.album + '</div>' +
      '<div class="track-duration">' + track.duration + '</div>';

    row.addEventListener('click', function () { playTrack(index); });
    trackListEl.appendChild(row);
  });
}

// ─── Play Track — fetches real audio from JioSaavn ──
async function playTrack(index) {
  const tracks = trackDatabase[currentPlaylist];
  if (!tracks || index >= tracks.length) return;

  currentTrackIndex = index;
  const track = tracks[index];

  // Update UI immediately
  playerTitle.innerText = track.title;
  playerArtist.innerText = track.artist;
  playerThumb.src = track.thumb;
  isPlaying = true;
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  progressBar.style.width = '0%';

  // Highlight active row
  document.querySelectorAll('.track-row').forEach(function (row, i) {
    row.classList.toggle('playing', i === index);
  });

  // Search JioSaavn for real audio
  try {
    var query = encodeURIComponent(track.title + ' ' + track.artist);
    var res = await fetch(JIOSAAVN_API + '/search/songs?query=' + query + '&limit=1');
    var data = await res.json();

    if (data.success && data.data && data.data.results && data.data.results.length) {
      var result = data.data.results[0];
      if (result.downloadUrl && result.downloadUrl.length) {
        var audioUrl = result.downloadUrl[result.downloadUrl.length - 1].url;
        playlistAudio.src = audioUrl;
        playlistAudio.play().catch(function () {});

        // Update thumb with real artwork if available
        if (result.image && result.image.length) {
          playerThumb.src = result.image[result.image.length - 1].url;
        }
        return;
      }
    }

    // Fallback: try iTunes preview
    var itunesRes = await fetch('https://itunes.apple.com/search?term=' + query + '&limit=1&entity=song&media=music');
    var itunesData = await itunesRes.json();
    if (itunesData.results && itunesData.results.length && itunesData.results[0].previewUrl) {
      playlistAudio.src = itunesData.results[0].previewUrl;
      playlistAudio.play().catch(function () {});
      if (itunesData.results[0].artworkUrl100) {
        playerThumb.src = itunesData.results[0].artworkUrl100;
      }
    } else {
      console.warn('No audio source found for:', track.title);
      playerTitle.innerText = track.title + ' (unavailable)';
    }
  } catch (err) {
    console.error('Playlist playback error:', err);
    playerTitle.innerText = track.title + ' (error)';
  }
}

// ─── Interactive Progress Bar (Seek + Drag + Touch) ──
var progressContainer = document.getElementById('playerProgressContainer');
var progressTooltip   = document.getElementById('progressTooltip');
var btTimeNow         = document.getElementById('btTimeNow');
var btTimeDur         = document.getElementById('btTimeDur');
var isDragging        = false;

// Real-time progress update from audio
playlistAudio.addEventListener('timeupdate', function () {
  if (isDragging) return; // Don't fight with user dragging
  if (!playlistAudio.duration) return;

  var pct = (playlistAudio.currentTime / playlistAudio.duration) * 100;
  progressBar.style.width = pct + '%';
  if (btTimeNow) btTimeNow.innerText = formatTime(playlistAudio.currentTime);
  if (btTimeDur)  btTimeDur.innerText = formatTime(playlistAudio.duration);
});

playlistAudio.addEventListener('ended', function () {
  nextTrack();
});

playlistAudio.addEventListener('loadedmetadata', function () {
  if (btTimeDur) btTimeDur.innerText = formatTime(playlistAudio.duration);
});

// Get seek position from mouse/touch event
function getSeekPct(e) {
  var rect = progressContainer.getBoundingClientRect();
  var x    = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  return Math.max(0, Math.min(x / rect.width, 1));
}

// Tooltip: show time on hover
if (progressContainer) {
  progressContainer.addEventListener('mousemove', function (e) {
    if (!playlistAudio.duration) return;
    var pct  = getSeekPct(e);
    var time = pct * playlistAudio.duration;
    if (progressTooltip) {
      progressTooltip.innerText = formatTime(time);
      var rect = progressContainer.getBoundingClientRect();
      var x = e.clientX - rect.left;
      progressTooltip.style.left = x + 'px';
    }
  });

  // Click to seek
  progressContainer.addEventListener('mousedown', function (e) {
    if (!playlistAudio.duration) return;
    isDragging = true;
    progressContainer.classList.add('dragging');
    var pct = getSeekPct(e);
    playlistAudio.currentTime = pct * playlistAudio.duration;
    progressBar.style.width = (pct * 100) + '%';
  });

  // Drag to seek
  document.addEventListener('mousemove', function (e) {
    if (!isDragging || !playlistAudio.duration) return;
    var pct = getSeekPct(e);
    progressBar.style.width = (pct * 100) + '%';
    if (btTimeNow) btTimeNow.innerText = formatTime(pct * playlistAudio.duration);
    if (progressTooltip) {
      var rect = progressContainer.getBoundingClientRect();
      var x = e.clientX - rect.left;
      progressTooltip.style.left = Math.max(0, Math.min(x, rect.width)) + 'px';
      progressTooltip.innerText = formatTime(pct * playlistAudio.duration);
    }
  });

  // Release drag
  document.addEventListener('mouseup', function (e) {
    if (!isDragging) return;
    isDragging = false;
    progressContainer.classList.remove('dragging');
    if (!playlistAudio.duration) return;
    var pct = getSeekPct(e);
    playlistAudio.currentTime = pct * playlistAudio.duration;
  });

  // Touch support for mobile
  progressContainer.addEventListener('touchstart', function (e) {
    if (!playlistAudio.duration) return;
    isDragging = true;
    progressContainer.classList.add('dragging');
    var pct = getSeekPct(e);
    playlistAudio.currentTime = pct * playlistAudio.duration;
    progressBar.style.width = (pct * 100) + '%';
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!isDragging || !playlistAudio.duration) return;
    var pct = getSeekPct(e);
    progressBar.style.width = (pct * 100) + '%';
    if (btTimeNow) btTimeNow.innerText = formatTime(pct * playlistAudio.duration);
  }, { passive: true });

  document.addEventListener('touchend', function () {
    if (!isDragging) return;
    isDragging = false;
    progressContainer.classList.remove('dragging');
  });
}

// ─── Play/Pause Toggle ──────────────────────────
playPauseBtn.addEventListener('click', function () {
  if (!playlistAudio.src || playlistAudio.src === '') {
    playTrack(0);
    return;
  }
  if (playlistAudio.paused) {
    playlistAudio.play().catch(function () {});
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    playlistAudio.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
});

// ─── Previous Track ─────────────────────────────
prevBtn.addEventListener('click', function () {
  if (currentTrackIndex > 0) {
    playTrack(currentTrackIndex - 1);
  }
});

// ─── Next Track ─────────────────────────────────
function nextTrack() {
  var tracks = trackDatabase[currentPlaylist];
  if (currentTrackIndex < tracks.length - 1) {
    playTrack(currentTrackIndex + 1);
  } else {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    progressBar.style.width = '0%';
  }
}

nextBtn.addEventListener('click', nextTrack);

// ─── Playlist Switching ─────────────────────────
document.querySelectorAll('.playlist-item').forEach(function (item) {
  item.addEventListener('click', function () {
    document.querySelectorAll('.playlist-item').forEach(function (i) { i.classList.remove('active'); });
    this.classList.add('active');
    var playlistId = this.dataset.playlist;
    playlistAudio.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    progressBar.style.width = '0%';
    loadPlaylist(playlistId);
  });
});

// ─── Filter Tags → Load genre-based searches ────
document.querySelectorAll('.filter-tag').forEach(function (tag) {
  tag.addEventListener('click', function () {
    document.querySelectorAll('.filter-tag').forEach(function (t) { t.classList.remove('active'); });
    this.classList.add('active');
    var filter = this.dataset.filter;
    if (filter === 'all') {
      // reload the current selected playlist
      loadPlaylist(currentPlaylist);
    } else {
      // Treat as a new search
      document.querySelectorAll('.playlist-item').forEach(function (i) { i.classList.remove('active'); });
      currentPlaylist = 'browse-' + filter;
      playlistAudio.pause();
      isPlaying = false;
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      progressBar.style.width = '0%';
      loadPlaylist(currentPlaylist);
    }
  });
});

// ─── Search ─────────────────────────────────────
playlistSearch.addEventListener('input', function () {
  var query = this.value.toLowerCase();
  var tracks = trackDatabase[currentPlaylist];
  var rows = document.querySelectorAll('.track-row');
  rows.forEach(function (row, index) {
    var track = tracks[index];
    var matches = track.title.toLowerCase().includes(query) ||
      track.artist.toLowerCase().includes(query) ||
      track.album.toLowerCase().includes(query);
    row.style.display = matches ? 'grid' : 'none';
  });
});

// ─── Create Playlist Modal ──────────────────────
createPlaylistBtn.addEventListener('click', function () {
  createPlaylistModal.classList.add('active');
});

closeModal.addEventListener('click', function () {
  createPlaylistModal.classList.remove('active');
});

cancelBtn.addEventListener('click', function () {
  createPlaylistModal.classList.remove('active');
});

confirmCreateBtn.addEventListener('click', function () {
  var name = document.getElementById('playlistNameInput').value;
  if (name) {
    var newPlaylist = document.createElement('div');
    newPlaylist.className = 'playlist-item';
    newPlaylist.innerHTML =
      '<i class="fas fa-music"></i>' +
      '<span>' + name + '</span>' +
      '<span class="track-count">0</span>';
    document.getElementById('userPlaylists').appendChild(newPlaylist);

    document.getElementById('playlistNameInput').value = '';
    document.getElementById('playlistDescInput').value = '';
    createPlaylistModal.classList.remove('active');
  }
});

// ─── Volume Control ─────────────────────────────
var volumeSlider = document.getElementById('volumeSlider');
var volumeBtn = document.getElementById('volumeBtn');

volumeSlider.addEventListener('input', function () {
  var volume = this.value / 100;
  playlistAudio.volume = volume;
  if (volume === 0) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else if (volume < 0.5) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  }
});

if (volumeBtn) {
  volumeBtn.addEventListener('click', function () {
    if (playlistAudio.volume > 0) {
      volumeBtn._prevVol = playlistAudio.volume;
      playlistAudio.volume = 0;
      if (volumeSlider) volumeSlider.value = 0;
      volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      playlistAudio.volume = volumeBtn._prevVol || 0.7;
      if (volumeSlider) volumeSlider.value = Math.round(playlistAudio.volume * 100);
      volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  });
}

// ─── Like Button ────────────────────────────────
document.getElementById('likeBtn').addEventListener('click', function () {
  this.classList.toggle('liked');
  var icon = this.querySelector('i');
  icon.classList.toggle('far');
  icon.classList.toggle('fas');
  this.style.color = icon.classList.contains('fas') ? '#bc13fe' : '';
});

// ─── Initialize ─────────────────────────────────
loadPlaylist('liked');

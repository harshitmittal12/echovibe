// ===================================================
// PLAYLIST PAGE PLAYER LOGIC — Real Audio via JioSaavn
// ===================================================

const JIOSAAVN_API = (window.ECHOVIBE_CONFIG && window.ECHOVIBE_CONFIG.JIOSAAVN_API) || 'https://saavn.sumit.co/api';

// Track Database — display metadata (audio fetched on demand)
const trackDatabase = {
  'liked': [
    { id: 1, title: "MIDNIGHT DRIFT", artist: "KSLV Noh", album: "Phonk Essentials", duration: "2:45", genre: "phonk", thumb: "https://images.unsplash.com/photo-1621693247912-c96604fe6d68?w=100" },
    { id: 2, title: "Neon Dreams", artist: "The Midnight", album: "Endless Summer", duration: "4:12", genre: "synthwave", thumb: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100" },
    { id: 3, title: "Study Session", artist: "Lofi Girl", album: "Chill Beats", duration: "3:28", genre: "lofi", thumb: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=100" },
    { id: 4, title: "SHADOW REALM", artist: "Kordhell", album: "Dark Phonk", duration: "2:33", genre: "phonk", thumb: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=100" },
    { id: 5, title: "Tokyo Nights", artist: "HOME", album: "Odyssey", duration: "3:56", genre: "synthwave", thumb: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=100" },
    { id: 6, title: "Rain on Glass", artist: "Jinsang", album: "Solitude", duration: "2:18", genre: "lofi", thumb: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=100" },
    { id: 7, title: "MURDER IN MY MIND", artist: "Kordhell", album: "Phonk Hits", duration: "2:51", genre: "phonk", thumb: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100" },
    { id: 8, title: "Resonance", artist: "HOME", album: "Odyssey", duration: "3:32", genre: "synthwave", thumb: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100" },
  ],
  'phonk-energy': [
    { id: 1, title: "MIDNIGHT DRIFT", artist: "KSLV Noh", album: "Phonk Essentials", duration: "2:45", genre: "phonk", thumb: "https://images.unsplash.com/photo-1621693247912-c96604fe6d68?w=100" },
    { id: 4, title: "SHADOW REALM", artist: "Kordhell", album: "Dark Phonk", duration: "2:33", genre: "phonk", thumb: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=100" },
    { id: 7, title: "MURDER IN MY MIND", artist: "Kordhell", album: "Phonk Hits", duration: "2:51", genre: "phonk", thumb: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100" },
  ],
  'midnight-drive': [
    { id: 2, title: "Neon Dreams", artist: "The Midnight", album: "Endless Summer", duration: "4:12", genre: "synthwave", thumb: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100" },
    { id: 5, title: "Tokyo Nights", artist: "HOME", album: "Odyssey", duration: "3:56", genre: "synthwave", thumb: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=100" },
    { id: 8, title: "Resonance", artist: "HOME", album: "Odyssey", duration: "3:32", genre: "synthwave", thumb: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100" },
  ],
  'focus-flow': [
    { id: 3, title: "Study Session", artist: "Lofi Girl", album: "Chill Beats", duration: "3:28", genre: "lofi", thumb: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=100" },
    { id: 6, title: "Rain on Glass", artist: "Jinsang", album: "Solitude", duration: "2:18", genre: "lofi", thumb: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=100" },
  ]
};

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
function loadPlaylist(playlistId) {
  currentPlaylist = playlistId;
  const tracks = trackDatabase[playlistId] || [];

  const playlistNames = {
    'liked': 'Liked Songs',
    'phonk-energy': 'Phonk Energy',
    'midnight-drive': 'Midnight Drive',
    'focus-flow': 'Focus Flow'
  };

  document.getElementById('currentPlaylistTitle').innerText = playlistNames[playlistId] || 'Playlist';
  document.querySelector('.playlist-track-count').innerText = tracks.length + ' songs';

  trackListEl.innerHTML = '';
  tracks.forEach(function (track, index) {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.innerHTML =
      '<div class="track-number">' + (index + 1) + '</div>' +
      '<div class="track-title-cell">' +
      '  <img src="' + track.thumb + '" class="track-mini-thumb" alt="' + track.title + '" loading="lazy">' +
      '  <div>' +
      '    <div class="track-title">' + track.title + '</div>' +
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

// ─── Audio Events ───────────────────────────────
playlistAudio.addEventListener('timeupdate', function () {
  if (!playlistAudio.duration) return;
  var pct = (playlistAudio.currentTime / playlistAudio.duration) * 100;
  progressBar.style.width = pct + '%';
});

playlistAudio.addEventListener('ended', function () {
  nextTrack();
});

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

// ─── Filter Tags ────────────────────────────────
document.querySelectorAll('.filter-tag').forEach(function (tag) {
  tag.addEventListener('click', function () {
    document.querySelectorAll('.filter-tag').forEach(function (t) { t.classList.remove('active'); });
    this.classList.add('active');
    currentFilter = this.dataset.filter;
    filterTracks();
  });
});

function filterTracks() {
  var tracks = trackDatabase[currentPlaylist];
  var rows = document.querySelectorAll('.track-row');
  rows.forEach(function (row, index) {
    var track = tracks[index];
    if (currentFilter === 'all' || track.genre === currentFilter) {
      row.style.display = 'grid';
    } else {
      row.style.display = 'none';
    }
  });
}

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

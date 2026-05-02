// ===================================================
// PLAYLIST PAGE PLAYER LOGIC
// ===================================================

// Sample Track Database
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

// Player State
let currentPlaylist = 'liked';
let currentTrackIndex = 0;
let isPlaying = false;
let currentFilter = 'all';

// DOM Elements
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

// Load Playlist
function loadPlaylist(playlistId) {
    currentPlaylist = playlistId;
    const tracks = trackDatabase[playlistId] || [];
    
    // Update header
    const playlistNames = {
        'liked': 'Liked Songs',
        'phonk-energy': 'Phonk Energy',
        'midnight-drive': 'Midnight Drive',
        'focus-flow': 'Focus Flow'
    };
    
    document.getElementById('currentPlaylistTitle').innerText = playlistNames[playlistId] || 'Playlist';
    document.querySelector('.playlist-track-count').innerText = `${tracks.length} songs`;
    
    // Render tracks
    trackListEl.innerHTML = '';
    tracks.forEach((track, index) => {
        const row = document.createElement('div');
        row.className = 'track-row';
        row.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <div class="track-title-cell">
                <img src="${track.thumb}" class="track-mini-thumb" alt="${track.title}">
                <div>
                    <div class="track-title">${track.title}</div>
                </div>
            </div>
            <div class="track-artist">${track.artist}</div>
            <div class="track-album">${track.album}</div>
            <div class="track-duration">${track.duration}</div>
        `;
        
        row.addEventListener('click', () => playTrack(index));
        trackListEl.appendChild(row);
    });
}

// Play Track
function playTrack(index) {
    const tracks = trackDatabase[currentPlaylist];
    if (!tracks || index >= tracks.length) return;
    
    currentTrackIndex = index;
    const track = tracks[index];
    
    // Update player UI
    playerTitle.innerText = track.title;
    playerArtist.innerText = track.artist;
    playerThumb.src = track.thumb;
    
    // Update track list highlighting
    document.querySelectorAll('.track-row').forEach((row, i) => {
        row.classList.toggle('playing', i === index);
    });
    
    // Start playing
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Simulate progress
    animateProgress();
}

// Animate Progress Bar
function animateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(interval);
            return;
        }
        progress += 0.5;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            nextTrack();
        }
    }, 100);
}

// Play/Pause Toggle
playPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    
    if (isPlaying && currentTrackIndex === 0 && progressBar.style.width === '0%') {
        playTrack(0);
    }
});

// Previous Track
prevBtn.addEventListener('click', () => {
    if (currentTrackIndex > 0) {
        playTrack(currentTrackIndex - 1);
    }
});

// Next Track
function nextTrack() {
    const tracks = trackDatabase[currentPlaylist];
    if (currentTrackIndex < tracks.length - 1) {
        playTrack(currentTrackIndex + 1);
    } else {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.style.width = '0%';
    }
}

nextBtn.addEventListener('click', nextTrack);

// Playlist Switching
document.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.playlist-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        const playlistId = this.dataset.playlist;
        loadPlaylist(playlistId);
    });
});

// Filter Tags
document.querySelectorAll('.filter-tag').forEach(tag => {
    tag.addEventListener('click', function() {
        document.querySelectorAll('.filter-tag').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        currentFilter = this.dataset.filter;
        filterTracks();
    });
});

function filterTracks() {
    const tracks = trackDatabase[currentPlaylist];
    const rows = document.querySelectorAll('.track-row');
    
    rows.forEach((row, index) => {
        const track = tracks[index];
        if (currentFilter === 'all' || track.genre === currentFilter) {
            row.style.display = 'grid';
        } else {
            row.style.display = 'none';
        }
    });
}

// Search
playlistSearch.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    const tracks = trackDatabase[currentPlaylist];
    const rows = document.querySelectorAll('.track-row');
    
    rows.forEach((row, index) => {
        const track = tracks[index];
        const matches = track.title.toLowerCase().includes(query) || 
                       track.artist.toLowerCase().includes(query) ||
                       track.album.toLowerCase().includes(query);
        
        row.style.display = matches ? 'grid' : 'none';
    });
});

// Create Playlist Modal
createPlaylistBtn.addEventListener('click', () => {
    createPlaylistModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
    createPlaylistModal.classList.remove('active');
});

cancelBtn.addEventListener('click', () => {
    createPlaylistModal.classList.remove('active');
});

confirmCreateBtn.addEventListener('click', () => {
    const name = document.getElementById('playlistNameInput').value;
    if (name) {
        // Add new playlist to sidebar
        const newPlaylist = document.createElement('div');
        newPlaylist.className = 'playlist-item';
        newPlaylist.innerHTML = `
            <i class="fas fa-music"></i>
            <span>${name}</span>
            <span class="track-count">0</span>
        `;
        document.getElementById('userPlaylists').appendChild(newPlaylist);
        
        // Clear inputs and close modal
        document.getElementById('playlistNameInput').value = '';
        document.getElementById('playlistDescInput').value = '';
        createPlaylistModal.classList.remove('active');
    }
});

// Volume Control
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');

volumeSlider.addEventListener('input', function() {
    const volume = this.value;
    if (volume == 0) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else if (volume < 50) {
        volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
    } else {
        volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

// Like Button
document.getElementById('likeBtn').addEventListener('click', function() {
    this.classList.toggle('liked');
    const icon = this.querySelector('i');
    icon.classList.toggle('far');
    icon.classList.toggle('fas');
});

// Initialize
loadPlaylist('liked');

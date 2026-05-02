// ===================================================
// COMMUNITY PAGE DYNAMIC CONTENT
// ===================================================

// Sample Data
const activityData = [
    { user: "DJ_Nox", avatar: "https://i.pravatar.cc/150?img=12", action: "added", track: "MIDNIGHT DRIFT", time: "2m ago" },
    { user: "SynthQueen", avatar: "https://i.pravatar.cc/150?img=25", action: "shared playlist", track: "Neon Dreams Collection", time: "5m ago" },
    { user: "PhonkMaster", avatar: "https://i.pravatar.cc/150?img=33", action: "liked", track: "SHADOW REALM", time: "8m ago" },
    { user: "LofiVibes", avatar: "https://i.pravatar.cc/150?img=47", action: "created", track: "Chill Study Mix", time: "12m ago" },
    { user: "BassHunter", avatar: "https://i.pravatar.cc/150?img=8", action: "followed", track: "Kordhell", time: "15m ago" },
    { user: "RetroWave_88", avatar: "https://i.pravatar.cc/150?img=52", action: "added", track: "Tokyo Nights", time: "18m ago" },
    { user: "DarkBeats", avatar: "https://i.pravatar.cc/150?img=19", action: "shared", track: "Underground Phonk", time: "22m ago" },
    { user: "ChillMaster", avatar: "https://i.pravatar.cc/150?img=31", action: "liked", track: "Rain on Glass", time: "25m ago" }
];

const trendingData = [
    { title: "MIDNIGHT DRIFT", artist: "KSLV Noh", plays: "1.2M", thumb: "https://images.unsplash.com/photo-1621693247912-c96604fe6d68?w=100" },
    { title: "Neon Dreams", artist: "The Midnight", plays: "987K", thumb: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100" },
    { title: "SHADOW REALM", artist: "Kordhell", plays: "856K", thumb: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=100" },
    { title: "Tokyo Nights", artist: "HOME", plays: "743K", thumb: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=100" },
    { title: "Study Session", artist: "Lofi Girl", plays: "692K", thumb: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=100" },
    { title: "Resonance", artist: "HOME", plays: "621K", thumb: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100" },
    { title: "Rain on Glass", artist: "Jinsang", plays: "587K", thumb: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=100" },
    { title: "MURDER IN MY MIND", artist: "Kordhell", plays: "534K", thumb: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100" }
];

const leaderboardData = [
    { name: "DJ_Nox", avatar: "https://i.pravatar.cc/150?img=12", hours: "247h", badge: "🔥 Streak King" },
    { name: "SynthQueen", avatar: "https://i.pravatar.cc/150?img=25", hours: "198h", badge: "👑 Top Curator" },
    { name: "PhonkMaster", avatar: "https://i.pravatar.cc/150?img=33", hours: "176h", badge: "⚡ Power User" },
    { name: "LofiVibes", avatar: "https://i.pravatar.cc/150?img=47", hours: "154h", badge: "🎵 Playlist Pro" },
    { name: "BassHunter", avatar: "https://i.pravatar.cc/150?img=8", hours: "142h", badge: "🎧 Audiophile" },
    { name: "RetroWave_88", avatar: "https://i.pravatar.cc/150?img=52", hours: "128h", badge: "🌟 Rising Star" }
];

const featuredUsers = [
    { name: "DJ_Nox", avatar: "https://i.pravatar.cc/150?img=12", role: "Phonk Curator", playlists: "42 playlists" },
    { name: "SynthQueen", avatar: "https://i.pravatar.cc/150?img=25", role: "Synthwave Expert", playlists: "38 playlists" },
    { name: "LofiVibes", avatar: "https://i.pravatar.cc/150?img=47", role: "Chill Master", playlists: "56 playlists" },
    { name: "PhonkMaster", avatar: "https://i.pravatar.cc/150?img=33", role: "Underground Scout", playlists: "31 playlists" },
    { name: "RetroWave_88", avatar: "https://i.pravatar.cc/150?img=52", role: "80s Specialist", playlists: "29 playlists" },
    { name: "BassHunter", avatar: "https://i.pravatar.cc/150?img=8", role: "Bass Enthusiast", playlists: "24 playlists" }
];

const eventsData = [
    { title: "Phonk Night Live", date: "Feb 10, 2026", location: "Virtual Event", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400", attendees: "2.3K" },
    { title: "Synthwave Sunset", date: "Feb 15, 2026", location: "Los Angeles, CA", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400", attendees: "1.8K" },
    { title: "Lo-Fi Study Session", date: "Feb 18, 2026", location: "Online", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400", attendees: "3.1K" },
    { title: "Underground Rave", date: "Feb 22, 2026", location: "Berlin, Germany", image: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=400", attendees: "5.2K" },
    { title: "Chill Vibes Festival", date: "Feb 28, 2026", location: "Tokyo, Japan", image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=400", attendees: "4.7K" },
    { title: "Midnight Release Party", date: "Mar 5, 2026", location: "Virtual Event", image: "https://images.unsplash.com/photo-1621693247912-c96604fe6d68?w=400", attendees: "6.8K" }
];

// Load Activity Feed
function loadActivityFeed() {
    const feed = document.getElementById('activityFeed');
    feed.innerHTML = activityData.map(activity => `
        <div class="activity-item">
            <img src="${activity.avatar}" class="activity-avatar" alt="${activity.user}">
            <div class="activity-content">
                <div class="activity-user">${activity.user}</div>
                <div class="activity-action">
                    ${activity.action} <span class="activity-track">${activity.track}</span>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Load Trending List
function loadTrendingList() {
    const list = document.getElementById('trendingList');
    list.innerHTML = trendingData.map((track, index) => `
        <div class="trending-item">
            <div class="trending-rank">${index + 1}</div>
            <img src="${track.thumb}" class="trending-thumb" alt="${track.title}">
            <div class="trending-info">
                <div class="trending-title">${track.title}</div>
                <div class="trending-artist">${track.artist}</div>
            </div>
            <div class="trending-plays">${track.plays}</div>
        </div>
    `).join('');
}

// Load Leaderboard
function loadLeaderboard() {
    const list = document.getElementById('leaderboardList');
    list.innerHTML = leaderboardData.map((user, index) => `
        <div class="leaderboard-item">
            <div class="leaderboard-rank">${index + 1}</div>
            <img src="${user.avatar}" class="leaderboard-avatar" alt="${user.name}">
            <div class="leaderboard-info">
                <div class="leaderboard-name">${user.name}</div>
                <div class="leaderboard-stats">${user.hours} this week</div>
            </div>
            <div class="leaderboard-badge">${user.badge}</div>
        </div>
    `).join('');
}

// Load Featured Users
function loadFeaturedUsers() {
    const grid = document.getElementById('featuredUsers');
    grid.innerHTML = featuredUsers.map(user => `
        <div class="featured-user-card">
            <img src="${user.avatar}" class="featured-avatar" alt="${user.name}">
            <div class="featured-name">${user.name}</div>
            <div class="featured-role">${user.role}</div>
            <div class="featured-stat">${user.playlists}</div>
            <button class="follow-btn">Follow</button>
        </div>
    `).join('');
}

// Load Events
function loadEvents() {
    const grid = document.getElementById('eventsGrid');
    grid.innerHTML = eventsData.map(event => `
        <div class="event-card">
            <img src="${event.image}" class="event-image" alt="${event.title}">
            <div class="event-content">
                <div class="event-date">${event.date}</div>
                <div class="event-title">${event.title}</div>
                <div class="event-location"><i class="fas fa-map-marker-alt me-2"></i>${event.location}</div>
                <div class="event-attendees">
                    <i class="fas fa-users"></i> ${event.attendees} interested
                </div>
            </div>
        </div>
    `).join('');
}

// Animate Stats Counter
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.innerText = target.toLocaleString();
                clearInterval(timer);
            } else {
                stat.innerText = Math.floor(current).toLocaleString();
            }
        }, 16);
    });
}

// Event Tab Switching
document.querySelectorAll('.event-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.event-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        // In a real app, you'd filter events here
    });
});

// Auto-refresh Activity Feed
setInterval(() => {
    // Simulate new activity
    const newActivity = activityData[Math.floor(Math.random() * activityData.length)];
    const feed = document.getElementById('activityFeed');
    const newItem = document.createElement('div');
    newItem.className = 'activity-item';
    newItem.style.opacity = '0';
    newItem.innerHTML = `
        <img src="${newActivity.avatar}" class="activity-avatar" alt="${newActivity.user}">
        <div class="activity-content">
            <div class="activity-user">${newActivity.user}</div>
            <div class="activity-action">
                ${newActivity.action} <span class="activity-track">${newActivity.track}</span>
            </div>
            <div class="activity-time">Just now</div>
        </div>
    `;
    feed.insertBefore(newItem, feed.firstChild);
    
    // Fade in animation
    setTimeout(() => {
        newItem.style.transition = 'opacity 0.5s';
        newItem.style.opacity = '1';
    }, 100);
    
    // Remove last item if too many
    if (feed.children.length > 8) {
        feed.removeChild(feed.lastChild);
    }
}, 10000); // New activity every 10 seconds

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadActivityFeed();
    loadTrendingList();
    loadLeaderboard();
    loadFeaturedUsers();
    loadEvents();
    animateStats();
});

gsap.registerPlugin(ScrollTrigger);

// =========================================
// 1. GLOBAL UI: PREMIUM MAGNETIC CURSOR (CONTEXTUAL MAP)
// =========================================

// Create cursor elements dynamically
const cursorWrapper = document.createElement("div");
cursorWrapper.className = "cursor-wrapper";

const cursorDot = document.createElement("div");
cursorDot.className = "cursor-dot";

const cursorRing = document.createElement("div");
cursorRing.className = "cursor-ring";

const cursorText = document.createElement("span");
cursorText.className = "cursor-text";
cursorText.innerText = "";

cursorRing.appendChild(cursorText); // Put text inside ring
cursorWrapper.appendChild(cursorDot);
cursorWrapper.appendChild(cursorRing);
document.body.appendChild(cursorWrapper);

// Initial set
gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
gsap.set(cursorRing, { xPercent: -50, yPercent: -50 });

// Movement Logic (Dot = Fast, Ring = Laggy)
const dotX = gsap.quickSetter(cursorDot, "x", "px");
const dotY = gsap.quickSetter(cursorDot, "y", "px");

const ringX = gsap.quickSetter(cursorRing, "x", "px");
const ringY = gsap.quickSetter(cursorRing, "y", "px");

let mouseX = 0;
let mouseY = 0;
let ringXPos = 0;
let ringYPos = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Update Dot Immediately
  dotX(mouseX);
  dotY(mouseY);
});

// Smooth Ring Loop
gsap.ticker.add(() => {
  const dt = 1.0 - Math.pow(1.0 - 0.15, gsap.ticker.deltaRatio()); 
  
  ringXPos += (mouseX - ringXPos) * dt;
  ringYPos += (mouseY - ringYPos) * dt;
  
  ringX(ringXPos);
  ringY(ringYPos);
});

// CONTEXTUAL HOVER SYSTEM
const cursorStates = [
  { selector: "a, button, input, .nav-links a", text: "" }, // Default active
  { selector: ".vinyl, #main-play-btn", text: "PLAY" },
  { selector: ".editorial-container, .echo-read-more", text: "READ" },
  { selector: ".matrix-card, .artist-card-large, .bento-item", text: "VIEW" }
];

cursorStates.forEach(state => {
  document.querySelectorAll(state.selector).forEach(el => {
    el.addEventListener("mouseenter", () => {
      if (state.text) {
        cursorText.innerText = state.text;
        cursorWrapper.classList.add("text-mode");
      } else {
         cursorWrapper.classList.add("active");
      }
    });
    
    el.addEventListener("mouseleave", () => {
      cursorWrapper.classList.remove("active");
      cursorWrapper.classList.remove("text-mode");
      cursorText.innerText = "";
    });
  });
});

// =========================================
// 2. NAVIGATION: CROSS-PAGE SMOOTH SCROLL
// =========================================
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");

    // Check if we are on index.html or if the link is a hashtag on the current page
    if (href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else if (href.includes("index.html#")) {
      // If on explore.html and clicking a home link, let the browser handle the redirect
      // If already on index.html, catch it and smooth scroll
      if (
        window.location.pathname.includes("index.html") ||
        window.location.pathname === "/"
      ) {
        e.preventDefault();
        const id = href.split("#")[1];
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// =========================================
// 3. HOME PAGE (INDEX) SPECIFIC LOGIC
// =========================================

// Hero Horizontal Scroll
if (document.querySelector(".pin-wrapper")) {
  gsap.to(".pin-wrapper", {
    x: "-100vw",
    ease: "none",
    scrollTrigger: {
      trigger: ".horizontal-scroll",
      pin: true,
      scrub: 1,
      snap: 1,
      end: () => "+=" + window.innerWidth,
    },
  });
}

// Vinyl Animation REMOVED
/*
const vinyl = document.querySelector(".vinyl");
const indexAudio = document.getElementById("audio-player");
const mainPlayBtn = document.getElementById("main-play-btn");

if (vinyl) {
  let vinylTween = gsap.to(vinyl, {
    rotation: 360,
    duration: 12,
    repeat: -1,
    ease: "none",
  });

  mainPlayBtn?.addEventListener("click", () => {
    if (indexAudio.paused) {
      indexAudio.play();
      gsap.to(vinylTween, { timeScale: 4, duration: 1 });
      mainPlayBtn.innerText = "PAUSE ECHO";
    } else {
      indexAudio.pause();
      gsap.to(vinylTween, { timeScale: 1, duration: 1 });
      mainPlayBtn.innerText = "JOIN COMMUNITY";
    }
  });
} 
*/

// Roadmap Line Animation
if (document.querySelector(".timeline-progress")) {
  gsap.to(".timeline-progress", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: ".roadmap-wrapper",
      start: "top center",
      end: "bottom center",
      scrub: 1,
    },
  });
}

// Trending Matrix Mood Filter
const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".matrix-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      if (filter === "all" || card.classList.contains(filter)) {
        card.style.display = "block";
        gsap.from(card, { opacity: 0, scale: 0.9, duration: 0.4 });
      } else {
        card.style.display = "none";
      }
    });
  });
});

// 3D PREVIEW TILT EFFECT (MATRIX CARDS)
document.querySelectorAll(".matrix-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse x inside card
    const y = e.clientY - rect.top; // Mouse y inside card
    
    // Calculate rotation (-15deg to 15deg)
    const xRot = ((y - rect.height / 2) / rect.height) * -20; 
    const yRot = ((x - rect.width / 2) / rect.width) * 20;

    gsap.to(card, {
      rotationX: xRot,
      rotationY: yRot,
      scale: 1.05,
      duration: 0.1,
      ease: "power2.out"
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)"
    });
  });
});

// 1️⃣ CAROUSEL LOGIC REMOVED
// The hero section is now the horizontal scroll


// Weekly Echo Scroll Animations
if (document.querySelector(".weekly-echo")) {
  gsap.from(".editorial-left", {
    x: -100,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out",
    scrollTrigger: { trigger: ".weekly-echo", start: "top 70%" },
  });

  gsap.from(".editorial-right > *", {
    y: 50,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".editorial-right", start: "top 75%" },
  });
}

// Dynamic Waveform Scroll
const waveformPath = document.querySelector("#waveform-path");
if (waveformPath) {
  function generateWavePath(progress) {
    let d = "M 0 200 ";
    for (let i = 0; i <= 60; i++) {
      const x = (i / 60) * 1000;
      const amplitude = 150 * Math.sin(progress * Math.PI);
      const wave1 = Math.sin(i * 0.2 + progress * 10) * amplitude;
      const wave2 = Math.sin(i * 0.1 - progress * 5) * (amplitude * 0.5);
      const y = 200 + (wave1 + wave2);
      d += `L ${x} ${y} `;
    }
    waveformPath.setAttribute("d", d);
  }
  gsap.to(
    {},
    {
      scrollTrigger: {
        trigger: ".live-echo-waveform",
        onUpdate: (self) => generateWavePath(self.progress),
      },
    }
  );
}

// Genre Sphere 3D Parallax
const sphereArea = document.querySelector("#sphere-area");
const tags = document.querySelectorAll(".genre-tag");

if (sphereArea) {
  sphereArea.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = sphereArea.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const moveX = clientX - centerX;
    const moveY = clientY - centerY;

    tags.forEach((tag) => {
      const speed = parseFloat(tag.getAttribute("data-speed"));
      gsap.to(tag, {
        x: moveX * speed * 2,
        y: moveY * speed * 2,
        z: Math.abs(moveX * speed * 5),
        rotationX: -moveY * speed * 0.5,
        rotationY: moveX * speed * 0.5,
        duration: 0.6,
        ease: "power2.out",
      });
    });
  });

  sphereArea.addEventListener("mouseleave", () => {
    tags.forEach((tag) => {
      gsap.to(tag, {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      });
    });
  });
}




  /* =====================================================
   GLOBAL CLICKABLE FEEDBACK (SAFE PATCH)
   ===================================================== */

const clickableSelectors = `
  .matrix-card,
  .bento-item,
  .artist-card-large,
  .genre-tag,
  .playlist-card,
  .song-row,
  .carousel-item,
  .album-card,
  .editorial-container,
  .vinyl
`;

document.querySelectorAll(clickableSelectors).forEach(el => {
  el.style.cursor = "pointer";

  el.addEventListener("click", () => {
    console.log("EchoVibe Click:", el.className);
  });
});

/* =====================================================
   INDEX – ARTIST CARD HOVER AUDIO PREVIEW
   ===================================================== */

const hoverAudio = new Audio();
hoverAudio.volume = 0.35;

document.querySelectorAll(".artist-card-large").forEach(card => {
  card.addEventListener("mouseenter", () => {
    hoverAudio.src =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    hoverAudio.play().catch(() => {});
  });

  card.addEventListener("mouseleave", () => {
    hoverAudio.pause();
    hoverAudio.currentTime = 0;
  });

  card.addEventListener("click", () => {
    console.log("Navigating to explore (disabled)");
  });
});
/* =====================================================
   UNIVERSAL ARTIST HOVER SOUND + CLICK REDIRECT
   SAFE ADDITIVE PATCH – DO NOT REMOVE
   ===================================================== */

const previewAudio = new Audio();
previewAudio.volume = 0.4;
previewAudio.preload = "none";

const PREVIEW_TRACK =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";

function attachHoverSound(selector) {
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener("mouseenter", () => {
      previewAudio.src = PREVIEW_TRACK;
      previewAudio.play().catch(() => {});
    });

    el.addEventListener("mouseleave", () => {
      previewAudio.pause();
      previewAudio.currentTime = 0;
    });

    el.addEventListener("click", () => {
      console.log("Navigating to explore (disabled)");
    });
  });
}

/* Apply to ALL visual music entities */
attachHoverSound(".artist-card-large");
attachHoverSound(".matrix-card");
attachHoverSound(".bento-item");


// HAMBURGER MENU TOGGLE
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu-overlay");
const mobileLinks = document.querySelectorAll(".mobile-nav-links li");

hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobileMenu.classList.toggle("active");
    
    // Staggered Animation for Links
    if (mobileMenu.classList.contains("active")) {
        mobileLinks.forEach((link, index) => {
            setTimeout(() => {
                link.style.opacity = "1";
                link.style.transform = "translateY(0)";
            }, index * 100 + 300);
        });
    } else {
        mobileLinks.forEach((link) => {
            link.style.opacity = "0";
            link.style.transform = "translateY(20px)";
        });
    }
});

// Close menu when a link is clicked
document.querySelectorAll(".mobile-nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        mobileMenu.classList.remove("active");
    });
});


// ===================================================
// FEATURE SPOTLIGHT CAROUSEL
// ===================================================

document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.getElementById("spotlightCarousel");
    if (!carousel) return;

    const slides = carousel.querySelectorAll(".spotlight-slide");
    const dots = document.querySelectorAll(".spotlight-dot");
    let currentSlide = 0;
    let autoplayInterval;

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        // Add active class to current slide and dot
        slides[index].classList.add("active");
        dots[index].classList.add("active");
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
        resetAutoplay();
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => goToSlide(index));
    });

    // Start autoplay
    startAutoplay();

    // Pause on hover
    carousel.addEventListener("mouseenter", () => clearInterval(autoplayInterval));
    carousel.addEventListener("mouseleave", startAutoplay);
});

/* =========================================
   MOOD RECOMMENDATION BACKEND CONNECTION
========================================= */

document.addEventListener("DOMContentLoaded", () => {

const moodButtons = document.querySelectorAll(".mood-btn");
const songsContainer = document.getElementById("songsContainer");

if(!moodButtons.length || !songsContainer) return;

moodButtons.forEach(button=>{

button.addEventListener("click", async ()=>{

const mood = button.dataset.mood;

songsContainer.innerHTML =
`<p style="color:white;">Loading recommendations...</p>`;

try{

const res = await fetch(
`http://localhost:5000/api/songs/${mood}`,
{
method:"GET",
headers:{
"Content-Type":"application/json"
}
}
);

const songs = await res.json();

if(!res.ok){
songsContainer.innerHTML=
`<p style="color:red;">Failed to fetch songs</p>`;
return;
}

if(!songs.length){
songsContainer.innerHTML=
`<p style="color:white;">No songs found for this mood. Add songs in phpMyAdmin!</p>`;
return;
}

let html="";

songs.forEach(song=>{

// song.title matches the 'title' column in your phpMyAdmin songs table
html += `
<div class="col-md-4 mb-4">
<div class="song-wide-card p-3" style="cursor:pointer;" onclick="playPreview('${song.title}','${song.artist}','${mood}')">
<h4>${song.title}</h4>
<p>${song.artist}</p>
<small style="color:#bc13fe;"><i class="fas fa-play-circle"></i> Tap to play preview</small>
</div>
</div>
`;

});

songsContainer.innerHTML = html;

}
catch(error){
console.error(error);
songsContainer.innerHTML=
`<p style="color:red;">Server Error</p>`;
}

});

});

});

// =========================================
// GLOBAL AUDIO PLAYER (iTunes 30-sec Previews)
// =========================================

const echoAudio = new Audio();
echoAudio.volume = 0.8;
let echoProgressTimer = null;

async function playPreview(title, artist, mood) {

  // 1. Save to history (silent if not logged in)
  saveSongHistory(title, mood);

  // 2. Show loading state in player bar
  updatePlayerBar(title, artist, '', true);

  try {
    // 3. Search iTunes for 30-sec preview
    const term = encodeURIComponent(title + ' ' + artist);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&limit=1&entity=song&media=music`
    );
    const data = await res.json();

    if (!data.results || !data.results.length || !data.results[0].previewUrl) {
      updatePlayerBar(title, artist, '', false);
      console.warn('No iTunes preview for:', title);
      return;
    }

    const track = data.results[0];

    // 4. Play the preview
    echoAudio.src = track.previewUrl;
    echoAudio.play();

    // 5. Update player bar with real artwork from iTunes
    updatePlayerBar(
      track.trackName || title,
      track.artistName || artist,
      track.artworkUrl100,
      false
    );

    // 6. Animate progress bar (iTunes previews = 30 seconds)
    startProgressBar(30);

  } catch(e) {
    console.error('iTunes preview error:', e);
    updatePlayerBar(title, artist, '', false);
  }
}

function updatePlayerBar(title, artist, thumb, loading) {
  const titleEl  = document.querySelector('.track-info h5');
  const artistEl = document.querySelector('.track-info p');
  const thumbEl  = document.querySelector('.track-thumb');
  const playIcon = document.querySelector('.play-pause-btn i');

  if (titleEl)  titleEl.innerText  = loading ? 'Loading...' : title;
  if (artistEl) artistEl.innerText = loading ? ''           : artist;
  if (thumbEl && thumb) thumbEl.src = thumb;
  if (playIcon) {
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
  }
}

function startProgressBar(durationSec) {
  clearInterval(echoProgressTimer);
  const bar = document.querySelector('.player-progress-bar');
  if (!bar) return;
  bar.style.width = '0%';
  let elapsed = 0;
  echoProgressTimer = setInterval(() => {
    elapsed += 0.1;
    bar.style.width = Math.min((elapsed / durationSec) * 100, 100) + '%';
    if (elapsed >= durationSec) clearInterval(echoProgressTimer);
  }, 100);
}

// Wire play/pause button on explore page
document.addEventListener('DOMContentLoaded', () => {
  const playPauseBtn = document.querySelector('.play-pause-btn');
  if (!playPauseBtn) return;

  playPauseBtn.addEventListener('click', () => {
    const icon = playPauseBtn.querySelector('i');
    if (echoAudio.paused) {
      echoAudio.play();
      icon.classList.replace('fa-play', 'fa-pause');
    } else {
      echoAudio.pause();
      icon.classList.replace('fa-pause', 'fa-play');
    }
  });
});

// =========================================
// SAVE SONG TO HISTORY
// =========================================
async function saveSongHistory(songName, mood) {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    await fetch('http://localhost:5000/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ song_name: songName, mood: mood })
    });
  } catch(e) {
    // Silent fail
  }
}
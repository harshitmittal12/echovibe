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

// Hide native cursor once custom cursor is loaded
document.documentElement.style.cursor = 'none';

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

/* Artist cards → navigate to explore on click */
document.querySelectorAll(".artist-card-large").forEach(card => {
  card.addEventListener("click", () => {
    window.location.href = 'explore.html';
  });
});


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

/* Old mood handler removed — explore.html inline script handles this */

/* Old duplicate audio engine removed — explore.html handles all playback */

// =========================================
// SAVE SONG TO HISTORY (used by explore.html)
// =========================================
async function saveSongHistory(songName, mood) {
  const token = localStorage.getItem('token');
  if (!token) return;
  const base = window.ECHOVIBE_CONFIG?.API_BASE_URL || 'http://localhost:5000';
  try {
    await fetch(base + '/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ song_name: songName, mood: mood })
    });
  } catch(e) { /* Silent fail */ }
}

// =========================================
// DYNAMIC NAVBAR (Login/Logout State)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');

  // Update ALL nav instances (desktop + mobile)
  document.querySelectorAll('.nav-links, .mobile-nav-links').forEach(nav => {
    const loginLink = nav.querySelector('a[href="login.html"]');
    if (!loginLink) return;
    const parentLi = loginLink.closest('li');
    if (!parentLi) return;

    if (token && (userEmail || userName)) {
      const displayName = userName || userEmail.split('@')[0];
      parentLi.innerHTML = `
        <a href="#" class="cta-btn small user-logout-btn" style="font-size:0.8rem;" aria-label="Logout">
          <i class="fas fa-user me-1"></i>${displayName}
          <i class="fas fa-sign-out-alt ms-2"></i>
        </a>
      `;
      parentLi.querySelector('.user-logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
      });
    }
  });
});

// =========================================
// EXPLORE PAGE: SEARCH BAR (iTunes Search + Live Suggestions)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('.search-input-box input');
  if (!searchInput) return;

  // Helper: format milliseconds to mm:ss
  function formatMs(ms) {
    if (!ms) return '';
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min + ':' + (sec < 10 ? '0' : '') + sec;
  }

  // --- LIVE SUGGESTIONS DROPDOWN ---
  // Create dropdown container
  let suggestBox = document.createElement('div');
  suggestBox.id = 'searchSuggestions';
  suggestBox.style.cssText = `
    position:absolute; top:100%; left:0; right:0; z-index:999;
    background:rgba(20,20,25,0.98); border:1px solid rgba(188,19,254,0.3);
    border-radius:0 0 12px 12px; max-height:400px; overflow-y:auto;
    display:none; backdrop-filter:blur(20px);
  `;
  // Make the parent relative
  const searchWrap = searchInput.closest('.search-input-box');
  if (searchWrap) {
    searchWrap.style.position = 'relative';
    searchWrap.appendChild(suggestBox);
  }

  let debounceTimer = null;

  searchInput.addEventListener('input', function () {
    const query = this.value.trim();
    clearTimeout(debounceTimer);

    if (query.length < 2) {
      suggestBox.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const term = encodeURIComponent(query);
        const res = await fetch(
          `https://itunes.apple.com/search?term=${term}&limit=6&entity=song&media=music`
        );
        const data = await res.json();

        if (!data.results || !data.results.length) {
          suggestBox.innerHTML = '<div style="padding:16px;color:#888;">No suggestions found</div>';
          suggestBox.style.display = 'block';
          return;
        }

        suggestBox.innerHTML = data.results.map(track => {
          const dur = formatMs(track.trackTimeMillis);
          return `
            <div class="suggest-item" style="
              display:flex; align-items:center; gap:12px; padding:10px 16px;
              cursor:pointer; transition:background 0.2s; border-bottom:1px solid rgba(255,255,255,0.05);
            "
            data-title="${encodeURIComponent(track.trackName || '')}"
            data-artist="${encodeURIComponent(track.artistName || '')}"
            data-preview="${track.previewUrl || ''}"
            data-artwork="${track.artworkUrl100 || ''}"
            >
              <img src="${track.artworkUrl60 || track.artworkUrl100 || ''}" style="width:40px;height:40px;border-radius:6px;flex-shrink:0;" alt="">
              <div style="flex:1;min-width:0;">
                <div style="color:#fff;font-size:0.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${track.trackName || ''}</div>
                <div style="color:#888;font-size:0.75rem;">${track.artistName || ''}</div>
              </div>
              <div style="color:#bc13fe;font-size:0.8rem;flex-shrink:0;">${dur}</div>
            </div>
          `;
        }).join('');

        suggestBox.style.display = 'block';

        // Click on suggestion → play it immediately
        suggestBox.querySelectorAll('.suggest-item').forEach(item => {
          item.addEventListener('mouseenter', () => { item.style.background = 'rgba(188,19,254,0.15)'; });
          item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; });
          item.addEventListener('click', async () => {
            const title = decodeURIComponent(item.dataset.title);
            const artist = decodeURIComponent(item.dataset.artist);
            const artwork = item.dataset.artwork;

            suggestBox.style.display = 'none';
            searchInput.value = title;

            // Update player bar immediately
            const h5 = document.querySelector('.track-info h5');
            const p = document.querySelector('.track-info p');
            const th = document.querySelector('.track-thumb');
            const icon = document.querySelector('.play-pause-btn i');
            if (h5) h5.innerText = 'Loading...';
            if (p) p.innerText = artist;

            // Try JioSaavn for full song
            try {
              const term = encodeURIComponent(title + ' ' + artist);
              const saavnRes = await fetch('https://saavn.sumit.co/api/search/songs?query=' + term + '&limit=1');
              const saavnData = await saavnRes.json();

              if (saavnData.success && saavnData.data?.results?.length) {
                const track = saavnData.data.results[0];
                if (track.downloadUrl?.length) {
                  const songUrl = track.downloadUrl[track.downloadUrl.length - 1].url;
                  const songName = track.name || title;
                  const songArtist = track.artists?.primary?.map(a => a.name).join(', ') || artist;
                  const songImage = track.image?.length ? track.image[track.image.length - 1].url : artwork;

                  const audio = document.getElementById('echoPlayer');
                  if (audio) {
                    audio.src = songUrl;
                    audio.play().catch(() => {});
                    if (h5) h5.innerText = songName;
                    if (p) p.innerText = songArtist;
                    if (th && songImage) th.src = songImage;
                    if (icon) icon.className = 'fas fa-pause';
                  }
                  return;
                }
              }

              // Fallback: iTunes preview
              const preview = item.dataset.preview;
              if (preview) {
                const audio = document.getElementById('echoPlayer');
                if (audio) {
                  audio.src = preview;
                  audio.play().catch(() => {});
                  if (h5) h5.innerText = title + ' (30s preview)';
                  if (p) p.innerText = artist;
                  if (th && artwork) th.src = artwork;
                  if (icon) icon.className = 'fas fa-pause';
                }
              }
            } catch (err) {
              console.error('Playback error:', err);
              if (h5) h5.innerText = title;
            }
          });
        });

      } catch (err) {
        console.error('Suggest error:', err);
      }
    }, 300); // 300ms debounce
  });

  // Hide suggestions on blur (with small delay for click)
  searchInput.addEventListener('blur', () => {
    setTimeout(() => { suggestBox.style.display = 'none'; }, 200);
  });
  searchInput.addEventListener('focus', () => {
    if (suggestBox.innerHTML && searchInput.value.trim().length >= 2) {
      suggestBox.style.display = 'block';
    }
  });

  // --- HELPER: Toggle explore sections visibility ---
  function toggleExploreSections(show) {
    const hero = document.querySelector('.hero-editorial');
    const accordion = document.querySelector('.playlist-accordion');
    const moodSection = hero ? hero.parentElement.querySelector('.mb-5:has(.mood-btn)') : null;
    const songsContainer = document.getElementById('songsContainer');
    const youMayLike = document.querySelector('.section-header');
    const songGrid = document.querySelector('.song-grid');

    // Toggle all sections between search bar and footer
    [hero, accordion, moodSection, songsContainer, youMayLike, songGrid].forEach(el => {
      if (el) el.style.display = show ? '' : 'none';
    });

    // Also hide parent wrappers of mood section
    document.querySelectorAll('.section-heading').forEach(heading => {
      if (heading.textContent.includes('Mood') || heading.textContent.includes('You may also like')) {
        const parent = heading.closest('.mb-5') || heading.closest('div');
        if (parent) parent.style.display = show ? '' : 'none';
      }
    });
  }

  // --- FULL SEARCH ON ENTER (grid results directly under search bar) ---
  searchInput.addEventListener('keydown', async (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    suggestBox.style.display = 'none';

    const query = searchInput.value.trim();
    const searchBox = document.getElementById('searchResultsContainer');
    if (!searchBox) return;

    if (!query) {
      // Clear search: hide results, show sections
      searchBox.style.display = 'none';
      searchBox.innerHTML = '';
      toggleExploreSections(true);
      return;
    }

    // Show search results container, hide other sections
    searchBox.style.display = 'flex';
    searchBox.style.flexWrap = 'wrap';
    toggleExploreSections(false);

    searchBox.innerHTML = '<p style="color:#ccc;padding:12px;width:100%">Searching for "' + query + '"...</p>';

    try {
      const term = encodeURIComponent(query);
      const res = await fetch(
        `https://itunes.apple.com/search?term=${term}&limit=12&entity=song&media=music`
      );
      const data = await res.json();

      if (!data.results || !data.results.length) {
        searchBox.innerHTML = '<p style="color:#aaa;padding:12px;width:100%">No results found for "' + query + '". Try another search.</p>';
        return;
      }

      searchBox.innerHTML =
        '<div class="col-12 mb-3 d-flex justify-content-between align-items-center">' +
          '<h3 class="section-heading mb-0">Search Results for "' + query + '"</h3>' +
          '<button class="btn btn-sm btn-outline-light" id="clearSearchBtn"><i class="fas fa-times me-1"></i>Clear</button>' +
        '</div>' +
        data.results.map(track => {
          const dur = formatMs(track.trackTimeMillis);
          return (
            '<div class="col-md-4 col-sm-6 mb-4">' +
              '<div class="search-result-card echo-song-card"' +
                   ' data-title="'  + encodeURIComponent(track.trackName || '') + '"' +
                   ' data-artist="' + encodeURIComponent(track.artistName || '') + '"' +
                   ' data-preview="' + (track.previewUrl || '') + '"' +
                   ' data-artwork="' + (track.artworkUrl100 || '') + '"' +
                   ' data-mood="search">' +
                '<img src="' + (track.artworkUrl100 || '') + '" alt="" loading="lazy">' +
                '<div class="search-card-info">' +
                  '<div class="search-card-title">' + (track.trackName || '') + '</div>' +
                  '<div class="search-card-artist">' + (track.artistName || '') + '</div>' +
                '</div>' +
                '<div class="search-card-duration">' + dur + '</div>' +
              '</div>' +
            '</div>'
          );
        }).join('');

      // Clear button handler
      const clearBtn = document.getElementById('clearSearchBtn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchBox.style.display = 'none';
          searchBox.innerHTML = '';
          toggleExploreSections(true);
        });
      }

      // Make search result cards clickable (delegate to existing songsContainer click handler)
      searchBox.querySelectorAll('.echo-song-card').forEach(card => {
        card.addEventListener('click', async function () {
          const title = decodeURIComponent(this.dataset.title);
          const artist = decodeURIComponent(this.dataset.artist);
          const artwork = this.dataset.artwork;
          const preview = this.dataset.preview;

          const h5 = document.querySelector('.track-info h5');
          const p = document.querySelector('.track-info p');
          const th = document.querySelector('.track-thumb');
          const icon = document.querySelector('.play-pause-btn i');
          if (h5) h5.innerText = 'Loading...';
          if (p) p.innerText = artist;

          const audioEl = document.getElementById('echoPlayer');
          if (!audioEl) return;

          try {
            const searchTerm = encodeURIComponent(title + ' ' + artist);
            const saavnRes = await fetch('https://saavn.sumit.co/api/search/songs?query=' + searchTerm + '&limit=1');
            const saavnData = await saavnRes.json();

            if (saavnData.success && saavnData.data?.results?.length) {
              const track = saavnData.data.results[0];
              if (track.downloadUrl?.length) {
                const songUrl = track.downloadUrl[track.downloadUrl.length - 1].url;
                const songName = track.name || title;
                const songArtist = track.artists?.primary?.map(a => a.name).join(', ') || artist;
                const songImage = track.image?.length ? track.image[track.image.length - 1].url : artwork;

                audioEl.src = songUrl;
                audioEl.play().catch(() => {});
                if (h5) h5.innerText = songName;
                if (p) p.innerText = songArtist;
                if (th && songImage) th.src = songImage;
                if (icon) icon.className = 'fas fa-pause';
                return;
              }
            }

            // Fallback: iTunes preview
            if (preview) {
              audioEl.src = preview;
              audioEl.play().catch(() => {});
              if (h5) h5.innerText = title + ' (30s preview)';
              if (p) p.innerText = artist;
              if (th && artwork) th.src = artwork;
              if (icon) icon.className = 'fas fa-pause';
            }
          } catch (err) {
            console.error('Search playback error:', err);
            if (h5) h5.innerText = title;
          }
        });
      });

    } catch(err) {
      console.error('Search error:', err);
      searchBox.innerHTML = '<p style="color:red;padding:12px;width:100%">Search failed. Try again.</p>';
    }
  });

  // --- Clear search when input is emptied ---
  searchInput.addEventListener('input', function () {
    if (this.value.trim() === '') {
      const searchBox = document.getElementById('searchResultsContainer');
      if (searchBox) {
        searchBox.style.display = 'none';
        searchBox.innerHTML = '';
      }
      toggleExploreSections(true);
    }
  });
});

// =========================================
// EXPLORE PAGE: AUTO-TRIGGER MOOD FROM URL
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mood = urlParams.get('mood');
  if (!mood) return;

  // Find the mood button and click it
  const moodBtn = document.querySelector(`.mood-btn[data-mood="${mood}"]`);
  if (moodBtn) {
    setTimeout(() => moodBtn.click(), 500);
  }
});

// =========================================
// PLAYLIST PAGE: iTunes Preview Integration
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  const trackList = document.getElementById('trackList');
  const playPauseBtn = document.getElementById('playPauseBtn');
  if (!trackList || !playPauseBtn) return;

  // Use a dedicated audio element for playlist page
  let playlistAudio = document.getElementById('echoPlayer') || new Audio();
  playlistAudio.volume = 0.8;

  // Override track click to use iTunes preview
  trackList.addEventListener('click', async (e) => {
    const row = e.target.closest('.track-row');
    if (!row) return;

    const titleEl = row.querySelector('.track-title');
    const artistEl = row.querySelector('.track-artist');
    if (!titleEl || !artistEl) return;

    const title = titleEl.innerText;
    const artist = artistEl.innerText;

    // Update player bar
    const pTitle = document.getElementById('playerTitle');
    const pArtist = document.getElementById('playerArtist');
    const pThumb = document.getElementById('playerThumb');
    if (pTitle) pTitle.innerText = 'Loading...';
    if (pArtist) pArtist.innerText = artist;

    // Highlight row
    document.querySelectorAll('.track-row').forEach(r => r.classList.remove('playing'));
    row.classList.add('playing');

    try {
      const term = encodeURIComponent(title + ' ' + artist);
      const res = await fetch(
        `https://itunes.apple.com/search?term=${term}&limit=1&entity=song&media=music`
      );
      const data = await res.json();

      if (data.results && data.results.length && data.results[0].previewUrl) {
        const track = data.results[0];
        playlistAudio.src = track.previewUrl;
        playlistAudio.play().catch(() => {});

        if (pTitle) pTitle.innerText = track.trackName || title;
        if (pArtist) pArtist.innerText = track.artistName || artist;
        if (pThumb && track.artworkUrl100) pThumb.src = track.artworkUrl100;

        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';

        // Progress bar
        const progBar = document.getElementById('progressBar');
        if (progBar) {
          progBar.style.width = '0%';
          let elapsed = 0;
          const progInterval = setInterval(() => {
            if (playlistAudio.paused) { clearInterval(progInterval); return; }
            elapsed += 0.1;
            progBar.style.width = Math.min((elapsed / 30) * 100, 100) + '%';
            if (elapsed >= 30) clearInterval(progInterval);
          }, 100);
        }
      } else {
        if (pTitle) pTitle.innerText = title + ' (no preview)';
      }
    } catch(err) {
      console.error('iTunes error:', err);
      if (pTitle) pTitle.innerText = title;
    }
  });
});

// =========================================
// EXPANDED FULLSCREEN PLAYER (YouTube Music)
// =========================================
document.addEventListener('DOMContentLoaded', () => {

  // --- Song history for the queue panel ---
  if (!window._echoQueue) window._echoQueue = [];

  // --- Inject the overlay HTML ---
  const overlay = document.createElement('div');
  overlay.className = 'expanded-player-overlay';
  overlay.id = 'expandedPlayer';
  overlay.innerHTML = `
    <!-- TOP BAR -->
    <div class="ep-topbar">
      <button class="ep-collapse-btn" id="epCollapse" title="Collapse">
        <i class="fas fa-chevron-down"></i>
      </button>
      <div class="ep-topbar-title">NOW PLAYING</div>
      <div class="ep-topbar-actions">
        <button title="Share"><i class="fas fa-share-alt"></i></button>
        <button title="More"><i class="fas fa-ellipsis-v"></i></button>
      </div>
    </div>

    <!-- BODY -->
    <div class="ep-body">
      <!-- LEFT: Artwork + Controls -->
      <div class="ep-left">
        <div class="ep-artwork-container">
          <img class="ep-artwork" id="epArtwork" src="https://images.unsplash.com/photo-1621693247912-c96604fe6d68?w=400" alt="Album Art">
          <div class="ep-artwork-glow" id="epGlow"></div>
        </div>

        <div class="ep-song-info">
          <div class="ep-song-title" id="epTitle">Select a track</div>
          <div class="ep-song-artist" id="epArtist">—</div>
        </div>

        <div class="ep-progress-section">
          <div class="ep-progress-track" id="epProgressTrack">
            <div class="ep-progress-fill" id="epProgressFill"></div>
          </div>
          <div class="ep-time-labels">
            <span id="epTimeNow">0:00</span>
            <span id="epTimeTotal">0:30</span>
          </div>
        </div>

        <div class="ep-controls">
          <button id="epShuffle" title="Shuffle"><i class="fas fa-random"></i></button>
          <button id="epPrev" title="Previous"><i class="fas fa-step-backward"></i></button>
          <button class="ep-play-btn" id="epPlay" title="Play/Pause"><i class="fas fa-play"></i></button>
          <button id="epNext" title="Next"><i class="fas fa-step-forward"></i></button>
          <button id="epRepeat" title="Repeat"><i class="fas fa-redo"></i></button>
        </div>

        <div class="ep-extra-controls">
          <button id="epLike" title="Like"><i class="far fa-heart"></i></button>
          <button id="epQueue" title="Queue"><i class="fas fa-list"></i></button>
          <div class="ep-volume-wrap">
            <button id="epVolBtn"><i class="fas fa-volume-up"></i></button>
            <input type="range" class="ep-volume-slider" id="epVolume" min="0" max="100" value="80">
          </div>
        </div>
      </div>

      <!-- RIGHT: Up Next Queue -->
      <div class="ep-right">
        <div class="ep-tabs">
          <button class="ep-tab active" data-tab="upnext">UP NEXT</button>
          <button class="ep-tab" data-tab="lyrics">LYRICS</button>
          <button class="ep-tab" data-tab="related">RELATED</button>
        </div>

        <div class="ep-queue-header">
          <div class="ep-queue-source">Playing from: <span id="epSource">EchoVibe</span></div>
          <button class="ep-queue-save"><i class="fas fa-bookmark me-1"></i> Save</button>
        </div>

        <div class="ep-queue-filters">
          <button class="ep-queue-filter active">All</button>
          <button class="ep-queue-filter">Familiar</button>
          <button class="ep-queue-filter">Discover</button>
          <button class="ep-queue-filter">Popular</button>
        </div>

        <div class="ep-queue-list" id="epQueueList">
          <!-- Queue items injected dynamically -->
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // --- DOM refs ---
  const ep          = document.getElementById('expandedPlayer');
  const epCollapse  = document.getElementById('epCollapse');
  const epArtwork   = document.getElementById('epArtwork');
  const epGlow      = document.getElementById('epGlow');
  const epTitle     = document.getElementById('epTitle');
  const epArtist    = document.getElementById('epArtist');
  const epPlay      = document.getElementById('epPlay');
  const epProgressFill = document.getElementById('epProgressFill');
  const epProgressTrack = document.getElementById('epProgressTrack');
  const epTimeNow   = document.getElementById('epTimeNow');
  const epTimeTotal = document.getElementById('epTimeTotal');
  const epVolume    = document.getElementById('epVolume');
  const epVolBtn    = document.getElementById('epVolBtn');
  const epQueueList = document.getElementById('epQueueList');
  const epLike      = document.getElementById('epLike');

  let epIsLiked = false;

  // --- Helper: format seconds to m:ss ---
  function fmtSec(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  // --- OPEN the expanded player ---
  function openExpandedPlayer() {
    syncExpandedPlayer();
    ep.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // --- CLOSE the expanded player ---
  function closeExpandedPlayer() {
    ep.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- Sync expanded player data from bottom bar ---
  function syncExpandedPlayer() {
    // Get current song info from bottom bar
    const btTitle  = document.querySelector('.bottom-player-bar .track-info h5');
    const btArtist = document.querySelector('.bottom-player-bar .track-info p');
    const btThumb  = document.querySelector('.bottom-player-bar .track-thumb');

    if (btTitle)  epTitle.innerText  = btTitle.innerText;
    if (btArtist) epArtist.innerText = btArtist.innerText;
    if (btThumb && btThumb.src) {
      // Use higher-res version
      const hiRes = btThumb.src.replace('w=100', 'w=600').replace('100x100', '600x600');
      epArtwork.src = hiRes;
      epGlow.style.backgroundImage = `url(${hiRes})`;
      epGlow.style.backgroundSize = 'cover';
    }

    // Sync audio state
    const audio = document.getElementById('echoPlayer');
    if (audio) {
      const icon = epPlay.querySelector('i');
      if (audio.paused) {
        icon.className = 'fas fa-play';
      } else {
        icon.className = 'fas fa-pause';
      }
    }

    renderQueue();
  }

  // --- Track songs that have been played for the queue ---
  // Monkey-patch: observe when song data changes in the bottom bar
  const bottomTitle = document.querySelector('.bottom-player-bar .track-info h5');
  if (bottomTitle) {
    const observer = new MutationObserver(() => {
      const title  = document.querySelector('.bottom-player-bar .track-info h5')?.innerText || '';
      const artist = document.querySelector('.bottom-player-bar .track-info p')?.innerText || '';
      const thumb  = document.querySelector('.bottom-player-bar .track-thumb')?.src || '';

      if (title && title !== 'Select a track' && title !== 'Loading...') {
        // Add to queue if not already the last item
        const last = window._echoQueue[0];
        if (!last || last.title !== title) {
          window._echoQueue.unshift({ title, artist, thumb, time: Date.now() });
          if (window._echoQueue.length > 20) window._echoQueue.pop();
        }

        // If expanded player is open, sync it
        if (ep.classList.contains('open')) {
          syncExpandedPlayer();
        }
      }
    });
    observer.observe(bottomTitle, { childList: true, characterData: true, subtree: true });
  }

  // --- Render queue list ---
  function renderQueue() {
    const queue = window._echoQueue || [];
    if (queue.length === 0) {
      epQueueList.innerHTML = `
        <div style="padding:40px 20px;text-align:center;color:#555;">
          <i class="fas fa-music" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
          Play some songs to build your queue
        </div>
      `;
      return;
    }

    const currentTitle = epTitle.innerText;

    epQueueList.innerHTML = queue.map((song, i) => {
      const isNow = (song.title === currentTitle);
      return `
        <div class="ep-queue-item ${isNow ? 'now-playing' : ''}" data-index="${i}">
          <div class="eq-play-icon">
            ${isNow ? '<i class="fas fa-volume-up"></i>' : (i + 1)}
          </div>
          <img class="eq-thumb" src="${song.thumb || 'https://images.unsplash.com/photo-1621693247912-c96604fe6d68?w=100'}" alt="">
          <div class="eq-info">
            <div class="eq-title">${song.title}</div>
            <div class="eq-artist">${song.artist}</div>
          </div>
          <div class="eq-duration">${isNow ? '<i class="fas fa-ellipsis-v" style="color:#888;"></i>' : ''}</div>
        </div>
      `;
    }).join('');
  }

  // --- Click on bottom bar → open ---
  document.addEventListener('click', (e) => {
    const currentTrack = e.target.closest('.bottom-player-bar .current-track');
    if (currentTrack) {
      e.stopPropagation();
      openExpandedPlayer();
    }
  });

  // --- Collapse button ---
  epCollapse.addEventListener('click', closeExpandedPlayer);

  // --- Escape key ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && ep.classList.contains('open')) {
      closeExpandedPlayer();
    }
  });

  // --- Play/Pause ---
  epPlay.addEventListener('click', () => {
    const audio = document.getElementById('echoPlayer');
    if (!audio) return;
    const icon = epPlay.querySelector('i');

    if (audio.paused) {
      audio.play().catch(() => {});
      icon.className = 'fas fa-pause';
    } else {
      audio.pause();
      icon.className = 'fas fa-play';
    }

    // Sync bottom bar play button too
    const btIcon = document.querySelector('.bottom-player-bar .play-pause-btn i');
    if (btIcon) btIcon.className = icon.className;
  });

  // --- Progress bar update loop ---
  setInterval(() => {
    if (!ep.classList.contains('open')) return;
    const audio = document.getElementById('echoPlayer');
    if (!audio || !audio.duration) return;

    const pct = (audio.currentTime / audio.duration) * 100;
    epProgressFill.style.width = pct + '%';
    epTimeNow.innerText = fmtSec(audio.currentTime);
    epTimeTotal.innerText = fmtSec(audio.duration);

    // Sync play icon
    const icon = epPlay.querySelector('i');
    icon.className = audio.paused ? 'fas fa-play' : 'fas fa-pause';
  }, 200);

  // --- Click on progress bar to seek ---
  epProgressTrack.addEventListener('click', (e) => {
    const audio = document.getElementById('echoPlayer');
    if (!audio || !audio.duration) return;
    const rect = epProgressTrack.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // --- Volume slider ---
  epVolume.addEventListener('input', () => {
    const audio = document.getElementById('echoPlayer');
    if (!audio) return;
    const vol = epVolume.value / 100;
    audio.volume = vol;
    const icon = epVolBtn.querySelector('i');
    if (vol === 0) icon.className = 'fas fa-volume-mute';
    else if (vol < 0.5) icon.className = 'fas fa-volume-down';
    else icon.className = 'fas fa-volume-up';
  });

  // --- Like button ---
  epLike.addEventListener('click', () => {
    epIsLiked = !epIsLiked;
    const icon = epLike.querySelector('i');
    icon.className = epIsLiked ? 'fas fa-heart' : 'far fa-heart';
    epLike.style.color = epIsLiked ? '#bc13fe' : '';
  });

  // --- Tab switching ---
  document.querySelectorAll('.ep-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.ep-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      const tabName = this.dataset.tab;
      if (tabName === 'lyrics') {
        epQueueList.innerHTML = `
          <div style="padding:40px 20px;text-align:center;color:#555;">
            <i class="fas fa-microphone-alt" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
            Lyrics not available for previews
          </div>
        `;
      } else if (tabName === 'related') {
        epQueueList.innerHTML = `
          <div style="padding:40px 20px;text-align:center;color:#555;">
            <i class="fas fa-compass" style="font-size:2rem;margin-bottom:12px;display:block;"></i>
            Play more songs to get recommendations
          </div>
        `;
      } else {
        renderQueue();
      }
    });
  });

  // --- Queue filter buttons ---
  document.querySelectorAll('.ep-queue-filter').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.ep-queue-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

});

// =========================================
// NEWSLETTER FORM HANDLER
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.footer-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input ? input.value.trim() : '';
      if (!email) return;

      // Show success toast
      const toast = document.createElement('div');
      toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#bc13fe,#00f0ff);color:#fff;padding:14px 28px;border-radius:12px;font-size:0.9rem;font-weight:600;z-index:99999;box-shadow:0 10px 40px rgba(188,19,254,0.4);animation:fadeInUp 0.4s ease;';
      toast.innerText = '✅ Subscribed! Welcome to the frequency.';
      document.body.appendChild(toast);
      if (input) input.value = '';
      setTimeout(() => { toast.remove(); }, 3000);
    });
  });
});

// =========================================
// LAZY LOAD IMAGES (Performance)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
});
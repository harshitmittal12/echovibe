// js/pages.js
import { artists } from "./artists.js";

export function renderHome() {
  // Do NOTHING – keeps your current GSAP page alive
}

export function renderArtist({ id }) {
  const artist = artists[id];
  if (!artist) return;

  const main = document.querySelector("main");

  main.innerHTML = `
    <section class="section-gap">
      <h2 class="section-title">${artist.name}</h2>
      <div style="display:flex;gap:60px;align-items:center;">
        <img src="${artist.image}" style="width:320px;border-radius:15px;">
        <div>
          <p><strong>Genre:</strong> ${artist.genre}</p>
          <p><strong>Mood:</strong> ${artist.mood}</p>
          <button class="cta-btn">PLAY SAMPLE</button>
        </div>
      </div>
    </section>
  `;
}

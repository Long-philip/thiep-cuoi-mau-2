// ====== CẤU HÌNH ======
const WEDDING = {
  date: "2026-05-03T11:30:00+07:00",
  calMonth: 4, calYear: 2026, calMarkDay: 3,
  gallery: [
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=600&q=80",
  ],
};

// ====== MỞ THIỆP (bìa tách đôi) ======
const cover = document.getElementById("cover");
const card = document.getElementById("card");
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

function openCard() {
  cover.classList.add("cover--open");
  card.classList.add("card--show");
  card.setAttribute("aria-hidden", "false");
  musicBtn.classList.add("music-btn--show");
  playMusic();
  window.scrollTo({ top: 0 });
  setTimeout(() => { cover.style.display = "none"; }, 1300);
}
document.getElementById("coverOpen").addEventListener("click", openCard);

// ====== NHẠC ======
function playMusic() { bgMusic.play().then(() => musicBtn.classList.add("music-btn--playing")).catch(() => {}); }
musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) { bgMusic.play(); musicBtn.classList.add("music-btn--playing"); }
  else { bgMusic.pause(); musicBtn.classList.remove("music-btn--playing"); }
});

// ====== ĐẾM NGƯỢC ======
const target = new Date(WEDDING.date).getTime();
const cd = { d: document.getElementById("cd-days"), h: document.getElementById("cd-hours"), m: document.getElementById("cd-mins"), s: document.getElementById("cd-secs") };
function tick() {
  const diff = target - Date.now();
  if (diff <= 0) { cd.d.textContent = cd.h.textContent = cd.m.textContent = cd.s.textContent = "00"; return; }
  cd.d.textContent = String(Math.floor(diff / 86400000)).padStart(2, "0");
  cd.h.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");
  cd.m.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  cd.s.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
}
tick(); setInterval(tick, 1000);

// ====== LỊCH ======
(function () {
  const grid = document.getElementById("calGrid");
  const firstDay = new Date(WEDDING.calYear, WEDDING.calMonth, 1).getDay();
  const days = new Date(WEDDING.calYear, WEDDING.calMonth + 1, 0).getDate();
  let html = "";
  for (let i = 0; i < firstDay; i++) html += `<span class="cal-empty">.</span>`;
  for (let d = 1; d <= days; d++) html += `<span class="${d === WEDDING.calMarkDay ? "cal-mark" : ""}">${d}</span>`;
  grid.innerHTML = html;
})();

// ====== TABS ======
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const key = tab.dataset.tab;
    document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("tab--active", t === tab));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("tab-panel--active", p.dataset.panel === key));
  });
});

// ====== ALBUM + LIGHTBOX ======
(function () {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = WEDDING.gallery.map((s) => `<figure><img src="${s}" alt="Ảnh cưới" loading="lazy" /></figure>`).join("");
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `<button class="lightbox__close" aria-label="Đóng">&times;</button><img alt="Ảnh phóng to" />`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");
  grid.addEventListener("click", (e) => { const img = e.target.closest("img"); if (!img) return; lbImg.src = img.src; lb.classList.add("lightbox--show"); });
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lightbox__close")) lb.classList.remove("lightbox--show"); });
})();

// ====== RSVP ======
document.getElementById("rsvpForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const all = JSON.parse(localStorage.getItem("rsvp") || "[]");
  all.push({ ...data, at: new Date().toISOString() });
  localStorage.setItem("rsvp", JSON.stringify(all));
  e.target.style.display = "none";
  document.getElementById("rsvpThanks").hidden = false;
});

// ====== REVEAL ======
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("reveal--in"); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ====== CÁNH HOA RƠI ======
function petals(id, n) {
  const c = document.getElementById(id); if (!c) return;
  const chars = ["🌸", "🌹", "❀", "❤"];
  for (let i = 0; i < n; i++) {
    const p = document.createElement("span");
    p.className = "petal"; p.textContent = chars[i % chars.length];
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 6 + Math.random() * 8 + "s";
    p.style.animationDelay = Math.random() * 8 + "s";
    p.style.fontSize = 0.8 + Math.random() * 1.1 + "rem";
    c.appendChild(p);
  }
}
petals("petalsCover", 12);
petals("petals", 16);

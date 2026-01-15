import { API_BASE } from "./api.js";

/* ================================
   SLUG FIX (NETLIFY SAFE)
================================ */
const path = location.pathname.replace(/\/$/, "");
const segments = path.split("/");

if (segments[1] !== "comic") {
  console.error("Bukan halaman comic:", path);
}

const slug = segments[2];

/* ================================
   ELEMENT
================================ */
const coverImg = document.getElementById("coverImg");
const titleEl = document.getElementById("title");
const genreEl = document.getElementById("genre");
const synopsisEl = document.getElementById("synopsis");
const chaptersEl = document.getElementById("chapters");
const bookmarkBtn = document.getElementById("bookmarkBtn");

/* ================================
   LOAD COMIC
================================ */
fetch("/data/data.json", { cache: "no-store" })
  .then(r => r.json())
  .then(data => {
    console.log("DATA JSON:", data);
    console.log("SLUG:", slug);

    const comic = data[slug];
    if (!comic) {
      console.error("Comic tidak ditemukan:", slug);
      return;
    }

    coverImg.src = comic.cover;
    titleEl.textContent = comic.title;
    genreEl.textContent = comic.genre || "-";
    synopsisEl.textContent = comic.synopsis || "";

    renderChapters(comic);
    setupBookmark();
  })
  .catch(err => {
    console.error("LOAD ERROR:", err);
  });

/* ================================
   CHAPTER
================================ */
function renderChapters(comic){
  const nums = Object.keys(comic.chapters || {})
    .map(Number)
    .sort((a,b)=>b-a);

  chaptersEl.innerHTML = nums.map(ch => `
    <div class="chapter" onclick="openChapter(${ch})">
      <div>Chapter ${ch}</div>
      <span>Read</span>
    </div>
  `).join("");
}

function openChapter(ch){
  location.href = `/comic/${slug}/${ch}`;
}
window.openChapter = openChapter;

/* ================================
   BOOKMARK
================================ */
function setupBookmark(){
  if (!bookmarkBtn) return;

  fetch(`${API_BASE}/api/bookmarks/${slug}`, {
    credentials: "include"
  })
  .then(r => r.status === 401 ? null : r.json())
  .then(d => d?.bookmarked && setBookmarked(true));

  bookmarkBtn.onclick = () => {
    fetch(`${API_BASE}/api/bookmarks/${slug}`, {
      method: "POST",
      credentials: "include"
    })
    .then(r => r.status === 401
      ? location.href = `/login.html?redirect=${encodeURIComponent(path)}`
      : r.json()
    )
    .then(d => d && setBookmarked(d.bookmarked));
  };
}

function setBookmarked(active){
  bookmarkBtn.classList.toggle("active", active);
  bookmarkBtn.innerHTML = active
    ? `<i class="ri-bookmark-fill"></i> Bookmarked`
    : `<i class="ri-bookmark-line"></i> Bookmark`;
}
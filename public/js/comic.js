import { API_BASE } from "./api.js";

/* ================================
   AMBIL SLUG (ANTI NETLIFY BUG)
================================ */
// contoh URL:
// /comic/sensei
// /comic/sensei/
// /comic/sensei/1  (ini gak kepake di comic detail)

const slug = location.pathname
  .replace(/\/$/, "")   // hapus trailing slash
  .split("/")
  .pop();               // ambil slug terakhir

/* ================================
   ELEMENT
================================ */
const coverImg   = document.getElementById("coverImg");
const titleEl    = document.getElementById("title");
const genreEl    = document.getElementById("genre");
const synopsisEl = document.getElementById("synopsis");
const chaptersEl = document.getElementById("chapters");
const bookmarkBtn = document.getElementById("bookmarkBtn");

/* ================================
   LOAD COMIC DATA
================================ */
fetch("/data/data.json", { cache: "no-store" })
  .then(res => {
    if (!res.ok) throw new Error("Gagal load data.json");
    return res.json();
  })
  .then(data => {
    const comic = data[slug];

    if (!comic) {
      console.warn("Comic tidak ditemukan:", slug, data);
      return;
    }

    // isi data
    coverImg.src = comic.cover;
    titleEl.textContent = comic.title;
    genreEl.textContent = comic.genre || "-";
    synopsisEl.textContent = comic.synopsis || "";

    renderChapters(comic);
    setupBookmark();
  })
  .catch(err => {
    console.error("ERROR LOAD COMIC:", err);
  });

/* ================================
   RENDER CHAPTER
================================ */
function renderChapters(comic){
  const nums = Object.keys(comic.chapters || {})
    .map(Number)
    .filter(n => !isNaN(n))
    .sort((a,b) => b - a);

  if (!nums.length){
    chaptersEl.innerHTML = `
      <p style="opacity:.6;padding:12px">
        Belum ada chapter
      </p>
    `;
    return;
  }

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
   BOOKMARK (SESSION BACKEND)
================================ */
function setupBookmark(){
  if (!bookmarkBtn) return;

  // cek status bookmark
  fetch(`${API_BASE}/api/bookmarks/${slug}`, {
    credentials: "include"
  })
  .then(res => {
    if (res.status === 401) return null;
    return res.json();
  })
  .then(data => {
    if (data?.bookmarked) setBookmarked(true);
  })
  .catch(() => {});

  // toggle bookmark
  bookmarkBtn.onclick = () => {
    bookmarkBtn.disabled = true;

    fetch(`${API_BASE}/api/bookmarks/${slug}`, {
      method: "POST",
      credentials: "include"
    })
    .then(res => {
      if (res.status === 401) {
        location.href =
          `/login.html?redirect=${encodeURIComponent(location.pathname)}`;
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (!data) return;
      setBookmarked(data.bookmarked);
    })
    .finally(() => {
      bookmarkBtn.disabled = false;
    });
  };
}

function setBookmarked(active){
  bookmarkBtn.classList.toggle("active", active);
  bookmarkBtn.innerHTML = active
    ? `<i class="ri-bookmark-fill"></i> Bookmarked`
    : `<i class="ri-bookmark-line"></i> Bookmark`;
}
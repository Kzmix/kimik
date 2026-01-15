import { API_BASE } from "./api.js";

/* ================================
   PARAM
================================ */
const parts = location.pathname.split("/").filter(Boolean);
// /comic/:slug
const slug = parts[1];

/* ================================
   ELEMENT
================================ */
const coverImg = document.getElementById("coverImg");
const title = document.getElementById("title");
const genre = document.getElementById("genre");
const synopsis = document.getElementById("synopsis");
const chapters = document.getElementById("chapters");
const bookmarkBtn = document.getElementById("bookmarkBtn");

/* ================================
   LOAD COMIC
================================ */
fetch(`${location.origin}/data/data.json`)
  .then(r => r.json())
  .then(data => {
    const comic = data[slug];
    if (!comic) {
      console.warn("Comic not found:", slug);
      return;
    }

    coverImg.src = comic.cover;
    title.textContent = comic.title;
    genre.textContent = comic.genre;
    synopsis.textContent = comic.synopsis;

    renderChapters(comic);
    setupBookmark();
  });

/* ================================
   CHAPTER LIST
================================ */
function renderChapters(comic){
  const nums = Object.keys(comic.chapters || {})
    .map(Number)
    .sort((a,b)=>b-a);

  chapters.innerHTML = nums.map(ch => `
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
   BOOKMARK (SESSION BASED)
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
  });

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
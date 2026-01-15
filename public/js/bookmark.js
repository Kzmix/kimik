import { API_BASE } from "./api.js";

let comics = {};

const list = document.getElementById("list");

/* ================================
   FETCH BOOKMARKS + COMICS
================================ */
Promise.all([
  fetch(`${API_BASE}/api/bookmarks`, {
  credentials: "include"
}),
  fetch("/data/data.json")
])
.then(async ([bmRes, comicRes]) => {
  if (bmRes.status === 401) {
    throw new Error("LOGIN_REQUIRED");
  }

  const bookmarks = await bmRes.json();
  comics = await comicRes.json();

  renderBookmarks(bookmarks);
})
.catch(err => {
  if (err.message === "LOGIN_REQUIRED") {
    renderLoginGate();
  } else {
    console.error(err);
    list.innerHTML = `
      <p style="padding:16px;color:#ffb4b4">
        Gagal memuat bookmark
      </p>
    `;
  }
});

/* ================================
   RENDER BOOKMARKS
================================ */
function renderBookmarks(bookmarks){
  let saved = bookmarks
    .map(slug => comics[slug])
    .filter(Boolean)
    .map(c => {
      const chapters = Object.keys(c.chapters || {})
        .map(k => Number(k))
        .filter(n => !isNaN(n))
        .sort((a,b)=>b-a);

      return {
        ...c,
        latestChapter: chapters[0] || 0
      };
    });

  // sort by update terbaru
  saved.sort((a,b)=>b.latestChapter - a.latestChapter);

  if (!saved.length){
    list.innerHTML = `
      <p style="padding:16px;opacity:.6">
        Belum ada bookmark ⭐
      </p>
    `;
    return;
  }

  list.innerHTML = saved.map(c => `
    <div class="bookmark-item"
         onclick="location.href='/comic/${c.slug}'">

      <div class="bookmark-cover">
        <img src="${c.cover}" alt="${c.title}">
      </div>

      <div class="bookmark-info">
        <div>
          <div class="bookmark-title">${c.title}</div>
          <div class="bookmark-genre">${c.genre}</div>
          <span class="badge-update">
            Chapter ${c.latestChapter}
          </span>
        </div>
      </div>
    </div>
  `).join("");
}

/* ================================
   LOGIN GATE
================================ */
function renderLoginGate(){
  list.innerHTML = `
    <div style="padding:28px;text-align:center;opacity:.9">
      <i class="ri-lock-2-line" style="font-size:44px;opacity:.6"></i>
      <h3 style="margin-top:12px">Login Diperlukan</h3>
      <p style="margin:10px 0 18px;font-size:14px;opacity:.75">
        Bookmark hanya tersedia untuk user yang sudah login
      </p>
      <button
        onclick="location.href='/login.html?redirect=${encodeURIComponent(location.pathname)}'"
        style="
          padding:12px 22px;
          border-radius:999px;
          border:none;
          background:#9aa4ff;
          color:#000;
          font-weight:600;
          font-size:14px;
        ">
        Login / Daftar
      </button>
    </div>
  `;
}
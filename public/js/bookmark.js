
import { API_BASE } from "./api.js";

let comics = {};

import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  getDocs
} from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const list = document.getElementById("list");

/* ================================
   AUTH CHECK (SATU KALI SAJA)
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

onAuthStateChanged(auth, async user => {
  if (!user){
    renderLoginGate();
    return;

  }

  try {
    const comics = await fetch("/data/data.json").then(r => r.json());

    const snap = await getDocs(
      collection(db, "bookmarks", user.uid, "items")
    );

    const saved = [];
    snap.forEach(doc => {
      if (comics[doc.id]) {
        saved.push(comics[doc.id]);
      }
    });

    render(saved);

  } catch (err) {
    console.error(err);
    list.innerHTML = `
      <p style="padding:16px;color:#ff9a9a">
        Gagal memuat bookmark
      </p>
    `;
  }
});

/* ================================
   RENDER BOOKMARK
================================ */
function render(arr){
  if (!arr.length){
    list.innerHTML = `
      <p style="opacity:.6;padding:16px">
        Belum ada bookmark ⭐
      </p>
    `;
    return;
  }

  list.innerHTML = arr.map(c => `
    <div class="bookmark-item"
      onclick="location.href='/comic/${c.slug}'">
      <img src="${c.cover}">
      <div>
        <div class="title">${c.title}</div>
        <div class="genre">${c.genre}</div>
      </div>
    </div>
  `).join("");
}

/* ================================
   LOGIN GATE
================================ */
function renderLoginGate(){
  list.innerHTML = `
    <div style="padding:30px;text-align:center;opacity:.9">
      <h3>Login Diperlukan</h3>
      <p style="font-size:14px;opacity:.7;margin:8px 0 16px">
        Bookmark hanya tersedia untuk user login
      </p>
      <button
        onclick="location.href='/login.html?redirect=${encodeURIComponent(location.pathname)}'"
        style="
          padding:12px 20px;
          border-radius:999px;
          border:none;
          background:#9aa4ff;
          font-weight:600;
        ">
        Login / Daftar
      </button>
    </div>
  `;
}
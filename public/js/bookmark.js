import { auth, db } from "./firebase.js";
import {
  collection, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const list = document.getElementById("list");

onAuthStateChanged(auth, async user => {
  if (!user){
    renderLoginGate();
    return;
  }

  const comics = await fetch("/data/data.json").then(r=>r.json());
  const snap = await getDocs(
    collection(db, "bookmarks", user.uid, "items")
  );

  const saved = [];
  snap.forEach(d => {
    if (comics[d.id]) saved.push(comics[d.id]);
  });

  render(saved);
});

function render(arr){
  if (!arr.length){
    list.innerHTML = `<p style="opacity:.6;padding:16px">Belum ada bookmark</p>`;
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

function renderLoginGate(){
  list.innerHTML = `
    <div style="padding:30px;text-align:center">
      <h3>Login Diperlukan</h3>
      <button onclick="location.href='/login.html'">
        Login / Daftar
      </button>
    </div>
  `;
}
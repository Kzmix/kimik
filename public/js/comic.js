<<<<<<< HEAD
import { API_BASE } from "./api.js";

/* ================================
   PARAM & ELEMENT
================================ */
const parts = location.pathname.split("/").filter(Boolean);
const slug = parts[1]; // /comic/sensei
=======
import { auth, db } from "./firebase.js";
import {
  doc, getDoc, setDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const slug = location.pathname.split("/")[2];
>>>>>>> 4cf1a47f18f39b8b55676084a411c557a242619f

const coverImg = document.getElementById("coverImg");
const title = document.getElementById("title");
const genre = document.getElementById("genre");
const synopsis = document.getElementById("synopsis");
const chapters = document.getElementById("chapters");
const bookmarkBtn = document.getElementById("bookmarkBtn");

let user = null;

/* AUTH */
onAuthStateChanged(auth, u => {
  user = u;
  if (user) checkBookmark();
});

/* LOAD COMIC */
fetch("/data/data.json")
.then(r => r.json())
.then(data => {
  const comic = data[slug];
  if (!comic) return;

  coverImg.src = comic.cover;
  title.textContent = comic.title;
  genre.textContent = comic.genre;
  synopsis.textContent = comic.synopsis;

  renderChapters(comic);
});

/* CHAPTER LIST */
function renderChapters(comic){
  const nums = Object.keys(comic.chapters)
    .map(Number).sort((a,b)=>b-a);

<<<<<<< HEAD
/* ================================
   BOOKMARK LOGIC
================================ */
function setupBookmark(){
  if (!bookmarkBtn) return;

  // cek status bookmark (WAJIB credentials)
  fetch(`${API_BASE}/api/bookmarks/${slug}`, {
  credentials: "include"
})
  .then(res => {
    if (res.status === 401) return null;
    return res.json();
  })
  .then(data => {
    if (data?.bookmarked) {
      setBookmarked(true);
    }
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
        showLoginModal();
        return null;
      }
      if (!res.ok) throw new Error("BOOKMARK_FAILED");
      return res.json();
    })
    .then(data => {
      if (!data) return;
      setBookmarked(data.bookmarked);
    })
    .catch(err => {
      console.error(err);
      showToast("Gagal menyimpan bookmark");
    })
    .finally(() => {
      bookmarkBtn.disabled = false;
    });
  };
=======
  chapters.innerHTML = nums.map(ch => `
    <div class="chapter" onclick="openChapter(${ch})">
      <div>Chapter ${ch}</div>
      <span>Read</span>
    </div>
  `).join("");
>>>>>>> 4cf1a47f18f39b8b55676084a411c557a242619f
}

function openChapter(ch){
  location.href = `/comic/${slug}/${ch}`;
}
window.openChapter = openChapter;

/* BOOKMARK */
async function checkBookmark(){
  const ref = doc(db, "bookmarks", user.uid, "items", slug);
  const snap = await getDoc(ref);
  setBookmarked(snap.exists());
}

bookmarkBtn.onclick = async () => {
  if (!user){
    location.href = `/login.html?redirect=${encodeURIComponent(location.pathname)}`;
    return;
  }

  const ref = doc(db, "bookmarks", user.uid, "items", slug);
  const snap = await getDoc(ref);

  if (snap.exists()){
    await deleteDoc(ref);
    setBookmarked(false);
  } else {
    await setDoc(ref, { slug, time: Date.now() });
    setBookmarked(true);
  }
};

function setBookmarked(active){
  bookmarkBtn.classList.toggle("active", active);
  bookmarkBtn.innerHTML = active
    ? `<i class="ri-bookmark-fill"></i> Bookmarked`
    : `<i class="ri-bookmark-line"></i> Bookmark`;
}
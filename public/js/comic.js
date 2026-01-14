import { auth, db } from "./firebase.js";
import {
  doc, getDoc, setDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const slug = location.pathname.split("/")[2];

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
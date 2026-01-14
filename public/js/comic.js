/* ================================
   PARAM & ELEMENT
================================ */
const parts = location.pathname.split("/").filter(Boolean);
const slug = parts[1]; // /comic/sensei

const coverImg = document.getElementById("coverImg");
const title = document.getElementById("title");
const genre = document.getElementById("genre");
const synopsis = document.getElementById("synopsis");
const chapters = document.getElementById("chapters");
const bookmarkBtn = document.getElementById("bookmarkBtn");

/* ================================
   LOGIN MODAL
================================ */
const loginModal = document.getElementById("loginModal");
const loginConfirm = document.getElementById("loginConfirm");
const loginCancel = document.getElementById("loginCancel");

function showLoginModal(){
  if (loginModal) loginModal.classList.add("show");
}

function hideLoginModal(){
  if (loginModal) loginModal.classList.remove("show");
}

if (loginCancel) loginCancel.onclick = hideLoginModal;
if (loginConfirm) {
  loginConfirm.onclick = () => {
    location.href =
      `/login.html?redirect=${encodeURIComponent(location.pathname)}`;
  };
}

/* ================================
   LOAD COMIC DATA
================================ */
fetch("/data/data.json")
  .then(res => {
    if (!res.ok) throw new Error("FAILED_LOAD_DATA");
    return res.json();
  })
  .then(data => {
    const comic = data[slug];

    if (!comic) {
      showToast("Comic tidak ditemukan");
      return;
    }

    coverImg.src = comic.cover;
    title.textContent = comic.title;
    genre.textContent = comic.genre || "-";
    synopsis.textContent = comic.synopsis || "";

    renderChapters(comic);
    setupBookmark();
  })
  .catch(err => {
    console.error(err);
    showToast("Gagal memuat data komik");
  });

/* ================================
   BOOKMARK LOGIC
================================ */
function setupBookmark(){
  if (!bookmarkBtn) return;

  // cek status bookmark (WAJIB credentials)
  fetch(`/api/bookmarks/${slug}`, {
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

    fetch(`/api/bookmarks/${slug}`, {
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
}

function setBookmarked(active){
  bookmarkBtn.classList.toggle("active", active);
  bookmarkBtn.innerHTML = active
    ? `<i class="ri-bookmark-fill"></i> Bookmarked`
    : `<i class="ri-bookmark-line"></i> Bookmark`;
}

/* ================================
   CHAPTER RENDER
================================ */
function renderChapters(comic){
  const chapterNums = Object.keys(comic.chapters || {})
    .map(Number)
    .filter(n => !isNaN(n))
    .sort((a,b)=>b-a);

  const saved = JSON.parse(
    localStorage.getItem(`last_read_${slug}`)
  );

  const lastRead = saved?.chapter || 0;

  chapters.innerHTML = chapterNums.map(ch => {
    let cls = "chapter";
    let badge = "";

    if (ch < lastRead) {
      cls += " seen";
      badge = `<span class="badge seen">Seen</span>`;
    }

    if (ch === lastRead) {
      cls += " last-read";
      badge = `<span class="badge last">Last read</span>`;
    }

    return `
      <div class="${cls}" onclick="openChapter(${ch})">
        <div class="chapter-left">
          Chapter ${ch}
          ${badge}
        </div>
        <span>Read</span>
      </div>
    `;
  }).join("");
}

/* ================================
   NAV
================================ */
function openChapter(chapter){
  location.href = `/comic/${slug}/${chapter}`;
}

window.openChapter = openChapter;
/* ================================
   TOAST UI (ANTI ALERT)
================================ */
function showToast(message){
  let toast = document.getElementById("toast");

  if (!toast){
    toast = document.createElement("div");
    toast.id = "toast";
    toast.style.position = "fixed";
    toast.style.bottom = "90px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "rgba(30,30,40,.95)";
    toast.style.color = "#fff";
    toast.style.padding = "10px 16px";
    toast.style.borderRadius = "999px";
    toast.style.fontSize = "13px";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = ".25s ease";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";

  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.style.opacity = "0";
  }, 2000);
}
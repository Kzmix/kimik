let comics = [];

const slider = document.getElementById("slider");
const trendingList = document.getElementById("trendingList");
const newest = document.getElementById("newest");

/* ================================
   LOAD DATA
================================ */
fetch("/data/data.json")
  .then(res => res.json())
  .then(data => {
    comics = Object.values(data);
    render();
  })
  .catch(err => {
    console.error("Gagal load data:", err);
  });

/* ================================
   NAV (HOME → COMIC DETAIL)
================================ */
function openComic(slug){
  location.href = `/comic/${slug}`;
}

/* ================================
   TEMPLATE
================================ */
function card(c, small=false){
  return `
    <div class="card ${small ? "small" : ""}" data-open="${c.slug}">
      <img src="${c.cover}" alt="${c.title}">
      <div class="overlay">
        <div>
          <div class="title">${c.title}</div>
          <div class="genre">${c.genre}</div>
        </div>
      </div>
    </div>
  `;
}

function list(c){
  return `
    <div class="list-card" data-open="${c.slug}">
      <img src="${c.cover}" alt="${c.title}">
      <div>
        <div class="title">${c.title}</div>
        <div class="genre">${c.genre}</div>
      </div>
    </div>
  `;
}

/* ================================
   EVENT BINDING
================================ */
function bindOpen(){
  document.querySelectorAll("[data-open]").forEach(el => {
    el.addEventListener("click", () => {
      openComic(el.dataset.open);
    });
  });
}

/* ================================
   RENDER
================================ */
function render(){
  slider.innerHTML = comics.map(c => card(c)).join("");
  trendingList.innerHTML = comics.map(c => card(c,true)).join("");
  newest.innerHTML = comics.map(c => list(c)).join("");

  bindOpen();
}
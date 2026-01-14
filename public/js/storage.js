/* ================================
   LOCAL STORAGE HELPER
================================ */

export function get(key){
  try{
    return JSON.parse(localStorage.getItem(key));
  }catch(e){
    return null;
  }
}

export function set(key, val){
  localStorage.setItem(key, JSON.stringify(val));
}

/* ================================
   BOOKMARK SYSTEM
================================ */

const BOOKMARK_KEY = "bookmarks_v1";

export function getBookmarks(){
  return get(BOOKMARK_KEY) || [];
}

export function isBookmarked(slug){
  return getBookmarks().includes(slug);
}

export function toggleBookmark(slug){
  let list = getBookmarks();

  if(list.includes(slug)){
    list = list.filter(s => s !== slug);
  }else{
    list.push(slug);
  }

  set(BOOKMARK_KEY, list);
  return list;
}

/* ================================
   CLICK / TRENDING SYSTEM
================================ */

const CLICK_KEY = "comic_clicks_v1";

export function getClicks(){
  return get(CLICK_KEY) || {};
}

export function addClick(slug){
  const clicks = getClicks();
  clicks[slug] = (clicks[slug] || 0) + 1;
  set(CLICK_KEY, clicks);
  return clicks[slug];
}
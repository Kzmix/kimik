import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const fd = new FormData(form);
  const username = fd.get("username");
  const password = fd.get("password");

  try {
    await signInWithEmailAndPassword(
      auth,
      `${username}@comic.local`,
      password
    );

    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect") || "/";
    location.href = redirect;

  } catch {
    showError("Username / password salah");
  }
});

function showError(msg){
  let el = document.querySelector(".auth-error");
  if (!el){
    el = document.createElement("div");
    el.className = "auth-error";
    el.style.color = "#ff9a9a";
    el.style.marginTop = "12px";
    form.appendChild(el);
  }
  el.textContent = msg;
}
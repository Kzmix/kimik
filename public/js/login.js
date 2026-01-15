<<<<<<< HEAD
import { API_BASE } from "./api.js";
=======
// public/js/login.js
import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
>>>>>>> 4cf1a47f18f39b8b55676084a411c557a242619f

const form = document.getElementById("loginForm");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const username = form.username.value.trim();
  const password = form.password.value;

  try {
    const email = `${username}@kimik.app`;

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

<<<<<<< HEAD
  fetch(`${API_BASE}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(data)
});
  .then(res => {
    if (!res.ok) throw new Error("Login gagal");
    return res.json();
  })
  .then(() => {
=======
>>>>>>> 4cf1a47f18f39b8b55676084a411c557a242619f
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect") || "/";
    location.href = redirect;

  } catch (err) {
    console.error(err);
    showError("Username atau password salah");
  }
});

function showError(msg){
  let el = document.querySelector(".auth-error");
  if (!el){
    el = document.createElement("div");
    el.className = "auth-error";
    el.style.marginTop = "12px";
    el.style.color = "#ff9a9a";
    form.appendChild(el);
  }
  el.textContent = msg;
}
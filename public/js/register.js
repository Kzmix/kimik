import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const fd = new FormData(form);
  const username = fd.get("username");
  const password = fd.get("password");
  const confirm = fd.get("confirm");

  if (password !== confirm) {
    showError("Password tidak sama");
    return;
  }

  try {
    await createUserWithEmailAndPassword(
      auth,
      `${username}@comic.local`,
      password
    );
    location.href = "/login.html";
  } catch (err) {
    showError("Username sudah digunakan");
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
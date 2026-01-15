// public/js/register.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const username = form.username.value.trim();
  const password = form.password.value;
  const confirm = form.confirm.value;

  if (password !== confirm) {
    showError("Password tidak sama");
    return;
  }

  try {
    // Firebase Auth butuh email → kita palsuin
    const email = `${username}@kimik.app`;

    const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Simpan username ke Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      username,
      createdAt: Date.now()
    });

    location.href = "/login.html";
  } catch (err) {
    console.error(err);
    showError("Username sudah digunakan");
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
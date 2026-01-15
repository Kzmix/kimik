import { API_BASE } from "./api.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

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
    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect") || "/";
    location.href = redirect;
  })
  .catch(() => {
    showError("Username atau password salah");
  });
});

/* SIMPLE ERROR UI */
function showError(msg){
  let el = document.querySelector(".auth-error");
  if (!el){
    el = document.createElement("div");
    el.className = "auth-error";
    el.style.marginTop = "12px";
    el.style.fontSize = "13px";
    el.style.color = "#ff9a9a";
    form.appendChild(el);
  }
  el.textContent = msg;
}
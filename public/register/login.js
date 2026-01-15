import { login } from "./auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  try {
    await login(email, password);

    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect") || "/";
    location.href = redirect;

  } catch (err) {
    showError("Email atau password salah");
  }
});

function showError(msg){
  const el = document.querySelector(".auth-error")
    || form.appendChild(Object.assign(
      document.createElement("div"),
      { className: "auth-error" }
    ));
  el.textContent = msg;
}
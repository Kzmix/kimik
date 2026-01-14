import { register } from "./auth.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async e => {
  e.preventDefault();

  const username = form.username.value;
  const email = form.email.value;
  const password = form.password.value;
  const confirm = form.confirm.value;

  if (password !== confirm){
    showError("Password tidak sama");
    return;
  }

  try {
    await register(username, email, password);

    const params = new URLSearchParams(location.search);
    const redirect = params.get("redirect") || "/";
    location.href = redirect;

  } catch (err) {
    showError("Gagal membuat akun");
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
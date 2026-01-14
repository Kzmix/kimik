const form = document.getElementById("registerForm");

form.addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (data.password !== data.confirm) {
    showError("Password dan konfirmasi tidak sama");
    return;
  }

  fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: data.username,
      password: data.password
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Register gagal");
    return res.json();
  })
  .then(() => {
    // setelah register langsung ke login
    location.href = "/login.html";
  })
  .catch(() => {
    showError("Username sudah digunakan atau data tidak valid");
  });
});

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
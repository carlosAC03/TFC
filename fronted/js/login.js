document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://tfc-2gv2.onrender.com";

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const loginSection = document.getElementById("login-section");
  const welcomeSection = document.getElementById("welcome-section");
  const userEmail = document.getElementById("user-email");

  if (usuario?.email) {
    loginSection.style.display = "none";
    welcomeSection.style.display = "block";
    userEmail.textContent = usuario.email;
  } else {
    loginSection.style.display = "block";
    welcomeSection.style.display = "none";
  }

  const form = document.getElementById("login-form");
  const btnLogin = document.getElementById("btn-login");

  if (form && btnLogin) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      btnLogin.disabled = true;
      btnLogin.innerHTML = `Entrando <span class="spinner"></span>`;

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("usuario", JSON.stringify({ email }));
          location.reload();
        } else {
          alert(data.message || "Error al iniciar sesión");
        }
      } catch (err) {
        alert("No se pudo conectar con el servidor");
        console.error(err);
      } finally {
        btnLogin.disabled = false;
        btnLogin.innerHTML = "Login";
      }
    });
  }
});

function logout() {
  localStorage.removeItem("usuario");
  window.location.reload();
}

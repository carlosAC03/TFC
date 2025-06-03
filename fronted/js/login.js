document.addEventListener("DOMContentLoaded", () => {
  const API_URL = ["localhost", "127.0.0.1"].includes(location.hostname)
    ? "http://localhost:4000"
    : "https://tfc-2gv2.onrender.com";

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const loginSection = document.getElementById("login-section");
  const welcomeSection = document.getElementById("welcome-section");
  const userEmail = document.getElementById("user-email");

  // Mostrar u ocultar secciones según sesión
  if (usuario?.email) {
    loginSection.style.display = "none";
    welcomeSection.style.display = "block";
    userEmail.textContent = usuario.email;

    // Opcional: mostrar que es admin
    if (usuario.rol === "admin") {
      userEmail.textContent += " (Administrador)";
    }
  } else {
    loginSection.style.display = "block";
    welcomeSection.style.display = "none";
  }

  // Formulario de login
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
          localStorage.setItem("usuario", JSON.stringify({
            email: data.email,
            rol: data.rol || "cliente"
          }));
          location.reload();
        } else {
          Swal.fire("Error", data.message || "Error al iniciar sesión", "error");
        }
      } catch (err) {
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        console.error(err);
      } finally {
        btnLogin.disabled = false;
        btnLogin.innerHTML = "Login";
      }
    });
  }
});

// Función de logout global
function logout() {
  localStorage.removeItem("usuario");
  Swal.fire("Sesión cerrada", "Vuelve pronto", "info").then(() => location.reload());
}

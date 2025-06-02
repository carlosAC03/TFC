document.addEventListener("DOMContentLoaded", () => {
  const API_URL = ["localhost", "127.0.0.1"].includes(location.hostname)
    ? "http://localhost:4000"
    : "https://tfc-2gv2.onrender.com";

  const form = document.getElementById("register-form");
  const btnRegistro = document.getElementById("btn-registrarse");

  if (form && btnRegistro) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      btnRegistro.disabled = true;
      btnRegistro.innerHTML = `Registrando <span class="spinner"></span>`;

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
          Swal.fire("Registro exitoso", "Usuario registrado correctamente. Ahora puedes iniciar sesión.", "success")
          .then(() => window.location.href = "login.html");
          window.location.href = "login.html";
        } else {
          Swal.fire("Error", data.message || "Error al registrar", "error");
        }
      } catch (err) {
        Swal.fire("Error", "No se pudo conectar con el servidor", "error");
        console.error(err);
      } finally {
        btnRegistro.disabled = false;
        btnRegistro.innerHTML = "Registrarse";
      }
    });
  }
});

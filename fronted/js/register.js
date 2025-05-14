document.addEventListener("DOMContentLoaded", () => {
  const API_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://tfc-2gv2.onrender.com"; // URL de tu backend

  const form = document.getElementById("register-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
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
        alert("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Error al registrar");
      }
    } catch (err) {
      alert("No se pudo conectar con el servidor");
      console.error(err);
    }
  });
});

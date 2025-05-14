document.addEventListener("DOMContentLoaded", () => {
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
    if (form) {
        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;

            const res = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("usuario", JSON.stringify({ email }));
                location.reload(); // refrescar para mostrar bienvenida
            } else {
                alert(data.message || "Error al iniciar sesión");
            }
        });
    }
});

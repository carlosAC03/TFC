document.getElementById("login-form").addEventListener("submit", async function (e) {
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
        alert("Sesión iniciada correctamente");
        window.location.href = "../../index.html";
    } else {
        alert(data.message || "Error al iniciar sesión");
    }
});

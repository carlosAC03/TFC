function logout() {
    localStorage.removeItem("usuario");
    alert("Sesión cerrada");
    location.reload();
}

// Mostrar botón "Cerrar sesión" si hay sesión activa
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        const usuario = localStorage.getItem("usuario");
        logoutBtn.style.display = usuario ? "block" : "none";
    }
});

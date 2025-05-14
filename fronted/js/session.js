function logout() {
    localStorage.removeItem("usuario");
    alert("Sesión cerrada");
    location.reload();
}
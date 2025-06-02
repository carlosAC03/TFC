function logout() {
    localStorage.removeItem("usuario");
    Swal.fire("Sesión cerrada", "Vuelve pronto", "info").then(() => location.reload());
}
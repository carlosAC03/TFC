export function mostrarLoader() {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.className = "loader";
    loader.innerHTML = 'Cargando tienda<span class="dots"></span>';
    document.body.insertBefore(loader, document.getElementById("productos"));
}

export function ocultarLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.remove();
}

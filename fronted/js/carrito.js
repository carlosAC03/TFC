document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.email) {
        alert("Debes iniciar sesión para ver tu carrito.");
        window.location.href = "login.html";
        return;
    }

    const clave = `carrito_${usuario.email}`;
    const carrito = JSON.parse(localStorage.getItem(clave)) || {};
    renderCarrito(carrito);
});

function renderCarrito(carrito) {
    const contenedor = document.getElementById("carrito-container");
    contenedor.innerHTML = "";

    for (const nombre in carrito) {
        const producto = carrito[nombre];
        const item = document.createElement("div");
        item.className = "item";
        item.innerHTML = `
            <h4>${nombre}</h4>
            <p>${producto.precio.toFixed(2)} €</p>
            <div class="cantidad">
                <button onclick="cambiarCantidad('${nombre}', -1)">−</button>
                <span>${producto.cantidad}</span>
                <button onclick="cambiarCantidad('${nombre}', 1)">+</button>
            </div>
        `;
        contenedor.appendChild(item);
    }
}

function cambiarCantidad(nombre, cambio) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.email) return;

    const clave = `carrito_${usuario.email}`;
    const carrito = JSON.parse(localStorage.getItem(clave)) || {};
    if (!carrito[nombre]) return;

    carrito[nombre].cantidad += cambio;
    if (carrito[nombre].cantidad <= 0) {
        delete carrito[nombre];
    }

    localStorage.setItem(clave, JSON.stringify(carrito));
    renderCarrito(carrito);
}

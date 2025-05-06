const productos = [];
const carrito = {};

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:3000/productos");
        const data = await res.json();
        productos.push(...data);
        renderProductos();
    } catch (err) {
        console.error("Error al cargar productos:", err);
    }
});

function renderProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";
    productos.forEach((p, i) => {
        contenedor.innerHTML += `
            <div class="producto">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h4>${p.nombre}</h4>
                <p>${p.descripcion}</p>
                <span>${p.precio.toFixed(2)} €</span>
                <button onclick="añadirCarrito(${i})">Añadir al carrito</button>
            </div>
        `;
    });
}

function añadirCarrito(index) {
    const id = productos[index].nombre;
    carrito[id] = carrito[id] ? carrito[id] + 1 : 1;
    renderCarrito();
}

function quitarCarrito(id) {
    if (carrito[id]) {
        carrito[id]--;
        if (carrito[id] <= 0) delete carrito[id];
    }
    renderCarrito();
}

function renderCarrito() {
    const items = document.getElementById("items-carrito");
    items.innerHTML = "";
    for (const nombre in carrito) {
        const prod = productos.find(p => p.nombre === nombre);
        items.innerHTML += `
            <div class="item">
                <span>${nombre}</span>
                <span>${prod.precio.toFixed(2)} €</span>
                <span>Cantidad: ${carrito[nombre]}</span>
                <button onclick="añadirCarrito(productos.findIndex(p => p.nombre === '${nombre}'))">+</button>
                <button onclick="quitarCarrito('${nombre}')">-</button>
            </div>
        `;
    }
}

function toggleCarrito() {
    document.getElementById("carritoToggle").classList.toggle("visible");
}

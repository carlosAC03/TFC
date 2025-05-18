const productos = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const API_URL = location.hostname === "localhost"
            ? "http://localhost:4000"
            : "https://tfc-2gv2.onrender.com"; // ← REEMPLAZA esto con tu URL real de Render

        const res = await fetch(`${API_URL}/productos`);
        const data = await res.json();
        productos.push(...data);
        renderProductos();
    } catch (err) {
        console.error("Error al cargar productos:", err);
    }
});

function getCategoriaDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("categoria");
}

function renderProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";
    const categoriaSeleccionada = getCategoriaDesdeURL();

    const productosFiltrados = categoriaSeleccionada
        ? productos.filter(p => p.categoria === categoriaSeleccionada)
        : productos;

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = `<p>No hay productos disponibles para esta categoría.</p>`;
        return;
    }

    productosFiltrados.forEach((p, i) => {
        contenedor.innerHTML += `
            <div class="producto">
                <img src="../${p.imagen}" alt="${p.nombre}">
                <h4>${p.nombre}</h4>
                <p>${p.descripcion}</p>
                <span>${p.precio.toFixed(2)} €</span>
                <button onclick="añadirCarrito(${i})">Añadir al carrito</button>
            </div>
        `;
    });
}

function añadirCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || {};
    const prod = productos[index];
    const nombre = prod.nombre;

    if (carrito[nombre]) {
        carrito[nombre].cantidad += 1;
    } else {
        carrito[nombre] = {
            precio: prod.precio,
            cantidad: 1
        };
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${nombre} añadido al carrito`);
}


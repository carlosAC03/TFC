const productos = [];

function getCategoriaDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("categoria");
}

function getBusquedaDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("busqueda") || "";
}

document.addEventListener("DOMContentLoaded", async () => {
    const loader = document.getElementById("loader");
    loader.style.display = "block"; 
    try {
        const API_URL = location.hostname === "localhost"
            ? "http://localhost:4000"
            : "https://tfc-2gv2.onrender.com";

        const res = await fetch(`${API_URL}/productos`);
        const data = await res.json();
        productos.push(...data);

        const textoBusqueda = getBusquedaDesdeURL().toLowerCase();
        renderProductos(textoBusqueda);

        const buscador = document.querySelector('.search-input');
        buscador.addEventListener('input', () => {
            const texto = buscador.value.toLowerCase();
            renderProductos(texto);
        });

    } catch (err) {
        console.error("Error al cargar productos:", err);
    } finally {
        if (loader) loader.style.display = "none"; 
    }
});

function renderProductos(filtroTexto = "") {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";
    const categoriaSeleccionada = getCategoriaDesdeURL();

    let productosFiltrados = categoriaSeleccionada
        ? productos.filter(p => p.categoria === categoriaSeleccionada)
        : productos;

    if (filtroTexto) {
        productosFiltrados = productosFiltrados.filter(p =>
            p.nombre.toLowerCase().includes(filtroTexto)
        );
    }

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = `<p>No hay productos que coincidan con tu búsqueda.</p>`;
        return;
    }

    productosFiltrados.forEach(p => {
        contenedor.innerHTML += `
            <div class="producto">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h4>${p.nombre}</h4>
                <p>${p.descripcion}</p>
                <span>${p.precio.toFixed(2)} €</span>
                <button onclick="añadirCarritoPorNombre('${p.nombre.replace(/'/g, "\\'")}')">Añadir al carrito</button>
            </div>
        `;
    });
}

function añadirCarritoPorNombre(nombre) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.email) {
        alert("Debes iniciar sesión para añadir productos al carrito.");
        window.location.href = "login.html";
        return;
    }

    const prod = productos.find(p => p.nombre === nombre);
    if (!prod) {
        alert("Producto no encontrado.");
        return;
    }

    const clave = `carrito_${usuario.email}`;
    const carrito = JSON.parse(localStorage.getItem(clave)) || {};

    if (carrito[nombre]) {
        carrito[nombre].cantidad += 1;
    } else {
        carrito[nombre] = {
            precio: prod.precio,
            cantidad: 1
        };
    }

    localStorage.setItem(clave, JSON.stringify(carrito));
    alert(`${nombre} añadido al carrito`);
}

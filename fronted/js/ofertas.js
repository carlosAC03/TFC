const API_URL = location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://tfc-2gv2.onrender.com";

let productos = [];

document.addEventListener("DOMContentLoaded", async () => {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.className = "loader";
    loader.innerHTML = 'Cargando tienda<span class="dots"></span>';
    document.body.insertBefore(loader, document.getElementById("productos"));

    try {
        const res = await fetch(`${API_URL}/productos/ofertas`);
        const data = await res.json();
        productos = data;

        renderProductosConBoton(productos);

        const buscador = document.querySelector(".search-input");
        buscador.addEventListener("input", () => {
            const texto = buscador.value.toLowerCase();
            const filtrados = productos.filter(p =>
                p.nombre.toLowerCase().includes(texto)
            );
            renderProductosConBoton(filtrados);
        });

    } catch (err) {
        console.error("Error al cargar productos en oferta:", err);
    } finally {
        if (loader) loader.remove();
    }
});

function renderProductosConBoton(lista) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = lista.length
        ? lista.map(p => `
            <div class="producto">
                <img src="${p.imagen}" alt="${p.nombre}">
                <h4>${p.nombre}</h4>
                <p>${p.descripcion}</p>
                ${p.novedad ? `<img src="../imagenes/new.png" alt="Novedad" class="etiqueta-novedad">` : ""}
                ${p.oferta && p.precioOriginal ? `
                    <p class="precio-oferta">
                        <span class="tachado">${p.precioOriginal.toFixed(2)} €</span>
                        <span class="precio-descuento">${p.precio.toFixed(2)} €</span>
                    </p>
                ` : `<span>${p.precio.toFixed(2)} €</span>`}
                <button onclick="añadirCarritoPorNombre('${p.nombre.replace(/'/g, "\\'")}')">Añadir al carrito</button>
            </div>
        `).join('')
        : `<p>No hay productos que coincidan con tu búsqueda.</p>`;
}

function añadirCarritoPorNombre(nombre) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario?.email) {
        alert("Debes iniciar sesión para añadir productos al carrito.");
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

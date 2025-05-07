const productos = [];

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:4000/productos");
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

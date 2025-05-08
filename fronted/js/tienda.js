// Detectar si estamos en local o en producción
const API_URL =
  location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://tfc-2gv2.onrender.com"; // Cambia si tu backend tiene otro dominio

const productos = [];

document.addEventListener("DOMContentLoaded", async () => {
<<<<<<< HEAD
  try {
    const res = await fetch(`${API_URL}/productos`);
    const data = await res.json();
    productos.push(...data);
    renderProductos();
  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
=======
    try {
        const res = await fetch("https://tfc-2gv2.onrender.com/productos");
        const data = await res.json();
        productos.push(...data);
        renderProductos();
    } catch (err) {
        console.error("Error al cargar productos:", err);
    }
>>>>>>> 8c1cf2a58d8f72180001db75c5a37b170c73cf8b
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

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario?.email) {
    Swal.fire("Acceso requerido", "Debes iniciar sesión para ver tu carrito.", "warning")
    .then(() => window.location.href = "login.html");
    return;
  }

  const clave = `carrito_${usuario.email}`;
  limpiarCarritoExpirado(clave);
  const carrito = JSON.parse(localStorage.getItem(clave)) || {};
  renderCarrito(carrito);
});

function limpiarCarritoExpirado(clave) {
  const carrito = JSON.parse(localStorage.getItem(clave)) || {};
  const ahora = Date.now();
  const actualizado = {};

  for (const nombre in carrito) {
    if (!carrito[nombre].timestamp || ahora - carrito[nombre].timestamp < 120000) {
      actualizado[nombre] = carrito[nombre];
    }
  }

  localStorage.setItem(clave, JSON.stringify(actualizado));
}

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

    const boton = document.createElement("button");
    boton.textContent = "Comprar";
    boton.className = "boton-comprar";
    const tieneProductos = Object.keys(carrito).length > 0;

if (tieneProductos) {
    boton.disabled = false;
    boton.onclick = realizarCompra;
} else {
    boton.disabled = true;
}

contenedor.appendChild(boton);

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

async function realizarCompra() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const clave = `carrito_${usuario.email}`;
  const carrito = JSON.parse(localStorage.getItem(clave)) || {};

  const API_URL = "https://tfc-2gv2.onrender.com";

  const res = await fetch(`${API_URL}/comprar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: usuario.email, carrito })
  });

  if (res.ok) {
    Swal.fire("¡Gracias por tu compra!", "Compra realizada con éxito.", "success");
    localStorage.removeItem(clave);
    renderCarrito({});
  } else {
    Swal.fire("Error", "Error al realizar la compra.", "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario?.email) {
    alert("Debes iniciar sesión para ver tu carrito.");
    window.location.href = "login.html";
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
  boton.style.backgroundColor = "#28a745";
  boton.style.color = "white";
  boton.style.fontSize = "18px";
  boton.style.padding = "10px 20px";
  boton.style.marginTop = "20px";
  boton.onclick = realizarCompra;
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
    alert("Compra realizada con éxito.");
    localStorage.removeItem(clave);
    renderCarrito({});
  } else {
    alert("Error al realizar la compra.");
  }
}

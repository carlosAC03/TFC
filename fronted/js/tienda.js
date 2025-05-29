const productos = [];
let paginaActual = getPaginaDesdeURL();
const limite = 12;

function getCategoriaDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("categoria");
}

function getBusquedaDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("busqueda") || "";
}

function getPaginaDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("page")) || 1;
}

document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "block";

  try {
    const API_URL = location.hostname === "localhost"
      ? "http://localhost:4000"
      : "https://tfc-2gv2.onrender.com";

    const textoBusqueda = getBusquedaDesdeURL().toLowerCase();
    const categoria = getCategoriaDesdeURL();

    const url = textoBusqueda || categoria
      ? `${API_URL}/productos?page=1&limit=1000`
      : `${API_URL}/productos?page=${paginaActual}&limit=${limite}`;

    const res = await fetch(url);
    const { productos: data, total } = await res.json();
    productos.push(...data);

    renderProductos(textoBusqueda);

    const buscador = document.querySelector('.search-input');
    if (buscador) {
      buscador.value = textoBusqueda;
      buscador.addEventListener('input', async () => {
        const texto = buscador.value.trim().toLowerCase();

        if (productos.length <= limite && texto.length === 1) {
          try {
            const fullRes = await fetch(`${API_URL}/productos?page=1&limit=1000`);
            const { productos: fullData } = await fullRes.json();
            productos.length = 0;
            productos.push(...fullData);
          } catch (err) {
            console.error("Error al cargar todos los productos:", err);
          }
        }

        renderProductos(texto);
      });
    }

    if (!textoBusqueda && !categoria) {
      renderPaginacion(total);
    }

  } catch (err) {
    console.error("Error al cargar productos:", err);
  } finally {
    if (loader) loader.style.display = "none";
  }
});

function renderPaginacion(total) {
  const totalPaginas = Math.ceil(total / limite);
  const paginador = document.getElementById("paginacion");
  if (!paginador) return;

  paginador.innerHTML = "";

  const btnPrimera = document.createElement("button");
  btnPrimera.textContent = "⏮";
  btnPrimera.disabled = paginaActual === 1;
  btnPrimera.addEventListener("click", () => cambiarPagina(1));
  paginador.appendChild(btnPrimera);

  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "◀";
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.addEventListener("click", () => cambiarPagina(paginaActual - 1));
  paginador.appendChild(btnAnterior);

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === paginaActual) btn.classList.add("activo");
    btn.addEventListener("click", () => cambiarPagina(i));
    paginador.appendChild(btn);
  }

  const btnSiguiente = document.createElement("button");
  btnSiguiente.textContent = "▶";
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.addEventListener("click", () => cambiarPagina(paginaActual + 1));
  paginador.appendChild(btnSiguiente);

  const btnUltima = document.createElement("button");
  btnUltima.textContent = "⏭";
  btnUltima.disabled = paginaActual === totalPaginas;
  btnUltima.addEventListener("click", () => cambiarPagina(totalPaginas));
  paginador.appendChild(btnUltima);
}

function cambiarPagina(nuevaPagina) {
  const params = new URLSearchParams(window.location.search);
  params.set("page", nuevaPagina);
  window.location.search = params.toString();
}

function renderProductos(filtroTexto = "") {
  const contenedor = document.getElementById("productos");
  const paginador = document.getElementById("paginacion");
  contenedor.innerHTML = "";
  if (paginador) paginador.innerHTML = "";

  const categoriaSeleccionada = getCategoriaDesdeURL();
  const textoBusqueda = getBusquedaDesdeURL();
  const esFiltrado = !!textoBusqueda || !!categoriaSeleccionada;

  let productosFiltrados = productos;

  if (categoriaSeleccionada) {
    productosFiltrados = productosFiltrados.filter(p =>
      p.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
    );
  }

  if (filtroTexto || textoBusqueda) {
    const texto = (filtroTexto || textoBusqueda).toLowerCase();
    productosFiltrados = productosFiltrados.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
    );
  }

  const totalFiltrados = productosFiltrados.length;

  if (totalFiltrados > limite) {
    const inicio = (paginaActual - 1) * limite;
    const fin = inicio + limite;
    productosFiltrados = productosFiltrados.slice(inicio, fin);
    renderPaginacion(totalFiltrados);
  } else if (!filtroTexto && !getBusquedaDesdeURL() && productos.length > limite) {
    renderPaginacion(productos.length);
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
        ${p.novedad ? `<span class="novedad-texto">NEW</span>` : ""}
        ${p.oferta && p.precioOriginal ? `
          <p class="precio-oferta">
            <span class="tachado">${p.precioOriginal.toFixed(2)} €</span>
            <span class="precio-descuento">${p.precio.toFixed(2)} €</span>
          </p>
        ` : `<span class="precio-normal">${p.precio.toFixed(2)} €</span>`}
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

// Array global donde se almacenarán los productos recuperados del servidor
const productos = [];
// Obtiene la página actual desde la URL
let paginaActual = getPaginaDesdeURL();
// Número de productos mostrados por página
const limite = 12;

// Obtiene el parámetro "categoria" de la URL
function getCategoriaDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("categoria");
}

// Obtiene el parámetro "busqueda" de la URL o una cadena vacía por defecto
function getBusquedaDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("busqueda") || "";
}

// Obtiene el parámetro "page" de la URL o devuelve 1 si no existe
function getPaginaDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("page")) || 1;
}

// Evento que se dispara cuando el DOM ha terminado de cargarse
document.addEventListener("DOMContentLoaded", async () => {
  // Muestra el loader si existe
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "block";

  try {
    // Determina si se está ejecutando en local o en producción
    const API_URL = ["localhost", "127.0.0.1"].includes(location.hostname)
      ? "http://localhost:4000"
      : "https://tfc-2gv2.onrender.com";

    // Obtiene los filtros desde la URL
    const textoBusqueda = getBusquedaDesdeURL().toLowerCase();
    const categoria = getCategoriaDesdeURL();

    // Si hay filtros, carga hasta 1000 productos. Si no, sólo los de la página actual
    const url = textoBusqueda || categoria
      ? `${API_URL}/productos?page=1&limit=1000`
      : `${API_URL}/productos?page=${paginaActual}&limit=${limite}`;

    // Fetch de productos desde la API
    const res = await fetch(url);
    const { productos: data, total } = await res.json();
    productos.push(...data); // Añade los productos al array global

    renderProductos(textoBusqueda); // Muestra los productos en pantalla

    // Configura el campo de búsqueda si existe
    const buscador = document.querySelector('.search-input');
    if (buscador) {
      buscador.value = textoBusqueda;

      buscador.addEventListener('input', async () => {
        const texto = buscador.value.trim().toLowerCase();

        // Si hay pocos productos cargados y se empieza a escribir, recarga todos
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

        // Vuelve a renderizar con el texto de búsqueda actual
        renderProductos(texto);
      });
    }

    // Si no hay filtros, muestra paginación
    if (!textoBusqueda && !categoria) {
      renderPaginacion(total);
    }

  } catch (err) {
    console.error("Error al cargar productos:", err);
  } finally {
    // Oculta el loader
    if (loader) loader.style.display = "none";
  }
});

// Renderiza los botones de paginación en función del total de productos
function renderPaginacion(total) {
  const totalPaginas = Math.ceil(total / limite);
  const paginador = document.getElementById("paginacion");
  if (!paginador) return;

  paginador.innerHTML = "";

  // Botón primera página
  const btnPrimera = document.createElement("button");
  btnPrimera.textContent = "⏮";
  btnPrimera.disabled = paginaActual === 1;
  btnPrimera.addEventListener("click", () => cambiarPagina(1));
  paginador.appendChild(btnPrimera);

  // Botón anterior
  const btnAnterior = document.createElement("button");
  btnAnterior.textContent = "◀";
  btnAnterior.disabled = paginaActual === 1;
  btnAnterior.addEventListener("click", () => cambiarPagina(paginaActual - 1));
  paginador.appendChild(btnAnterior);

  // Botones numerados por página
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === paginaActual) btn.classList.add("activo");
    btn.addEventListener("click", () => cambiarPagina(i));
    paginador.appendChild(btn);
  }

  // Botón siguiente
  const btnSiguiente = document.createElement("button");
  btnSiguiente.textContent = "▶";
  btnSiguiente.disabled = paginaActual === totalPaginas;
  btnSiguiente.addEventListener("click", () => cambiarPagina(paginaActual + 1));
  paginador.appendChild(btnSiguiente);

  // Botón última página
  const btnUltima = document.createElement("button");
  btnUltima.textContent = "⏭";
  btnUltima.disabled = paginaActual === totalPaginas;
  btnUltima.addEventListener("click", () => cambiarPagina(totalPaginas));
  paginador.appendChild(btnUltima);
}

// Cambia la página actual y recarga la URL con el nuevo parámetro
function cambiarPagina(nuevaPagina) {
  const params = new URLSearchParams(window.location.search);
  params.set("page", nuevaPagina);
  window.location.search = params.toString();
}

// Renderiza los productos filtrados en pantalla
function renderProductos(filtroTexto = "") {
  const contenedor = document.getElementById("productos");
  const paginador = document.getElementById("paginacion");
  contenedor.innerHTML = "";
  if (paginador) paginador.innerHTML = "";

  const categoriaSeleccionada = getCategoriaDesdeURL();
  const textoBusqueda = getBusquedaDesdeURL();

  let productosFiltrados = productos;

  // Filtra por categoría si está presente
  if (categoriaSeleccionada) {
    productosFiltrados = productosFiltrados.filter(p =>
      p.categoria.toLowerCase() === categoriaSeleccionada.toLowerCase()
    );
  }

  // Filtra por búsqueda si hay texto
  if (filtroTexto || textoBusqueda) {
    const texto = (filtroTexto || textoBusqueda).toLowerCase();
    productosFiltrados = productosFiltrados.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
    );
  }

  const totalFiltrados = productosFiltrados.length;

  // Si hay más productos de los permitidos por página, se muestra paginación
  if (totalFiltrados > limite) {
    const inicio = (paginaActual - 1) * limite;
    const fin = inicio + limite;
    productosFiltrados = productosFiltrados.slice(inicio, fin);
    renderPaginacion(totalFiltrados);
  } else {
    if (paginador) paginador.innerHTML = "";
  }

  // Si no hay productos tras el filtrado
  if (productosFiltrados.length === 0) {
    contenedor.innerHTML = `<p>No hay productos que coincidan con tu búsqueda.</p>`;
    return;
  }

  // Renderizado del HTML para cada producto
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

// Añade un producto al carrito usando su nombre
function añadirCarritoPorNombre(nombre) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario?.email) {
    Swal.fire("Acceso requerido", "Debes iniciar sesión para añadir productos al carrito.", "warning")
    .then(() => window.location.href = "login.html");
    window.location.href = "login.html";
    return;
  }

  const prod = productos.find(p => p.nombre === nombre);
  if (!prod) {
    Swal.fire("Error", "Producto no encontrado.", "error");
    return;
  }

  const clave = `carrito_${usuario.email}`;
  const carrito = JSON.parse(localStorage.getItem(clave)) || {};

  if (carrito[nombre]) {
    carrito[nombre].cantidad += 1;
  } else {
    carrito[nombre] = {
      precio: prod.precio,
      cantidad: 1,
      timestamp: Date.now()
    };
  }

  localStorage.setItem(clave, JSON.stringify(carrito));
  Swal.fire("Añadido al carrito", `${nombre} añadido al carrito`, "success");
}

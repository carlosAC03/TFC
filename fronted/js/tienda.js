const productos = [];
let paginaActual = getPaginaDesdeURL();
const limite = 12;
const API_URL = ["localhost", "127.0.0.1"].includes(location.hostname)
  ? "http://localhost:4000"
  : "https://tfc-2gv2.onrender.com";

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
  }

  if (productosFiltrados.length === 0) {
    contenedor.innerHTML = `<p>No hay productos que coincidan con tu búsqueda.</p>`;
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  productosFiltrados.forEach(p => {
    contenedor.innerHTML += `
      <div class="producto-wrapper">
        ${usuario?.rol === "admin" ? `
          <button class="boton-editar-admin" onclick="mostrarModalEditar('${p._id}', '${p.nombre}', '${p.descripcion}', ${p.precio}, '${p.imagen || ""}', ${p.oferta}, ${p.novedad}, ${p.precioOriginal || 0})">✎ Editar</button>
        ` : ""}
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
      </div>
    `;
  });
}


function añadirCarritoPorNombre(nombre) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario?.email) {
    Swal.fire({
      icon: "warning",
      title: "Acceso requerido",
      text: "Debes iniciar sesión para añadir productos al carrito.",
      confirmButtonText: "Iniciar sesión"
    }).then(result => {
      if (result.isConfirmed) window.location.href = "login.html";
    });
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

function mostrarModalCrear() {
  const formHtml = `
    <form id="formCrearProducto" style="display:flex;flex-direction:column;gap:10px">
      <label>Nombre: <input type="text" id="new-nombre"></label>
      <label>Descripción: <input type="text" id="new-descripcion"></label>
      <label>Precio: <input type="number" id="new-precio"></label>
      <label>Precio Original: <input type="number" id="new-precioOriginal"></label>
      <label>Imagen URL: <input type="text" id="new-imagen"></label>
      <label><input type="checkbox" id="new-oferta"> En oferta</label>
      <label><input type="checkbox" id="new-novedad"> Es novedad</label>
      <label>Categoría: <input type="text" id="new-categoria"></label>
    </form>
  `;

  Swal.fire({
    title: "Nuevo producto",
    html: formHtml,
    showCancelButton: true,
    confirmButtonText: "Crear producto",
    focusConfirm: false,
    preConfirm: async () => {
      const nuevo = {
        nombre: document.getElementById("new-nombre").value,
        descripcion: document.getElementById("new-descripcion").value,
        precio: parseFloat(document.getElementById("new-precio").value),
        precioOriginal: parseFloat(document.getElementById("new-precioOriginal").value),
        imagen: document.getElementById("new-imagen").value,
        oferta: document.getElementById("new-oferta").checked,
        novedad: document.getElementById("new-novedad").checked,
        categoria: document.getElementById("new-categoria").value
      };

      const res = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo)
      });

      if (!res.ok) throw new Error("Error al crear producto");
      return res.json();
    }
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire("¡Creado!", "El producto fue añadido correctamente.", "success")
        .then(() => location.reload());
    }
  });
}

function mostrarModalEditar(id, nombre, descripcion, precio, imagen, oferta, novedad, precioOriginal) {
  const formHtml = `
    <form id="formEditarProducto" style="display:flex;flex-direction:column;gap:10px">
      <label>Nombre: <input type="text" id="edit-nombre" value="${nombre}"></label>
      <label>Descripción: <input type="text" id="edit-descripcion" value="${descripcion}"></label>
      <label>Precio: <input type="number" id="edit-precio" value="${precio}"></label>
      <label>Precio Original: <input type="number" id="edit-precioOriginal" value="${precioOriginal}"></label>
      <label>Imagen URL: <input type="text" id="edit-imagen" value="${imagen}"></label>
      <label><input type="checkbox" id="edit-oferta" ${oferta ? "checked" : ""}> En oferta</label>
      <label><input type="checkbox" id="edit-novedad" ${novedad ? "checked" : ""}> Es novedad</label>
    </form>
  `;

  Swal.fire({
    title: "Editar producto",
    html: formHtml,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "Guardar cambios",
    denyButtonText: "Eliminar producto",
    cancelButtonText: "Cancelar",
    focusConfirm: false,
    preConfirm: async () => {
      const updated = {
        nombre: document.getElementById("edit-nombre").value,
        descripcion: document.getElementById("edit-descripcion").value,
        precio: parseFloat(document.getElementById("edit-precio").value),
        precioOriginal: parseFloat(document.getElementById("edit-precioOriginal").value),
        imagen: document.getElementById("edit-imagen").value,
        oferta: document.getElementById("edit-oferta").checked,
        novedad: document.getElementById("edit-novedad").checked
      };

      const res = await fetch(`${API_URL}/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });

      if (!res.ok) throw new Error("Error al guardar");
      return res.json();
    }
  }).then(async result => {
    if (result.isConfirmed) {
      Swal.fire("¡Actualizado!", "El producto fue modificado correctamente.", "success")
        .then(() => location.reload());
    } else if (result.isDenied) {
      const confirmDelete = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });

      if (confirmDelete.isConfirmed) {
        const res = await fetch(`${API_URL}/productos/${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success").then(() => location.reload());
        } else {
          Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        }
      }
    }
  });
}

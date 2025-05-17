const API_URL = "https://tfc-2gv2.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch(`${API_URL}/productos/ofertas`);
    const data = await res.json();
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = data.map(p => `
      <div class="producto">
        <img src="${p.imagen}" alt="${p.nombre}">
        <h4>${p.nombre}</h4>
        <p>${p.descripcion}</p>
        <span>${p.precio.toFixed(2)} €</span>
      </div>
    `).join('');
  } catch (err) {
    console.error("Error al cargar productos en oferta:", err);
  }
});

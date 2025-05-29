// Carrusel de imágenes con transición
const images = document.querySelectorAll('.carousel-img');
let currentImageIndex = 0;

function changeImage() {
  if (!images.length) return;
  images.forEach(img => img.classList.remove('active'));
  currentImageIndex = (currentImageIndex + 1) % images.length;
  images[currentImageIndex].classList.add('active');
}

if (images.length) {
  setInterval(changeImage, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  const filtroBtn = document.getElementById('toggleMenu');
  const filtroMenu = document.querySelector('.filtro-menu');
  const overlay = document.querySelector('.overlay');
  const cerrarBtn = document.querySelector('.cerrar-menu');

  if (filtroBtn) {
    filtroBtn.addEventListener('click', () => {
      filtroMenu.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  }

  if (cerrarBtn && filtroMenu && overlay) {
    cerrarBtn.addEventListener('click', () => {
      filtroMenu.classList.remove('open');
      overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
      filtroMenu.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  // Buscador: redirige desde cualquier página a tienda.html
  const searchInput = document.querySelector('.search-input');
  const searchBtn = document.querySelector('.search-icon');

  if (searchInput) {
    const redirigirBusqueda = () => {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `/html/tienda.html?busqueda=${encodeURIComponent(query)}`;
      }
    };

    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        redirigirBusqueda();
      }
    });

    searchBtn?.addEventListener('click', redirigirBusqueda);
  }

  // Leer más / Leer menos en blog
  document.querySelectorAll('.leer-mas').forEach(boton => {
    boton.addEventListener('click', (e) => {
      e.preventDefault();
      const textoExtra = e.target.closest('.blog-card-content').querySelector('.extra-text');
      const visible = textoExtra.style.display === 'inline';
      textoExtra.style.display = visible ? 'none' : 'inline';
      e.target.textContent = visible ? 'Leer más →' : 'Leer menos ↑';
    });
  });

  // Menú responsive adicional
  const menuToggle = document.getElementById("menuToggle");
  const menuLateral = document.getElementById("menuLateral");
  const cerrarMenu = menuLateral?.querySelector(".cerrar-menu");

  if (menuToggle && menuLateral && overlay) {
    menuToggle.addEventListener("click", () => {
      menuLateral.classList.add("open");
      overlay.classList.add("active");
    });

    cerrarMenu?.addEventListener("click", () => {
      menuLateral.classList.remove("open");
      overlay.classList.remove("active");
    });

    overlay.addEventListener("click", () => {
      menuLateral.classList.remove("open");
      overlay.classList.remove("active");
    });
  }
});

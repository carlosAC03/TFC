// Carrusel de imágenes
const images = document.querySelectorAll('.carousel-img');
let currentImageIndex = 0;

function changeImage() {
    images.forEach(img => img.classList.remove('active'));
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
}
setInterval(changeImage, 3000);

document.addEventListener('DOMContentLoaded', () => {
    // Menú lateral
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

    // 🔍 Buscador universal
    const searchInput = document.querySelector('.search-input');
    const currentPath = window.location.pathname;

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (!query) return;

                const isTienda = currentPath.includes('tienda.html');
                const isOfertas = currentPath.includes('ofertas.html');
                const isNovedades = currentPath.includes('novedades.html');

                // Si ya estamos en tienda/ofertas/novedades, no redirigimos
                if (!isTienda && !isOfertas && !isNovedades) {
                    const tiendaPath = currentPath.includes('/html/') ? 'tienda.html' : 'html/tienda.html';
                    window.location.href = `${tiendaPath}?busqueda=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});

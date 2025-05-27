// Carrusel de imágenes con transición
const images = document.querySelectorAll('.carousel-img');
let currentImageIndex = 0;

function changeImage() {
    images.forEach(img => img.classList.remove('active'));
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
}

setInterval(changeImage, 3000);

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
});


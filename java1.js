// Carrusel con transición suave entre imágenes cada 3 segundos
const images = document.querySelectorAll('.carousel-img');
let currentImageIndex = 0;

function changeImage() {
    // Quitar la clase "active" de todas las imágenes
    images.forEach(img => img.classList.remove('active'));

    // Activar la siguiente imagen
    currentImageIndex = (currentImageIndex + 1) % images.length;
    images[currentImageIndex].classList.add('active');
}

// Cambia de imagen cada 3 segundos
setInterval(changeImage, 3000);
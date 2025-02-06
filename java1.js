let index = 0;
function changeSlide() {
    const slides = document.querySelectorAll(".carousel-img");
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
}
setInterval(changeSlide, 3000);

function filtrar(tipo) {
    console.log("Filtrando por: ", tipo);
    // Aquí puedes agregar lógica para mostrar solo los productos de la categoría seleccionada
}

function verTodos() {
    console.log("Mostrando todos los productos");
    // Aquí puedes agregar lógica para mostrar todos los productos sin filtrar
}

document.getElementById("cargar-mas").addEventListener("click", function() {
    let hiddenProducts = document.querySelectorAll(".productos-grid .hidden");
    hiddenProducts.forEach((producto, index) => {
        if (index < 6) {
            producto.classList.remove("hidden");
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const productosGrid = document.getElementById("productos-grid");
    for (let i = 1; i <= 15; i++) {
        let producto = document.createElement("img");
        producto.src = `producto${i}.jpg`;
        producto.classList.add("producto");
        if (i > 9) producto.classList.add("hidden");
        productosGrid.appendChild(producto);
    }
});

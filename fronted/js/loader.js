export function mostrarLoader() {
    const loader = document.createElement("div");
    loader.id = "loader";
    loader.className = "loader";
    loader.innerHTML = 'Cargando tienda<span class="dots"></span>';
    document.body.insertBefore(loader, document.getElementById("productos"));
}

export function ocultarLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.remove();
}
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a[href]");
  links.forEach(link => {
    const href = link.getAttribute("href");
    // Si el href es tipo "index.html" (relativo), prepende location.origin + "/"
    if (
      href &&
      !href.startsWith("http") &&
      !href.startsWith("/") &&
      !href.startsWith("#")
    ) {
      link.setAttribute("href", location.origin + "/" + href);
    }
  });
});

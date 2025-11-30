export function fixNavbarSpacing() {
  const navbar = document.getElementById("main-navbar");
  if (!navbar) return;

  const height = navbar.offsetHeight;
  document.documentElement.style.setProperty("--navbar-height", `${height}px`);
}

// Ejecutar al cargar y al redimensionar
window.addEventListener("load", fixNavbarSpacing);
window.addEventListener("resize", fixNavbarSpacing);

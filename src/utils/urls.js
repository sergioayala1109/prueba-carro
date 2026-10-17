// Ruta base del sitio según Vite.
// - En desarrollo vale '/'.
// - En producción (GitHub Pages) vale '/prueba-carro/'.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Prefija una ruta absoluta de un archivo de `public/` con la ruta base.
 * Ej: rutaPublica('/productos/foto.jpg') -> '/prueba-carro/productos/foto.jpg'
 * Sirve para que las imágenes funcionen igual en local y en GitHub Pages.
 */
export function rutaPublica(ruta) {
  return `${base}${ruta}`;
}

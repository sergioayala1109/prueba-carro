// Ruta base del sitio según Vite.
// - En desarrollo vale '/'.
// - En producción (GitHub Pages) vale '/prueba-carro/'.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

// Rutas que NO deben llevar el prefijo: ya son absolutas o vienen de fuera.
const ES_EXTERNA = /^(https?:|data:|blob:|mailto:|tel:|#)/i;

/**
 * Prefija una ruta interna de `public/` con la ruta base del despliegue.
 *   rutaPublica('/productos/foto.jpg') -> '/prueba-carro/productos/foto.jpg'
 *
 * Deja intactas las URLs externas, los data: URL y las rutas relativas, para
 * que la administradora pueda pegar un enlace de imagen o subir una foto.
 */
export function rutaPublica(ruta) {
  if (!ruta || ES_EXTERNA.test(ruta) || !ruta.startsWith('/')) return ruta;
  return `${base}${ruta}`;
}

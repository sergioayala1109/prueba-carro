// ⚠️⚠️  CREDENCIALES DE DEMOSTRACIÓN — NO SON SEGURAS  ⚠️⚠️
//
// Este proyecto es un sitio estático publicado en GitHub Pages y el repositorio
// es público. Eso significa que este archivo viaja dentro del JavaScript que
// cualquiera puede descargar y leer desde el navegador.
//
// Por lo tanto, este usuario y contraseña NO PROTEGEN NADA: son solo una puerta
// de demostración para mostrar cómo se vería un panel de administración.
// NO usar aquí contraseñas reales.
//
// Para una autenticación de verdad hace falta un servicio con backend
// (por ejemplo Supabase o Firebase), que valide las credenciales en un servidor.

export const CREDENCIALES_DEMO = {
  usuario: 'admin',
  clave: 'monsant2026',
};

// Pista que se muestra en la pantalla de acceso, para poder probarla.
export const PISTA_DEMO = `${CREDENCIALES_DEMO.usuario} / ${CREDENCIALES_DEMO.clave}`;

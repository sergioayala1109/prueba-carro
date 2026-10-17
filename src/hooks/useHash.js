import { useEffect, useState } from 'react';

/**
 * Lee el hash de la URL (ej. "#/admin") y vuelve a renderizar cuando cambia.
 * Se usa para tener dos "pantallas" (vitrina y panel) sin instalar un router.
 */
export function useHash() {
  const [hash, setHash] = useState(() =>
    typeof window === 'undefined' ? '' : window.location.hash,
  );

  useEffect(() => {
    const alCambiar = () => setHash(window.location.hash);
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);

  return hash;
}

/** true si el hash corresponde a la pantalla de administración. */
export function esRutaAdmin(hash) {
  return hash.replace(/^#\/?/, '').startsWith('admin');
}

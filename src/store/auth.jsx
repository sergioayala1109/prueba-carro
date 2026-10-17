import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CREDENCIALES_DEMO } from '../data/admin';

// La sesión se recuerda en el navegador para no tener que entrar en cada recarga.
const CLAVE = 'monsant:sesion';

const AuthContext = createContext(null);

function leerSesion() {
  try {
    return window.localStorage.getItem(CLAVE) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);

  const entrar = useCallback((nombre, clave) => {
    const usuarioOk =
      String(nombre).trim().toLowerCase() === CREDENCIALES_DEMO.usuario;
    const claveOk = String(clave) === CREDENCIALES_DEMO.clave;

    if (!usuarioOk || !claveOk) {
      return { ok: false, error: 'Usuario o contraseña incorrectos.' };
    }

    try {
      window.localStorage.setItem(CLAVE, CREDENCIALES_DEMO.usuario);
    } catch {
      // Si no se puede recordar la sesión, igual dejamos entrar en esta pestaña.
    }
    setUsuario(CREDENCIALES_DEMO.usuario);
    return { ok: true };
  }, []);

  const salir = useCallback(() => {
    try {
      window.localStorage.removeItem(CLAVE);
    } catch {
      // Sin problema: igual cerramos la sesión en memoria.
    }
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, autenticado: Boolean(usuario), entrar, salir }),
    [usuario, entrar, salir],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth() debe usarse dentro de <AuthProvider>.');
  }
  return contexto;
}

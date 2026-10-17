import { useState } from 'react';
import { PISTA_DEMO } from '../../data/admin';
import { useAuth } from '../../store/auth';

export default function AdminLogin() {
  const { entrar } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const enviar = (evento) => {
    evento.preventDefault();
    const resultado = entrar(usuario, clave);
    if (!resultado.ok) setError(resultado.error);
  };

  return (
    <div className="acceso">
      <div className="acceso__caja">
        <div className="acceso__logo" aria-hidden="true">M</div>
        <h1 className="acceso__titulo">Panel de administración</h1>
        <p className="acceso__texto">Monsant · Estudio creativo</p>

        <form className="acceso__form" onSubmit={enviar}>
          {error && (
            <p className="acceso__error" role="alert">
              {error}
            </p>
          )}

          <label className="campo">
            <span className="campo__label">Usuario</span>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </label>

          <label className="campo">
            <span className="campo__label">Contraseña</span>
            <input
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <button type="submit" className="boton boton--primario">
            Entrar
          </button>
        </form>

        <div className="acceso__pie">
          <p className="acceso__pista">
            Demo · usuario y contraseña: <code>{PISTA_DEMO}</code>
          </p>
          <p>
            <a className="enlace-volver" href="#inicio">
              ← Volver a la tienda
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

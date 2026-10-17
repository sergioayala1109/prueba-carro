import { negocio } from '../data/negocio';

export default function Header() {
  const whatsapp = negocio.telefonos.find((t) => t.whatsapp);

  return (
    <header className="header">
      <div className="contenedor header__interior">
        <a className="marca" href="#inicio">
          <span className="marca__logo" aria-hidden="true">M</span>
          <span className="marca__texto">
            <strong>{negocio.nombre}</strong>
            <small>{negocio.eslogan}</small>
          </span>
        </a>

        <nav className="nav" aria-label="Navegación principal">
          <a href="#catalogo">Productos</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#tienda">Contacto</a>
        </nav>

        <a
          className="boton boton--wa header__cta"
          href={`https://wa.me/${whatsapp.tel.replace('+', '')}`}
          target="_blank"
          rel="noreferrer"
        >
          Escríbenos
        </a>
      </div>
    </header>
  );
}

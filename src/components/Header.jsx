import { useDatos } from '../store/datos';
import { enlaceWhatsApp } from '../utils/whatsapp';

export default function Header() {
  const { negocio } = useDatos();
  const whatsapp = enlaceWhatsApp(negocio);

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

        {whatsapp && (
          <a
            className="boton boton--wa header__cta"
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            Escríbenos
          </a>
        )}
      </div>
    </header>
  );
}

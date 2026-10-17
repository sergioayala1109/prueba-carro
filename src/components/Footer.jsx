import { useDatos } from '../store/datos';
import { enlaceWhatsApp } from '../utils/whatsapp';

// El año se calcula una vez al cargar el módulo (no en cada render).
const ANIO = new Date().getFullYear();

function IconoInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconoFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-7.2h2.5l.4-2.8h-2.9V9.2c0-.8.3-1.4 1.5-1.4h1.5V5.3c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8.1v2.8h2.5V21z" />
    </svg>
  );
}

function IconoWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.2a8.8 8.8 0 0 0-7.5 13.4L3.2 21l4.6-1.2A8.8 8.8 0 1 0 12 3.2zm0 1.7a7.1 7.1 0 0 1 0 14.2 7 7 0 0 1-3.6-1l-.3-.2-2.7.7.7-2.6-.2-.3A7.1 7.1 0 0 1 12 4.9zm-2.6 3.4c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2s.8 2.2 1 2.4c.1.2 1.6 2.5 4 3.4 2 .8 2.4.7 2.8.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3-1.6-.8c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.7-.6-1.1-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4.2-.5c.1-.1 0-.3 0-.4l-.7-1.6c-.1-.3-.3-.3-.5-.3z" />
    </svg>
  );
}

const iconosRed = {
  Instagram: <IconoInstagram />,
  Facebook: <IconoFacebook />,
};

export default function Footer() {
  const { negocio } = useDatos();
  const waBase = enlaceWhatsApp(negocio);
  const { direccion, informacion, horario, redes } = negocio;
  const direccionCompleta = `${direccion.calle}, ${direccion.comuna}, ${direccion.ciudad}, ${direccion.pais}`;
  const mapaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccionCompleta,
  )}`;

  return (
    <footer className="footer">
      <div className="contenedor footer__interior">
        <div className="footer__bloque footer__bloque--marca">
          <p className="footer__logo">{negocio.nombre}</p>
          <p className="footer__mision">{negocio.mision}</p>

          <p className="footer__subtitulo">Síguenos</p>
          <div className="footer__redes">
            {redes.map((red) => (
              <a
                key={red.nombre}
                className="footer__red"
                href={red.url}
                target="_blank"
                rel="noreferrer"
                aria-label={red.nombre}
                title={red.nombre}
              >
                {iconosRed[red.nombre] ?? red.nombre.charAt(0)}
              </a>
            ))}
            {waBase && (
              <a
                className="footer__red"
                href={waBase}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <IconoWhatsApp />
              </a>
            )}
          </div>

          <p className="footer__copy">
            © {ANIO} {negocio.nombre}. Todos los derechos reservados.
            <br />
            <a className="footer__admin" href="#/admin">
              Administrar
            </a>
          </p>
        </div>

        <nav className="footer__bloque" aria-label="Información">
          <h3 className="footer__titulo">Información</h3>
          <ul className="footer__lista">
            {informacion.map((item) => {
              const enlace = item.mapa
                ? mapaUrl
                : (item.ancla ??
                  (waBase
                    ? `${waBase}?text=${encodeURIComponent(item.consulta)}`
                    : null));

              if (!enlace) return null;

              return (
                <li key={item.etiqueta}>
                  <a
                    href={enlace}
                    {...(item.ancla
                      ? {}
                      : { target: '_blank', rel: 'noreferrer' })}
                  >
                    {item.etiqueta}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="footer__bloque" id="tienda">
          <h3 className="footer__titulo">Tienda {negocio.nombre}</h3>
          <address className="footer__direccion">
            <a href={mapaUrl} target="_blank" rel="noreferrer" title="Ver en Google Maps">
              {direccion.calle}
              <br />
              {direccion.comuna}
              <br />
              {direccion.ciudad} - {direccion.pais}
            </a>
          </address>

          <p className="footer__subtitulo">Horario</p>
          <ul className="footer__horario">
            {horario.map((bloque) => (
              <li key={bloque.dias}>
                <span>{bloque.dias}</span>
                <span>{bloque.horas}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

import { useDatos } from '../store/datos';
import { rutaPublica } from '../utils/urls';

const collage = [
  { src: '/productos/01-agenda-personalizada.jpg', alt: 'Agenda personalizada' },
  { src: '/productos/09-invitaciones-boda.jpg', alt: 'Invitaciones de boda' },
  { src: '/productos/04-cake-topper.jpg', alt: 'Cake topper personalizado' },
  { src: '/productos/05-devocional-femenino.jpg', alt: 'Devocional personalizado' },
].map((foto) => ({ ...foto, src: rutaPublica(foto.src) }));

export default function Hero() {
  const { negocio, textos } = useDatos();
  const { hero } = textos;
  const { direccion } = negocio;
  const mapaUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${direccion.calle}, ${direccion.comuna}, ${direccion.ciudad}, ${direccion.pais}`,
  )}`;

  return (
    <section className="hero" id="inicio">
      <div className="contenedor hero__interior">
        <div className="hero__texto">
          <p className="hero__etiqueta">{hero.etiqueta}</p>
          <h1>
            {hero.titulo}
            <span className="hero__resaltado">{hero.resaltado}</span>
          </h1>
          <p className="hero__descripcion">{hero.descripcion}</p>

          <div className="hero__acciones">
            <a className="boton boton--primario" href="#catalogo">
              Ver productos
            </a>
            <a
              className="boton boton--fantasma"
              href={mapaUrl}
              target="_blank"
              rel="noreferrer"
            >
              Cómo llegar
            </a>
          </div>

          <ul className="hero__ventajas">
            {hero.ventajas.map((ventaja, indice) => (
              <li key={indice}>{ventaja}</li>
            ))}
          </ul>
        </div>

        <div className="hero__collage">
          {collage.map((foto, indice) => (
            <div
              className={`hero__pieza hero__pieza--${indice + 1}`}
              key={foto.src}
            >
              <img src={foto.src} alt={foto.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

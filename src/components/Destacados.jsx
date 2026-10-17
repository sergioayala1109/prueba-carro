import { useCallback, useEffect, useRef, useState } from 'react';
import { formatoPrecio, negocio } from '../data/negocio';
import { productos } from '../data/productos';

const destacados = productos.filter((producto) => producto.destacado);
const total = destacados.length;

export default function Destacados({ onVerDetalle }) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const toqueX = useRef(null);

  const whatsapp = negocio.telefonos.find((t) => t.whatsapp);
  const waBase = `https://wa.me/${whatsapp.tel.replace('+', '')}`;

  const ir = useCallback((i) => setIndice(((i % total) + total) % total), []);
  const siguiente = useCallback(() => setIndice((i) => (i + 1) % total), []);
  const anterior = useCallback(() => setIndice((i) => (i - 1 + total) % total), []);

  // Autoplay, se detiene al pasar el mouse o enfocar.
  useEffect(() => {
    if (pausado || total <= 1) return undefined;
    const id = setInterval(siguiente, 5000);
    return () => clearInterval(id);
  }, [pausado, siguiente]);

  const onTouchStart = (evento) => {
    toqueX.current = evento.touches[0].clientX;
  };

  const onTouchEnd = (evento) => {
    if (toqueX.current === null) return;
    const delta = evento.changedTouches[0].clientX - toqueX.current;
    if (Math.abs(delta) > 45) {
      if (delta < 0) siguiente();
      else anterior();
    }
    toqueX.current = null;
  };

  return (
    <section className="destacados" id="destacados">
      <div className="contenedor">
        <div className="seccion__encabezado">
          <p className="seccion__etiqueta">Lo más pedido</p>
          <h2>Productos destacados</h2>
          <p className="seccion__descripcion">
            Nuestros favoritos, listos para personalizar. Desliza o usa las
            flechas para ver más.
          </p>
        </div>

        <div
          className="carrusel"
          role="region"
          aria-roledescription="carrusel"
          aria-label="Productos destacados"
          tabIndex={0}
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onFocus={() => setPausado(true)}
          onBlur={() => setPausado(false)}
          onKeyDown={(evento) => {
            if (evento.key === 'ArrowRight') siguiente();
            if (evento.key === 'ArrowLeft') anterior();
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="carrusel__viewport">
            <div
              className="carrusel__pista"
              style={{ transform: `translateX(-${indice * 100}%)` }}
            >
              {destacados.map((producto, i) => {
                const mensaje = encodeURIComponent(
                  `¡Hola ${negocio.nombre}! Me interesa "${producto.nombre}" (${formatoPrecio(
                    producto.precio,
                  )}). ¿Me das más información?`,
                );

                return (
                  <article
                    className="slide"
                    key={producto.id}
                    aria-hidden={i !== indice}
                  >
                    <div className="slide__media">
                      <button
                        type="button"
                        className="slide__media-boton"
                        onClick={() => onVerDetalle(producto)}
                        aria-label={`Ver detalles de ${producto.nombre}`}
                      >
                        <img src={producto.imagenes[0]} alt={producto.nombre} />
                      </button>
                      <span className="slide__contador">
                        {String(i + 1).padStart(2, '0')} /{' '}
                        {String(total).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="slide__info">
                      <span className="producto__categoria">
                        {producto.categoria}
                      </span>
                      <h3 className="slide__nombre">{producto.nombre}</h3>
                      <p className="slide__descripcion">
                        {producto.descripcion}
                      </p>

                      <div className="slide__precio">
                        <strong>{formatoPrecio(producto.precio)}</strong>
                        {producto.precioAntes && (
                          <s>{formatoPrecio(producto.precioAntes)}</s>
                        )}
                      </div>

                      <div className="slide__acciones">
                        <a
                          className="boton boton--wa"
                          href={`${waBase}?text=${mensaje}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Cotizar por WhatsApp
                        </a>
                        <button
                          type="button"
                          className="boton boton--fantasma"
                          onClick={() => onVerDetalle(producto)}
                        >
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="carrusel__flecha carrusel__flecha--prev"
            onClick={anterior}
            aria-label="Producto anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="carrusel__flecha carrusel__flecha--next"
            onClick={siguiente}
            aria-label="Producto siguiente"
          >
            ›
          </button>

          <div className="carrusel__puntos" role="tablist" aria-label="Elegir producto">
            {destacados.map((producto, i) => (
              <button
                key={producto.id}
                type="button"
                role="tab"
                aria-selected={i === indice}
                aria-label={`Ir a ${producto.nombre}`}
                className={'punto' + (i === indice ? ' punto--activo' : '')}
                onClick={() => ir(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

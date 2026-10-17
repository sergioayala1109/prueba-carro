import { useCallback, useEffect, useRef, useState } from 'react';
import { formatoPrecio } from '../data/negocio';
import { useDatos } from '../store/datos';
import { enlaceWhatsApp } from '../utils/whatsapp';

export default function ProductoModal({ producto, onCerrar }) {
  const { negocio } = useDatos();
  const [imagenes, setImagenes] = useState(producto.imagenes ?? []);
  const [actual, setActual] = useState(0);
  const cerrarRef = useRef(null);

  const total = imagenes.length;
  const detalles = producto.detalles ?? [];

  const mover = useCallback(
    (paso) => {
      setActual((prev) => {
        if (total === 0) return 0;
        return (prev + paso + total) % total;
      });
    },
    [total],
  );

  // Bloquear el scroll del fondo y capturar teclas.
  useEffect(() => {
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cerrarRef.current?.focus();

    const onKey = (evento) => {
      if (evento.key === 'Escape') onCerrar();
      if (evento.key === 'ArrowRight') mover(1);
      if (evento.key === 'ArrowLeft') mover(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflowPrevio;
      document.removeEventListener('keydown', onKey);
    };
  }, [onCerrar, mover]);

  const quitarImagen = (src) => {
    const siguientes = imagenes.filter((s) => s !== src);
    setImagenes(siguientes);
    setActual((prev) => Math.min(prev, Math.max(0, siguientes.length - 1)));
  };

  const enlace = enlaceWhatsApp(
    negocio,
    `¡Hola ${negocio.nombre}! Me interesa "${producto.nombre}" (${formatoPrecio(
      producto.precio,
    )}${producto.medidas ? ` · ${producto.medidas}` : ''}). ¿Me das más información?`,
  );
  const asunto = encodeURIComponent(`Consulta: ${producto.nombre}`);

  return (
    <div
      className="modal"
      role="presentation"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar();
      }}
    >
      <div
        className="modal__caja"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
      >
        <button
          ref={cerrarRef}
          type="button"
          className="modal__cerrar"
          onClick={onCerrar}
          aria-label="Cerrar ficha"
        >
          ×
        </button>

        <div className="modal__galeria">
          <div className="modal__principal">
            {total > 0 ? (
              <img
                src={imagenes[actual]}
                alt={`${producto.nombre} — imagen ${actual + 1}`}
                onError={() => quitarImagen(imagenes[actual])}
              />
            ) : (
              <span className="modal__sinimagen" role="img" aria-label={producto.nombre}>
                {producto.icono}
              </span>
            )}

            {total > 1 && (
              <>
                <button
                  type="button"
                  className="modal__nav modal__nav--prev"
                  onClick={() => mover(-1)}
                  aria-label="Imagen anterior"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="modal__nav modal__nav--next"
                  onClick={() => mover(1)}
                  aria-label="Imagen siguiente"
                >
                  ›
                </button>
                <span className="modal__contador">
                  {actual + 1} / {total}
                </span>
              </>
            )}
          </div>

          {total > 1 && (
            <div className="modal__miniaturas">
              {imagenes.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  className={'miniatura' + (i === actual ? ' miniatura--activa' : '')}
                  onClick={() => setActual(i)}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img src={src} alt="" onError={() => quitarImagen(src)} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="modal__info">
          <span className="producto__categoria">{producto.categoria}</span>
          <h3 id="modal-titulo" className="modal__nombre">
            {producto.nombre}
          </h3>

          <div className="modal__precio">
            <strong>{formatoPrecio(producto.precio)}</strong>
            {producto.precioAntes && <s>{formatoPrecio(producto.precioAntes)}</s>}
          </div>

          {producto.medidas && (
            <p className="modal__medidas">
              <span aria-hidden="true">📐</span> {producto.medidas}
            </p>
          )}

          <p className="modal__descripcion">{producto.descripcion}</p>

          {detalles.length > 0 && (
            <>
              <h4 className="modal__subtitulo">Detalles</h4>
              <ul className="modal__detalles">
                {detalles.map((detalle) => (
                  <li key={detalle}>{detalle}</li>
                ))}
              </ul>
            </>
          )}

          <div className="modal__acciones">
            {enlace && (
              <a
                className="boton boton--wa"
                href={enlace}
                target="_blank"
                rel="noreferrer"
              >
                Cotizar por WhatsApp
              </a>
            )}
            <a
              className="boton boton--fantasma"
              href={`mailto:${negocio.correo}?subject=${asunto}`}
            >
              Escribir correo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

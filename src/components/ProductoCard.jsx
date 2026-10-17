import { useMemo, useState } from 'react';
import { formatoPrecio, negocio } from '../data/negocio';

export default function ProductoCard({ producto, onVerDetalle }) {
  const [imagenFallo, setImagenFallo] = useState(false);
  const whatsapp = negocio.telefonos.find((t) => t.whatsapp);
  const portada = producto.imagenes[0];

  const descuento = useMemo(
    () =>
      producto.precioAntes
        ? Math.round((1 - producto.precio / producto.precioAntes) * 100)
        : 0,
    [producto.precio, producto.precioAntes],
  );

  const mensaje = encodeURIComponent(
    `¡Hola ${negocio.nombre}! Me interesa "${producto.nombre}" (${formatoPrecio(
      producto.precio,
    )}). ¿Me das más información?`,
  );

  return (
    <article className="producto">
      <button
        type="button"
        className="producto__imagen"
        onClick={() => onVerDetalle(producto)}
        aria-label={`Ver detalles de ${producto.nombre}`}
      >
        {!imagenFallo ? (
          <img
            src={portada}
            alt={producto.nombre}
            loading="lazy"
            onError={() => setImagenFallo(true)}
          />
        ) : (
          <span className="producto__icono" role="img" aria-label={producto.nombre}>
            {producto.icono}
          </span>
        )}
        {descuento > 0 && <span className="producto__badge">-{descuento}%</span>}
        {producto.destacado && <span className="producto__etiqueta">Destacado</span>}
        <span className="producto__lupa" aria-hidden="true">Ver ficha</span>
      </button>

      <div className="producto__cuerpo">
        <span className="producto__categoria">{producto.categoria}</span>
        <h3 className="producto__nombre">{producto.nombre}</h3>
        <p className="producto__descripcion">{producto.descripcion}</p>

        <div className="producto__precio">
          <strong>{formatoPrecio(producto.precio)}</strong>
          {producto.precioAntes && <s>{formatoPrecio(producto.precioAntes)}</s>}
        </div>

        <div className="producto__acciones">
          <button
            type="button"
            className="boton boton--fantasma boton--bloque"
            onClick={() => onVerDetalle(producto)}
          >
            Ver detalles
          </button>
          <a
            className="boton boton--wa boton--bloque"
            href={`https://wa.me/${whatsapp.tel.replace('+', '')}?text=${mensaje}`}
            target="_blank"
            rel="noreferrer"
          >
            Cotizar por WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}

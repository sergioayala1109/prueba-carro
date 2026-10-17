import { useRef, useState } from 'react';
import { rutaPublica } from '../../utils/urls';

// Tope de peso por archivo subido: se guarda como texto dentro de localStorage,
// que tiene un límite chico (~5 MB en total). Mejor rechazar que llenar la cuota.
const MAX_BYTES = 400 * 1024;

function leerComoDataUrl(archivo) {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver(String(lector.result));
    lector.onerror = () => rechazar(new Error('No se pudo leer el archivo.'));
    lector.readAsDataURL(archivo);
  });
}

export default function EditorProducto({ producto, categorias, onGuardar, onCerrar }) {
  const [borrador, setBorrador] = useState(() => ({
    ...producto,
    precio: String(producto.precio ?? ''),
    precioAntes: producto.precioAntes == null ? '' : String(producto.precioAntes),
    detallesTexto: (producto.detalles ?? []).join('\n'),
    imagenes: [...(producto.imagenes ?? [])],
  }));
  const [error, setError] = useState('');
  const archivosRef = useRef({});

  const cambiar = (campo, valor) =>
    setBorrador((previo) => ({ ...previo, [campo]: valor }));

  const cambiarImagen = (indice, valor) =>
    setBorrador((previo) => {
      const imagenes = [...previo.imagenes];
      imagenes[indice] = valor;
      return { ...previo, imagenes };
    });

  const quitarImagen = (indice) =>
    setBorrador((previo) => ({
      ...previo,
      imagenes: previo.imagenes.filter((_, i) => i !== indice),
    }));

  const agregarImagen = () =>
    setBorrador((previo) => ({ ...previo, imagenes: [...previo.imagenes, ''] }));

  const subirArchivo = async (indice, archivo) => {
    if (!archivo) return;
    if (archivo.size > MAX_BYTES) {
      setError(
        `La imagen pesa ${Math.round(archivo.size / 1024)} KB y el máximo es ${MAX_BYTES / 1024} KB. Comprímela o pega una URL en vez de subirla.`,
      );
      return;
    }
    try {
      const dataUrl = await leerComoDataUrl(archivo);
      cambiarImagen(indice, dataUrl);
      setError('');
    } catch {
      setError('No se pudo leer la imagen.');
    }
  };

  const enviar = (evento) => {
    evento.preventDefault();

    const nombre = borrador.nombre.trim();
    if (!nombre) {
      setError('El producto necesita un nombre.');
      return;
    }

    const precio = Number(borrador.precio);
    if (!Number.isFinite(precio) || precio < 0) {
      setError('El precio debe ser un número igual o mayor que 0.');
      return;
    }

    const limpio = {
      id: producto.id,
      nombre,
      categoria: borrador.categoria.trim() || 'Otros',
      precio,
      descripcion: borrador.descripcion.trim(),
      medidas: borrador.medidas.trim(),
      detalles: borrador.detallesTexto
        .split('\n')
        .map((linea) => linea.trim())
        .filter(Boolean),
      imagenes: borrador.imagenes.map((ruta) => ruta.trim()).filter(Boolean),
      icono: borrador.icono.trim() || '🎁',
      destacado: Boolean(borrador.destacado),
    };

    const antes = Number(borrador.precioAntes);
    if (borrador.precioAntes !== '' && Number.isFinite(antes) && antes > precio) {
      limpio.precioAntes = antes;
    }

    onGuardar(limpio);
  };

  const categoriasDisponibles = categorias.filter((c) => c !== 'Todos');

  return (
    <div
      className="editor"
      role="presentation"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) onCerrar();
      }}
    >
      <form className="editor__caja" onSubmit={enviar}>
        <div className="editor__encabezado">
          <h2>{producto.nombre ? `Editar: ${producto.nombre}` : 'Nuevo producto'}</h2>
          <button type="button" className="boton-mini" onClick={onCerrar}>
            Cerrar
          </button>
        </div>

        <div className="editor__cuerpo">
          {error && (
            <p className="admin__aviso admin__aviso--error" role="alert">
              {error}
            </p>
          )}

          <label className="campo">
            <span className="campo__label">Nombre</span>
            <input
              type="text"
              value={borrador.nombre}
              onChange={(e) => cambiar('nombre', e.target.value)}
              required
            />
          </label>

          <div className="campos campos--dos">
            <label className="campo">
              <span className="campo__label">Categoría</span>
              <input
                type="text"
                list="lista-categorias"
                value={borrador.categoria}
                onChange={(e) => cambiar('categoria', e.target.value)}
              />
              <datalist id="lista-categorias">
                {categoriasDisponibles.map((categoria) => (
                  <option key={categoria} value={categoria} />
                ))}
              </datalist>
              <span className="campo__nota">
                Si escribes una nueva, aparece sola en los filtros del catálogo.
              </span>
            </label>

            <label className="campo">
              <span className="campo__label">Medidas</span>
              <input
                type="text"
                value={borrador.medidas}
                onChange={(e) => cambiar('medidas', e.target.value)}
                placeholder="Ej: A5 · 14,8 × 21 cm"
              />
            </label>

            <label className="campo">
              <span className="campo__label">Precio (CLP)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={borrador.precio}
                onChange={(e) => cambiar('precio', e.target.value)}
              />
            </label>

            <label className="campo">
              <span className="campo__label">Precio antes (opcional)</span>
              <input
                type="number"
                min="0"
                step="1"
                value={borrador.precioAntes}
                onChange={(e) => cambiar('precioAntes', e.target.value)}
              />
              <span className="campo__nota">
                Si es mayor que el precio, se muestra tachado con el % de descuento.
              </span>
            </label>

            <label className="campo">
              <span className="campo__label">Ícono (respaldo si falla la foto)</span>
              <input
                type="text"
                value={borrador.icono}
                onChange={(e) => cambiar('icono', e.target.value)}
                placeholder="🎁"
              />
            </label>

            <label className="campo campo--check">
              <input
                type="checkbox"
                checked={Boolean(borrador.destacado)}
                onChange={(e) => cambiar('destacado', e.target.checked)}
              />
              <span>Mostrar en el carrusel de destacados</span>
            </label>
          </div>

          <label className="campo">
            <span className="campo__label">Descripción</span>
            <textarea
              value={borrador.descripcion}
              onChange={(e) => cambiar('descripcion', e.target.value)}
            />
          </label>

          <label className="campo">
            <span className="campo__label">Detalles (uno por línea)</span>
            <textarea
              value={borrador.detallesTexto}
              onChange={(e) => cambiar('detallesTexto', e.target.value)}
              placeholder={'200 hojas bond de 90 g\nEncuadernación artesanal'}
            />
          </label>

          <p className="subtitulo-campo">Fotos</p>
          <p className="campo__nota">
            La <strong>primera</strong> es la portada; las demás forman la galería.
            Puedes pegar una ruta interna (ej. <code>/productos/foto.jpg</code>), un
            enlace de internet, o subir un archivo (máx. {MAX_BYTES / 1024} KB).
          </p>

          <div className="galeria-editor">
            {borrador.imagenes.map((ruta, indice) => (
              <div className="galeria-editor__item" key={`foto-${indice}`}>
                <div className="galeria-editor__foto">
                  {ruta ? (
                    <img src={rutaPublica(ruta)} alt="" />
                  ) : (
                    <span aria-hidden="true">🖼️</span>
                  )}
                </div>

                <div className="galeria-editor__cuerpo">
                  <input
                    type="text"
                    className="campo__entrada-suelta"
                    style={{
                      width: '100%',
                      font: 'inherit',
                      border: '1px solid var(--borde)',
                      borderRadius: 10,
                      padding: '0.5rem 0.7rem',
                    }}
                    value={ruta}
                    onChange={(e) => cambiarImagen(indice, e.target.value)}
                    placeholder="/productos/foto.jpg  o  https://..."
                  />

                  <div className="galeria-editor__herramientas">
                    {indice === 0 && (
                      <span className="galeria-editor__principal">Portada</span>
                    )}
                    <label className="boton-mini galeria-editor__archivo">
                      Subir archivo
                      <input
                        ref={(el) => {
                          archivosRef.current[indice] = el;
                        }}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => subirArchivo(indice, e.target.files?.[0])}
                      />
                    </label>
                    <button
                      type="button"
                      className="boton-mini boton-mini--peligro"
                      onClick={() => quitarImagen(indice)}
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <button type="button" className="boton-mini" onClick={agregarImagen}>
              + Agregar foto
            </button>
          </div>
        </div>

        <div className="editor__pie">
          <button type="button" className="boton boton--fantasma" onClick={onCerrar}>
            Cancelar
          </button>
          <button type="submit" className="boton boton--primario">
            Guardar producto
          </button>
        </div>
      </form>
    </div>
  );
}

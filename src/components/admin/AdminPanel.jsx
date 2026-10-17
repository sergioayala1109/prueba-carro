import { useState } from 'react';
import { nuevoId, useDatos } from '../../store/datos';
import { useAuth } from '../../store/auth';
import { rutaPublica } from '../../utils/urls';
import { formatoPrecio } from '../../data/negocio';
import EditorProducto from './EditorProducto';
import FormNegocio from './FormNegocio';

const PRODUCTO_VACIO = {
  nombre: '',
  categoria: '',
  precio: '',
  descripcion: '',
  medidas: '',
  detalles: [],
  imagenes: [''],
  icono: '🎁',
  destacado: false,
};

export default function AdminPanel() {
  const { usuario, salir } = useAuth();
  const {
    negocio,
    textos,
    productosCrudos,
    categorias,
    guardar,
    guardarProductos,
    restablecer,
    hayCambios,
  } = useDatos();

  const [pestana, setPestana] = useState('productos');
  const [editor, setEditor] = useState(null);
  const [aviso, setAviso] = useState(null);
  // Se incrementa al restablecer para que el formulario del negocio se recree
  // con los valores originales (si no, conservaría el borrador anterior).
  const [versionFormulario, setVersionFormulario] = useState(0);

  const guardarProducto = (producto) => {
    const existe = productosCrudos.some((p) => p.id === producto.id);
    const siguientes = existe
      ? productosCrudos.map((p) => (p.id === producto.id ? producto : p))
      : [...productosCrudos, producto];

    const resultado = guardarProductos(siguientes);
    if (resultado.ok) {
      setEditor(null);
      setAviso({ tipo: 'ok', texto: `Producto "${producto.nombre}" guardado.` });
    } else {
      setAviso({ tipo: 'error', texto: resultado.error });
    }
  };

  const duplicarProducto = (producto) => {
    const copia = {
      ...JSON.parse(JSON.stringify(producto)),
      id: nuevoId(productosCrudos),
      nombre: `${producto.nombre} (copia)`,
      destacado: false,
    };
    const resultado = guardarProductos([...productosCrudos, copia]);
    setAviso(
      resultado.ok
        ? { tipo: 'ok', texto: `Se duplicó "${producto.nombre}".` }
        : { tipo: 'error', texto: resultado.error },
    );
  };

  const eliminarProducto = (producto) => {
    const confirmado = window.confirm(
      `¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmado) return;
    const resultado = guardarProductos(
      productosCrudos.filter((p) => p.id !== producto.id),
    );
    setAviso(
      resultado.ok
        ? { tipo: 'ok', texto: `Se eliminó "${producto.nombre}".` }
        : { tipo: 'error', texto: resultado.error },
    );
  };

  const alternarDestacado = (producto) => {
    const resultado = guardarProductos(
      productosCrudos.map((p) =>
        p.id === producto.id ? { ...p, destacado: !p.destacado } : p,
      ),
    );
    if (!resultado.ok) setAviso({ tipo: 'error', texto: resultado.error });
  };

  // Un solo guardado atómico: si se hicieran dos seguidos, el segundo pisaría
  // al primero con el estado anterior.
  const guardarNegocioYTextos = (nuevoNegocio, nuevosTextos) =>
    guardar({ negocio: nuevoNegocio, textos: nuevosTextos });

  const restablecerTodo = () => {
    const confirmado = window.confirm(
      '¿Descartar todos los cambios y volver a los datos originales?',
    );
    if (!confirmado) return;
    restablecer();
    setVersionFormulario((v) => v + 1);
    setAviso({ tipo: 'ok', texto: 'Datos restablecidos a los originales del sitio.' });
    setEditor(null);
  };

  return (
    <div className="admin">
      <div className="admin__barra">
        <div className="admin__barra-interior">
          <span className="admin__marca">
            <span aria-hidden="true">M</span>
            <span>Panel de Monsant</span>
          </span>
          <div className="admin__barra-acciones">
            <a className="boton-mini" href="#inicio">
              Ver la tienda
            </a>
            <span className="admin__usuario">Sesión: {usuario}</span>
            <button type="button" className="boton-mini" onClick={salir}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div className="admin__contenedor">
        <h1 className="admin__titulo">Administración</h1>
        <p className="admin__subtitulo">
          Edita el catálogo y los datos del negocio. Cada cambio se refleja al
          instante en la tienda de tu navegador.
        </p>

        <div className="admin__aviso">
          <strong>Demo sin seguridad real.</strong> El usuario y la contraseña
          viajan en el código público del sitio (cualquiera puede leerlos) y los
          cambios se guardan <strong>solo en este navegador</strong>: no los ven
          los visitantes ni quedan en GitHub. Para que esto fuera de verdad haría
          falta un servicio con backend (Supabase, Firebase, etc.).
        </div>

        {aviso && (
          <p
            className={
              'admin__aviso' +
              (aviso.tipo === 'error' ? ' admin__aviso--error' : ' admin__aviso--ok')
            }
            role="status"
          >
            {aviso.texto}
          </p>
        )}

        <div className="admin__pestanas">
          <button
            type="button"
            className={
              'admin__pestana' + (pestana === 'productos' ? ' admin__pestana--activa' : '')
            }
            onClick={() => setPestana('productos')}
          >
            Productos ({productosCrudos.length})
          </button>
          <button
            type="button"
            className={
              'admin__pestana' + (pestana === 'negocio' ? ' admin__pestana--activa' : '')
            }
            onClick={() => setPestana('negocio')}
          >
            Datos y textos
          </button>
          <button
            type="button"
            className="admin__pestana"
            onClick={restablecerTodo}
            disabled={!hayCambios}
            title={hayCambios ? '' : 'No hay cambios que descartar'}
            style={{ marginLeft: 'auto', opacity: hayCambios ? 1 : 0.5 }}
          >
            Restablecer originales
          </button>
        </div>

        {pestana === 'productos' && (
          <div className="panel">
            <div className="admin__seccion-encabezado">
              <h2>Catálogo</h2>
              <button
                type="button"
                className="boton boton--primario"
                onClick={() =>
                  setEditor({ ...PRODUCTO_VACIO, id: nuevoId(productosCrudos) })
                }
              >
                + Agregar producto
              </button>
            </div>

            {productosCrudos.length === 0 ? (
              <p className="campo__nota">
                No hay productos. Agrega el primero con el botón de arriba.
              </p>
            ) : (
              <ul className="lista-productos">
                {productosCrudos.map((producto) => (
                  <li className="producto-fila" key={producto.id}>
                    <span className="producto-fila__foto">
                      {producto.imagenes?.[0] ? (
                        <img src={rutaPublica(producto.imagenes[0])} alt="" />
                      ) : (
                        <span aria-hidden="true">{producto.icono}</span>
                      )}
                    </span>

                    <span className="producto-fila__datos">
                      <p className="producto-fila__nombre">{producto.nombre}</p>
                      <p className="producto-fila__meta">
                        <span>{producto.categoria}</span>
                        <span>·</span>
                        <span>{formatoPrecio(producto.precio)}</span>
                        <span>·</span>
                        <span>
                          {(producto.imagenes ?? []).length} foto
                          {(producto.imagenes ?? []).length === 1 ? '' : 's'}
                        </span>
                        {producto.destacado && (
                          <span className="etiqueta-destacado">Destacado</span>
                        )}
                      </p>
                    </span>

                    <span className="producto-fila__acciones">
                      <button
                        type="button"
                        className="boton-mini"
                        onClick={() => setEditor({ ...producto })}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="boton-mini"
                        onClick={() => alternarDestacado(producto)}
                      >
                        {producto.destacado ? 'Quitar destacado' : 'Destacar'}
                      </button>
                      <button
                        type="button"
                        className="boton-mini"
                        onClick={() => duplicarProducto(producto)}
                      >
                        Duplicar
                      </button>
                      <button
                        type="button"
                        className="boton-mini boton-mini--peligro"
                        onClick={() => eliminarProducto(producto)}
                      >
                        Eliminar
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {pestana === 'negocio' && (
          <FormNegocio
            key={versionFormulario}
            negocio={negocio}
            textos={textos}
            onGuardar={guardarNegocioYTextos}
          />
        )}
      </div>

      {editor && (
        <EditorProducto
          producto={editor}
          categorias={categorias}
          onGuardar={guardarProducto}
          onCerrar={() => setEditor(null)}
        />
      )}
    </div>
  );
}

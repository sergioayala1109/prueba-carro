import { useState } from 'react';
import { nuevoId, useDatos } from '../../store/datos';
import { useAuth } from '../../store/auth';
import { rutaPublica } from '../../utils/urls';
import { formatoPrecio } from '../../data/negocio';
import { avisoError, avisoExito, confirmarAccion } from '../../utils/alertas';
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

// Cuántos productos por página en la lista de administración.
const POR_PAGINA_PREDETERMINADO = 10;
const OPCIONES_POR_PAGINA = [10, 20, 50];

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
  // Se incrementa al restablecer para que el formulario del negocio se recree
  // con los valores originales (si no, conservaría el borrador anterior).
  const [versionFormulario, setVersionFormulario] = useState(0);

  // --- Filtros de la lista de productos ---
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroDestacado, setFiltroDestacado] = useState('todos');

  // --- Paginación (10 por defecto) ---
  const [porPagina, setPorPagina] = useState(POR_PAGINA_PREDETERMINADO);
  const [pagina, setPagina] = useState(1);

  // Si la categoría elegida ya no existe (ej. se borró el último producto),
  // el filtro se comporta como "Todas".
  const categoriaFiltro = categorias.includes(filtroCategoria)
    ? filtroCategoria
    : 'Todos';

  const coincide = (producto) => {
    if (categoriaFiltro !== 'Todos' && producto.categoria !== categoriaFiltro) {
      return false;
    }
    if (filtroDestacado === 'destacados' && !producto.destacado) return false;
    if (filtroDestacado === 'sin-destacar' && producto.destacado) return false;

    const texto = busqueda.trim().toLowerCase();
    if (!texto) return true;
    return [
      producto.nombre,
      producto.categoria,
      producto.medidas,
      producto.descripcion,
    ].some((valor) => String(valor ?? '').toLowerCase().includes(texto));
  };

  const productosFiltrados = productosCrudos.filter(coincide);

  const hayFiltros =
    busqueda.trim() !== '' || categoriaFiltro !== 'Todos' || filtroDestacado !== 'todos';

  const limpiarFiltros = () => {
    setBusqueda('');
    setFiltroCategoria('Todos');
    setFiltroDestacado('todos');
    setPagina(1);
  };

  // --- Paginación (independiente de los filtros) ---
  const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / porPagina));
  // Se recorta aquí mismo y no con un setState: si se borran filas o cambian
  // los filtros, la página pedida puede dejar de existir.
  const paginaActual = Math.min(Math.max(pagina, 1), totalPaginas);
  const desde = (paginaActual - 1) * porPagina;
  const productosPagina = productosFiltrados.slice(desde, desde + porPagina);

  // Dónde queda un producto recién creado o duplicado (siempre al final).
  const paginaFinalDe = (totalElementos) =>
    Math.max(1, Math.ceil(totalElementos / porPagina));

  // Números a mostrar: todas si son pocas páginas, si no el primero, el
  // último y las vecinas de la actual, con "…" en los saltos.
  const botonesPagina = (() => {
    const vecinas = [paginaActual - 1, paginaActual, paginaActual + 1].filter(
      (n) => n > 1 && n < totalPaginas,
    );
    const marcas = [...new Set([1, ...vecinas, totalPaginas])].sort(
      (a, b) => a - b,
    );
    if (totalPaginas <= 7) return marcas;
    const salida = [];
    marcas.forEach((n, indice) => {
      if (indice > 0 && n - marcas[indice - 1] > 1) salida.push('…');
      salida.push(n);
    });
    return salida;
  })();

  const guardarProducto = (producto) => {
    const existe = productosCrudos.some((p) => p.id === producto.id);
    const siguientes = existe
      ? productosCrudos.map((p) => (p.id === producto.id ? producto : p))
      : [...productosCrudos, producto];

    const resultado = guardarProductos(siguientes);
    if (resultado.ok) {
      setEditor(null);
      // Si el producto guardado no pasa los filtros activos, se limpian para
      // que no parezca que el cambio no se guardó.
      const oculto = hayFiltros && !coincide(producto);
      if (oculto) limpiarFiltros();
      // Un producto nuevo se agrega al final del catálogo: si hay varias
      // páginas, saltamos a la última para que se vea recién guardado.
      if (!existe) {
        const totalFinal = oculto
          ? siguientes.length
          : productosFiltrados.length + (coincide(producto) ? 1 : 0);
        setPagina(paginaFinalDe(totalFinal));
      }
      avisoExito(
        `Producto "${producto.nombre}" guardado.${oculto ? ' Se limpiaron los filtros para mostrarlo.' : ''}`,
      );
    } else {
      avisoError(resultado.error, 'No se pudo guardar el producto');
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
    if (resultado.ok) {
      // La copia queda al final: mostramos la última página.
      const totalFinal =
        coincide(copia) ? productosFiltrados.length + 1 : productosFiltrados.length;
      setPagina(paginaFinalDe(totalFinal));
      avisoExito(`Se duplicó "${producto.nombre}".`);
    } else {
      avisoError(resultado.error, 'No se pudo duplicar el producto');
    }
  };

  const eliminarProducto = async (producto) => {
    const confirmado = await confirmarAccion({
      titulo: `¿Eliminar "${producto.nombre}"?`,
      texto: 'Esta acción no se puede deshacer.',
      confirmar: 'Sí, eliminar',
      advertencia: true,
    });
    if (!confirmado) return;
    const resultado = guardarProductos(
      productosCrudos.filter((p) => p.id !== producto.id),
    );
    if (resultado.ok) {
      avisoExito(`Se eliminó "${producto.nombre}".`);
    } else {
      avisoError(resultado.error, 'No se pudo eliminar el producto');
    }
  };

  const alternarDestacado = (producto) => {
    const resultado = guardarProductos(
      productosCrudos.map((p) =>
        p.id === producto.id ? { ...p, destacado: !p.destacado } : p,
      ),
    );
    if (!resultado.ok) avisoError(resultado.error);
  };

  // Un solo guardado atómico: si se hicieran dos seguidos, el segundo pisaría
  // al primero con el estado anterior.
  const guardarNegocioYTextos = (nuevoNegocio, nuevosTextos) =>
    guardar({ negocio: nuevoNegocio, textos: nuevosTextos });

  const restablecerTodo = async () => {
    const confirmado = await confirmarAccion({
      titulo: '¿Restablecer los datos originales?',
      texto: 'Se descartan todos los cambios hechos en el catálogo, los datos del negocio y los textos.',
      confirmar: 'Sí, restablecer',
      advertencia: true,
    });
    if (!confirmado) return;
    restablecer();
    setVersionFormulario((v) => v + 1);
    setEditor(null);
    avisoExito('Datos restablecidos a los originales del sitio.');
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
              <>
                <div className="panel__filtros">
                  <label className="campo panel__filtros-buscar">
                    <span className="campo__label">Buscar</span>
                    <input
                      type="search"
                      value={busqueda}
                      placeholder="Nombre, categoría, medidas…"
                      onChange={(evento) => {
                        setBusqueda(evento.target.value);
                        setPagina(1);
                      }}
                    />
                  </label>

                  <label className="campo">
                    <span className="campo__label">Categoría</span>
                    <select
                      value={categoriaFiltro}
                      onChange={(evento) => {
                        setFiltroCategoria(evento.target.value);
                        setPagina(1);
                      }}
                    >
                      <option value="Todos">Todas</option>
                      {categorias
                        .filter((categoria) => categoria !== 'Todos')
                        .map((categoria) => (
                          <option key={categoria} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                    </select>
                  </label>

                  <label className="campo">
                    <span className="campo__label">Destacados</span>
                    <select
                      value={filtroDestacado}
                      onChange={(evento) => {
                        setFiltroDestacado(evento.target.value);
                        setPagina(1);
                      }}
                    >
                      <option value="todos">Todos</option>
                      <option value="destacados">Solo destacados</option>
                      <option value="sin-destacar">Sin destacar</option>
                    </select>
                  </label>

                  <p className="panel__filtros-contador">
                    <span>
                      {hayFiltros
                        ? `Mostrando ${productosFiltrados.length} de ${productosCrudos.length}`
                        : `${productosCrudos.length} productos`}
                    </span>
                    {hayFiltros && (
                      <button
                        type="button"
                        className="boton-mini"
                        onClick={limpiarFiltros}
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </p>
                </div>

                {productosFiltrados.length === 0 ? (
                  <p className="campo__nota">
                    Ningún producto coincide con la búsqueda o los filtros.{' '}
                    <button
                      type="button"
                      className="boton-mini"
                      onClick={limpiarFiltros}
                    >
                      Limpiar filtros
                    </button>
                  </p>
                ) : (
                  <ul className="lista-productos">
                    {productosPagina.map((producto) => (
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

                {productosFiltrados.length > 0 && (
                  <nav className="panel__paginacion" aria-label="Paginación del catálogo">
                    {totalPaginas > 1 && (
                      <>
                      <button
                        type="button"
                        className="boton-mini"
                        disabled={paginaActual === 1}
                        onClick={() => setPagina(paginaActual - 1)}
                      >
                        ← Anterior
                      </button>

                      <ul className="panel__paginacion__numeros">
                        {botonesPagina.map((numero, indice) =>
                          numero === '…' ? (
                            <li
                              key={`hueco-${indice}`}
                              className="panel__paginacion__hueco"
                              aria-hidden="true"
                            >
                              …
                            </li>
                          ) : (
                            <li key={numero}>
                              <button
                                type="button"
                                className={
                                  numero === paginaActual
                                    ? 'boton-mini boton-mini--activo'
                                    : 'boton-mini'
                                }
                                aria-current={
                                  numero === paginaActual ? 'page' : undefined
                                }
                                onClick={() => setPagina(numero)}
                              >
                                {numero}
                              </button>
                            </li>
                          ),
                        )}
                      </ul>

                      <button
                        type="button"
                        className="boton-mini"
                        disabled={paginaActual === totalPaginas}
                        onClick={() => setPagina(paginaActual + 1)}
                      >
                        Siguiente →
                      </button>
                      </>
                    )}

                    <span className="panel__paginacion__rango">
                      {desde + 1}–{desde + productosPagina.length} de{' '}
                      {productosFiltrados.length}
                    </span>

                    <label className="panel__paginacion__por">
                      <span>Por página</span>
                      <select
                        value={porPagina}
                        onChange={(evento) => {
                          setPorPagina(Number(evento.target.value));
                          setPagina(1);
                        }}
                      >
                        {OPCIONES_POR_PAGINA.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                  </nav>
                )}
              </>
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

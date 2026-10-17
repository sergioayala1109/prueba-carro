import { useMemo, useState } from 'react';
import { useDatos } from '../store/datos';
import ProductoCard from './ProductoCard';

export default function Catalogo({ onVerDetalle }) {
  const { categorias, productos } = useDatos();
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  // Si la categoría activa desaparece (porque se editaron productos), volvemos a "Todos".
  const categoriaEfectiva = categorias.includes(categoriaActiva)
    ? categoriaActiva
    : 'Todos';

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return productos.filter((producto) => {
      const coincideCategoria =
        categoriaEfectiva === 'Todos' || producto.categoria === categoriaEfectiva;
      const nombre = (producto.nombre ?? '').toLowerCase();
      const descripcion = (producto.descripcion ?? '').toLowerCase();
      const coincideBusqueda =
        texto === '' || nombre.includes(texto) || descripcion.includes(texto);
      return coincideCategoria && coincideBusqueda;
    });
  }, [categoriaEfectiva, busqueda, productos]);

  return (
    <section className="catalogo" id="catalogo">
      <div className="contenedor">
        <div className="seccion__encabezado">
          <p className="seccion__etiqueta">Catálogo</p>
          <h2>Nuestros productos</h2>
          <p className="seccion__descripcion">
            Precios de referencia por pieza. Todo se puede personalizar: colores,
            nombres, frases y tamaño.
          </p>
        </div>

        <div className="catalogo__controles">
          <div className="filtros" role="tablist" aria-label="Filtrar por categoría">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                type="button"
                role="tab"
                aria-selected={categoriaEfectiva === categoria}
                className={
                  'filtro' + (categoriaEfectiva === categoria ? ' filtro--activo' : '')
                }
                onClick={() => setCategoriaActiva(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>

          <label className="buscador">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
            />
          </label>
        </div>

        {productosFiltrados.length > 0 ? (
          <div className="grid-productos">
            {productosFiltrados.map((producto) => (
              <ProductoCard
                key={producto.id}
                producto={producto}
                onVerDetalle={onVerDetalle}
              />
            ))}
          </div>
        ) : (
          <p className="catalogo__vacio">
            No encontramos productos con esos filtros. Prueba con otra búsqueda.
          </p>
        )}
      </div>
    </section>
  );
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { negocio as negocioBase } from '../data/negocio';
import { categorias as categoriasBase, productos as productosBase } from '../data/productos';
import { textos as textosBase } from '../data/textos';
import { rutaPublica } from '../utils/urls';

// La administración guarda aquí sus cambios. Ojo: es una demo, así que los
// cambios viven SOLO en este navegador (localStorage), no en el sitio público.
const CLAVE = 'monsant:datos';
const VERSION = 1;

const DatosContext = createContext(null);

const clonar = (valor) => JSON.parse(JSON.stringify(valor));

function valoresPorDefecto() {
  return {
    negocio: clonar(negocioBase),
    productos: clonar(productosBase),
    textos: clonar(textosBase),
  };
}

function leerEstadoInicial() {
  const porDefecto = valoresPorDefecto();
  if (typeof window === 'undefined') return porDefecto;

  try {
    const bruto = window.localStorage.getItem(CLAVE);
    if (!bruto) return porDefecto;
    const guardado = JSON.parse(bruto);
    if (!guardado || guardado.version !== VERSION) return porDefecto;
    return {
      negocio: guardado.negocio ?? porDefecto.negocio,
      productos: guardado.productos ?? porDefecto.productos,
      textos: guardado.textos ?? porDefecto.textos,
    };
  } catch {
    return porDefecto;
  }
}

const MENSAJE_ERROR_GUARDADO =
  'No se pudieron guardar los cambios: el almacenamiento del navegador está lleno o bloqueado. Si subiste fotos, prueba con archivos más livianos o pega una URL en vez de subir el archivo.';

export function DatosProvider({ children }) {
  const [datos, setDatos] = useState(leerEstadoInicial);

  // Copia siempre actualizada del estado: permite encadenar varios guardados en
  // el mismo clic sin que el segundo pise al primero con datos viejos.
  const datosRef = useRef(datos);
  useEffect(() => {
    datosRef.current = datos;
  }, [datos]);

  const actualizar = useCallback((parcial) => {
    const siguiente = { ...datosRef.current, ...parcial };
    try {
      window.localStorage.setItem(
        CLAVE,
        JSON.stringify({ version: VERSION, ...siguiente }),
      );
    } catch {
      return { ok: false, error: MENSAJE_ERROR_GUARDADO };
    }
    datosRef.current = siguiente;
    setDatos(siguiente);
    return { ok: true };
  }, []);

  const guardarProductos = useCallback(
    (productos) => actualizar({ productos }),
    [actualizar],
  );

  const guardarNegocio = useCallback(
    (negocio) => actualizar({ negocio }),
    [actualizar],
  );

  const guardarTextos = useCallback(
    (textos) => actualizar({ textos }),
    [actualizar],
  );

  const restablecer = useCallback(() => {
    try {
      window.localStorage.removeItem(CLAVE);
    } catch {
      // Si no se puede borrar, igual restauramos el estado en memoria.
    }
    const porDefecto = valoresPorDefecto();
    datosRef.current = porDefecto;
    setDatos(porDefecto);
  }, []);

  // Productos listos para mostrar: se les aplica la ruta base del despliegue.
  const productosPublicos = useMemo(
    () =>
      datos.productos.map((producto) => ({
        ...producto,
        imagenes: (producto.imagenes ?? []).map(rutaPublica),
      })),
    [datos.productos],
  );

  // Categorías para los filtros: las de siempre (si tienen productos) + las nuevas.
  const categorias = useMemo(() => {
    const usadas = new Set(
      datos.productos.map((producto) => producto.categoria).filter(Boolean),
    );
    const base = categoriasBase.filter(
      (categoria) => categoria !== 'Todos' && usadas.has(categoria),
    );
    const extra = [...usadas].filter((categoria) => !base.includes(categoria));
    return ['Todos', ...base, ...extra];
  }, [datos.productos]);

  const hayCambios = useMemo(
    () => JSON.stringify(datos) !== JSON.stringify(valoresPorDefecto()),
    [datos],
  );

  const valor = useMemo(
    () => ({
      negocio: datos.negocio,
      textos: datos.textos,
      // `productos` ya trae la ruta base aplicada (para mostrar);
      // `productosCrudos` guarda las rutas tal cual se editan.
      productos: productosPublicos,
      productosCrudos: datos.productos,
      categorias,
      hayCambios,
      guardar: actualizar,
      guardarProductos,
      guardarNegocio,
      guardarTextos,
      restablecer,
    }),
    [
      datos.negocio,
      datos.textos,
      productosPublicos,
      datos.productos,
      categorias,
      hayCambios,
      actualizar,
      guardarProductos,
      guardarNegocio,
      guardarTextos,
      restablecer,
    ],
  );

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}

export function useDatos() {
  const contexto = useContext(DatosContext);
  if (!contexto) {
    throw new Error('useDatos() debe usarse dentro de <DatosProvider>.');
  }
  return contexto;
}

/** Devuelve un id nuevo que no choque con los existentes. */
export function nuevoId(productos) {
  return productos.reduce((maximo, p) => Math.max(maximo, Number(p.id) || 0), 0) + 1;
}

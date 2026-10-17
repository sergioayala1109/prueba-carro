import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Destacados from './components/Destacados';
import Beneficios from './components/Beneficios';
import Catalogo from './components/Catalogo';
import Footer from './components/Footer';
import ProductoModal from './components/ProductoModal';
import Admin from './components/admin/Admin';
import { useDatos } from './store/datos';
import { esRutaAdmin, useHash } from './hooks/useHash';
import './App.css';

export default function App() {
  const [productoActivo, setProductoActivo] = useState(null);
  const { textos } = useDatos();
  const hash = useHash();

  // La pantalla de administración reemplaza a la vitrina (ruta "#/admin").
  if (esRutaAdmin(hash)) {
    return <Admin />;
  }

  const { nosotros } = textos;

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Destacados onVerDetalle={setProductoActivo} />
        <Beneficios />
        <Catalogo onVerDetalle={setProductoActivo} />
        <section className="nosotros" id="nosotros">
          <div className="contenedor nosotros__interior">
            <div className="nosotros__texto">
              <p className="seccion__etiqueta">{nosotros.etiqueta}</p>
              <h2>{nosotros.titulo}</h2>
              {nosotros.parrafos.map((parrafo, indice) => (
                <p key={indice}>{parrafo}</p>
              ))}
            </div>
            <div className="nosotros__datos">
              {nosotros.metricas.map((metrica, indice) => (
                <div className="dato" key={indice}>
                  <strong>{metrica.valor}</strong>
                  <span>{metrica.etiqueta}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {productoActivo && (
        <ProductoModal
          producto={productoActivo}
          onCerrar={() => setProductoActivo(null)}
        />
      )}
    </>
  );
}

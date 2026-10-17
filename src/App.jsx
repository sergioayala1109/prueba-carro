import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Destacados from './components/Destacados';
import Beneficios from './components/Beneficios';
import Catalogo from './components/Catalogo';
import Footer from './components/Footer';
import ProductoModal from './components/ProductoModal';
import './App.css';

export default function App() {
  const [productoActivo, setProductoActivo] = useState(null);

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
              <p className="seccion__etiqueta">Sobre el estudio</p>
              <h2>Personalizamos cada detalle</h2>
              <p>
                Monsant es un estudio creativo pequeño que diseña papelería,
                impresos y regalos personalizados. Trabajamos con papel de buena
                calidad, acabados cuidados y mucha atención al detalle.
              </p>
              <p>
                Soy Monse: cuéntame qué necesitas y te envío una propuesta con
                muestra digital antes de imprimir. Ideal para marcas, eventos,
                bodas y regalos con significado.
              </p>
            </div>
            <div className="nosotros__datos">
              <div className="dato">
                <strong>+2,500</strong>
                <span>pedidos entregados</span>
              </div>
              <div className="dato">
                <strong>4.9★</strong>
                <span>valoración de clientes</span>
              </div>
              <div className="dato">
                <strong>3-5</strong>
                <span>días de entrega</span>
              </div>
              <div className="dato">
                <strong>100%</strong>
                <span>personalizable</span>
              </div>
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

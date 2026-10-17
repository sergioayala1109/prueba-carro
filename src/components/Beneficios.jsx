import { negocio } from '../data/negocio';

const instagram = negocio.redes.find((r) => r.nombre === 'Instagram');

function Icono({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const beneficios = [
  {
    titulo: 'Hecho con amor',
    texto: 'Preparamos cada pedido con dedicación y mucho cuidado.',
    icono: (
      <Icono>
        <path d="M12 20.5S4 15.6 4 9.9A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 8 2.5c0 5.7-8 10.6-8 10.6Z" />
      </Icono>
    ),
  },
  {
    titulo: 'Diseños únicos',
    texto: 'Cada producto es exclusivo y personalizado para ti.',
    icono: (
      <Icono>
        <path d="M12 3.5l1.7 4.9 4.9 1.7-4.9 1.7L12 16.7l-1.7-4.9L5.4 10.1l4.9-1.7z" />
        <path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
      </Icono>
    ),
  },
  {
    titulo: 'Envíos a todo Chile',
    texto: 'Despachamos en Constitución, la región y todo el país.',
    icono: (
      <Icono>
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h3.5l3.5 3.5V16h-7z" />
        <circle cx="7" cy="17.5" r="1.7" />
        <circle cx="17.5" cy="17.5" r="1.7" />
      </Icono>
    ),
  },
  {
    titulo: 'Taller en Constitución',
    texto: 'Visítanos en Cruz 395 o coordina tu pedido por WhatsApp.',
    icono: (
      <Icono>
        <path d="M4 9.5 5 5h14l1 4.5" />
        <path d="M5 9.5V19h14V9.5" />
        <path d="M9.5 19v-5h5v5" />
      </Icono>
    ),
  },
  {
    titulo: '¿Cuál elegir?',
    texto: (
      <>
        Escríbenos por Instagram{' '}
        <a
          className="beneficio__enlace"
          href={instagram.url}
          target="_blank"
          rel="noreferrer"
        >
          {instagram.usuario}
        </a>{' '}
        y te ayudamos.
      </>
    ),
    icono: (
      <Icono>
        <path d="M4.5 5.5h15v10h-9.5L4.5 20z" />
        <path d="M8.5 9h7M8.5 12h4.5" />
      </Icono>
    ),
  },
];

export default function Beneficios() {
  return (
    <section className="beneficios" aria-label="Por qué elegir Monsant">
      <div className="contenedor">
        <ul className="beneficios__grid">
          {beneficios.map((beneficio) => (
            <li className="beneficio" key={beneficio.titulo}>
              <span className="beneficio__icono">{beneficio.icono}</span>
              <h3 className="beneficio__titulo">{beneficio.titulo}</h3>
              <p className="beneficio__texto">{beneficio.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Datos del negocio.
// Edita estos valores para que coincidan con la tienda real.
export const negocio = {
  nombre: 'Monsant',
  eslogan: 'Estudio creativo',
  mision:
    'En Monsant creamos papelería y regalos personalizados que te ayudan a organizar tu tiempo y a regalar con significado. Cada pieza está hecha a mano, con calidez y cuidado por los detalles, desde Constitución para todo Chile.',
  direccion: {
    calle: 'Cruz 395',
    comuna: 'Constitución',
    ciudad: 'Maule',
    pais: 'Chile',
  },
  telefonos: [
    {
      etiqueta: 'WhatsApp y fijo',
      numero: '+56 9 8453 6000',
      tel: '+56984536000',
      whatsapp: true,
    },
  ],
  correo: 'hola@monsant.cl',
  redes: [
    {
      nombre: 'Instagram',
      usuario: '@monsantestudiocreativo',
      url: 'https://www.instagram.com/monsantestudiocreativo',
    },
    {
      nombre: 'Facebook',
      usuario: '/monsantestudiocreativo',
      url: 'https://www.facebook.com/monsantestudiocreativo',
    },
  ],
  informacion: [
    { etiqueta: 'Tienda física', mapa: true },
    {
      etiqueta: 'Plazos de despacho',
      consulta: 'Hola, quisiera saber los plazos de despacho.',
    },
    {
      etiqueta: 'Condiciones de despacho',
      consulta: 'Hola, ¿cuáles son las condiciones de despacho?',
    },
    {
      etiqueta: 'Cambios y devoluciones',
      consulta: 'Hola, ¿cómo funcionan los cambios y devoluciones?',
    },
  ],
  horario: [
    { dias: 'Lunes a viernes', horas: '10:00 - 19:00' },
    { dias: 'Sábado', horas: '10:00 - 14:00' },
    { dias: 'Domingo', horas: 'Cerrado' },
  ],
};

export const moneda = 'CLP';

export function formatoPrecio(valor) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);
}

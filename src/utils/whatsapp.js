/**
 * Devuelve el teléfono que se usa para los enlaces de WhatsApp.
 * Si la administradora borró el marcado como WhatsApp, cae al primero.
 */
export function telefonoWhatsApp(negocio) {
  return (
    negocio.telefonos?.find((telefono) => telefono.whatsapp) ??
    negocio.telefonos?.[0] ??
    null
  );
}

/**
 * Construye un enlace de wa.me, con un mensaje opcional ya escrito.
 * Devuelve null si no hay ningún teléfono configurado, para que quien lo use
 * pueda simplemente no mostrar el botón.
 */
export function enlaceWhatsApp(negocio, mensaje) {
  const telefono = telefonoWhatsApp(negocio);
  const digitos = String(telefono?.tel ?? '').replace(/\D/g, '');
  if (!digitos) return null;

  const base = `https://wa.me/${digitos}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

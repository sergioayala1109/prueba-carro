import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Avisos del panel de administración con SweetAlert2.
// Los colores salen de las variables de la vitrina (--rosa, --borde…) para que
// las ventanas se vean parte del mismo sitio.

const BOTON = {
  confirmButtonColor: 'var(--rosa)',
  cancelButtonColor: 'var(--borde)',
};

/**
 * Pregunta antes de ejecutar una acción. Resuelve `true` solo si la persona
 * confirma; si cancela o cierra la ventana, resuelve `false`.
 */
export function confirmarAccion({
  titulo,
  texto,
  confirmar = 'Sí, continuar',
  cancelar = 'Cancelar',
  advertencia = false,
}) {
  return Swal.fire({
    ...BOTON,
    icon: advertencia ? 'warning' : 'question',
    title: titulo,
    text: texto,
    showCancelButton: true,
    confirmButtonText: confirmar,
    cancelButtonText: cancelar,
    reverseButtons: true,
    focusCancel: true,
  }).then((respuesta) => Boolean(respuesta.isConfirmed));
}

/** Aviso breve de éxito, en la esquina, que se cierra solo. */
export function avisoExito(texto) {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon: 'success',
    text: texto,
    showConfirmButton: false,
    timer: 2600,
    timerProgressBar: true,
  });
}

/** Error que se queda en pantalla hasta que se cierre. */
export function avisoError(texto, titulo = 'No se pudo completar') {
  return Swal.fire({
    ...BOTON,
    icon: 'error',
    title: titulo,
    text: texto,
    confirmButtonText: 'Entendido',
  });
}

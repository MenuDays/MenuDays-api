/**
 * Horas que un pedido concluido (entregado / rechazado / cancelado)
 * sigue apareciendo en los listados antes de ocultarse solo.
 *
 * La "autoeliminación" no borra nada de la base: es un filtro que se
 * aplica al leer (ver OrderService.buildVisibilityWhere), así que
 * funciona aunque el usuario no abra la app durante ese tiempo y los
 * datos del pedido se conservan para reseñas, auditoría e integridad.
 *
 * Para cambiar el plazo, editar sólo este valor.
 */
export const ORDER_AUTO_HIDE_HOURS = 24;

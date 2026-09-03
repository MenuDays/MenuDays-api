export function formatHour(date: Date | null): string | null {
  if (!date) {
    return null;
  }

  return date.toISOString().substring(11, 16);
}

/**
 * Inverso de formatHour: toma una hora de pared "HH:mm" y devuelve un
 * Date sobre la época (1970-01-01) cuyos componentes UTC son esa hora.
 *
 * Las columnas restaurante_horarios.hora_apertura / hora_cierre son TIME
 * sin timezone, y tanto formatHour() como restaurant-status.util.ts las
 * leen con getUTC*(). Guardar con el sufijo "Z" (UTC explícito) hace que
 * el round-trip sea exacto sin importar el huso horario del proceso que
 * corre la API.
 *
 * Devuelve null si el valor viene vacío o con un formato inesperado
 * (no rompe: el día simplemente queda sin esa hora).
 */
export function parseHour(hour: string | null | undefined): Date | null {
  if (!hour || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(hour)) {
    return null;
  }

  return new Date(`1970-01-01T${hour}:00.000Z`);
}

const ECUADOR_TIME_ZONE = 'America/Guayaquil';

const WEEKDAY_TO_DIA_SEMANA: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

type EstadoOperativo = 'abierto' | 'cerrado' | 'cerrado_temporal' | 'vacaciones';

interface HorarioLike {
  dia_semana: number;
  hora_apertura: Date | null;
  hora_cierre: Date | null;
  cerrado: boolean;
}

/**
 * Hora "de pared" en Ecuador (UTC-5, sin horario de verano),
 * calculada de forma explícita para no depender del huso horario
 * del proceso/servidor donde corre la API.
 */
function getEcuadorNow(referenceDate: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ECUADOR_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(referenceDate);

  const weekdayShort = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon';
  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');

  return {
    diaSemana: WEEKDAY_TO_DIA_SEMANA[weekdayShort] ?? 1,
    minutosDelDia: hour * 60 + minute,
  };
}

// restaurante_horarios.hora_apertura/hora_cierre son columnas TIME (sin
// timezone). Prisma las devuelve como Date en fecha época 1970-01-01,
// con los dígitos HH:mm tal como se guardaron, leídos vía getUTC*
// (mismo criterio que ya usa formatHour.util.ts para mostrarlas).
function horaToMinutos(hora: Date | null): number | null {
  if (!hora) return null;
  return hora.getUTCHours() * 60 + hora.getUTCMinutes();
}

/**
 * Calcula si un restaurante está abierto ahora mismo, en base a su
 * horario semanal (restaurante_horarios) y la hora actual en Ecuador.
 *
 * Si el estado guardado es un override manual ("cerrado_temporal" o
 * "vacaciones"), se respeta tal cual y no se recalcula.
 */
export function computeEstadoOperativo(
  rawEstado: EstadoOperativo,
  horarios: HorarioLike[],
  referenceDate: Date = new Date(),
): EstadoOperativo {
  if (rawEstado === 'cerrado_temporal' || rawEstado === 'vacaciones') {
    return rawEstado;
  }

  const { diaSemana, minutosDelDia } = getEcuadorNow(referenceDate);
  const horarioHoy = horarios.find((h) => h.dia_semana === diaSemana);

  if (!horarioHoy || horarioHoy.cerrado) {
    return 'cerrado';
  }

  const apertura = horaToMinutos(horarioHoy.hora_apertura);
  const cierre = horaToMinutos(horarioHoy.hora_cierre);

  if (apertura === null || cierre === null || apertura === cierre) {
    return 'cerrado';
  }

  // Rango normal dentro del mismo día (ej: 09:00 - 22:00).
  if (cierre > apertura) {
    return minutosDelDia >= apertura && minutosDelDia < cierre
      ? 'abierto'
      : 'cerrado';
  }

  // Rango que cruza la medianoche (ej: 22:00 - 02:00).
  return minutosDelDia >= apertura || minutosDelDia < cierre
    ? 'abierto'
    : 'cerrado';
}

/**
 * Fecha "de hoy" (sin hora) según el calendario de Ecuador, como
 * Date en medianoche UTC. Se usa para comparar contra columnas
 * @db.Date (fecha_inicio/fecha_fin de menús y promociones), que no
 * tienen huso horario propio: comparar contra un `new Date()` crudo
 * hace que la vigencia se corte varias horas antes/después según el
 * huso horario del servidor, en vez de seguir el día calendario real
 * del comensal en Ecuador.
 */
export function getEcuadorTodayDateOnly(referenceDate: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ECUADOR_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(referenceDate);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
}

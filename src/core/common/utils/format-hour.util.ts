export function formatHour(date: Date | null): string | null {
  if (!date) {
    return null;
  }

  return date.toISOString().substring(11, 16);
}
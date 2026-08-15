export function localDate(date = new Date()): string {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function addDays(dateText: string, days: number): string {
  const date = new Date(`${dateText}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDate(date);
}

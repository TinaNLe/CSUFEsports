// Notion dates come back as "YYYY-MM-DD" (optionally with a time/offset
// suffix, e.g. from a database date property). Parsing that string with
// `new Date(...)` treats it as UTC midnight, which can shift a day in local
// timezones west of UTC. Pulling the y/m/d out directly and building the
// Date from local components keeps the displayed calendar date exactly what
// was stored, regardless of the viewer's timezone.
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso + 'T00:00:00');
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isThisWeek(iso: string): boolean {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  const d = new Date(iso + 'T00:00:00');
  return d >= startOfWeek && d < endOfWeek;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function weekStartISO(): string {
  const now = new Date();
  now.setDate(now.getDate() - now.getDay());
  return now.toISOString().slice(0, 10);
}

export function getWeekDays(): { label: string; date: string }[] {
  const days = [];
  const now = new Date();
  now.setDate(now.getDate() - now.getDay());
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      label: d.toLocaleDateString('es-PE', { weekday: 'short' }),
      date: d.toISOString().slice(0, 10),
    });
  }
  return days;
}

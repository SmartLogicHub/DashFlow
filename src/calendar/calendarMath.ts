import type { CalendarEvent, CalendarWeekStart } from "../models";
import { addDays, localDate } from "../utils/date";

export interface CalendarDayCell {
  date: string;
  day: number;
  inMonth: boolean;
  today: boolean;
}

export function calendarMonthGrid(
  month: string,
  weekStart: CalendarWeekStart = "monday",
  today = localDate(),
): CalendarDayCell[] {
  const normalized = /^\d{4}-\d{2}$/.test(month) ? month : today.slice(0, 7);
  const first = `${normalized}-01`;
  const weekday = new Date(`${first}T12:00:00`).getDay();
  const offset = weekStart === "monday" ? (weekday + 6) % 7 : weekday;
  const start = addDays(first, -offset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(start, index);
    return {
      date,
      day: Number(date.slice(8, 10)),
      inMonth: date.startsWith(normalized),
      today: date === today,
    };
  });
}

export function shiftCalendarMonth(month: string, delta: number): string {
  const date = new Date(`${month}-01T12:00:00`);
  if (!Number.isFinite(date.getTime())) return localDate().slice(0, 7);
  date.setMonth(date.getMonth() + delta);
  return localDate(date).slice(0, 7);
}

export function groupCalendarEvents(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const bucket = grouped.get(event.date) ?? [];
    bucket.push(event);
    grouped.set(event.date, bucket);
  }
  return grouped;
}

export function calendarWeekdayLabels(weekStart: CalendarWeekStart): string[] {
  const sunday = ["日", "一", "二", "三", "四", "五", "六"];
  return weekStart === "monday" ? [...sunday.slice(1), sunday[0]] : sunday;
}

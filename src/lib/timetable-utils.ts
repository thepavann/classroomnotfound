import { timetableData, type TimetableEntry } from "@/data/timetable";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export function getDayName(date: Date): string {
  return DAYS[date.getDay()];
}

export function getClassesForDay(day: string): TimetableEntry[] {
  return timetableData
    .filter((c) => c.day === day)
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
}

export type ClassStatus = "completed" | "live" | "upcoming";

export function getClassStatus(entry: TimetableEntry, nowMinutes: number): ClassStatus {
  const start = toMinutes(entry.startTime);
  const end = toMinutes(entry.endTime);
  if (nowMinutes >= end) return "completed";
  if (nowMinutes >= start && nowMinutes < end) return "live";
  return "upcoming";
}

export interface DashboardState {
  todayClasses: TimetableEntry[];
  currentClass: TimetableEntry | null;
  nextClass: TimetableEntry | null;
  nowMinutes: number;
  minutesUntilNext: number | null;
  minutesLeftCurrent: number | null;
  day: string;
}

export function computeDashboard(now: Date): DashboardState {
  const day = getDayName(now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const todayClasses = getClassesForDay(day);

  let currentClass: TimetableEntry | null = null;
  let nextClass: TimetableEntry | null = null;

  for (const c of todayClasses) {
    const start = toMinutes(c.startTime);
    const end = toMinutes(c.endTime);
    if (nowMinutes >= start && nowMinutes < end) currentClass = c;
    if (nowMinutes < start && nextClass === null) nextClass = c;
  }

  const minutesLeftCurrent = currentClass ? toMinutes(currentClass.endTime) - nowMinutes : null;
  const minutesUntilNext = nextClass ? toMinutes(nextClass.startTime) - nowMinutes : null;

  return {
    todayClasses,
    currentClass,
    nextClass,
    nowMinutes,
    minutesUntilNext,
    minutesLeftCurrent,
    day,
  };
}

export function humanizeMinutes(mins: number): string {
  if (mins <= 0) return "now";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m} min${m === 1 ? "" : "s"}`;
}

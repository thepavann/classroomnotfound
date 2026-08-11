export type AttendanceStatus = "invalid" | "critical" | "safe" | "excellent";

export type Record = { attended: number; total: number; target: number };

export const TARGET_PRESETS = [75, 80, 85, 90] as const;

export function isValid(attended: number, total: number) {
  return (
    Number.isFinite(attended) &&
    Number.isFinite(total) &&
    attended >= 0 &&
    total > 0 &&
    attended <= total
  );
}

export function validationError(attended: number, total: number): string | null {
  if (!Number.isFinite(attended) || !Number.isFinite(total)) return "Enter valid numbers.";
  if (attended < 0 || total < 0) return "Values cannot be negative.";
  if (total === 0) return "Total classes conducted cannot be zero.";
  if (attended > total) return "Attended classes cannot exceed total classes.";
  return null;
}

export function percent(attended: number, total: number) {
  if (total <= 0) return 0;
  return (attended / total) * 100;
}

export function fmt(n: number) {
  return `${n.toFixed(2)}%`;
}

export function statusOf(pct: number, target: number): AttendanceStatus {
  if (pct < target) return "critical";
  if (pct >= Math.min(target + 10, 100)) return "excellent";
  return "safe";
}

/** Smallest x >= 0 with (A + x) / (T + x) >= p. Returns null when unreachable. */
export function classesToReach(attended: number, total: number, target: number): number | null {
  const p = target / 100;
  if (percent(attended, total) >= target) return 0;
  if (p >= 1) {
    // Only reachable if already 100%; otherwise never.
    return attended === total ? 0 : null;
  }
  return Math.ceil((p * total - attended) / (1 - p));
}

/** Max future classes that can be missed while staying >= target. */
export function classesCanMiss(attended: number, total: number, target: number): number {
  const p = target / 100;
  if (percent(attended, total) < target) return 0;
  if (p <= 0) return Infinity;
  return Math.floor(attended / p - total);
}

export function afterAttending(attended: number, total: number, x: number) {
  return { attended: attended + x, total: total + x, pct: percent(attended + x, total + x) };
}

export function afterMissing(attended: number, total: number, x: number) {
  return { attended, total: total + x, pct: percent(attended, total + x) };
}

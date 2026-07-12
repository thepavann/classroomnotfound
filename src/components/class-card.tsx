import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import type { TimetableEntry } from "@/data/timetable";
import { formatTime12, getClassStatus, humanizeMinutes, toMinutes } from "@/lib/timetable-utils";
import { TypeBadge } from "@/components/type-badge";
import { fadeUp } from "@/components/motion";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .replace(/^(Mr|Mrs|Ms|Dr)\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const AVATAR_TINTS = [
  "bg-primary/10 text-primary",
  "bg-chart-4/15 text-chart-4",
  "bg-success/10 text-success",
  "bg-warning/15 text-warning-foreground dark:text-warning",
];

export function ClassCard({
  entry,
  nowMinutes,
}: {
  entry: TimetableEntry;
  nowMinutes: number | null;
}) {
  const status = nowMinutes === null ? "upcoming" : getClassStatus(entry, nowMinutes);
  const isLive = status === "live";
  const isDone = status === "completed";
  const minsLeft = nowMinutes !== null ? toMinutes(entry.endTime) - nowMinutes : null;

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        "hover-lift rounded-2xl border bg-card p-5 soft-shadow",
        isLive && "border-primary/60 glow-primary",
        isDone && "opacity-55",
        !isLive && !isDone && "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">Period {entry.period}</span>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" /> LIVE
            </span>
          )}
        </div>
        <TypeBadge type={entry.type} />
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug">{entry.subject}</h3>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        {entry.faculty.length > 0 && (
          <div className="flex items-start gap-2">
            <User className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{entry.faculty.join(", ")}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{entry.room}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" />
          <span>
            {formatTime12(entry.startTime)} – {formatTime12(entry.endTime)}
          </span>
        </div>
      </div>

      {isLive && minsLeft !== null && (
        <div className="mt-4 rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          Ends in {humanizeMinutes(minsLeft)}
        </div>
      )}
    </motion.div>
  );
}

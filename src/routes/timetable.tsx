import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CalendarRange } from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  computeDashboard,
  formatTime12,
  getClassesForDay,
  getDayName,
  toMinutes,
} from "@/lib/timetable-utils";
import { ClassCard } from "@/components/class-card";
import { TypeBadge } from "@/components/type-badge";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fadeUp } from "@/components/motion";
import { cn } from "@/lib/utils";
import { Radio, Timer } from "lucide-react";
import type { DashboardState } from "@/lib/timetable-utils";

export const Route = createFileRoute("/timetable")({
  head: () => ({
    meta: [
      { title: "Timetable — Classmate" },
      { name: "description", content: "Today's live timetable and full weekly schedule for AIML-B." },
      { property: "og:title", content: "Timetable — Classmate" },
      { property: "og:description", content: "Today's live timetable and full weekly schedule for AIML-B." },
    ],
  }),
  component: TimetablePage,
});

const WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function TimetablePage() {
  const hydrated = useHydrated();
  const now = useNow(1000);
  const state = computeDashboard(now);
  const day = hydrated ? getDayName(now) : "Today";

  return (
    <PageShell
      eyebrow="AIML-B"
      title="Timetable"
      description={hydrated ? `Today is ${day}. Live status updates automatically.` : "Your class schedule."}
      action={<WeeklyDialog />}
    >
      {!hydrated ? (
        <div className="space-y-4">
          <Skeleton className="h-28 rounded-2xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : state.todayClasses.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="grid place-items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center"
        >
          <CalendarRange className="h-8 w-8 text-muted-foreground/50" />
          <p className="font-medium">No classes scheduled for {day}</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <NowNextStrip state={state} now={now} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.todayClasses.map((c) => {
              const isLive = state.currentClass?.id === c.id;
              return (
                <div
                  key={c.id}
                  ref={isLive ? undefined : undefined}
                  className={cn(
                    "rounded-2xl transition-all",
                    isLive && "ring-2 ring-primary/50 ring-offset-2 ring-offset-background",
                  )}
                >
                  <ClassCard entry={c} nowMinutes={state.nowMinutes} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageShell>
  );
}

function NowNextStrip({ state, now }: { state: DashboardState; now: Date }) {
  const { currentClass, nextClass } = state;
  const secs = nextClass
    ? Math.max(
        0,
        (toMinutes(nextClass.startTime) - state.nowMinutes) * 60 - now.getSeconds(),
      )
    : null;
  const pad = (n: number) => n.toString().padStart(2, "0");
  const countdown =
    secs === null
      ? null
      : `${pad(Math.floor(secs / 3600))}:${pad(Math.floor((secs % 3600) / 60))}:${pad(secs % 60)}`;

  return (
    <motion.div variants={fadeUp} className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-4 soft-shadow">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
          <Radio className="h-3.5 w-3.5" /> Happening now
        </div>
        {currentClass ? (
          <>
            <p className="mt-2 truncate text-base font-semibold">{currentClass.subject}</p>
            <p className="text-sm text-muted-foreground">
              {currentClass.room} · {formatTime12(currentClass.startTime)} –{" "}
              {formatTime12(currentClass.endTime)}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">No class in session right now.</p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 soft-shadow">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Timer className="h-3.5 w-3.5" /> Next class
        </div>
        {nextClass ? (
          <>
            <p className="mt-2 truncate text-base font-semibold">{nextClass.subject}</p>
            <p className="text-sm text-muted-foreground">
              {nextClass.room} · starts at {formatTime12(nextClass.startTime)}
            </p>
            <p className="mt-2 font-mono text-lg font-semibold tabular-nums text-primary">
              {countdown}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">That's all for today.</p>
        )}
      </div>
    </motion.div>
  );
}

function WeeklyDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full">
          <CalendarRange className="h-4 w-4" /> View weekly timetable
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle>Weekly timetable · AIML-B</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          {WEEK.map((d) => {
            const classes = getClassesForDay(d);
            if (classes.length === 0) return null;
            return (
              <div key={d}>
                <h3 className="mb-2 text-sm font-semibold text-primary">{d}</h3>
                <div className="space-y-2">
                  {classes.map((c) => (
                    <div
                      key={c.id}
                      className="flex flex-col gap-1 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{c.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.room}
                          {c.faculty.length ? ` · ${c.faculty.join(", ")}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatTime12(c.startTime)} – {formatTime12(c.endTime)}
                        </span>
                        <TypeBadge type={c.type} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  User,
  Coffee,
  CircleDot,
} from "lucide-react";
import { useNow } from "@/hooks/use-now";
import { useHydrated } from "@/hooks/use-hydrated";
import { computeDashboard, formatTime12, humanizeMinutes } from "@/lib/timetable-utils";
import { TypeBadge } from "@/components/type-badge";
import { ClassCard } from "@/components/class-card";
import { fadeUp, stagger, scaleIn } from "@/components/motion";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const hydrated = useHydrated();
  const now = useNow(1000);
  const state = computeDashboard(now);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div variants={stagger} initial="hidden" animate="show">
        <motion.div variants={fadeUp} className="mb-8">
          <p className="text-sm font-semibold text-primary">
            {hydrated ? (
              now.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })
            ) : (
              "Today"
            )}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            What do I have right now?
          </h1>
          <p className="mt-2 text-muted-foreground">
            AIML-B · Second Year, Semester 1 · Live class dashboard
          </p>
        </motion.div>

        {!hydrated ? (
          <Skeleton className="h-72 w-full rounded-3xl" />
        ) : (
          <HeroCard state={state} />
        )}

        {hydrated && <NextClass state={state} />}
      </motion.div>

      <motion.section variants={stagger} initial="hidden" animate="show" className="mt-12">
        <motion.div variants={fadeUp} className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Today's timetable</h2>
          </div>
          <Link
            to="/timetable"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View weekly <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {!hydrated ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : state.todayClasses.length === 0 ? (
          <EmptyDay />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.todayClasses.map((c) => (
              <ClassCard key={c.id} entry={c} nowMinutes={state.nowMinutes} />
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}

function HeroCard({ state }: { state: ReturnType<typeof computeDashboard> }) {
  const c = state.currentClass;

  if (!c) {
    return (
      <motion.div
        variants={scaleIn}
        className="glass-strong flex flex-col items-start gap-3 rounded-3xl border border-border p-8 soft-shadow sm:p-10"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Coffee className="h-6 w-6" />
        </span>
        <h2 className="text-2xl font-bold sm:text-3xl">No class right now</h2>
        <p className="text-muted-foreground">
          {state.nextClass
            ? `Enjoy the break — your next class starts in ${humanizeMinutes(
                state.minutesUntilNext ?? 0,
              )}.`
            : "You're done for the day. See you next class!"}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={scaleIn}
      className="relative overflow-hidden rounded-3xl border border-primary/40 bg-card p-8 glow-primary sm:p-10"
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm font-semibold text-success">
            <span className="h-2 w-2 rounded-full bg-success pulse-dot" /> LIVE NOW
          </span>
          <TypeBadge type={c.type} />
          <span className="text-sm text-muted-foreground">Period {c.period}</span>
        </div>

        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{c.subject}</h2>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <HeroDetail icon={User} label="Faculty" value={c.faculty.length ? c.faculty.join(", ") : "—"} />
          <HeroDetail icon={MapPin} label="Room" value={c.room} />
          <HeroDetail
            icon={Clock}
            label="Time"
            value={`${formatTime12(c.startTime)} – ${formatTime12(c.endTime)}`}
          />
        </div>

        {state.minutesLeftCurrent !== null && (
          <div className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-sm">
            <CircleDot className="h-5 w-5" />
            Ends in {humanizeMinutes(state.minutesLeftCurrent)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function HeroDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-0.5 font-semibold leading-snug">{value}</p>
      </div>
    </div>
  );
}

function NextClass({ state }: { state: ReturnType<typeof computeDashboard> }) {
  const n = state.nextClass;
  if (!n) return null;

  return (
    <motion.div variants={fadeUp} className="mt-5">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 soft-shadow sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-primary">
            <ArrowRight className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Next class
            </p>
            <p className="truncate text-lg font-semibold">{n.subject}</p>
            <p className="text-sm text-muted-foreground">
              {n.faculty.length ? `${n.faculty.join(", ")} · ` : ""}
              {n.room} · {formatTime12(n.startTime)}
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-xl bg-primary/10 px-4 py-2 text-center">
          <p className="text-xs font-medium text-muted-foreground">Starts in</p>
          <p className="text-lg font-bold text-primary">
            {humanizeMinutes(state.minutesUntilNext ?? 0)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyDay() {
  return (
    <motion.div
      variants={fadeUp}
      className="grid place-items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center"
    >
      <Coffee className="h-8 w-8 text-muted-foreground/50" />
      <p className="font-medium">No classes scheduled today</p>
      <p className="text-sm text-muted-foreground">Enjoy your day off.</p>
    </motion.div>
  );
}

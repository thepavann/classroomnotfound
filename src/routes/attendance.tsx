import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CalendarCheck,
  CalendarX,
  LifeBuoy,
  Plus,
  Target,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { AttendanceRing } from "@/components/attendance-ring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { fadeUp } from "@/components/motion";
import { cn } from "@/lib/utils";
import { useAttendance } from "@/hooks/use-attendance";
import {
  TARGET_PRESETS,
  afterAttending,
  afterMissing,
  classesCanMiss,
  classesToReach,
  fmt,
  isValid,
  percent,
  statusOf,
  validationError,
} from "@/lib/attendance";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance Simulator — Classmate" },
      {
        name: "description",
        content:
          "Track your attendance, plan recovery and simulate how many classes you can attend or miss to stay above your target.",
      },
      { property: "og:title", content: "Attendance Simulator — Classmate" },
      {
        property: "og:description",
        content: "Plan your attendance: recovery plan, what-if simulators and subject-wise tracking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AttendancePage,
});

function Card({
  title,
  icon: Icon,
  children,
  className,
}: {
  title?: string;
  icon?: typeof Target;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={fadeUp}
      className={cn("rounded-2xl border border-border bg-card p-5 soft-shadow", className)}
    >
      {title && (
        <div className="mb-4 flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </h2>
        </div>
      )}
      {children}
    </motion.section>
  );
}

function StatusPill({ pct, target }: { pct: number; target: number }) {
  const status = statusOf(pct, target);
  const text =
    status === "critical"
      ? "⚠️ Attendance below target"
      : status === "excellent"
        ? "You're in the safe zone."
        : "🎉 Target reached!";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        status === "critical" && "border-destructive/30 bg-destructive/10 text-destructive",
        status === "safe" && "border-primary/25 bg-primary/10 text-primary",
        status === "excellent" && "border-success/25 bg-success/10 text-success",
      )}
    >
      {text}
    </span>
  );
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        inputMode="numeric"
        min={min}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        className="h-11 rounded-xl text-base"
      />
    </div>
  );
}

function ChoiceRow({
  options,
  value,
  onSelect,
  customLabel = "Custom",
}: {
  options: number[];
  value: number;
  onSelect: (v: number) => void;
  customLabel?: string;
}) {
  const isCustom = !options.includes(value);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onSelect(o)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
            value === o
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-accent",
          )}
        >
          {o}
        </button>
      ))}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">{customLabel}</span>
        <Input
          type="number"
          min={0}
          value={isCustom ? value : ""}
          placeholder="—"
          onChange={(e) => onSelect(e.target.value === "" ? 0 : Number(e.target.value))}
          className="h-9 w-20 rounded-full text-center"
        />
      </div>
    </div>
  );
}

function AttendancePage() {
  const { overall, subjects, loading, isSynced, setOverall, addSubject, updateSubject, removeSubject } =
    useAttendance();

  const attended = overall.attended;
  const total = overall.total;
  const target = overall.target;

  const untouched = attended === 0 && total === 0;
  const error = untouched ? null : validationError(attended, total);

  const valid = isValid(attended, total);
  const pct = valid ? percent(attended, total) : 0;
  const status = valid ? statusOf(pct, target) : "invalid";

  const need = valid ? classesToReach(attended, total, target) : null;
  const canMiss = valid ? classesCanMiss(attended, total, target) : 0;

  const [attendX, setAttendX] = useState(3);
  const [missX, setMissX] = useState(2);

  const attendSim = useMemo(() => afterAttending(attended, total, Math.max(0, attendX)), [attended, total, attendX]);
  const missSim = useMemo(() => afterMissing(attended, total, Math.max(0, missX)), [attended, total, missX]);

  const overallSubjects = useMemo(() => {
    const a = subjects.reduce((s, x) => s + x.attended, 0);
    const t = subjects.reduce((s, x) => s + x.total, 0);
    return { a, t, pct: percent(a, t) };
  }, [subjects]);

  if (loading) {
    return (
      <PageShell eyebrow="Academics" title="Attendance">
        <div className="grid gap-4 lg:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Academics"
      title="Attendance"
      description={
        isSynced
          ? "Private to you — plan, simulate and recover your attendance."
          : "Saved on this device. Sign in to keep your attendance private and synced."
      }
    >
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Overview */}
        <Card className="lg:col-span-3">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <AttendanceRing value={pct} status={status} label="Current attendance" />
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-sm font-semibold text-muted-foreground">Current Attendance</p>
              <p className="mt-1 text-4xl font-bold tabular-nums">{valid ? fmt(pct) : "—"}</p>
              <div className="mt-3 flex justify-center gap-6 sm:justify-start">
                <div>
                  <p className="text-xl font-semibold tabular-nums">{attended}</p>
                  <p className="text-xs text-muted-foreground">Attended</p>
                </div>
                <div>
                  <p className="text-xl font-semibold tabular-nums">{total}</p>
                  <p className="text-xs text-muted-foreground">Conducted</p>
                </div>
              </div>
              {valid && (
                <div className="mt-4">
                  <StatusPill pct={pct} target={target} />
                </div>
              )}
            </div>
          </div>

          {/* progress bar with target marker */}
          <div className="mt-6">
            <div className="relative h-2.5 w-full rounded-full bg-muted">
              <motion.div
                initial={false}
                animate={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                transition={{ type: "spring", stiffness: 70, damping: 20 }}
                className={cn(
                  "h-full rounded-full",
                  status === "critical" ? "bg-destructive" : status === "excellent" ? "bg-success" : "bg-primary",
                )}
              />
              <div
                className="absolute -top-1 h-4.5 w-0.5 bg-foreground/60"
                style={{ left: `${target}%`, height: "1.125rem" }}
                aria-hidden
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
              <span>0%</span>
              <span>Target {target}%</span>
              <span>100%</span>
            </div>
          </div>
        </Card>

        {/* Calculator */}
        <Card title="Calculate your attendance" icon={TrendingUp} className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            <NumberField
              label="Classes attended"
              value={attended}
              onChange={(v) => void setOverall({ ...overall, attended: v })}
            />
            <NumberField
              label="Total classes conducted"
              value={total}
              onChange={(v) => void setOverall({ ...overall, total: v })}
            />
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Target Attendance</h3>
            </div>
            <ChoiceRow
              options={[...TARGET_PRESETS]}
              value={target}
              onSelect={(v) =>
                void setOverall({ ...overall, target: Math.min(100, Math.max(1, v || 1)) })
              }
            />
            {target >= 100 && (
              <p className="mt-2 text-xs text-muted-foreground">
                At a 100% target you must attend every future class — you cannot miss any.
              </p>
            )}
          </div>
        </Card>

        {/* Recovery plan */}
        <Card title="Recovery Plan" icon={LifeBuoy} className="lg:col-span-3">
          {!valid ? (
            <p className="text-sm text-muted-foreground">Enter valid attendance values to see your plan.</p>
          ) : need === 0 ? (
            <p className="text-base font-medium text-success">You're already above your target 🎉</p>
          ) : need === null ? (
            <p className="text-sm text-muted-foreground">
              A {target}% target can never be reached once a class has been missed. Attend every future class
              to get as close as possible.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs text-muted-foreground">Current</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">
                  {attended} / {total}
                </p>
                <p className="text-sm text-muted-foreground tabular-nums">{fmt(pct)}</p>
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <p className="text-xs text-primary">Required</p>
                <p className="mt-1 text-lg font-semibold">Attend the next {need} classes</p>
                <p className="text-sm text-muted-foreground">Target {target}%</p>
              </div>
              <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                <p className="text-xs text-success">After {need} classes</p>
                <p className="mt-1 text-lg font-semibold tabular-nums">
                  {attended + need} / {total + need}
                </p>
                <p className="text-sm text-muted-foreground tabular-nums">
                  {fmt(percent(attended + need, total + need))}
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* How many can I miss */}
        <Card title="How many classes can I miss?" icon={CalendarX} className="lg:col-span-2">
          {!valid ? (
            <p className="text-sm text-muted-foreground">Enter valid values first.</p>
          ) : pct < target ? (
            <p className="text-sm">
              You're currently below your target.{" "}
              <span className="font-medium text-destructive">
                Attend {need ?? "all"} consecutive classes to recover.
              </span>
            </p>
          ) : (
            <p className="text-sm">
              You can miss{" "}
              <span className="text-2xl font-bold tabular-nums text-success">{canMiss}</span>{" "}
              {canMiss === 1 ? "class" : "classes"} and remain at {target}%.
            </p>
          )}
        </Card>

        {/* What if I attend */}
        <Card title="What if I attend the next…" icon={CalendarCheck} className="lg:col-span-3">
          <ChoiceRow options={[1, 3, 5, 10]} value={attendX} onSelect={setAttendX} />
          {valid && (
            <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
              <p className="text-xs text-muted-foreground">
                After attending {Math.max(0, attendX)} classes
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{fmt(attendSim.pct)}</p>
              <p className="text-sm text-muted-foreground tabular-nums">
                {attendSim.attended} / {attendSim.total}
              </p>
              <div className="mt-3">
                <StatusPill pct={attendSim.pct} target={target} />
              </div>
            </div>
          )}
        </Card>

        {/* What if I miss */}
        <Card title="What if I miss…" icon={CalendarX} className="lg:col-span-2">
          <ChoiceRow options={[1, 2, 3, 5]} value={missX} onSelect={setMissX} />
          {valid && (
            <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
              <p className="text-xs text-muted-foreground">If you miss {Math.max(0, missX)} classes</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{fmt(missSim.pct)}</p>
              <p className="text-sm text-muted-foreground tabular-nums">
                {missSim.attended} / {missSim.total}
              </p>
              <div className="mt-3">
                <StatusPill pct={missSim.pct} target={target} />
              </div>
            </div>
          )}
        </Card>

        {/* Target comparison */}
        <Card title="Target comparison" icon={Target} className="lg:col-span-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TARGET_PRESETS.map((t) => {
              const n = valid ? classesToReach(attended, total, t) : null;
              const reached = valid && pct >= t;
              return (
                <button
                  key={t}
                  onClick={() => void setOverall({ ...overall, target: t })}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-colors",
                    target === t ? "border-primary bg-primary/5" : "border-border hover:bg-accent/50",
                  )}
                >
                  <p className="text-sm font-semibold">{t}% target</p>
                  <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                    Current {valid ? fmt(pct) : "—"}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-sm font-medium",
                      reached ? "text-success" : "text-muted-foreground",
                    )}
                  >
                    {!valid
                      ? "Add your numbers"
                      : reached
                        ? "Already achieved 🎉"
                        : n === null
                          ? "Not reachable"
                          : `Attend ${n} more classes`}
                  </p>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Subject-wise */}
        <Card className="lg:col-span-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Subject-wise attendance
              </h2>
            </div>
            {subjects.length > 0 && (
              <p className="text-sm text-muted-foreground tabular-nums">
                Overall {overallSubjects.a} / {overallSubjects.t} · {fmt(overallSubjects.pct)}
              </p>
            )}
          </div>

          {subjects.length === 0 ? (
            <p className="mb-4 text-sm text-muted-foreground">
              Add your subjects to track attendance for each one separately.
            </p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {subjects.map((s) => {
                const sp = percent(s.attended, s.total);
                const sValid = isValid(s.attended, s.total);
                const sStatus = sValid ? statusOf(sp, s.target) : "invalid";
                const sNeed = sValid ? classesToReach(s.attended, s.total, s.target) : null;
                const sMiss = sValid ? classesCanMiss(s.attended, s.total, s.target) : 0;
                return (
                  <div key={s.id} className="rounded-xl border border-border bg-background/60 p-4">
                    <div className="flex items-start gap-4">
                      <AttendanceRing value={sValid ? sp : 0} status={sStatus} size={84} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="truncate font-semibold">{s.name}</p>
                          <button
                            aria-label={`Remove ${s.name}`}
                            onClick={() => void removeSubject(s.id)}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground tabular-nums">
                          {s.attended} / {s.total} · target {s.target}%
                        </p>
                        <p className="mt-1 text-sm">
                          {!sValid ? (
                            <span className="text-destructive">
                              {validationError(s.attended, s.total)}
                            </span>
                          ) : sNeed === 0 ? (
                            <span className="text-success">Safe — can miss {sMiss}</span>
                          ) : sNeed === null ? (
                            <span className="text-muted-foreground">Target not reachable</span>
                          ) : (
                            <span className="text-destructive">Attend {sNeed} to recover</span>
                          )}
                        </p>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            min={0}
                            value={s.attended}
                            aria-label="Attended"
                            onChange={(e) =>
                              void updateSubject(s.id, { attended: Number(e.target.value || 0) })
                            }
                            className="h-9 rounded-lg"
                          />
                          <Input
                            type="number"
                            min={0}
                            value={s.total}
                            aria-label="Total"
                            onChange={(e) =>
                              void updateSubject(s.id, { total: Number(e.target.value || 0) })
                            }
                            className="h-9 rounded-lg"
                          />
                          <Input
                            type="number"
                            min={1}
                            max={100}
                            value={s.target}
                            aria-label="Target"
                            onChange={(e) =>
                              void updateSubject(s.id, {
                                target: Math.min(100, Math.max(1, Number(e.target.value || 1))),
                              })
                            }
                            className="h-9 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <AddSubject onAdd={(v) => void addSubject(v)} defaultTarget={target} />
        </Card>
      </div>
    </PageShell>
  );
}

function AddSubject({
  onAdd,
  defaultTarget,
}: {
  onAdd: (s: { name: string; attended: number; total: number; target: number }) => void;
  defaultTarget: number;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [attended, setAttended] = useState(0);
  const [total, setTotal] = useState(0);
  const err = name.trim() === "" ? "Enter a subject name." : validationError(attended, total);

  if (!open)
    return (
      <Button variant="outline" className="mt-4 rounded-full" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add Subject
      </Button>
    );

  return (
    <div className="mt-4 rounded-xl border border-dashed border-border p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-3">
          <Label className="text-xs text-muted-foreground">Subject name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 80))}
            placeholder="e.g. Data Structures"
            className="h-11 rounded-xl"
          />
        </div>
        <NumberField label="Attended" value={attended} onChange={setAttended} />
        <NumberField label="Total conducted" value={total} onChange={setTotal} />
      </div>
      {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
      <div className="mt-4 flex gap-2">
        <Button
          className="rounded-full"
          disabled={!!err}
          onClick={() => {
            onAdd({ name: name.trim(), attended, total, target: defaultTarget });
            setName("");
            setAttended(0);
            setTotal(0);
            setOpen(false);
          }}
        >
          Add subject
        </Button>
        <Button variant="ghost" className="rounded-full" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

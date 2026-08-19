import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Award, Pencil, RotateCcw, Share2, Sparkles, Target, Trophy } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUp } from "@/components/motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { GRADE_ORDER, GRADE_POINTS, SEM_1_2, type Grade } from "@/data/grading";
import {
  LOADER_LINES,
  computeSgpa,
  fmt2,
  reactionFor,
  type GradeMap,
} from "@/lib/cgpa";

export const Route = createFileRoute("/cgpa")({
  head: () => ({
    meta: [
      { title: "CGPA Calculator · 1-2 Sem — Classmate" },
      {
        name: "description",
        content:
          "Live SGPA calculator for 1st year 2nd semester (20 credits) using the official O/A+/A/B+/B/C/F/AB grading system.",
      },
      { property: "og:title", content: "CGPA Calculator · 1-2 Sem — Classmate" },
      {
        property: "og:description",
        content: "Pick your grades, watch your SGPA update live, and reveal your result.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CgpaPage,
});

const STORAGE_KEY = "classmate:cgpa:1-2";

function useCountUp(target: number, run: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

function Confetti({ intensity = 1 }: { intensity?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: Math.round(28 * intensity) }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        dur: 1.6 + Math.random() * 1.2,
        rot: Math.random() * 360,
        size: 4 + Math.random() * 5,
        hue: [
          "bg-primary",
          "bg-emerald-400",
          "bg-amber-400",
          "bg-sky-400",
          "bg-fuchsia-400",
        ][i % 5],
      })),
    [intensity],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-10%", opacity: 0, rotate: 0 }}
          animate={{ y: "115%", opacity: [0, 1, 1, 0], rotate: p.rot }}
          transition={{ duration: p.dur, delay: p.delay, ease: "easeIn" }}
          className={cn("absolute rounded-[2px]", p.hue)}
          style={{ left: `${p.x}%`, width: p.size, height: p.size * 1.6 }}
        />
      ))}
    </div>
  );
}

function GradeSelector({
  value,
  onChange,
}: {
  value?: Grade;
  onChange: (g: Grade) => void;
}) {
  return (
    <div className="-mx-1 flex snap-x gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
      {GRADE_ORDER.map((g) => {
        const active = value === g;
        return (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            aria-pressed={active}
            className={cn(
              "relative min-w-11 shrink-0 snap-start rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
              active
                ? "border-primary/40 text-primary-foreground"
                : "border-border bg-card/50 text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
                className="absolute inset-0 rounded-xl bg-primary"
              />
            )}
            <span className="relative">{g}</span>
          </button>
        );
      })}
    </div>
  );
}

function CgpaPage() {
  const sem = SEM_1_2;
  const [grades, setGrades] = useState<GradeMap>({});
  const [phase, setPhase] = useState<"idle" | "loading" | "revealed">("idle");
  const [loaderLine, setLoaderLine] = useState(LOADER_LINES[0]);
  const [skipAnim, setSkipAnim] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const revealedFor = useRef<string | null>(null);
  const shake = useAnimationControls();
  const gradesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { grades?: GradeMap; skip?: boolean };
        if (parsed.grades) setGrades(parsed.grades);
        if (parsed.skip) setSkipAnim(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ grades, skip: skipAnim }));
    } catch {
      /* ignore */
    }
  }, [grades, skipAnim]);

  const result = useMemo(() => computeSgpa(sem.courses, grades), [sem.courses, grades]);
  const reaction = reactionFor(result.sgpa);
  const signature = useMemo(
    () => sem.courses.map((c) => grades[c.code] ?? "-").join("|"),
    [sem.courses, grades],
  );

  // Trigger the reveal once every subject has a grade.
  useEffect(() => {
    if (!result.complete) {
      revealedFor.current = null;
      if (phase !== "idle") setPhase("idle");
      return;
    }
    if (revealedFor.current !== null) {
      // grades edited after reveal: keep result live, no re-loading
      setPhase("revealed");
      return;
    }
    revealedFor.current = signature;
    if (skipAnim) {
      setPhase("revealed");
      return;
    }
    setLoaderLine(LOADER_LINES[Math.floor(Math.random() * LOADER_LINES.length)]);
    setPhase("loading");
    const t = setTimeout(() => setPhase("revealed"), 850);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.complete, signature, skipAnim]);

  useEffect(() => {
    if (phase === "revealed" && reaction.tone === "alert" && !skipAnim) {
      shake.start({
        x: [0, -8, 7, -5, 4, 0],
        transition: { duration: 0.5 },
      });
    }
  }, [phase, reaction.tone, skipAnim, shake]);

  const animate = phase === "revealed" && !skipAnim;
  const shown = useCountUp(result.sgpa, animate && revealedFor.current === signature);
  const perfect = phase === "revealed" && result.sgpa === 10;
  const [perfectOpen, setPerfectOpen] = useState(false);
  useEffect(() => {
    if (perfect && !skipAnim) {
      setPerfectOpen(true);
      const t = setTimeout(() => setPerfectOpen(false), 2600);
      return () => clearTimeout(t);
    }
  }, [perfect, skipAnim]);

  const setGrade = useCallback((code: string, g: Grade) => {
    setGrades((prev) => ({ ...prev, [code]: g }));
  }, []);

  const reset = () => {
    setGrades({});
    revealedFor.current = null;
    setPhase("idle");
    gradesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const shareText = `CLASSMATE\n1-2 SEMESTER\nSGPA ${fmt2(result.sgpa)}\n${reaction.mood.toUpperCase()}\n${sem.totalCredits} Credits`;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: "Classmate · 1-2 Sem Result", text: shareText });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      toast.success("Result card copied to clipboard");
    } catch {
      /* user cancelled */
    }
  };

  const maxCount = Math.max(1, ...result.distribution.map((d) => d.count));

  return (
    <PageShell
      eyebrow="Academics"
      title="CGPA Calculator"
      description={`${sem.year} · ${sem.semester} · ${sem.totalCredits} credits. Pick a grade for each subject — your SGPA updates instantly.`}
      action={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setSkipAnim((s) => !s)}>
            {skipAnim ? "Animations off" : "Skip animation"}
          </Button>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="mr-1.5 h-4 w-4" /> Reset
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Subjects */}
        <motion.div
          ref={gradesRef}
          variants={fadeUp}
          className={cn(
            "rounded-2xl border border-border/60 bg-card/60 p-4 transition-all sm:p-6",
            phase === "loading" && !skipAnim && "pointer-events-none blur-[2px] opacity-60",
          )}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Subjects</h2>
            <span className="text-sm text-muted-foreground">
              {result.distribution.reduce((a, d) => a + d.count, 0)}/{sem.courses.length} graded
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {sem.courses.map((c) => (
              <div key={c.code} className="py-4 first:pt-0 last:pb-0">
                <div className="mb-2.5 flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.code} · {c.credits} {c.credits === 1 ? "Credit" : "Credits"}
                    </p>
                  </div>
                  {grades[c.code] && (
                    <span className="shrink-0 text-xs font-medium text-muted-foreground">
                      {c.credits * GRADE_POINTS[grades[c.code]!]} pts
                    </span>
                  )}
                </div>
                <GradeSelector value={grades[c.code]} onChange={(g) => setGrade(c.code, g)} />
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-border/70 p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">🎯 What If?</span> Change any grade above —
            e.g. bump your DS grade — and the SGPA recalculates instantly. Your result stays on screen.
          </div>
        </motion.div>

        {/* Result column */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <motion.div variants={fadeUp} animate={shake} className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6">
            <AnimatePresence mode="wait">
              {phase === "loading" && !skipAnim ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-44 flex-col items-center justify-center gap-3 text-center"
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-7 w-7 rounded-full border-2 border-primary/30 border-t-primary"
                  />
                  <p className="text-sm text-muted-foreground">{loaderLine}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={animate ? { opacity: 0, scale: 0.94 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    1-2 Semester Result
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-6xl font-bold tracking-tight tabular-nums",
                      reaction.tone === "elite" || reaction.tone === "great"
                        ? "text-primary"
                        : reaction.tone === "alert"
                          ? "text-destructive"
                          : "text-foreground",
                    )}
                  >
                    {fmt2(phase === "revealed" ? shown : result.sgpa)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">SGPA</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {result.credits} Credits · {Math.round(result.gradePoints * 100) / 100} Grade Points
                  </p>

                  {phase === "revealed" && (
                    <div className="mt-5 border-t border-border/60 pt-4">
                      <p className="text-sm font-semibold uppercase tracking-wide">{reaction.mood}</p>
                      <p className="mt-1 text-lg font-bold">{reaction.headline}</p>
                      <p className="mt-1 text-sm text-muted-foreground">«{reaction.sub}»</p>
                      {reaction.tone === "alert" && (
                        <p className="mt-2 text-sm font-medium text-primary">
                          Don't worry. Comeback arc starts now. 📈
                        </p>
                      )}
                      {result.hasF && (
                        <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                          F detected 💀 Time to lock in for the next attempt.
                        </p>
                      )}
                      {result.hasAB && (
                        <p className="mt-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400">
                          AB detected 👀 Bro wasn't even present for the boss fight.
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {phase === "revealed" &&
              animate &&
              (reaction.tone === "elite" || reaction.tone === "great" || reaction.tone === "good") && (
                <Confetti intensity={reaction.tone === "elite" ? 1.4 : reaction.tone === "great" ? 1 : 0.6} />
              )}
          </motion.div>

          {/* Grade distribution */}
          {result.distribution.length > 0 && (
            <motion.div variants={fadeUp} className="rounded-2xl border border-border/60 bg-card/60 p-5">
              <h3 className="mb-3 text-sm font-semibold">Grade Distribution</h3>
              <div className="space-y-2">
                {result.distribution.map((d) => (
                  <div key={d.grade} className="flex items-center gap-3">
                    <span className="w-8 text-sm font-semibold">{d.grade}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-accent">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <span className="w-6 text-right text-sm tabular-nums text-muted-foreground">
                      {d.count}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {phase === "revealed" && (
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => gradesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                <Pencil className="mr-1.5 h-4 w-4" /> Edit Grades
              </Button>
              <Button variant="outline" onClick={reset}>
                <Target className="mr-1.5 h-4 w-4" /> Try Another
              </Button>
              <Button className="col-span-2" onClick={() => setShowShare((s) => !s)}>
                <Share2 className="mr-1.5 h-4 w-4" /> Share Result
              </Button>
            </motion.div>
          )}

          <AnimatePresence>
            {showShare && phase === "revealed" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Classmate</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                  1-2 Semester
                </p>
                <p className="mt-4 text-4xl font-bold tabular-nums">SGPA {fmt2(result.sgpa)}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide">{reaction.mood}</p>
                <p className="mt-1 text-xs text-muted-foreground">{sem.totalCredits} Credits</p>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  No personal details are included.
                </p>
                <Button size="sm" className="mt-4" onClick={share}>
                  <Share2 className="mr-1.5 h-4 w-4" /> Share card
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Perfect score celebration */}
      <AnimatePresence>
        {perfectOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPerfectOpen(false)}
            className="fixed inset-0 z-[60] grid place-items-center bg-background/80 backdrop-blur-sm"
          >
            <Confetti intensity={2} />
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative px-6 text-center"
            >
              <Award className="mx-auto h-12 w-12 text-primary" />
              <p className="mt-4 text-7xl font-bold tracking-tight text-primary drop-shadow-[0_0_40px_hsl(var(--primary)/0.45)]">
                10.00
              </p>
              <p className="mt-3 text-xl font-bold">ACADEMIC WEAPON UNLOCKED 🗿🔥</p>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" /> Tap anywhere to continue
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Crown, Medal, RefreshCw, Trophy } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/components/motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "SGPA Leaderboard — Classmate" },
      {
        name: "description",
        content:
          "See how AIML-B ranks. Every SGPA saved from the Classmate CGPA calculator, ranked highest to lowest.",
      },
      { property: "og:title", content: "SGPA Leaderboard — Classmate" },
      {
        property: "og:description",
        content: "Class-wide SGPA rankings saved from the Classmate CGPA calculator.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LeaderboardPage,
});

type Row = {
  id: string;
  name: string;
  sgpa: number;
  credits: number;
  semester: string;
  created_at: string;
};

function medal(rank: number) {
  if (rank === 0) return { Icon: Crown, cls: "text-amber-500" };
  if (rank === 1) return { Icon: Medal, cls: "text-slate-400" };
  if (rank === 2) return { Icon: Medal, cls: "text-amber-700" };
  return null;
}

function LeaderboardPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("cgpa_results")
      .select("id,name,sgpa,credits,semester,created_at")
      .order("sgpa", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(100);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <PageShell
      eyebrow="Academics"
      title="SGPA Leaderboard"
      description="Every result saved from the CGPA calculator, ranked highest to lowest."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
            <RefreshCw className={cn("mr-1.5 h-4 w-4", loading && "animate-spin")} /> Refresh
          </Button>
          <Button size="sm" asChild>
            <Link to="/cgpa">Calculate yours</Link>
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-accent/60" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-dashed border-border/70 p-10 text-center"
        >
          <Trophy className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-semibold">No results yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first — calculate your SGPA and save it to the board.
          </p>
          <Button className="mt-5" asChild>
            <Link to="/cgpa">Open CGPA Calculator</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          {rows.map((r, i) => {
            const m = medal(i);
            return (
              <motion.div
                key={r.id}
                variants={fadeUp}
                className={cn(
                  "grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border bg-card/60 p-3 sm:gap-4 sm:p-4",
                  i === 0 ? "border-primary/40 bg-primary/5" : "border-border/60",
                )}
              >
                <div className="flex justify-center">
                  {m ? (
                    <m.Icon className={cn("h-5 w-5", m.cls)} />
                  ) : (
                    <span className="text-sm font-semibold tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Sem {r.semester} · {r.credits} credits
                  </p>
                </div>
                <p className="shrink-0 text-xl font-bold tabular-nums sm:text-2xl">
                  {Number(r.sgpa).toFixed(2)}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}

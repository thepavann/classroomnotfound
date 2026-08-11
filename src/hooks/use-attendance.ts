import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type Subject = {
  id: string;
  name: string;
  attended: number;
  total: number;
  target: number;
};

export type Overall = { attended: number; total: number; target: number };

const LS_KEY = "classmate.attendance.v1";

type LocalShape = { overall: Overall; subjects: Subject[] };

const DEFAULTS: LocalShape = {
  overall: { attended: 0, total: 0, target: 75 },
  subjects: [],
};

function readLocal(): LocalShape {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as LocalShape) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function writeLocal(data: LocalShape) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function useAttendance() {
  const { user, loading: authLoading } = useAuth();
  const [overall, setOverall] = useState<Overall>(DEFAULTS.overall);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // load
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    const load = async () => {
      if (!user) {
        const local = readLocal();
        if (!cancelled) {
          setOverall(local.overall);
          setSubjects(local.subjects);
          setLoading(false);
        }
        return;
      }
      const [{ data: o }, { data: s }] = await Promise.all([
        supabase
          .from("attendance_overall")
          .select("attended,total,target")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("attendance_subjects")
          .select("id,name,attended,total,target")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true }),
      ]);
      if (cancelled) return;
      setOverall(
        o
          ? { attended: o.attended, total: o.total, target: Number(o.target) }
          : DEFAULTS.overall,
      );
      setSubjects(
        (s ?? []).map((r) => ({
          id: r.id,
          name: r.name,
          attended: r.attended,
          total: r.total,
          target: Number(r.target),
        })),
      );
      setLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const persistOverall = useCallback(
    async (next: Overall) => {
      setOverall(next);
      if (!user) {
        writeLocal({ overall: next, subjects: readLocal().subjects });
        return;
      }
      await supabase.from("attendance_overall").upsert({ user_id: user.id, ...next });
    },
    [user],
  );

  const persistSubjects = useCallback(
    (next: Subject[]) => {
      setSubjects(next);
      if (!user) writeLocal({ overall: readLocal().overall, subjects: next });
    },
    [user],
  );

  const addSubject = useCallback(
    async (input: Omit<Subject, "id">) => {
      if (!user) {
        const local = readLocal();
        const next = [...local.subjects, { ...input, id: crypto.randomUUID() }];
        setSubjects(next);
        writeLocal({ overall: local.overall, subjects: next });
        return;
      }
      const { data } = await supabase
        .from("attendance_subjects")
        .insert({ user_id: user.id, ...input })
        .select("id,name,attended,total,target")
        .single();
      if (data)
        setSubjects((prev) => [
          ...prev,
          {
            id: data.id,
            name: data.name,
            attended: data.attended,
            total: data.total,
            target: Number(data.target),
          },
        ]);
    },
    [user],
  );

  const updateSubject = useCallback(
    async (id: string, patch: Partial<Omit<Subject, "id">>) => {
      const next = subjects.map((s) => (s.id === id ? { ...s, ...patch } : s));
      persistSubjects(next);
      if (user) await supabase.from("attendance_subjects").update(patch).eq("id", id);
    },
    [subjects, user, persistSubjects],
  );

  const removeSubject = useCallback(
    async (id: string) => {
      persistSubjects(subjects.filter((s) => s.id !== id));
      if (user) await supabase.from("attendance_subjects").delete().eq("id", id);
    },
    [subjects, user, persistSubjects],
  );

  return {
    overall,
    subjects,
    loading: loading || authLoading,
    isSynced: !!user,
    setOverall: persistOverall,
    addSubject,
    updateSubject,
    removeSubject,
  };
}

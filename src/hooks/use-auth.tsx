import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "student" | "ta" | "professor";

type AuthState = {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  displayName: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (r: AppRole | AppRole[]) => boolean;
  canWrite: (scope: "announcements" | "events" | "timetable" | "faculty" | "crs") => boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

async function loadRoleAndProfile(userId: string) {
  const [{ data: roleRow }, { data: profile }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", userId).order("role").limit(1).maybeSingle(),
    supabase.from("profiles").select("display_name").eq("id", userId).maybeSingle(),
  ]);
  return {
    role: (roleRow?.role ?? null) as AppRole | null,
    displayName: profile?.display_name ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async (s: Session | null) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // defer to avoid deadlock in onAuthStateChange
        setTimeout(async () => {
          const { role, displayName } = await loadRoleAndProfile(s.user.id);
          if (!cancelled) {
            setRole(role);
            setDisplayName(displayName);
          }
        }, 0);
      } else {
        setRole(null);
        setDisplayName(null);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      void hydrate(s);
    });

    supabase.auth.getSession().then(({ data }) => {
      void hydrate(data.session);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const hasRole = (r: AppRole | AppRole[]) => {
    if (!role) return false;
    return Array.isArray(r) ? r.includes(role) : role === r;
  };

  const canWrite: AuthState["canWrite"] = (scope) => {
    if (!role) return false;
    if (role === "professor") return true;
    if (role === "ta") return scope === "announcements" || scope === "events";
    return false;
  };

  const refresh = async () => {
    if (!user) return;
    const { role, displayName } = await loadRoleAndProfile(user.id);
    setRole(role);
    setDisplayName(displayName);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        displayName,
        loading,
        isAuthenticated: !!user,
        hasRole,
        canWrite,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const ROLE_LABEL: Record<AppRole, string> = {
  student: "Student",
  ta: "Teaching Assistant",
  professor: "Professor",
};

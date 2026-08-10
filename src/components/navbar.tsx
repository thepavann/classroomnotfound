import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoLight from "@/assets/classmate-logo-light.png.asset.json";
import logoDark from "@/assets/classmate-logo-dark.png.asset.json";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "@/components/global-search";
import { NotificationBell } from "@/components/notification-bell";
import { UserMenu } from "@/components/user-menu";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/timetable", label: "Timetable" },
  { to: "/faculty", label: "Faculty" },
  { to: "/events", label: "Events" },
  { to: "/announcements", label: "Announcements" },
  { to: "/crs", label: "CRs" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 glass-strong">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 sm:gap-4 sm:px-6">
        <Link to="/" className="flex min-w-0 shrink-0 items-center" aria-label="Classmate — home">
          <img
            src={logoLight.url}
            alt="Classmate"
            className="h-8 w-auto sm:h-9 dark:hidden"
            width={574}
            height={155}
          />
          <img
            src={logoDark.url}
            alt="Classmate"
            className="hidden h-8 w-auto sm:h-9 dark:block"
            width={528}
            height={135}
          />
        </Link>




        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <GlobalSearch />
          <div className="hidden sm:block">
            <NotificationBell />
          </div>
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <UserMenu />
          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/60 lg:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
              {links.map((l) => {
                const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                      active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50",
                    )}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <div className="mt-2 flex items-center gap-2 border-t border-border/60 pt-3 sm:hidden">
                <NotificationBell />
                <ThemeToggle />
              </div>
            </div>

          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

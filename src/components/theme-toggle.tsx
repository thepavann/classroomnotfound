import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const hydrated = useHydrated();
  const isDark = hydrated && theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "relative grid h-9 w-9 place-items-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </motion.span>
    </button>
  );
}

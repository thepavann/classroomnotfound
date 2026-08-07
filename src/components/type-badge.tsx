import { BookOpen, FlaskConical, Globe, Sparkles, Utensils } from "lucide-react";
import type { ClassType } from "@/data/timetable";
import { cn } from "@/lib/utils";

const config: Record<ClassType, { label: string; className: string; icon: typeof BookOpen }> = {
  Theory: {
    label: "Theory",
    className: "bg-primary/10 text-primary border-primary/20",
    icon: BookOpen,
  },
  Lab: {
    label: "Lab",
    className: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    icon: FlaskConical,
  },
  Online: {
    label: "Online",
    className: "bg-warning/15 text-warning-foreground border-warning/30 dark:text-warning",
    icon: Globe,
  },
  Activity: {
    label: "Activity",
    className: "bg-success/10 text-success border-success/20",
    icon: Sparkles,
  },
  Break: {
    label: "Break",
    className: "bg-muted text-muted-foreground border-border",
    icon: Utensils,
  },
};

export function TypeBadge({ type, className }: { type: ClassType; className?: string }) {
  const c = config[type];
  const Icon = c.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        c.className,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {c.label}
    </span>
  );
}

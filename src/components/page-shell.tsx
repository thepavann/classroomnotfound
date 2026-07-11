import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger } from "@/components/motion";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12"
    >
      <motion.div
        variants={fadeUp}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p>
          )}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </motion.div>
      {children}
    </motion.div>
  );
}

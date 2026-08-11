import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/lib/attendance";

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  invalid: "var(--muted-foreground)",
  critical: "var(--destructive)",
  safe: "var(--primary)",
  excellent: "var(--success)",
};

/**
 * Circular attendance indicator with a soft "watercolour" liquid fill
 * that rises to the current percentage.
 */
export function AttendanceRing({
  value,
  status,
  size = 176,
  label,
  className,
}: {
  value: number;
  status: AttendanceStatus;
  size?: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  const color = STATUS_COLOR[status];
  const r = 50;
  const c = 2 * Math.PI * r;
  const level = 120 - (pct / 100) * 120; // y position inside 120-height viewbox

  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${pct.toFixed(2)} percent attendance`}
    >
      {/* liquid fill clipped to the inner circle */}
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full">
        <defs>
          <clipPath id="att-clip">
            <circle cx="60" cy="60" r="44" />
          </clipPath>
        </defs>
        <circle cx="60" cy="60" r="44" fill={color} opacity={0.07} />
        <g clipPath="url(#att-clip)">
          <motion.g
            initial={false}
            animate={{ y: level }}
            transition={{ type: "spring", stiffness: 60, damping: 18 }}
          >
            <motion.path
              d="M-120 6 q 30 -8 60 0 t 60 0 t 60 0 t 60 0 t 60 0 V 140 H -120 Z"
              fill={color}
              opacity={0.22}
              animate={{ x: [0, 120, 240] }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d="M-120 10 q 30 8 60 0 t 60 0 t 60 0 t 60 0 t 60 0 V 140 H -120 Z"
              fill={color}
              opacity={0.35}
              animate={{ x: [0, -120, -240] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.g>
        </g>
        {/* track + progress ring */}
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c - (pct / 100) * c }}
          transition={{ type: "spring", stiffness: 70, damping: 20 }}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <motion.p
            key={pct.toFixed(2)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold tabular-nums sm:text-3xl"
            style={{ color }}
          >
            {pct.toFixed(2)}%
          </motion.p>
          {label && <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>}
        </div>
      </div>
    </div>
  );
}

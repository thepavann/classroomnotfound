import logoLight from "@/assets/classmate-logo-light.png.asset.json";
import logoDark from "@/assets/classmate-logo-dark.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * Theme-aware Classmate lockup. Both source images share the exact same
 * geometry (574x155), so they render at identical size in either theme.
 */
export function Logo({ className }: { className?: string }) {
  const base = cn("w-auto", className);
  return (
    <>
      <img
        src={logoLight.url}
        alt="Classmate"
        width={574}
        height={155}
        className={cn(base, "dark:hidden")}
      />
      <img
        src={logoDark.url}
        alt="Classmate"
        width={574}
        height={155}
        className={cn(base, "hidden dark:block")}
      />
    </>
  );
}

import { cn } from "@/lib/utils";

/**
 * Lumina mark — minimal compass + sunrise.
 * A 3/4 arc (horizon / compass ring) with a single tapered needle rising
 * through the opening toward a small dot at the destination point.
 * Pure stroke, uses currentColor so it inverts cleanly in dark mode.
 */
export function LuminaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("h-7 w-7", className)}>
      {/* Horizon arc, opening upward */}
      <path
        d="M5 21 A 11 11 0 0 1 27 21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {/* Subtle inner arc — adds depth without clutter */}
      <path
        d="M9.5 21 A 6.5 6.5 0 0 1 22.5 21"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* Rising needle / ray */}
      <path d="M16 24 L16 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* Destination dot */}
      <circle cx="16" cy="6.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function LuminaLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-foreground", className)}>
      <LuminaMark className="h-6 w-6 text-accent" />
      <span className="font-display text-xl font-semibold tracking-tight">Lumina</span>
    </span>
  );
}

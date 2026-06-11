import { useEffect, useState } from "react";
import { Check } from "lucide-react";

const STEPS = [
  "Evaluating Qualifications",
  "Analyzing Professional Experience",
  "Aligning Career Goals",
  "Generating Personalized Insights",
] as const;

export function LoadingExperience() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s < STEPS.length ? s + 1 : s));
    }, 650);
    return () => window.clearInterval(id);
  }, []);

  const progress = Math.min(100, ((step + 0.5) / STEPS.length) * 100);

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 shadow-elevated sm:p-10">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">Preparing</p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        Preparing Your Recommendation
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        A few seconds — we're mapping your profile against four academic pathways.
      </p>

      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-7 space-y-3">
        {STEPS.map((label, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={label} className="flex items-center gap-3 text-sm">
              <span
                className={
                  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors " +
                  (done
                    ? "border-accent bg-accent text-accent-foreground"
                    : active
                      ? "border-accent text-accent"
                      : "border-border text-muted-foreground")
                }
              >
                {done ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <span
                className={
                  done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground"
                }
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

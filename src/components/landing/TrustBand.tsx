import { Briefcase, Compass, GraduationCap, Sparkles } from "lucide-react";

const BADGES = [
  {
    icon: Sparkles,
    label: "Personalized Recommendations",
    body: "Built around your qualifications, experience, and ambitions.",
  },
  {
    icon: Briefcase,
    label: "Career-Focused Guidance",
    body: "Every pathway is tied to a concrete professional outcome.",
  },
  {
    icon: GraduationCap,
    label: "Academic Growth Planning",
    body: "Credentials that compound over the long arc of a career.",
  },
  {
    icon: Compass,
    label: "Professional Development Insights",
    body: "Structured next steps you can act on the same day.",
  },
];

export function TrustBand() {
  return (
    <section className="border-b border-border/60 bg-surface">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="text-center">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">
            What you can rely on
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Credibility built into every recommendation.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BADGES.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.label}
                className="flex h-full flex-col rounded-xl border border-border bg-card p-5 text-left shadow-card"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="h-4 w-4" />
                </span>
                <p className="mt-4 text-sm font-semibold text-foreground">{b.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

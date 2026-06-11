import { Compass, GraduationCap, LineChart, Target } from "lucide-react";

const VALUES = [
  {
    icon: Target,
    title: "Personalized Guidance",
    body: "Recommendations grounded in your profile, not generic advice.",
  },
  {
    icon: LineChart,
    title: "Career-Oriented Insights",
    body: "Every pathway is mapped to real career outcomes and growth.",
  },
  {
    icon: GraduationCap,
    title: "Academic Growth Planning",
    body: "Clarity on credentials that actually compound over your career.",
  },
  {
    icon: Compass,
    title: "Instant Clarity",
    body: "A structured report you can act on the same day — no waiting.",
  },
];

export function WhyLumina() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">Why Lumina</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for the decisions that shape a career.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-card transition-colors hover:border-accent/40"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

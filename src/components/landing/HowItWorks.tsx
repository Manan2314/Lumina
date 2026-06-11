import { Compass, Sparkles, UserRound } from "lucide-react";

const STEPS = [
  {
    icon: UserRound,
    title: "Tell Us About Yourself",
    body: "Share your qualifications, professional experience, and the direction you're aiming at. It takes a couple of minutes.",
  },
  {
    icon: Sparkles,
    title: "Profile Evaluation",
    body: "Our recommendation engine maps your inputs against four established academic pathways — built for clarity, not noise.",
  },
  {
    icon: Compass,
    title: "Receive Your Academic Pathway",
    body: "Get a structured recommendation with reasoning, key benefits, suggested next steps, and future growth opportunities.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">
            How It Works
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            A clear, three-step path to your recommendation.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Designed for working professionals — no jargon, no fluff. Just structured clarity on
            your next step.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-elevated"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-medium text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

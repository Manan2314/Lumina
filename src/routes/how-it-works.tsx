import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works · Lumina" },
      {
        name: "description",
        content:
          "Three structured steps from profile to a personalized academic pathway recommendation, designed for working professionals.",
      },
      { property: "og:title", content: "How Lumina Works" },
      {
        property: "og:description",
        content:
          "A clear, three-step path from your current position to a tailored academic recommendation.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const DETAILED_STEPS = [
  {
    icon: UserRound,
    eyebrow: "Step 01",
    title: "Tell us about yourself",
    body: "Share your highest qualification, professional experience, current role, and the direction you're aiming at. The form takes around two minutes and asks only what's needed to give a meaningful recommendation.",
    points: [
      "Highest qualification",
      "Years of professional experience",
      "Current profession",
      "Career goal in your own words",
    ],
  },
  {
    icon: Sparkles,
    eyebrow: "Step 02",
    title: "Profile evaluation",
    body: "Your inputs are mapped against four established academic pathways. The engine considers your qualification level, professional tenure, and the language of your career goal — separating skill-building, leadership, research, and recognition trajectories.",
    points: [
      "Qualification fit",
      "Experience weight",
      "Career-goal alignment",
      "Pathway strength scoring",
    ],
  },
  {
    icon: Compass,
    eyebrow: "Step 03",
    title: "Receive your academic pathway",
    body: "You get a structured report with the recommended pathway, a strength indicator, the reasoning behind it, key benefits, suggested next steps, and future growth opportunities — plus an email-ready summary you can save or share.",
    points: [
      "Recommended pathway",
      "Strength indicator",
      "Reasoning + benefits",
      "Next steps + growth",
    ],
  },
];

function HowItWorksPage() {
  return (
    <>
      <section className="hero-light border-b border-border/60">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">
              How it works
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              From profile to pathway in three structured steps.
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Lumina is built for working professionals — short, focused, and useful the moment you
              finish. Here's exactly what happens after you start.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link to="/get-started">
                  Get My Recommendation <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl space-y-6 px-5 py-16 sm:px-8 sm:py-20">
          {DETAILED_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="grid gap-6 rounded-2xl border border-border bg-card p-7 shadow-card sm:grid-cols-[auto_1fr] sm:p-10"
              >
                <div className="flex sm:block">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div>
                  <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {step.eyebrow}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{step.body}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {step.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

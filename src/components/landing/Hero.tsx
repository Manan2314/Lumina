import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRUST = [
  "Personalized Recommendations",
  "Career-Focused Guidance",
  "Academic Growth Planning",
  "Professional Development Insights",
];

const JOURNEY = [
  { label: "Current Position", caption: "Where you stand today" },
  { label: "Evaluation", caption: "Profile, experience & ambition" },
  { label: "Recommendation", caption: "Your tailored pathway" },
  { label: "Academic Growth", caption: "Credentials that compound" },
  { label: "Career Advancement", caption: "Where you're headed next" },
];

export function Hero() {
  return (
    <section className="hero-light relative overflow-hidden border-b border-border/60">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div className="space-y-7 animate-fade-in">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft/60 px-3 py-1 text-xs font-medium text-foreground/80 dark:bg-accent-soft/30">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Where Ambition Meets Direction
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Discover the Academic Pathway That Matches Your Ambition.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Lumina helps professionals and lifelong learners gain clarity on the next academic and
            career move — a personalized pathway grounded in your qualifications, experience, and
            ambitions.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-card"
            >
              <Link to="/get-started">
                Get My Recommendation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border">
              <Link to="/how-it-works">Explore How It Works</Link>
            </Button>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-xs text-muted-foreground sm:text-sm">
            {TRUST.map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <JourneyVisual />
        </div>
      </div>
    </section>
  );
}

function JourneyVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-elevated sm:p-8">
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/15 blur-2xl"
        aria-hidden
      />
      <p className="font-display text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Your Journey
      </p>
      <ol className="relative mt-5 space-y-5">
        <span
          className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-accent/60 via-accent/30 to-transparent"
          aria-hidden
        />
        {JOURNEY.map((step, i) => {
          const isFinal = i === JOURNEY.length - 1;
          return (
            <li key={step.label} className="relative flex items-start gap-4">
              <span
                className={
                  "relative z-10 mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold " +
                  (isFinal
                    ? "border-accent bg-accent text-accent-foreground shadow-card"
                    : "border-border bg-card text-muted-foreground")
                }
              >
                {i + 1}
              </span>
              <div className="pt-0.5">
                <p
                  className={
                    "text-sm font-medium " + (isFinal ? "text-foreground" : "text-foreground/90")
                  }
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.caption}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

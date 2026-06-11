import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="hero-light relative overflow-hidden rounded-3xl border border-border bg-card p-10 text-center shadow-elevated sm:p-16">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">
            Ready when you are
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Your next academic step, made clear.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            A few honest answers is all it takes. Get a personalized pathway recommendation in under
            two minutes.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link to="/get-started">
                Get My Recommendation <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

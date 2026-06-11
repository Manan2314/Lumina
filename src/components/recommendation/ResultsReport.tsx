import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Compass, Sparkles, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PATHWAY_LABELS, PATHWAY_SHORT, type RecommendResult } from "@/lib/recommend";
import { EmailSummaryCard } from "./EmailSummaryCard";

export function ResultsReport({
  result,
  recipientName,
}: {
  result: RecommendResult;
  recipientName?: string;
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero recommendation card */}
      <section className="hero-light relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-elevated sm:p-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">
            Recommended Pathway
          </p>
          <StrengthBadge strength={result.strength} />
        </div>
        <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {PATHWAY_LABELS[result.pathway]}
        </h1>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {PATHWAY_SHORT[result.pathway]} · Personalized for your profile
        </p>
      </section>

      {/* Why */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            Why this recommendation fits you
          </h2>
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">{result.reasoning}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Benefits */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <h2 className="font-display text-xl font-semibold tracking-tight">Key benefits</h2>
          </div>
          <ul className="mt-5 space-y-3">
            {result.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="text-foreground/85">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Next steps */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <Compass className="h-4 w-4" />
            </span>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              Suggested next steps
            </h2>
          </div>
          <ol className="mt-5 space-y-3">
            {result.nextSteps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 text-sm">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[11px] font-semibold text-foreground/80">
                  {i + 1}
                </span>
                <span className="text-foreground/85">{s}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* Future growth */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <TrendingUp className="h-4 w-4" />
          </span>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            Future growth opportunities
          </h2>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {result.growth.map((g) => (
            <div
              key={g}
              className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-foreground/85"
            >
              {g}
            </div>
          ))}
        </div>
      </section>

      {/* Email summary (modular) */}
      <EmailSummaryCard result={result} recipientName={recipientName} />

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-6 shadow-card">
        <p className="text-sm text-muted-foreground">
          Want a recommendation for a different profile, or see all submissions?
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <Link to="/submissions">View All Submissions</Link>
          </Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to="/get-started">
              Generate Another Recommendation <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function StrengthBadge({ strength }: { strength: RecommendResult["strength"] }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-xs font-semibold text-accent shadow-card">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {strength}
    </span>
  );
}

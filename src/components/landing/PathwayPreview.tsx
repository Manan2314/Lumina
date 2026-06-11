import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const PATHWAYS = [
  {
    name: "Certification Program",
    short: "Certification",
    blurb: "For learners seeking targeted skills and industry-recognized credentials.",
    audience: "Best for early-career professionals and career changers building credibility fast.",
  },
  {
    name: "Doctor of Business Administration",
    short: "DBA",
    blurb: "For experienced professionals pursuing executive leadership and strategic impact.",
    audience: "Best for senior leaders translating practice into applied research.",
  },
  {
    name: "Doctor of Philosophy",
    short: "PhD",
    blurb: "For researchers, academics, and knowledge creators.",
    audience: "Best for those advancing original research in their field.",
  },
  {
    name: "Honorary Doctorate",
    short: "Honorary",
    blurb: "For distinguished professionals with significant contributions and achievements.",
    audience: "Best for established figures whose body of work merits recognition.",
  },
];

export function PathwayPreview() {
  return (
    <section className="border-b border-border/60 bg-surface">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">Pathways</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Four recommendation outcomes. One that fits you.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Every recommendation lands on one of these four pathways — each built around a
              distinct career and academic trajectory.
            </p>
          </div>
          <Link
            to="/get-started"
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80"
          >
            Find your pathway <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {PATHWAYS.map((p) => (
            <article
              key={p.name}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-elevated"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {p.short}
                </span>
                <span className="h-2 w-2 rounded-full bg-accent transition-transform group-hover:scale-150" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.blurb}</p>
              <p className="mt-5 border-t border-border/70 pt-4 text-xs text-foreground/80">
                <span className="text-muted-foreground">Best suited for · </span>
                {p.audience}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

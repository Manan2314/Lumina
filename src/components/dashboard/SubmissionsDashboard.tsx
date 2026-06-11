import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { PATHWAY_SHORT, type Pathway } from "@/lib/recommend";
import type { Submission } from "@/lib/submissions.functions";
import { Button } from "@/components/ui/button";

const PATHWAY_OPTIONS: { value: "all" | Pathway; label: string }[] = [
  { value: "all", label: "All pathways" },
  { value: "certification", label: "Certification" },
  { value: "dba", label: "DBA" },
  { value: "phd", label: "PhD" },
  { value: "honorary", label: "Honorary" },
];

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function SubmissionsDashboard({ submissions }: { submissions: Submission[] }) {
  const [search, setSearch] = useState("");
  const [pathway, setPathway] = useState<"all" | Pathway>("all");

  const stats = useMemo(() => {
    const total = submissions.length;
    const counts: Record<Pathway, number> = { certification: 0, dba: 0, phd: 0, honorary: 0 };
    submissions.forEach((s) => {
      counts[s.recommendation as Pathway] = (counts[s.recommendation as Pathway] ?? 0) + 1;
    });
    const mostCommon = (Object.entries(counts) as [Pathway, number][])
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1])[0];
    const latest = submissions[0];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = submissions.filter((s) => new Date(s.created_at).getTime() >= weekAgo).length;
    return {
      total,
      mostCommon: mostCommon ? PATHWAY_SHORT[mostCommon[0]] : "—",
      latest: latest ? formatRelative(latest.created_at) : "—",
      recent,
    };
  }, [submissions]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter((s) => {
      if (pathway !== "all" && s.recommendation !== pathway) return false;
      if (!q) return true;
      return (
        s.full_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.current_profession.toLowerCase().includes(q) ||
        s.career_goal.toLowerCase().includes(q)
      );
    });
  }, [submissions, search, pathway]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Recommendations" value={String(stats.total)} />
        <StatCard label="Most Common Pathway" value={stats.mostCommon} />
        <StatCard label="Latest Submission" value={stats.latest} />
        <StatCard label="Last 7 Days" value={String(stats.recent)} />
      </div>

      {/* Controls */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-card sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, profession, or goal"
              className="block w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring"
            />
          </div>
          <select
            value={pathway}
            onChange={(e) => setPathway(e.target.value as "all" | Pathway)}
            className="min-w-[140px] rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring"
          >
            {PATHWAY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / list */}
      {filtered.length === 0 ? (
        <EmptyState hasAny={submissions.length > 0} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card shadow-card sm:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Career Goal</th>
                  <th className="px-5 py-3 font-medium">Recommendation</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s: Submission) => (
                  <tr
                    key={s.id}
                    className="border-b border-border/70 last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground">{s.full_name}</td>
                    <td className="px-5 py-3.5 text-foreground/80">
                      <span className="line-clamp-1 max-w-[28ch]" title={s.career_goal}>
                        {s.career_goal}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <PathwayPill pathway={s.recommendation as Pathway} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {formatDate(s.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="space-y-3 sm:hidden">
            {filtered.map((s: Submission) => (
              <article
                key={s.id}
                className="rounded-xl border border-border bg-card p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate font-medium text-foreground">{s.full_name}</p>
                  <PathwayPill pathway={s.recommendation as Pathway} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-foreground/85">{s.career_goal}</p>
                <p className="mt-3 text-xs text-muted-foreground">{formatDate(s.created_at)}</p>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function PathwayPill({ pathway }: { pathway: Pathway }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
      <span className="h-1 w-1 rounded-full bg-accent" />
      {PATHWAY_SHORT[pathway]}
    </span>
  );
}

function EmptyState({ hasAny }: { hasAny: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-card">
      <p className="font-display text-lg font-semibold">
        {hasAny ? "No matching submissions" : "No submissions yet"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasAny
          ? "Try adjusting your search or pathway filter."
          : "Be the first to generate an academic pathway recommendation."}
      </p>
      <div className="mt-5">
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/get-started">Generate a recommendation</Link>
        </Button>
      </div>
    </div>
  );
}

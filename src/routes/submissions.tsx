import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { listSubmissions } from "@/lib/submissions.functions";
import { SubmissionsDashboard } from "@/components/dashboard/SubmissionsDashboard";

export const Route = createFileRoute("/submissions")({
  head: () => ({
    meta: [
      { title: "Submissions · Lumina" },
      {
        name: "description",
        content:
          "Review every recommendation generated through Lumina — names, career goals, and recommended pathways.",
      },
      { property: "og:title", content: "Submissions · Lumina" },
      {
        property: "og:description",
        content: "Dashboard of every academic pathway recommendation generated through Lumina.",
      },
    ],
  }),
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const fetcher = useServerFn(listSubmissions);
  const { data, isPending, isError } = useQuery({
    queryKey: ["submissions"],
    queryFn: () => fetcher(),
  });

  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">Dashboard</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Submissions
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Every recommendation generated through Lumina, in one place.
            </p>
          </div>
        </div>

        <div className="mt-10">
          {isPending ? (
            <DashboardSkeleton />
          ) : isError ? (
            <div className="rounded-2xl border border-destructive/30 bg-card p-8 text-center text-sm text-destructive shadow-card">
              We couldn't load submissions. Please refresh and try again.
            </div>
          ) : (
            <SubmissionsDashboard submissions={data ?? []} />
          )}
        </div>
      </div>
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl border border-border bg-card" />
        ))}
      </div>
      <div className="h-16 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="h-72 animate-pulse rounded-2xl border border-border bg-card" />
    </div>
  );
}

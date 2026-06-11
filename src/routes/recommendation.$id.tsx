import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getSubmission } from "@/lib/submissions.functions";
import { recommend } from "@/lib/recommend";
import { LoadingExperience } from "@/components/recommendation/LoadingExperience";
import { ResultsReport } from "@/components/recommendation/ResultsReport";

export const Route = createFileRoute("/recommendation/$id")({
  head: () => ({
    meta: [
      { title: "Your Recommendation · Lumina" },
      {
        name: "description",
        content:
          "A personalized academic pathway recommendation grounded in your profile and ambitions.",
      },
      { property: "og:title", content: "Your Lumina Recommendation" },
      {
        property: "og:description",
        content: "Recommended pathway, reasoning, and next steps tailored to you.",
      },
    ],
  }),
  component: RecommendationPage,
  errorComponent: ErrorView,
  notFoundComponent: () => (
    <ErrorView error={new Error("Recommendation not found")} reset={() => {}} />
  ),
});

function RecommendationPage() {
  const { id } = Route.useParams();
  const fetcher = useServerFn(getSubmission);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["submission", id],
    queryFn: () => fetcher({ data: { id } }),
    retry: 1,
  });

  // Build the full result object:
  // - pathway/strength/benefits/nextSteps/growth come from the deterministic engine (source of truth)
  // - reasoning comes from the DB (Gemini-generated, or deterministic fallback if Gemini was unavailable)
  const result = data
    ? {
        ...recommend({
          highest_qualification: data.highest_qualification,
          years_experience: data.years_experience,
          career_goal: data.career_goal,
          current_profession: data.current_profession,
        }),
        // Override the deterministic reasoning with what was stored at submission time
        // (this will be Gemini-generated when GEMINI_API_KEY is configured).
        reasoning: data.recommendation_reasoning,
      }
    : null;

  return (
    <section className="bg-surface">
      <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        {isPending ? (
          <LoadingExperience />
        ) : isError || !data || !result ? (
          <ErrorView
            error={(error as Error) ?? new Error("Could not load recommendation")}
            reset={() => {}}
          />
        ) : (
          <ResultsReport recipientName={data.full_name} result={result} />
        )}
      </div>
    </section>
  );
}

function ErrorView({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-card">
      <p className="font-display text-xs uppercase tracking-[0.2em] text-destructive">
        Something went wrong
      </p>
      <h2 className="mt-2 font-display text-2xl font-semibold">
        We couldn't load this recommendation
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
        >
          Try again
        </button>
        <a
          href="/get-started"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          Start a new recommendation
        </a>
      </div>
    </div>
  );
}

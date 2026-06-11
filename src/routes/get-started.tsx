import { createFileRoute } from "@tanstack/react-router";
import { ProfileForm } from "@/components/form/ProfileForm";

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Get Started · Lumina" },
      {
        name: "description",
        content:
          "Tell us about your qualifications, experience, and career goal — we'll recommend the academic pathway best aligned to you.",
      },
      { property: "og:title", content: "Tell us about yourself · Lumina" },
      {
        property: "og:description",
        content:
          "A short profile is all it takes to receive a personalized academic pathway recommendation.",
      },
    ],
  }),
  component: GetStartedPage,
});

function GetStartedPage() {
  return (
    <section className="hero-light min-h-[calc(100vh-4rem)]">
      <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-2xl">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-accent">Profile</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Tell us about yourself.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Help us understand your background so we can recommend the most suitable academic
            pathway. Takes about two minutes.
          </p>
        </div>
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-elevated sm:p-10">
          <ProfileForm />
        </div>
      </div>
    </section>
  );
}

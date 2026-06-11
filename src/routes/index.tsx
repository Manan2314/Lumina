import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PathwayPreview } from "@/components/landing/PathwayPreview";
import { WhyLumina } from "@/components/landing/WhyLumina";
import { TrustBand } from "@/components/landing/TrustBand";
import { ClosingCTA } from "@/components/landing/ClosingCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumina · Discover the Academic Pathway That Matches Your Ambition" },
      {
        name: "description",
        content:
          "Get a personalized academic pathway recommendation grounded in your qualifications, experience, and career ambitions.",
      },
      { property: "og:title", content: "Lumina · Where Ambition Meets Direction" },
      {
        property: "og:description",
        content:
          "Personalized academic pathway recommendations for professionals, graduates, and lifelong learners.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <PathwayPreview />
      <WhyLumina />
      <TrustBand />
      <ClosingCTA />
    </>
  );
}

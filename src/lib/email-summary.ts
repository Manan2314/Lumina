import { PATHWAY_LABELS, type RecommendResult } from "./recommend";

/**
 * Formats a recommendation as a plain-text block suitable for emailing.
 * Modular and pure — drop into a future Resend server fn without changes.
 */
export function formatEmailSummary(result: RecommendResult, recipientName?: string): string {
  const greeting = recipientName ? `Hi ${recipientName.split(" ")[0]},\n\n` : "";
  const steps = result.nextSteps.map((s, i) => `  ${i + 1}. ${s}`).join("\n");

  return `${greeting}Here is your Lumina academic pathway recommendation.

Recommendation: ${PATHWAY_LABELS[result.pathway]}

Reasoning:
${result.reasoning}

Suggested Next Steps:
${steps}

— Lumina · Where Ambition Meets Direction`;
}

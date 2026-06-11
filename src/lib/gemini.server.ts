// Server-only Gemini integration.
// NEVER import this file from client components — it reads process.env directly.
//
// Usage inside a createServerFn handler:
//   const { generateReasoning } = await import("@/lib/gemini.server");
//   const reasoning = await generateReasoning(profile, pathway, fallback);

import type { Pathway } from "./recommend";

/** Subset of the user profile passed to Gemini. No secrets, no PII beyond what's needed for the prompt. */
export interface GeminiProfile {
  highest_qualification: string;
  years_experience: number;
  current_profession: string;
  career_goal: string;
}

const PATHWAY_NAMES: Record<Pathway, string> = {
  certification: "a targeted Certification Program",
  dba: "a Doctor of Business Administration (DBA)",
  phd: "a Doctor of Philosophy (PhD)",
  honorary: "an Honorary Doctorate",
};

function buildPrompt(profile: GeminiProfile, pathway: Pathway): string {
  return `You are an academic pathway advisor writing a personalised recommendation explanation for a professional. The recommendation system has already selected the pathway — your role is ONLY to write the reasoning, not to change or question the pathway choice.

PROFILE
- Highest qualification: ${profile.highest_qualification}
- Years of professional experience: ${profile.years_experience}
- Current profession: ${profile.current_profession}
- Career goal: ${profile.career_goal}

SELECTED PATHWAY: ${PATHWAY_NAMES[pathway]}

Write 2–3 concise paragraphs (plain prose, no bullet points, no headers, no markdown) explaining:
1. Why this specific pathway is a strong fit for this person's background.
2. How it connects directly to their stated career goal.
3. One concrete encouragement about the journey ahead.

Tone: professional, warm, and direct. Avoid marketing superlatives. Do not suggest a different pathway. Do not mention competitor institutions. Output only the paragraphs — nothing else.`;
}

/**
 * Generate personalised reasoning text using Gemini.
 *
 * @param profile  - User's qualification / experience data
 * @param pathway  - The pathway already selected by the deterministic engine
 * @param fallback - The reasoning produced by the deterministic engine (used on any failure)
 * @param timeoutMs - Maximum time to wait for Gemini before using fallback (default 8 s)
 * @returns Personalised reasoning string, or the fallback if Gemini is unavailable
 */
export async function generateReasoning(
  profile: GeminiProfile,
  pathway: Pathway,
  fallback: string,
  timeoutMs = 8_000,
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Key not configured — silently use the deterministic fallback.
    console.info("[gemini] GEMINI_API_KEY not set — using deterministic reasoning.");
    return fallback;
  }

  try {
    const result = await Promise.race([
      callGemini(apiKey, buildPrompt(profile, pathway)),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini request timed out")), timeoutMs),
      ),
    ]);

    const text = result.trim();
    if (!text || text.length < 60) {
      console.warn("[gemini] Response too short — using deterministic reasoning.");
      return fallback;
    }

    return text;
  } catch (err) {
    // Any failure — network, timeout, quota, bad response — falls back gracefully.
    console.warn("[gemini] Falling back to deterministic reasoning:", (err as Error).message);
    return fallback;
  }
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const res = await fetch(`${url}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 512,
        topP: 0.9,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = await res.json();
  const text: string | undefined = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned an empty or malformed response");
  }

  return text;
}

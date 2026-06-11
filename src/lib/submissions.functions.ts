import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { recommend, type Pathway } from "./recommend";

export interface Submission {
  id: string;
  full_name: string;
  email: string;
  highest_qualification: string;
  years_experience: number;
  current_profession: string;
  career_goal: string;
  recommendation: Pathway;
  recommendation_reasoning: string;
  created_at: string;
}

const submissionInputSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  highest_qualification: z.enum([
    "High School",
    "Diploma",
    "Bachelor's Degree",
    "Master's Degree",
    "Doctorate",
  ]),
  years_experience: z.number().int().min(0).max(80),
  current_profession: z.string().trim().min(1, "Current profession is required").max(160),
  career_goal: z.string().trim().min(10, "Tell us a little more about your goal").max(1000),
});

export type SubmissionInput = z.infer<typeof submissionInputSchema>;

export const createSubmission = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => submissionInputSchema.parse(data))
  .handler(async ({ data }) => {
    // Step 1 — deterministic engine selects the pathway (unchanged).
    const result = recommend({
      highest_qualification: data.highest_qualification,
      years_experience: data.years_experience,
      career_goal: data.career_goal,
      current_profession: data.current_profession,
    });

    // Step 2 — Gemini enriches the reasoning text.
    // Falls back to result.reasoning automatically on any failure or missing key.
    const { generateReasoning } = await import("@/lib/gemini.server");
    const reasoning = await generateReasoning(
      {
        highest_qualification: data.highest_qualification,
        years_experience: data.years_experience,
        current_profession: data.current_profession,
        career_goal: data.career_goal,
      },
      result.pathway,
      result.reasoning, // deterministic fallback
    );

    // Step 3 — persist to Supabase.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: inserted, error } = await supabaseAdmin
      .from("submissions")
      .insert({
        full_name: data.full_name,
        email: data.email,
        highest_qualification: data.highest_qualification,
        years_experience: data.years_experience,
        current_profession: data.current_profession,
        career_goal: data.career_goal,
        recommendation: result.pathway,
        recommendation_reasoning: reasoning,
      })
      .select()
      .single();

    if (error || !inserted) {
      throw new Error(error?.message ?? "Failed to save submission");
    }

    return { id: inserted.id as string };
  });

const idSchema = z.object({ id: z.string().uuid() });

export const getSubmission = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => idSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("submissions")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Submission not found");
    return row as unknown as Submission;
  });

export const listSubmissions = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as Submission[];
});

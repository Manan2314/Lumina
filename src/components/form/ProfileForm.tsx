import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createSubmission } from "@/lib/submissions.functions";

const QUALIFICATIONS = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
] as const;

const schema = z.object({
  full_name: z.string().trim().min(1, "Please enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  highest_qualification: z.enum(QUALIFICATIONS, {
    message: "Choose your highest qualification",
  }),
  years_experience: z
    .number({ message: "Enter your years of experience" })
    .int()
    .min(0, "Cannot be negative")
    .max(80, "Please enter a realistic value"),
  current_profession: z.string().trim().min(1, "Enter your current profession").max(160),
  career_goal: z
    .string()
    .trim()
    .min(10, "Tell us a little more about your goal")
    .max(1000, "Please keep this under 1000 characters"),
});

type FormValues = z.infer<typeof schema>;

export function ProfileForm() {
  const navigate = useNavigate();
  const submit = useServerFn(createSubmission);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: "",
      email: "",
      highest_qualification: undefined as unknown as FormValues["highest_qualification"],
      years_experience: undefined as unknown as number,
      current_profession: "",
      career_goal: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setPending(true);
    try {
      const { id } = await submit({ data: values });
      navigate({ to: "/recommendation/$id", params: { id } });
    } catch (err) {
      console.error(err);
      toast.error("We couldn't generate your recommendation. Please try again.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name" fieldId="field-full-name" error={errors.full_name?.message}>
          <input
            id="field-full-name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            aria-invalid={!!errors.full_name}
            aria-describedby={errors.full_name ? "field-full-name-error" : undefined}
            className={fieldClass(!!errors.full_name)}
            {...register("full_name")}
          />
        </Field>

        <Field label="Email Address" fieldId="field-email" error={errors.email?.message}>
          <input
            id="field-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "field-email-error" : undefined}
            className={fieldClass(!!errors.email)}
            {...register("email")}
          />
        </Field>

        <Field
          label="Highest Qualification"
          fieldId="field-highest-qualification"
          error={errors.highest_qualification?.message}
        >
          <select
            id="field-highest-qualification"
            aria-invalid={!!errors.highest_qualification}
            aria-describedby={
              errors.highest_qualification ? "field-highest-qualification-error" : undefined
            }
            className={fieldClass(!!errors.highest_qualification)}
            defaultValue=""
            {...register("highest_qualification")}
          >
            <option value="" disabled>
              Select your highest qualification
            </option>
            {QUALIFICATIONS.map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Years of Work Experience"
          fieldId="field-years-experience"
          error={errors.years_experience?.message}
        >
          <input
            id="field-years-experience"
            type="number"
            inputMode="numeric"
            min={0}
            max={80}
            placeholder="e.g. 6"
            aria-invalid={!!errors.years_experience}
            aria-describedby={errors.years_experience ? "field-years-experience-error" : undefined}
            className={fieldClass(!!errors.years_experience)}
            {...register("years_experience", { valueAsNumber: true })}
          />
        </Field>

        <Field
          label="Current Profession"
          fieldId="field-current-profession"
          error={errors.current_profession?.message}
          className="sm:col-span-2"
        >
          <input
            id="field-current-profession"
            type="text"
            placeholder="e.g. Senior Product Manager, Healthcare"
            aria-invalid={!!errors.current_profession}
            aria-describedby={
              errors.current_profession ? "field-current-profession-error" : undefined
            }
            className={fieldClass(!!errors.current_profession)}
            {...register("current_profession")}
          />
        </Field>

        <Field
          label="Career Goal"
          fieldId="field-career-goal"
          hint="What direction are you aiming at over the next 3–5 years?"
          error={errors.career_goal?.message}
          className="sm:col-span-2"
        >
          <textarea
            id="field-career-goal"
            rows={4}
            placeholder="e.g. Move into executive leadership at a global health-tech company and contribute to applied strategy research."
            aria-invalid={!!errors.career_goal}
            aria-describedby={errors.career_goal ? "field-career-goal-error" : undefined}
            className={fieldClass(!!errors.career_goal, "min-h-[112px] resize-y py-3")}
            {...register("career_goal")}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          We use your responses only to generate your recommendation. No spam, ever.
        </p>
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Preparing…
            </>
          ) : (
            <>
              Generate My Academic Pathway <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  fieldId,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  fieldId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const errorId = `${fieldId}-error`;
  return (
    <div className={"block " + (className ?? "")}>
      <label
        htmlFor={fieldId}
        className="mb-1.5 flex items-center justify-between gap-2 text-sm font-medium text-foreground"
      >
        {label}
        {hint ? <span className="text-xs font-normal text-muted-foreground">{hint}</span> : null}
      </label>
      {children}
      {error ? (
        <span id={errorId} role="alert" className="mt-1.5 block text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </div>
  );
}

function fieldClass(hasError: boolean, extra = "") {
  return [
    "block w-full rounded-lg border bg-card px-3.5 py-2.5 text-sm text-foreground shadow-sm placeholder:text-muted-foreground/70 transition-colors focus:outline-none focus:ring-2",
    hasError
      ? "border-destructive/60 focus:border-destructive focus:ring-destructive/30"
      : "border-input hover:border-foreground/20 focus:border-accent focus:ring-accent-ring",
    extra,
  ].join(" ");
}

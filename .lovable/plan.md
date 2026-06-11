# Lumina — Refined Build Plan

Production-grade EdTech recommendation platform. TanStack Start + Tailwind v4 + shadcn, backed by Lovable Cloud (Supabase) for real persistence.

## 1. Backend (Lovable Cloud)

Enable Lovable Cloud, then apply a migration:

```sql
create type public.pathway as enum (
  'certification', 'dba', 'phd', 'honorary'
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  highest_qualification text not null,
  years_experience int not null check (years_experience >= 0 and years_experience <= 80),
  current_profession text not null,
  career_goal text not null,
  recommendation public.pathway not null,
  recommendation_reasoning text not null,
  created_at timestamptz not null default now()
);

grant select, insert on public.submissions to anon, authenticated;
grant all on public.submissions to service_role;

alter table public.submissions enable row level security;

-- Public assessment tool: anyone can submit, anyone can read aggregate list
-- (assignment scope — no auth). Documented in README for reviewers.
create policy "anyone can insert submission"
  on public.submissions for insert to anon, authenticated with check (true);

create policy "anyone can read submissions"
  on public.submissions for select to anon, authenticated using (true);

create index submissions_created_at_idx on public.submissions (created_at desc);
```

Reviewer note: open RLS is an intentional, documented scope choice for the assignment (no auth). Tightening to per-user reads is a one-policy change once auth is added.

## 2. Data Layer (modular, swappable)

`src/lib/recommend.ts` — pure deterministic engine:

```ts
recommend(input): {
  pathway: 'certification' | 'dba' | 'phd' | 'honorary',
  strength: 'Recommended Pathway' | 'Strong Match' | 'Excellent Alignment',
  reasoning: string,        // 2–3 sentence rationale
  benefits: string[],
  nextSteps: string[],
  growth: string[],
}
```

Rules (illustrative):

- High School / Diploma, or Bachelor's <3y → Certification (Recommended)
- Bachelor's 3y+ aiming at expertise → Certification (Strong Match)
- Master's + 5y+ leadership/executive goal → DBA (Excellent Alignment)
- Master's/Doctorate + research/teaching goal → PhD (Excellent Alignment)
- Doctorate + 15y+ distinguished/industry-contribution goal → Honorary (Strong Match)

`src/lib/submissions.functions.ts` — TanStack server fns:

- `createSubmission` — zod-validated insert via `requireSupabaseAuth`-free public client (admin client inside handler), returns the new row including computed recommendation fields.
- `listSubmissions` — returns ordered list for the dashboard.
- `getSubmission(id)` — used by `/recommendation/$id`.

Recommendation is computed server-side inside `createSubmission` so the DB always stores the engine's truth.

`src/lib/email-summary.ts` — pure formatter producing the email-ready block (Recommendation / Reasoning / Suggested Next Steps). Used by the UI today; ready to drop into a Resend server fn later.

## 3. Design System

`src/styles.css` tokens (oklch equivalents):

- Light: bg `#F8FAFC`, card `#FFFFFF`, fg `#0F172A`, accent `#0EA5E9`
- Dark: bg `#0F172A`, card `#1E293B`, fg `#F1F5F9`, accent `#38BDF8`
- Plus border, muted, ring, soft accent tint, two custom shadows (`--shadow-card`, `--shadow-elevated`), and one restrained radial light gradient used only behind the hero.
- Fonts loaded via `<link>` in `__root.tsx`: **Fraunces** (display serif, headlines — gives the university credibility) + **Inter** (UI/body). Registered as `--font-display` / `--font-sans`.
- Class-based dark mode via `<html class="dark">`, persisted toggle in header.

All component colors via semantic tokens — zero hardcoded hex.

## 4. Logo (refined)

`<LuminaMark />` — minimal compass-meets-sunrise:

- A thin 3/4 arc (the compass ring / horizon)
- A single tapered needle/ray rising from center-bottom through the arc opening
- One small dot at the needle's tip (the point of arrival)
- Pure stroke, `currentColor`, 1.5px weight, perfectly geometric
- Reads as guidance + direction + a rising path; works at 16px favicon and 64px header
- Wordmark "Lumina" in Fraunces beside it, slight negative tracking

## 5. Routes

```
src/routes/
  __root.tsx           shell, fonts, theme provider, header/footer, toaster
  index.tsx            landing
  how-it-works.tsx     extended process page
  get-started.tsx      profile form
  recommendation.$id.tsx  loading → fetched result
  submissions.tsx      dashboard
```

Each route ships its own `head()` with unique title, description, og tags.

TanStack Query wiring per template defaults (loader `ensureQueryData` + `useSuspenseQuery`).

## 6. Landing Page

**Hero**

- Eyebrow: "Where Ambition Meets Direction"
- Headline (Fraunces, large): _"Discover the Academic Pathway That Matches Your Ambition."_
- Sub: "Lumina helps professionals and lifelong learners gain clarity on their next academic and career move — a personalized pathway grounded in your qualifications, experience, and ambitions."
- Primary CTA: **Get My Recommendation** → `/get-started`
- Secondary CTA: **Explore How It Works** → `/how-it-works`
- Trust chips (no fake numbers): Personalized Recommendations · Career-Focused Guidance · Academic Growth Planning · Professional Development Insights
- Visual: hand-built SVG journey diagram (Current Position → Evaluation → Recommendation → Academic Growth → Career Advancement) as an elegant vertical stepped flow with quiet accent glow. No stock illustration, no robot, no chatbot.

**How It Works** — 3 numbered cards (Tell Us About Yourself / Profile Evaluation / Receive Your Academic Pathway), Lucide icons (UserRound, Sparkles, Compass), subtle hover lift.

**Pathway Preview** _(new, before any form)_ — 4 premium cards introducing the outcomes:

- Certification Program — "For learners seeking targeted skills and industry-recognized credentials."
- DBA — "For experienced professionals pursuing executive leadership and strategic impact."
- PhD — "For researchers, academics, and knowledge creators."
- Honorary Doctorate — "For distinguished professionals with significant contributions and achievements."
  Each card: pathway name in Fraunces, short description, "Best suited for…" line, quiet accent border on hover.

**Why Lumina** — 4 value cards (Personalized Guidance · Career-Oriented Insights · Academic Growth Planning · Instant Clarity).

**Trust band** _(replaces fake stats)_ — 4 credibility badges with icons (Personalized Recommendations · Career-Focused Guidance · Academic Growth Planning · Professional Development Insights). No fabricated numbers anywhere on the site.

**Closing CTA** — calm conversion band → Get My Recommendation.

## 7. Form Page (`/get-started`)

- Heading: "Tell Us About Yourself" + supportive subheading.
- `react-hook-form` + `zod`, floating labels, helpful placeholders, inline validation, disabled-submit-while-pending, error toasts via sonner.
- Fields: Full Name, Email, Highest Qualification (select: High School / Diploma / Bachelor's / Master's / Doctorate), Years of Work Experience (number 0–80), Current Profession, Career Goal (textarea).
- Submit calls `createSubmission` server fn; on success navigates to `/recommendation/$id`.
- Length caps per input-validation guidance.

## 8. Loading + Results

`/recommendation/$id` route:

- While the query is pending, render `LoadingExperience` — 4 sequential progress steps with checkmark transitions and a smooth determinate bar:
  - Evaluating Qualifications
  - Analyzing Professional Experience
  - Aligning Career Goals
  - Generating Personalized Insights
  - No spinner.
- On data ready, render `ResultsReport`:
  - **Hero card**: pathway name large in Fraunces + **strength badge** (`Recommended Pathway` / `Strong Match` / `Excellent Alignment`) as a refined pill with accent ring.
  - **Why This Recommendation Fits You** — reasoning paragraph.
  - **Key Benefits** — icon bullets.
  - **Suggested Next Steps** — numbered checklist.
  - **Future Growth Opportunities** — quiet card grid.
  - **Email-Ready Summary** — `<EmailSummaryCard />` with a copy button, formatted as:
    ```
    Recommendation: <pathway>
    Reasoning: <paragraph>
    Suggested Next Steps:
      1. …
      2. …
    ```
    Modular component fed by `formatEmailSummary(result)` — wired today, drop-in for a future Resend send.
  - Action buttons: Generate Another Recommendation · View All Submissions.

## 9. Submissions Dashboard (`/submissions`)

Real data via `listSubmissions` server fn.

- 4 analytics cards computed from rows: Total Recommendations · Most Common Pathway · Latest Submission (relative time) · Recent Activity (last 7 days).
- Search (name/email/profession), pathway filter (All + 4 options), responsive table → card list under `sm`.
- Columns: Name · Email · Career Goal (truncate) · Recommendation (pathway pill) · Date.
- Empty state with a quiet CTA back to `/get-started`.

## 10. Polish

- Header uses the responsive grid pattern from the layout rules.
- `animate-fade-in`, `hover-scale`, group-hover translate on cards, smooth progress transitions — restrained, never flashy.
- Focus rings on every interactive element; aria-labels on icon buttons.
- Dark mode parity across every screen.
- Mobile-first; tested at 360 / 768 / 1280.
- Per-route `head()` metadata.

## Out of Scope (explicit)

- Auth (RLS scoped accordingly, documented).
- Resend wiring — the email summary component is ready, the send call is a future step.
- No AI / chatbot / robot imagery. No fake stats. No generic AI gradients.

Ready to build on approval.

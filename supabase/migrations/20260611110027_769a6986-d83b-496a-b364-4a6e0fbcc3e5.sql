CREATE TYPE public.pathway AS ENUM ('certification', 'dba', 'phd', 'honorary');

CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  highest_qualification text NOT NULL,
  years_experience int NOT NULL CHECK (years_experience >= 0 AND years_experience <= 80),
  current_profession text NOT NULL,
  career_goal text NOT NULL,
  recommendation public.pathway NOT NULL,
  recommendation_reasoning text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.submissions TO anon, authenticated;
GRANT ALL ON public.submissions TO service_role;

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a submission"
  ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can read submissions"
  ON public.submissions FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX submissions_created_at_idx ON public.submissions (created_at DESC);
# Lumina Pathfinder 🌟

Lumina Pathfinder is a premium, high-fidelity academic pathway recommendation engine built using **TanStack Start**, **Vite**, **Supabase**, and **Tailwind CSS v4**. It guides students and professionals to select the optimal advanced academic pathway (Certification, DBA, PhD, or Honorary Doctorate) using a hybrid approach of deterministic business logic and generative Gemini AI reasoning.

---

## 🚀 Key Features

* **Deterministic Recommendation Engine**: Evaluates professional experience, qualifications, and career goals to select the exact right pathway.
* **Gemini AI Personalized Reasoning**: Uses Google Gemini to generate custom reasoning explaining why the pathway fits the user's specific background.
* **Submissions Dashboard**: View and manage previous recommendations (accessible at `/submissions`).
* **Supabase Core Integration**: Saves entries securely to a database.
* **A11y & Performance Focus**: Fully screen-reader friendly and optimized for high-performance deployment.

---

## 🛠️ Tech Stack

* **Framework**: [TanStack Start](https://tanstack.com/router/latest/docs/start/overview) (React 19 + Vinxi + Nitro)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Database**: [Supabase](https://supabase.com/)
* **AI Engine**: [Google Gemini AI API](https://aistudio.google.com/)
* **Deployment**: Optimized for [Vercel](https://vercel.com/)

---

## 📦 Getting Started

### 1. Prerequisites
Ensure you have Node.js and npm (or Bun) installed.

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` in the root folder:
```bash
cp .env.example .env
```
Fill in the following keys:
```env
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-secret-service-role-key"

VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"

GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Database Setup
Execute the SQL schema found in `supabase/migrations/` inside your **Supabase SQL Editor**:
```sql
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
```

---

## 💻 Commands

### Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) to test locally.

### Production Build
```bash
npm run build
```

---

## 🌐 Deployment to Vercel

1. Push your clean repository to GitHub.
2. Import the project in Vercel.
3. Add the exact environment variables from `.env` in the **Vercel Settings → Environment Variables** tab.
4. Deploy!

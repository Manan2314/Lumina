// Deterministic recommendation engine. Pure function — no I/O, easy to test.

export type Pathway = "certification" | "dba" | "phd" | "honorary";
export type Strength = "Recommended Pathway" | "Strong Match" | "Excellent Alignment";

export const PATHWAY_LABELS: Record<Pathway, string> = {
  certification: "Certification Program",
  dba: "Doctor of Business Administration (DBA)",
  phd: "Doctor of Philosophy (PhD)",
  honorary: "Honorary Doctorate",
};

export const PATHWAY_SHORT: Record<Pathway, string> = {
  certification: "Certification",
  dba: "DBA",
  phd: "PhD",
  honorary: "Honorary Doctorate",
};

export type Qualification =
  | "High School"
  | "Diploma"
  | "Bachelor's Degree"
  | "Master's Degree"
  | "Doctorate";

export interface RecommendInput {
  highest_qualification: Qualification | string;
  years_experience: number;
  career_goal: string;
  current_profession?: string;
}

export interface RecommendResult {
  pathway: Pathway;
  strength: Strength;
  reasoning: string;
  benefits: string[];
  nextSteps: string[];
  growth: string[];
}

const RESEARCH_TERMS = [
  "research",
  "academic",
  "professor",
  "phd",
  "publish",
  "scholar",
  "teach",
  "faculty",
  "scientist",
];
const LEADERSHIP_TERMS = [
  "executive",
  "leader",
  "leadership",
  "ceo",
  "cxo",
  "founder",
  "director",
  "strategy",
  "strategic",
  "consult",
  "transform",
  "vp",
  "vice president",
  "board",
];
const HONORARY_TERMS = [
  "distinguished",
  "lifetime",
  "industry leader",
  "philanthrop",
  "legacy",
  "recognition",
  "honorary",
];

function includesAny(haystack: string, terms: string[]) {
  const h = haystack.toLowerCase();
  return terms.some((t) => h.includes(t));
}

function pathwayFromInput(input: RecommendInput): { pathway: Pathway; strength: Strength } {
  const q = input.highest_qualification;
  const y = input.years_experience;
  const goal = `${input.career_goal} ${input.current_profession ?? ""}`;

  const wantsResearch = includesAny(goal, RESEARCH_TERMS);
  const wantsLeadership = includesAny(goal, LEADERSHIP_TERMS);
  const wantsHonorary = includesAny(goal, HONORARY_TERMS);

  // Honorary — distinguished, long-tenured doctorate holder
  if (q === "Doctorate" && (wantsHonorary || y >= 20)) {
    return { pathway: "honorary", strength: "Strong Match" };
  }

  // PhD — research-oriented goals at master's+
  if ((q === "Master's Degree" || q === "Doctorate") && wantsResearch) {
    return { pathway: "phd", strength: "Excellent Alignment" };
  }

  // DBA — senior leadership goals with significant experience
  if ((q === "Master's Degree" || q === "Doctorate") && wantsLeadership && y >= 5) {
    return { pathway: "dba", strength: "Excellent Alignment" };
  }

  // Master's with experience but no clear research/leadership tilt → DBA suggested with softer strength
  if (q === "Master's Degree" && y >= 7) {
    return { pathway: "dba", strength: "Strong Match" };
  }

  // PhD for master's holders aiming high without leadership keywords
  if (q === "Master's Degree" && wantsResearch === false && wantsLeadership === false && y < 5) {
    return { pathway: "phd", strength: "Recommended Pathway" };
  }

  // Doctorate already — point to honorary recognition path
  if (q === "Doctorate") {
    return { pathway: "honorary", strength: "Recommended Pathway" };
  }

  // Bachelor's seasoned + leadership → DBA after a master's; for now recommend certification toward leadership stack
  if (q === "Bachelor's Degree" && wantsLeadership && y >= 8) {
    return { pathway: "dba", strength: "Recommended Pathway" };
  }

  // Default — certification track for foundational growth
  if (q === "Bachelor's Degree" && y >= 3) {
    return { pathway: "certification", strength: "Strong Match" };
  }

  return { pathway: "certification", strength: "Recommended Pathway" };
}

function reasoningFor(p: Pathway, input: RecommendInput): string {
  const y = input.years_experience;
  const q = input.highest_qualification;
  switch (p) {
    case "certification":
      return `With a ${q.toLowerCase()} background and ${y} year${y === 1 ? "" : "s"} of professional experience, a targeted certification program will give you industry-recognized credentials that compound quickly. It's the highest-leverage move for the goal you described — measurable progress in months, not years, without pausing your career.`;
    case "dba":
      return `Your combination of academic foundation and ${y} year${y === 1 ? "" : "s"} of practice is exactly the profile a Doctor of Business Administration is built for. The DBA translates senior experience into applied research and executive-grade strategic thinking — a credible step toward the leadership trajectory you're aiming at.`;
    case "phd":
      return `Your background and stated direction point clearly toward original research and the academic community. A PhD gives you the rigor, peer network, and credentials to contribute to your field as a knowledge creator rather than a practitioner.`;
    case "honorary":
      return `Your professional standing and the breadth of contribution suggested by your goal align with the criteria for an Honorary Doctorate — a recognition pathway for distinguished professionals whose impact already speaks for itself.`;
  }
}

const BENEFITS: Record<Pathway, string[]> = {
  certification: [
    "Industry-recognized credential employers actively look for",
    "Focused curriculum — outcomes measured in months, not years",
    "Career advancement without pausing your current trajectory",
    "Stackable toward future graduate study",
  ],
  dba: [
    "Executive-grade strategic and applied-research capability",
    "Credibility for board, C-suite, and consulting roles",
    "Cohort of senior peers across industries",
    "Doctoral title without leaving full-time practice",
  ],
  phd: [
    "Recognized credential in academia and research-led organizations",
    "Mentorship from established researchers in your field",
    "Authorship, publication, and conference presence",
    "Foundation for faculty, fellowship, and senior R&D roles",
  ],
  honorary: [
    "Formal recognition of distinguished professional contribution",
    "Doctoral title conferred on the strength of your work",
    "Strengthens authority for speaking, advising, and board roles",
    "Cements legacy and long-term industry standing",
  ],
};

const NEXT_STEPS: Record<Pathway, string[]> = {
  certification: [
    "Shortlist 2–3 certifications aligned to your target role",
    "Confirm prerequisites, time commitment, and assessment format",
    "Block weekly study time and set a target completion date",
    "Share progress with your manager to align it with a promotion path",
  ],
  dba: [
    "Identify accredited DBA programs that fit your industry focus",
    "Draft a 1-page applied research interest aligned to your work",
    "Secure 2 senior references familiar with your strategic impact",
    "Plan finances and time horizon with your employer or sponsor",
  ],
  phd: [
    "Define a focused research question rooted in your field",
    "Identify 3–5 prospective supervisors whose work overlaps yours",
    "Prepare a competitive research proposal and writing sample",
    "Map funding routes: fellowships, scholarships, and assistantships",
  ],
  honorary: [
    "Compile a comprehensive record of your professional contributions",
    "Identify institutions with values aligned to your body of work",
    "Approach a sponsor or nominator within those institutions",
    "Prepare endorsements from senior figures in your industry",
  ],
};

const GROWTH: Record<Pathway, string[]> = {
  certification: [
    "Promotion into a specialist or lead role within 12–18 months",
    "Foundation to pursue a Master's program down the line",
    "Lateral pivot into a higher-demand domain",
  ],
  dba: [
    "C-suite, board, or partner-track positions",
    "Independent advisory and strategy consulting",
    "Adjunct teaching at executive education programs",
  ],
  phd: [
    "Faculty, postdoctoral, or senior research positions",
    "Research grants and authored publications",
    "Industry R&D leadership or think-tank roles",
  ],
  honorary: [
    "Speaking, advisory, and board roles globally",
    "Recognition that compounds your existing influence",
    "Legacy projects, foundations, and mentorship programs",
  ],
};

export function recommend(input: RecommendInput): RecommendResult {
  const { pathway, strength } = pathwayFromInput(input);
  return {
    pathway,
    strength,
    reasoning: reasoningFor(pathway, input),
    benefits: BENEFITS[pathway],
    nextSteps: NEXT_STEPS[pathway],
    growth: GROWTH[pathway],
  };
}

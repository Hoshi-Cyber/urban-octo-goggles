// src/data/pages/process.ts

/**
 * Process page data model – aligned with
 * “Customized Ideal Process Layout for cvwriting.co.ke”
 * and Fix Plan 201 – Customized Process Layout, Stable and Clean.
 */

/**
 * Single step in the CV process.
 *
 * - title: short, human-readable label for the step
 * - description: 1–2 sentence overview
 * - summary: optional focused one-liner
 * - weDo: what Hoshi / the writer does in this step
 * - youDo: what the client does in this step
 */
export type ProcessStep = {
  title: string;
  description: string;
  summary?: string;
  weDo?: string[];
  youDo?: string[];
};

/**
 * Structured configuration for the "Our Process" block.
 * This is the ONLY source of truth for step data.
 */
export type ProcessStepsConfig = {
  title: string;
  eyebrow?: string;
  items: ProcessStep[];
};

export type DeliverableItem = { label: string };

export type TimelineItem = {
  phase: string;
  window: string;
};

export type CTA = {
  title: string;
  sub: string;
  primaryHref: string;
  primaryLabel: string;
};

export type HeroAction = {
  label: string;
  href: string;
};

export type HeroMetaItem = {
  label: string;
};

export type HeroConfig = {
  eyebrow: string;
  title: string;
  sub: string;
  actions: HeroAction[];
  meta: HeroMetaItem[];
};

const processPage = {
  title: "How We Work on Your CV",
  description:
    "A structured, four-step CV writing process for Kenya’s job market and ATS systems — from intake and role targeting to drafts, revisions, and final delivery.",
  seo: { canonical: "/process/" },

  // Hero configuration for the process page
  hero: {
    eyebrow: "Process",
    title: "How We Work on Your CV",
    sub: "A structured, four-step process designed for Kenya’s job market and ATS systems. You know what happens at every stage, when to expect drafts, and how to give feedback.",
    actions: [
      {
        label: "Start your CV project",
        href: "/contact/",
      },
    ],
    meta: [
      { label: "Typical projects: 3–5 days" },
      { label: "Work via email & WhatsApp" },
      { label: "Clear revision window for each draft" },
    ],
  } as HeroConfig,

  // Short intro body copy for any legacy/header usage
  intro:
    "A structured, four-step process designed for Kenya’s job market and ATS systems. You know what happens at every stage, when to expect drafts, and how to give feedback.",

  /**
   * Step-by-step process (aligned to Customized Ideal Process Layout).
   *
   * NOTE:
   * - Titles are pure labels (no "Step 1 —" prefix); the visual STEP X label
   *   is handled by the component.
   * - description: short overview paragraph.
   * - summary: focused one-line version of the step.
   * - weDo / youDo: bullets for “What we do” and “What you do”.
   */
  steps: {
    title: "Our Process",
    eyebrow: "Step-by-step",
    items: [
      {
        title: "Intake & role targeting",
        description:
          "You complete a short intake form, share your existing CV (if any), and send example job descriptions or roles you’re targeting. We confirm your goals and payment to secure your slot.",
        summary: "We clarify your goals, roles, and target applications.",
        weDo: [
          "Confirm payment and secure your project slot.",
          "Review your intake form, existing CV (if any), and target roles.",
          "Highlight any gaps or clarifications needed before we start drafting.",
        ],
        youDo: [
          "Pay (e.g. via M-Pesa) to confirm your project.",
          "Complete the intake form with your background and goals.",
          "Share target roles, example job descriptions, and any existing CV.",
        ],
      },
      {
        title: "Drafting & ATS alignment",
        description:
          "We restructure and rewrite your CV for clarity, impact, and ATS compatibility, using language and expectations that fit Kenya’s job market and your target roles.",
        summary:
          "We rebuild your CV for clarity, impact, and ATS alignment for Kenya’s job market.",
        weDo: [
          "Restructure and rewrite your CV for a clear, recruiter-friendly flow.",
          "Align content with ATS and Kenya-specific role expectations and language.",
          "Pull out achievements, metrics, and impact where available.",
        ],
        youDo: [
          "Share any missing details or achievements we request during drafting.",
          "Flag any hard constraints (non-negotiable details or role preferences).",
        ],
      },
      {
        title: "Review & revisions",
        description:
          "You review the first draft, share comments, and highlight any gaps. We refine content, structure, and presentation within a clear revision window so the document feels accurate and authentic.",
        summary:
          "We refine the draft based on your feedback so the CV feels accurate and authentic.",
        weDo: [
          "Provide a first draft within the agreed timeline.",
          "Review your comments and questions in detail.",
          "Refine content, structure, and presentation within the defined revision window.",
        ],
        youDo: [
          "Review the first draft carefully within the revision window.",
          "Share comments, corrections, and any missing information.",
          "Confirm when the revised draft feels accurate and ready to finalise.",
        ],
      },
      {
        title: "Final polish & delivery",
        description:
          "We apply final edits, formatting, and checks, then deliver your CV (and cover letter / LinkedIn guidance if included in your plan) in PDF and editable formats, ready for applications.",
        summary:
          "We finalise formatting, checks, and deliver your CV (and add-ons) ready for applications.",
        weDo: [
          "Apply final edits, formatting, and quality checks.",
          "Deliver your CV in both PDF and editable formats.",
          "Include cover letter and LinkedIn guidance where your plan includes them.",
          "Provide short guidance on how to adapt the CV for future roles.",
        ],
        youDo: [
          "Store your final files safely and back them up.",
          "Use the guidance notes to adapt your CV for new roles and applications.",
        ],
      },
    ] as ProcessStep[],
  } as ProcessStepsConfig,

  // What clients receive
  deliverables: [
    { label: "ATS-ready CV (PDF + editable DOCX)" },
    {
      label:
        "Cover letter and LinkedIn optimisation guidance where included in your plan",
    },
    {
      label:
        "Targeted keyword and ATS alignment for Kenya job boards and employer portals",
    },
    {
      label:
        "Clear, recruiter-friendly structure with quantified achievements where available",
    },
    {
      label:
        "Short guidance notes on how to adapt your CV for future roles and applications",
    },
    {
      label:
        "Support within a defined revisions window (typically up to 7 days from first draft)",
    },
    {
      label:
        "Optional rush delivery upgrade for urgent roles (subject to availability)",
    },
  ] as DeliverableItem[],

  // Typical timeline expectations
  timeline: [
    { phase: "Payment & intake", window: "Day 0–1" },
    { phase: "First draft", window: "Day 2–3" },
    { phase: "Review & revisions", window: "Day 4–5" },
    { phase: "Final delivery", window: "Day 5–7" },
  ] as TimelineItem[],

  // CTA banner
  cta: {
    title: "Ready to start your CV project?",
    sub: "Share your details and target roles, and we’ll confirm your slot and next steps.",
    primaryHref: "/contact/",
    primaryLabel: "Start Your CV Project",
  } as CTA,
};

export default processPage;

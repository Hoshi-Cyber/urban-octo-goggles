// src/data/pages/samples.ts

export type Level = "Graduate" | "Entry" | "Mid" | "Senior" | "Executive";

export type Media = {
  src: string; // root-relative under /public
  alt: string;
  width?: number;
  height?: number;
};

export type Sample = {
  id: string;
  title: string;
  level: Level;
  industry: string;
  before: string;
  after: string;
  // Preview image placed under /public/assets/images/samples/<id>.jpg
  media?: Media | null;
};

const items: Sample[] = [
  {
    id: "grad-accounting",
    title: "Graduate — Accounting",
    level: "Graduate",
    industry: "Accounting",
    before: "Responsible for accounting tasks.",
    after:
      "Managed daily journal entries and helped cut reconciliation discrepancies by 20%.",
    media: {
      src: "/assets/images/samples/grad-accounting.jpg",
      alt: "Graduate accounting CV preview",
      width: 960,
      height: 1280,
    },
  },
  {
    id: "entry-it",
    title: "Entry-Level — IT Support",
    level: "Entry",
    industry: "IT",
    before: "Fixed computer issues.",
    after: "Resolved 30+ incidents weekly (HW/SW), improving office uptime.",
    media: {
      src: "/assets/images/samples/entry-it.jpg",
      alt: "IT support CV preview",
      width: 960,
      height: 1280,
    },
  },
  {
    id: "mid-marketing",
    title: "Mid-Career — Marketing",
    level: "Mid",
    industry: "Marketing",
    before: "Worked on campaigns.",
    after: "Led multi-channel campaigns, +35% brand engagement.",
    media: {
      src: "/assets/images/samples/mid-marketing.jpg",
      alt: "Marketing CV preview",
      width: 960,
      height: 1280,
    },
  },
  {
    id: "senior-finance",
    title: "Senior — Finance",
    level: "Senior",
    industry: "Finance",
    before: "Managed budgets.",
    after: "Oversaw KSh 100M+ budgets; new controls cut overspend 15%.",
    media: {
      src: "/assets/images/samples/senior-finance.jpg",
      alt: "Finance CV preview",
      width: 960,
      height: 1280,
    },
  },
  {
    id: "ngo-pm",
    title: "NGO — Project Management",
    level: "Mid",
    industry: "NGO",
    before: "Led projects in the community.",
    after:
      "Coordinated programs impacting 5,000+ beneficiaries; cross-functional teams.",
    media: {
      src: "/assets/images/samples/ngo-pm.jpg",
      alt: "NGO PM CV preview",
      width: 960,
      height: 1280,
    },
  },
  {
    id: "exec-ops",
    title: "Executive — Operations",
    level: "Executive",
    industry: "Operations",
    before: "Head of operations.",
    after: "Directed multi-site ops (200+ staff), −KSh 2M annual costs.",
    media: {
      src: "/assets/images/samples/exec-ops.jpg",
      alt: "Executive operations CV preview",
      width: 960,
      height: 1280,
    },
  },
];

// Filters
const LEVEL_ORDER: Level[] = [
  "Graduate",
  "Entry",
  "Mid",
  "Senior",
  "Executive",
];

export const levels: Level[] = Array.from(
  new Set(items.map((i) => i.level)),
).sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b));

export const industries: string[] = Array.from(
  new Set(items.map((i) => i.industry)),
).sort();

// Page config
const samplesPage = {
  title: "CV Samples",
  description:
    "See examples of our work across different career levels and industries.",
  seo: { canonical: "/samples/" },
  filters: { levels, industries },
  items,
} as const;

export default samplesPage;

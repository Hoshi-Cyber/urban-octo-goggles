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
  // Optional preview image placed under /public (e.g. /assets/samples/<industry>/<file>.jpg)
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
      src: "/assets/samples/accounting/graduate-accounting-1.jpg",
      alt: "Transformed CV layout for a graduate accountant",
      width: 640,
      height: 360,
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
      src: "/assets/samples/it/it-support-1.jpg",
      alt: "Transformed CV layout for an entry-level IT support specialist",
      width: 640,
      height: 360,
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
      src: "/assets/samples/marketing/mid-marketing-1.jpg",
      alt: "Transformed CV layout for a mid-career marketing professional",
      width: 640,
      height: 360,
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
      src: "/assets/samples/finance/senior-finance-1.jpg",
      alt: "Transformed CV layout for a senior finance manager",
      width: 640,
      height: 360,
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
      src: "/assets/samples/ngo/project-manager-1.jpg",
      alt: "Transformed CV layout for an NGO project manager",
      width: 640,
      height: 360,
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
      src: "/assets/samples/operations/executive-operations-1.jpg",
      alt: "Transformed CV layout for an executive head of operations",
      width: 640,
      height: 360,
    },
  },

  // High-value samples with anonymised thumbnails under /assets/samples/

 {
  id: "senior-software-engineer-fintech",
  title: "Senior Software Engineer — Fintech",
  level: "Senior",
  industry: "IT",
  before:
    "CV lists multiple projects in long paragraphs, mixes programming languages and tools without context, and has no clear summary. Achievements are described as duties, with no metrics or mention of scale.",
  after:
    "Structured CV around a sharp profile summary, a concise tech stack section, and outcome-focused experience bullets. Highlighted impact using metrics such as payment uptime, transaction volumes, and production issue reduction, and grouped projects under relevant roles.",
  media: {
    src: "/assets/samples/it/senior-software-engineer-1.jpg",
    alt: "Transformed CV layout for a senior software engineer in fintech",
    width: 640,
    height: 360,
  },
},

  {
    id: "registered-nurse-referral-hospital",
    title: "Registered Nurse — Referral Hospital",
    level: "Mid",
    industry: "Healthcare",
    before:
      "CV is formatted as a long narrative with overlapping dates and facility details repeated several times. Clinical duties are generic and do not show any patient outcomes or special responsibilities.",
    after:
      "Rebuilt the CV into clear sections for clinical experience, key procedures, and professional development. Emphasised triage efficiency, ward leadership, infection control initiatives, and patient satisfaction outcomes, with clean, ATS-ready formatting.",
    media: {
      src: "/assets/samples/healthcare/registered-nurse-1.jpg",
      alt: "Transformed CV layout for a registered nurse in a referral hospital",
      width: 640,
      height: 360,
    },
  },
  {
    id: "logistics-coordinator-fmcg",
    title: "Logistics Coordinator — FMCG",
    level: "Mid",
    industry: "Logistics",
    before:
      "CV lists warehouse and dispatch tasks in a single block of text with no mention of volumes, route planning, or cost savings. Systems and tools are buried in a miscellaneous section at the end.",
    after:
      "Introduced a profile summary and a dedicated “Logistics & Systems Expertise” section. Reframed experience to show daily order volumes, on-time delivery rates, route optimisation, and stock variance reduction, with tools like ERPs and TMS clearly surfaced.",
    media: {
      src: "/assets/samples/logistics/logistics-coordinator-1.jpg",
      alt: "Transformed CV layout for a logistics coordinator in FMCG",
      width: 640,
      height: 360,
    },
  },
  {
    id: "programme-officer-ingo",
    title: "Programme Officer — International NGO",
    level: "Mid",
    industry: "NGO",
    before:
      "Experience section lists community activities by location but does not show budgets managed, partner coordination, or donor reporting responsibilities. The CV has inconsistent formatting across roles.",
    after:
      "Organised experience around grant-funded projects with clear budgets, target populations, and geographic coverage. Highlighted partner coordination, donor compliance, logframe monitoring, and reporting to HQ and donors, using consistent bullet structures.",
    media: {
      src: "/assets/samples/ngo/programme-officer-1.jpg",
      alt: "Transformed CV layout for a programme officer in an international NGO",
      width: 640,
      height: 360,
    },
  },
  {
    id: "high-school-teacher-math-physics",
    title: "High School Teacher — Mathematics & Physics",
    level: "Mid",
    industry: "Education",
    before:
      "CV simply lists schools taught at and subjects handled, without showing results, responsibilities beyond classroom teaching, or co-curricular involvement.",
    after:
      "Restructured the CV to include mean grade improvements, exam performance trends, and responsibility for clubs, mentorship, and departmental roles. Clarified teaching loads, syllabus coverage, and involvement in curriculum review and exam setting.",
    media: {
      src: "/assets/samples/education/high-school-teacher-1.jpg",
      alt: "Transformed CV layout for a high school mathematics and physics teacher",
      width: 640,
      height: 360,
    },
  },
  {
    id: "sales-executive-fmcg",
    title: "Sales Executive — Fast-Moving Consumer Goods",
    level: "Mid",
    industry: "Sales",
    before:
      "The CV lists a long set of daily sales activities but does not show territory size, route structure, or revenue growth. Key accounts and trade marketing initiatives are not visible.",
    after:
      "Refocused the CV on territory coverage, monthly targets, portfolio mix, and year-on-year growth. Highlighted key account wins, route-to-market optimisation, merchandising execution, and collaboration with marketing on promotions.",
    media: {
      src: "/assets/samples/sales/sales-executive-1.jpg",
      alt: "Transformed CV layout for a sales executive in FMCG",
      width: 640,
      height: 360,
    },
  },
  {
    id: "operations-manager-manufacturing",
    title: "Operations Manager — Manufacturing Plant",
    level: "Senior",
    industry: "Operations",
    before:
      "Experience is written as a broad description of “overseeing operations” with minimal reference to production lines, output, or cost control. Health and safety responsibilities are underplayed.",
    after:
      "Defined production throughput, shift structures, and team size. Emphasised efficiency gains, downtime reduction, safety improvements, and cross-functional coordination with maintenance, quality, and supply chain.",
    media: {
      src: "/assets/samples/operations/operations-manager-1.jpg",
      alt: "Transformed CV layout for an operations manager in a manufacturing plant",
      width: 640,
      height: 360,
    },
  },
  {
    id: "data-analyst-telecoms",
    title: "Data Analyst — Telecoms",
    level: "Mid",
    industry: "IT",
    before:
      "CV mixes technical and business content and lists tools without context. Insights and dashboards are not linked to any decisions or performance metrics.",
    after:
      "Rebuilt the CV around analytics impact: churn analysis, campaign performance, customer segmentation, and revenue protection. Clarified use of SQL, BI tools, and scripting, tying each to business decisions and measurable results.",
    media: {
      src: "/assets/samples/it/data-analyst-1.jpg",
      alt: "Transformed CV layout for a data analyst in telecoms",
      width: 640,
      height: 360,
    },
  },
  {
    id: "bdm-b2b-services",
    title: "Business Development Manager — B2B Services",
    level: "Senior",
    industry: "Sales",
    before:
      "Document is a long list of client meetings and proposals with no closed deals or revenue figures. Territory and segment focus are unclear.",
    after:
      "Positioned the role around pipeline management, deals closed, and strategic accounts. Added revenue growth, deal sizes, and sectors targeted, plus collaboration with product and operations to deliver proposals and implementation.",
    media: {
      src: "/assets/samples/sales/business-development-manager-1.jpg",
      alt: "Transformed CV layout for a business development manager in B2B services",
      width: 640,
      height: 360,
    },
  },

  // Remaining samples, now with thumbnails as well

  {
    id: "csr-call-centre",
    title: "Customer Service Representative — Call Centre",
    level: "Entry",
    industry: "Customer Service",
    before:
      "CV is one page with generic statements like “good communication skills” and “works well under pressure”, and very little detail on call types, KPIs, or tools used.",
    after:
      "Clarified inbound vs outbound responsibilities, average daily calls, first-call resolution, NPS/CSAT scores, and adherence to scripts and quality audits. Added tools such as CRM platforms, ticketing systems, and call monitoring software.",
    media: {
      src: "/assets/samples/customer-service/customer-service-rep-1.jpg",
      alt: "Transformed CV layout for a call centre customer service representative",
      width: 640,
      height: 360,
    },
  },
  {
    id: "junior-accountant-sme",
    title: "Junior Accountant — SME",
    level: "Entry",
    industry: "Finance",
    before:
      "CV lists all tasks in one block, mixing bookkeeping, admin support, and cashier work. There is no clarity on systems used or the specific reports prepared.",
    after:
      "Separated responsibilities into bookkeeping, reconciliations, and reporting. Highlighted use of accounting packages, preparation of bank and supplier reconciliations, and support for VAT, PAYE, and other statutory returns in line with local regulations.",
    media: {
      src: "/assets/samples/finance/junior-accountant-1.jpg",
      alt: "Transformed CV layout for a junior accountant in an SME",
      width: 640,
      height: 360,
    },
  },
  {
    id: "hr-officer-multi-site",
    title: "HR Officer — Multi-Site Organisation",
    level: "Mid",
    industry: "HR",
    before:
      "Original CV is heavily task-based with lines such as “handled recruitment” and “managed payroll”, without numbers or scope. Policies and culture work are not mentioned.",
    after:
      "Defined headcount coverage, number of roles recruited per quarter, and payroll cycles supported. Showed involvement in policy rollout, performance management, onboarding, and employee engagement programmes across multiple sites.",
    media: {
      src: "/assets/samples/hr/hr-officer-1.jpg",
      alt: "Transformed CV layout for an HR officer in a multi-site organisation",
      width: 640,
      height: 360,
    },
  },
  {
    id: "grants-compliance-officer-ngo",
    title: "Grants & Compliance Officer — NGO",
    level: "Mid",
    industry: "NGO",
    before:
      "CV describes reviewing reports and checking documentation but provides no detail on donor types, portfolio size, or compliance frameworks.",
    after:
      "Defined grant portfolio values, donors handled, and audit outcomes. Emphasised policy implementation, sub-grant monitoring, due diligence reviews, and training of partners on compliance requirements.",
    media: {
      src: "/assets/samples/ngo/grants-compliance-officer-1.jpg",
      alt: "Transformed CV layout for an NGO grants and compliance officer",
      width: 640,
      height: 360,
    },
  },
  {
    id: "storekeeper-wholesale-distribution",
    title: "Storekeeper — Wholesale & Distribution",
    level: "Entry",
    industry: "Logistics",
    before:
      "CV blends storekeeping and general labour tasks, with no system references and no mention of stock accuracy or shrinkage controls.",
    after:
      "Clarified responsibilities for stock receiving, binning, cycle counts, and dispatch. Highlighted stock accuracy, shrinkage reduction, and familiarity with basic warehouse systems and documentation.",
    media: {
      src: "/assets/samples/logistics/storekeeper-1.jpg",
      alt: "Transformed CV layout for a storekeeper in wholesale and distribution",
      width: 640,
      height: 360,
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

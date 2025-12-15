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
    title: "Graduate Accountant — First Role CV",
    level: "Graduate",
    industry: "Accounting",
    before:
      "Listed coursework and basic office duties with no link to real business impact.",
    after:
      "Turned attachment and internship work into clear bullets on reconciliations, audit support, and 98% accuracy in daily postings for a busy SME finance team.",
    media: {
      src: "/assets/samples/accounting/graduate-accounting.jpg",
      alt: "Transformed CV layout for a graduate accountant",
      width: 640,
      height: 360,
    },
  },
  {
    id: "mid-internal-auditor",
    title: "Internal Auditor — Commercial & NGOs",
    level: "Mid",
    industry: "Accounting",
    before:
      "Listed audit assignments without showing risk areas, recommendations, or follow-up.",
    after:
      "Showed end-to-end responsibility for operational and compliance audits, identifying control gaps and supporting actions that reduced repeat findings across Kenyan branches.",
    media: {
      src: "/assets/samples/accounting/internal-auditor.jpg",
      alt: "Transformed CV layout for a mid-level internal auditor",
      width: 640,
      height: 360,
    },
  },
  {
    id: "entry-it",
    title: "IT Support Technician — Early Career",
    level: "Entry",
    industry: "IT",
    before:
      "Described helping users with computer issues in a single, generic sentence.",
    after:
      "Showed how they resolved 30+ hardware and software tickets weekly, met internal SLAs, and reduced user downtime across two Nairobi offices.",
    media: {
      src: "/assets/samples/it/it-support.jpg",
      alt: "Transformed CV layout for an entry-level IT support specialist",
      width: 640,
      height: 360,
    },
  },
  {
    id: "data-analyst-telecoms",
    title: "Data Analyst — Telecoms & Customer Insights",
    level: "Mid",
    industry: "IT",
    before:
      "Listed tools such as Excel and SQL without explaining how the analysis was used.",
    after:
      "Highlighted dashboards and insight reports used by leadership to track churn, informing retention campaigns that reduced customer exits in key segments.",
    media: {
      src: "/assets/samples/it/data-analyst.jpg",
      alt: "Transformed CV layout for a data analyst in telecoms",
      width: 640,
      height: 360,
    },
  },
  {
    id: "senior-software-engineer-fintech",
    title: "Senior Software Engineer — Fintech Platforms",
    level: "Senior",
    industry: "IT",
    before:
      "Technical stack was listed without showing impact on fintech products or users.",
    after:
      "Showed ownership of core payments services handling 1M+ monthly transactions, with improvements in latency, reliability, and uptime for East African customers.",
    media: {
      src: "/assets/samples/it/senior-software-engineer.jpg",
      alt: "Transformed CV layout for a senior software engineer in fintech",
      width: 640,
      height: 360,
    },
  },
  {
    id: "mid-network-engineer-it-telecoms",
    title: "Network Engineer — ISP & Telecoms",
    level: "Mid",
    industry: "IT",
    before:
      "Listed network technologies without describing environments or uptime expectations.",
    after:
      "Showed support for carrier-grade networks, incident response, and projects that improved uptime and bandwidth for corporate and home users across Kenya.",
    media: {
      src: "/assets/samples/it/network-engineer.jpg",
      alt: "Transformed CV layout for a network engineer in telecoms",
      width: 640,
      height: 360,
    },
  },
  {
    id: "mid-marketing",
    title: "Marketing Executive — Brand & Digital",
    level: "Mid",
    industry: "Marketing",
    before:
      "Mentioned ‘working on campaigns’ without channels, budget, or results.",
    after:
      "Positioned as lead on multi-channel campaigns that grew social reach by 45%, lifted email engagement by 28%, and increased qualified leads from Kenyan SMEs.",
    media: {
      src: "/assets/samples/marketing/mid-marketing.jpg",
      alt: "Transformed CV layout for a mid-career marketing professional",
      width: 640,
      height: 360,
    },
  },
  {
    id: "mid-digital-marketing-specialist",
    title: "Digital Marketing Specialist — E-commerce & Services",
    level: "Mid",
    industry: "Marketing",
    before:
      "CV only stated ‘managing social media pages’ without platforms or results.",
    after:
      "Showed performance across paid and organic channels, including ROAS on campaigns, growth in website leads, and impact of SEO and email automation in Kenya.",
    media: {
      src: "/assets/samples/marketing/digital-marketing-specialist.jpg",
      alt: "Transformed CV layout for a digital marketing specialist",
      width: 640,
      height: 360,
    },
  },
  {
    id: "senior-finance",
    title: "Finance Manager — Regional Operations",
    level: "Senior",
    industry: "Finance",
    before:
      "Summarised the role as ‘overseeing finance department’ with a long list of duties.",
    after:
      "Clarified responsibility for a KSh 500M+ P&L, month-end close within 5 working days, and cost-saving initiatives that trimmed operating expenses by 12%.",
    media: {
      src: "/assets/samples/finance/senior-finance.jpg",
      alt: "Transformed CV layout for a senior finance manager",
      width: 640,
      height: 360,
    },
  },
  {
    id: "executive-finance-director-banking",
    title: "Finance Director — Banking & SACCOs",
    level: "Executive",
    industry: "Finance",
    before:
      "High-level bullets on ‘overseeing finance’ with no scale of responsibility.",
    after:
      "Positioned as board-level partner overseeing KSh 10B+ balance sheet, capital adequacy, and strategic initiatives that improved ROE and regulatory compliance.",
    media: {
      src: "/assets/samples/finance/finance-director.jpg",
      alt: "Transformed CV layout for a finance director in banking and SACCOs",
      width: 640,
      height: 360,
    },
  },
  {
    id: "junior-accountant-sme",
    title: "Junior Accountant — SME Environment",
    level: "Entry",
    industry: "Finance",
    before:
      "Mixed junior tasks like filing, invoicing, and admin with no clear structure.",
    after:
      "Clarified contribution to AR/AP processing, payroll support, vendor reconciliations, and keeping debtor and creditor ageing within agreed terms.",
    media: {
      src: "/assets/samples/finance/junior-accountant.jpg",
      alt: "Transformed CV layout for a junior accountant in an SME",
      width: 640,
      height: 360,
    },
  },
  {
    id: "ngo-pm",
    title: "Project Manager — Community & NGO Programmes",
    level: "Mid",
    industry: "NGO",
    before: "Vague statements about ‘leading community projects’ with no scale.",
    after:
      "Highlighted coordination of multi-donor programmes across 3 counties, managing budgets of KSh 40M+ and delivering services to 5,000+ beneficiaries annually.",
    media: {
      src: "/assets/samples/ngo/project-manager.jpg",
      alt: "Transformed CV layout for an NGO project manager",
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
      "Policy and advocacy work was buried under generic administration tasks.",
    after:
      "Brought out grant management across multiple donors, stakeholder engagement with government and INGOs, and consistent delivery against logframe indicators.",
    media: {
      src: "/assets/samples/ngo/programme-officer.jpg",
      alt: "Transformed CV layout for a programme officer in an international NGO",
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
      "Policy-heavy bullets that did not show responsibility for funds or audits.",
    after:
      "Showed stewardship of multi-million shilling grants, adherence to donor rules, timely reporting, and zero disallowed costs in recent compliance audits.",
    media: {
      src: "/assets/samples/ngo/grants-compliance-officer.jpg",
      alt: "Transformed CV layout for an NGO grants and compliance officer",
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
      "Described caring for patients in long paragraphs without numbers or specialisms.",
    after:
      "Rewrote into concise bullets on triage volumes, nurse-to-patient ratios, specialised clinics covered, and contribution to reduced readmission and infection rates.",
    media: {
      src: "/assets/samples/healthcare/registered-nurse.jpg",
      alt: "Transformed CV layout for a registered nurse in a referral hospital",
      width: 640,
      height: 360,
    },
  },
  {
    id: "mid-clinical-officer",
    title: "Clinical Officer — Hospital & Outreach Clinics",
    level: "Mid",
    industry: "Healthcare",
    before:
      "Combined outpatient, inpatient, and outreach work into one dense paragraph.",
    after:
      "Separated experience into OPD, inpatient, and outreach services, highlighting daily patient volumes, common conditions managed, and contribution to reduced referrals.",
    media: {
      src: "/assets/samples/healthcare/clinical-officer.jpg",
      alt: "Transformed CV layout for a clinical officer",
      width: 640,
      height: 360,
    },
  },
  {
    id: "logistics-coordinator-fmcg",
    title: "Logistics Coordinator — FMCG Distribution",
    level: "Mid",
    industry: "Logistics",
    before: "Generic bullet about ‘coordinating deliveries and stock’.",
    after:
      "Quantified daily route planning for 40+ outlets, 98% on-time delivery performance, and reduced transport costs through load optimisation and vendor consolidation.",
    media: {
      src: "/assets/samples/logistics/logistics-coordinator.jpg",
      alt: "Transformed CV layout for a logistics coordinator in FMCG",
      width: 640,
      height: 360,
    },
  },
  {
    id: "senior-supply-chain-manager",
    title: "Supply Chain Manager — FMCG & Distribution",
    level: "Senior",
    industry: "Logistics",
    before:
      "Job description-style bullets covering procurement, warehousing, and transport.",
    after:
      "Quantified responsibility for end-to-end supply chain spend, vendor management, warehouse optimisation, and route planning across multiple Kenyan regions.",
    media: {
      src: "/assets/samples/logistics/supply-chain-manager.jpg",
      alt: "Transformed CV layout for a supply chain manager",
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
      "Basic stock-taking duties mentioned with no indication of volume or systems.",
    after:
      "Detailed management of 3,000+ SKUs, accurate bin card and system records, reduced stock-outs, and support for regular cycle counts and audits.",
    media: {
      src: "/assets/samples/logistics/storekeeper.jpg",
      alt: "Transformed CV layout for a storekeeper in wholesale and distribution",
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
      "Long paragraph listing subjects taught, clubs, and responsibilities with no results.",
    after:
      "Structured bullets on mean grade improvements, KCSE pass rates, remedial programmes, and curriculum leadership for Mathematics and Physics departments.",
    media: {
      src: "/assets/samples/education/high-school-teacher.jpg",
      alt: "Transformed CV layout for a high school mathematics and physics teacher",
      width: 640,
      height: 360,
    },
  },
  {
    id: "graduate-teacher-education",
    title: "Graduate Teacher — First Posting",
    level: "Graduate",
    industry: "Education",
    before:
      "CV focused on university projects and teaching practice with little structure.",
    after:
      "Framed teaching practice into clear bullets on lesson planning, classroom management, and use of CBC-aligned methods across public and private schools.",
    media: {
      src: "/assets/samples/education/graduate-teacher.jpg",
      alt: "Transformed CV layout for a graduate teacher",
      width: 640,
      height: 360,
    },
  },
  {
    id: "senior-school-principal",
    title: "School Principal — Day & Boarding School",
    level: "Senior",
    industry: "Education",
    before:
      "Long narrative about managing school operations without key performance indicators.",
    after:
      "Showed leadership of 800+ learners and 60 staff, improvement in KCSE mean scores, fee collection, and implementation of policies that strengthened school reputation.",
    media: {
      src: "/assets/samples/education/school-principal.jpg",
      alt: "Transformed CV layout for a school principal",
      width: 640,
      height: 360,
    },
  },
  {
    id: "sales-executive-fmcg",
    title: "Sales Executive — Modern & General Trade (FMCG)",
    level: "Mid",
    industry: "Sales",
    before:
      "Focused on daily route visits and merchandising with limited sales context.",
    after:
      "Framed territory management across 120+ outlets, 15% year-on-year sales growth, improved visibility on key SKUs, and consistent achievement of monthly targets.",
    media: {
      src: "/assets/samples/sales/sales-executive.jpg",
      alt: "Transformed CV layout for a sales executive in FMCG",
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
      "Generic statements about ‘bringing in new business’ and ‘building relationships’.",
    after:
      "Quantified ownership of a KSh 80M+ pipeline, average deal size and win rates, and strategic relationships with regional key accounts and channel partners.",
    media: {
      src: "/assets/samples/sales/business-development-manager.jpg",
      alt: "Transformed CV layout for a business development manager in B2B services",
      width: 640,
      height: 360,
    },
  },
  {
    id: "executive-head-of-sales",
    title: "Head of Sales — National & Regional Markets",
    level: "Executive",
    industry: "Sales",
    before:
      "Broad statements about ‘driving sales growth’ and ‘leading teams’ with no context.",
    after:
      "Clarified ownership of national sales strategy, multi-region teams, key account relationships, and revenue growth across Kenyan and East African markets.",
    media: {
      src: "/assets/samples/sales/head-of-sales.jpg",
      alt: "Transformed CV layout for a head of sales",
      width: 640,
      height: 360,
    },
  },
  {
    id: "csr-call-centre",
    title: "Customer Service Representative — Call Centre",
    level: "Entry",
    industry: "Customer Service",
    before:
      "Described answering calls and resolving complaints without evidence of quality.",
    after:
      "Positioned as a top-quartile CSR handling 80+ calls per shift, 90% first-call resolution, strong QA scores, and positive feedback from Kenyan customers.",
    media: {
      src: "/assets/samples/customer-service/customer-service-rep.jpg",
      alt: "Transformed CV layout for a call centre customer service representative",
      width: 640,
      height: 360,
    },
  },
  {
    id: "entry-front-office-receptionist",
    title: "Front Office Receptionist — Corporate Office",
    level: "Entry",
    industry: "Customer Service",
    before:
      "Described ‘answering calls and welcoming visitors’ in one short sentence.",
    after:
      "Clarified handling 100+ calls and walk-in clients daily, managing switchboard, visitor log, and meeting room bookings while maintaining a professional front office.",
    media: {
      src: "/assets/samples/customer-service/front-office-receptionist.jpg",
      alt: "Transformed CV layout for a front office receptionist",
      width: 640,
      height: 360,
    },
  },
  {
    id: "senior-customer-experience-manager",
    title: "Customer Experience Manager — Telco & Digital Channels",
    level: "Senior",
    industry: "Customer Service",
    before:
      "Generic bullets about ‘improving customer satisfaction’ without evidence.",
    after:
      "Showed ownership of NPS and CES metrics, design of feedback loops across call centre, retail shops, and apps, and projects that cut complaints on key journeys by 20%+.",
    media: {
      src: "/assets/samples/customer-service/customer-experience-manager.jpg",
      alt: "Transformed CV layout for a customer experience manager",
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
      "Broad HR responsibilities listed in a block of text with little indication of scale.",
    after:
      "Mapped HR support across 4 sites and 200+ staff, leading recruitment cycles, onboarding, and employee relations while maintaining compliant HR records.",
    media: {
      src: "/assets/samples/hr/hr-officer.jpg",
      alt: "Transformed CV layout for an HR officer in a multi-site organisation",
      width: 640,
      height: 360,
    },
  },
  {
    id: "mid-talent-acquisition-specialist",
    title: "Talent Acquisition Specialist — High-Volume Hiring",
    level: "Mid",
    industry: "HR",
    before:
      "Mentioned ‘recruiting staff’ without volumes, timelines, or strategic input.",
    after:
      "Showed ownership of 40–60 hires per quarter, optimisation of sourcing channels, and reduced time-to-fill for critical roles in Nairobi and regional offices.",
    media: {
      src: "/assets/samples/hr/talent-acquisition-specialist.jpg",
      alt: "Transformed CV layout for a talent acquisition specialist",
      width: 640,
      height: 360,
    },
  },
  {
    id: "senior-hr-manager",
    title: "HR Manager — Multi-Branch Kenyan Company",
    level: "Senior",
    industry: "HR",
    before:
      "Duties-focused bullets on recruitment, payroll, and discipline with no scale.",
    after:
      "Positioned as HR lead for 400+ staff across 6 locations, driving workforce planning, ER cases, HRIS implementation, and initiatives that reduced annual staff turnover.",
    media: {
      src: "/assets/samples/hr/hr-manager.jpg",
      alt: "Transformed CV layout for a senior HR manager",
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
      "Job description pasted from contract with no indication of scope or results.",
    after:
      "Showed responsibility for 24/7 plant operations, improved OEE by 12%, reduced scrap and rework, and led HSE initiatives that cut reportable incidents.",
    media: {
      src: "/assets/samples/operations/operations-manager.jpg",
      alt: "Transformed CV layout for an operations manager in a manufacturing plant",
      width: 640,
      height: 360,
    },
  },
  {
    id: "exec-ops",
    title: "Executive Head of Operations — Multi-Site",
    level: "Executive",
    industry: "Operations",
    before:
      "High-level bullet points about ‘driving operations’ with little context or scale.",
    after:
      "Articulated leadership of 300+ staff across 5 sites, double-digit improvement in OTIF delivery, and end-to-end optimisation from procurement to last-mile fulfilment.",
    media: {
      src: "/assets/samples/operations/executive-operations.jpg",
      alt: "Transformed CV layout for an executive head of operations",
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
  title: "CV Samples & Before/After Transformations",
  description:
    "Explore anonymised CV samples for Kenyan professionals at graduate, mid-career, senior, and executive level. See how we turn generic responsibilities into clear, quantified impact across industries.",
  seo: { canonical: "/samples/" },
  filters: { levels, industries },
  items,
} as const;

export default samplesPage;

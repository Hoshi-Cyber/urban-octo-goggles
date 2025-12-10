// File: scripts/new-blog-post.mjs
//
// Purpose:
// - Scaffold a new MDX blog post for cvwriting.co.ke under the 5-category system.
// - Enforce canonical defaults per category (layoutPreset, stage, articleType).
// - Generate schema-compliant frontmatter that passes Astro content validation.
//
// Usage (from project root):
//   node scripts/new-blog-post.mjs --category=cv-strategy --title="Modern CV for Kenyan Product Managers" --slug=modern-cv-product-managers-kenya --date=2025-02-01
//
// Arguments:
//   --category   One of: cv-strategy, linkedin, career-growth, kenya-market, hiring-insights (required)
//   --title      Article title (required)
//   --slug       URL-safe slug (optional; derived from title if omitted)
//   --date       Publish date YYYY-MM-DD (optional; defaults to today)
//   --description Meta description (optional; uses TODO placeholder if omitted)
//   --dry-run    If present, prints what would be created without writing to disk
//
// Notes:
// - Creates file at: src/content/blog/<category>/<slug>.mdx
// - Fails safely if the file already exists.

import fs from "node:fs";
import path from "node:path";

// ---------- Helpers ----------

function parseArgs(argv) {
  const args = {};
  for (const raw of argv) {
    if (!raw.startsWith("--")) continue;
    const trimmed = raw.slice(2);
    const [key, ...rest] = trimmed.split("=");
    const value = rest.length > 0 ? rest.join("=") : "true";
    args[key] = value;
  }
  return args;
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// Very light YYYY-MM-DD validator
function isValidDateString(s) {
  if (typeof s !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return false;
  // Extra sanity: month and day consistency
  const [y, m, day] = s.split("-").map((n) => Number(n));
  return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m && d.getUTCDate() === day;
}

// ---------- Category config (canonical defaults) ----------

const CATEGORY_CONFIG = {
  "cv-strategy": {
    label: "CV Strategy",
    layoutPreset: "conversionArticle",
    articleType: "pillar",
    stage: "BOFU",
    heroSrc: "/assets/images/blog/hero/blog-home-hero-01.webp",
  },
  linkedin: {
    label: "LinkedIn",
    layoutPreset: "conversionArticle",
    articleType: "pillar",
    stage: "MOFU",
    heroSrc: "/assets/images/blog/hero/blog-home-hero-02.webp",
  },
  "career-growth": {
    label: "Career Growth",
    layoutPreset: "editorialArticle",
    articleType: "editorial",
    stage: "MOFU",
    heroSrc: "/assets/images/blog/hero/blog-home-hero-03.webp",
  },
  "kenya-market": {
    label: "Kenya Job Market",
    layoutPreset: "analysisArticle",
    articleType: "analysis",
    stage: "TOFU",
    heroSrc: "/assets/images/blog/hero/blog-home-hero-04.webp",
  },
  "hiring-insights": {
    label: "Hiring Insights",
    // Defaulting to analysisArticle; you can manually switch to conversionArticle per post.
    layoutPreset: "analysisArticle",
    articleType: "pillar",
    stage: "MOFU",
    heroSrc: "/assets/images/blog/hero/blog-home-hero-03.webp",
  },
};

// ---------- Template generation ----------

function buildFrontmatter({
  category,
  title,
  description,
  date,
  slug,
}) {
  const cfg = CATEGORY_CONFIG[category];
  const updated = date;
  const metaDescription =
    description ||
    "TODO: Replace with an SEO-focused meta description tailored to this specific article and outcome in Kenya.";

  // Category-specific tag defaults
  let tagsBlock;
  switch (category) {
    case "cv-strategy":
      tagsBlock = [
        '"cv writing"',
        '"cv format kenya"',
        '"ats cv"',
        '"kenya job search"',
      ];
      break;
    case "linkedin":
      tagsBlock = [
        '"linkedin profile kenya"',
        '"linkedin headline"',
        '"personal branding"',
        '"kenya job search"',
      ];
      break;
    case "career-growth":
      tagsBlock = [
        '"career growth kenya"',
        '"promotions"',
        '"leadership"',
        '"career resilience"',
      ];
      break;
    case "kenya-market":
      tagsBlock = [
        '"kenya job market"',
        '"salary trends"',
        '"hiring trends"',
        '"sector insights"',
      ];
      break;
    case "hiring-insights":
      tagsBlock = [
        '"recruiter behaviour kenya"',
        '"shortlisting"',
        '"interviews kenya"',
        '"ats filters"',
      ];
      break;
    default:
      tagsBlock = ['"kenya career"', '"cvwriting.co.ke"'];
  }

  // Generic keyTakeaways placeholders – safe strings
  const keyTakeaways = [
    "TODO: Key takeaway 1 – what changes for the reader after this article.",
    "TODO: Key takeaway 2 – a specific strategic or tactical insight.",
    "TODO: Key takeaway 3 – a local Kenyan nuance or pattern.",
  ];

  const readingTime = 8; // safe default; adjust later manually

  const fmLines = [
    "---",
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${metaDescription.replace(/"/g, '\\"')}"`,
    `date: "${date}"`,
    `updated: "${updated}"`,
    "",
    `category: "${category}"`,
    `layoutVersion: "blog-post-v1"`,
    `layoutPreset: "${cfg.layoutPreset}"`,
    `articleType: "${cfg.articleType}"`,
    "",
    `stage: "${cfg.stage}"`,
    `funnelStage: "${cfg.stage}"`,
    "",
    "tags:",
    ...tagsBlock.map((t) => `  - ${t}`),
    "",
    "cover:",
    `  src: "${cfg.heroSrc}"`,
    `  alt: "TODO: Descriptive cover image alt text for this article"`,
    "",
    "heroImage:",
    `  src: "${cfg.heroSrc}"`,
    `  alt: "TODO: Descriptive hero image alt text for this article"`,
    "",
    `readingTime: ${readingTime}`,
    "",
    "keyTakeaways:",
    ...keyTakeaways.map((kt) => `  - "${kt.replace(/"/g, '\\"')}"`),
    "---",
    "",
  ];

  return fmLines.join("\n");
}

function buildBody({ category, title }) {
  const prettyCategory = CATEGORY_CONFIG[category]?.label ?? "Blog";

  const lines = [
    `# ${title}`,
    "",
    `_Category: ${prettyCategory}_`,
    "",
    "_Intro paragraph – explain who this is for, what problem it solves in Kenya, and what outcome they can expect._",
    "",
    "## Context",
    "",
    "_Set the scene: what is happening in the Kenyan market, and why this topic matters now?_",
    "",
    "## Framework",
    "",
    "_Lay out a simple model, steps, or structure your reader can remember._",
    "",
    "## Steps",
    "",
    "_Turn the framework into clear actions your reader can take._",
    "",
    "## Mistakes",
    "",
    "_Call out frequent mistakes Kenyan professionals make on this topic._",
    "",
    "## Examples",
    "",
    "_Show one or two concrete, Kenya-specific examples or mini case studies._",
    "",
    "## Implementation Checklist",
    "",
    "_Optional: summarise the implementation steps as a checklist band if relevant to this category._",
    "",
    "## DIY vs Expert",
    "",
    "_Help the reader decide when to DIY and when to hire cvwriting.co.ke for a done-for-you solution._",
    "",
  ];

  return lines.join("\n");
}

// ---------- Main ----------

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const category = args.category;
  const title = args.title;
  const slugArg = args.slug;
  const dateArg = args.date;
  const descriptionArg = args.description;
  const dryRun = args["dry-run"] === "true" || args["dry-run"] === "1" || args["dry-run"] === "yes";

  if (!category || !CATEGORY_CONFIG[category]) {
    console.error(
      "[new-blog-post] Error: --category is required and must be one of:",
      Object.keys(CATEGORY_CONFIG).join(", "),
    );
    process.exitCode = 1;
    return;
  }

  if (!title) {
    console.error("[new-blog-post] Error: --title is required.");
    process.exitCode = 1;
    return;
  }

  const slug = slugArg && slugArg.trim().length > 0 ? slugify(slugArg) : slugify(title);
  if (!slug) {
    console.error("[new-blog-post] Error: could not derive a valid slug from title. Please pass --slug explicitly.");
    process.exitCode = 1;
    return;
  }

  const date = dateArg && dateArg.trim().length > 0 ? dateArg.trim() : todayISO();
  if (!isValidDateString(date)) {
    console.error(`[new-blog-post] Error: --date must be a valid YYYY-MM-DD string. Received: "${date}"`);
    process.exitCode = 1;
    return;
  }

  const projectRoot = process.cwd();
  const targetDir = path.join(projectRoot, "src", "content", "blog", category);
  const targetFile = path.join(targetDir, `${slug}.mdx`);

  console.log("[new-blog-post] Target file:", path.relative(projectRoot, targetFile));

  if (fs.existsSync(targetFile)) {
    console.error("[new-blog-post] Error: target file already exists. Aborting to avoid overwriting.");
    process.exitCode = 1;
    return;
  }

  const frontmatter = buildFrontmatter({
    category,
    title,
    description: descriptionArg,
    date,
    slug,
  });

  const body = buildBody({ category, title });
  const full = `${frontmatter}${body}`;

  if (dryRun) {
    console.log("[new-blog-post] DRY RUN: file would be created with the following content:\n");
    console.log(full);
    return;
  }

  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, full, { encoding: "utf8" });

  console.log("[new-blog-post] ✓ Created new blog post scaffold.");
  console.log("[new-blog-post]   Path:", path.relative(projectRoot, targetFile));
}

void main();

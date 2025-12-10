// scripts/migrate-blog-categories.mjs
//
// Usage (from project root):
//   node scripts/migrate-blog-categories.mjs --dry-run   # preview only
//   node scripts/migrate-blog-categories.mjs             # apply changes
//
// Requires: gray-matter
//   npm install --save-dev gray-matter

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const DRY_RUN = process.argv.includes("--dry-run");

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "src", "content", "blog");

// Canonical category slugs
const NEW_CATEGORY_SLUGS = new Set([
  "cv-strategy",
  "linkedin",
  "career-growth",
  "kenya-market",
  "hiring-insights",
]);

// Map old category slugs/labels → new canonical slugs
const CATEGORY_SLUG_MAP = {
  "cv-tips": "cv-strategy",
  cv: "cv-strategy",
  "cv-cover-letter-tips": "cv-strategy",
  "cv-and-cover-letter-tips": "cv-strategy",

  linkedin: "linkedin",
  "linked-in": "linkedin",

  "career-growth": "career-growth",
  "career-development": "career-growth",

  "kenya-market": "kenya-market",
  "kenya-job-market": "kenya-market",

  "interview-prep": "hiring-insights",
  interviews: "hiring-insights",
  "hiring-insights": "hiring-insights",
};

// Default layout preset per canonical category
const PRESET_BY_CATEGORY = {
  "cv-strategy": "conversionArticle",
  linkedin: "conversionArticle",
  "career-growth": "editorialArticle",
  "kenya-market": "analysisArticle",
  "hiring-insights": "conversionArticle",
};

// Default funnel stage per canonical category
const STAGE_BY_CATEGORY = {
  "cv-strategy": "BOFU",
  linkedin: "MOFU",
  "career-growth": "MOFU",
  "kenya-market": "TOFU",
  "hiring-insights": "MOFU",
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function findMdxFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMdxFiles(full));
    } else if (entry.isFile() && full.toLowerCase().endsWith(".mdx")) {
      files.push(full);
    }
  }

  return files;
}

function resolveCanonicalCategory(rawCategory, fileRelPath) {
  const trimmed = String(rawCategory || "").trim();

  // Already canonical
  if (NEW_CATEGORY_SLUGS.has(trimmed)) {
    return trimmed;
  }

  const slug = slugify(trimmed);

  if (NEW_CATEGORY_SLUGS.has(slug)) {
    return slug;
  }

  if (CATEGORY_SLUG_MAP[slug]) {
    return CATEGORY_SLUG_MAP[slug];
  }

  if (trimmed) {
    console.warn(
      `[WARN] ${fileRelPath} :: Unmapped category "${trimmed}" (slug="${slug}") – leaving as-is`,
    );
  }

  return trimmed || null;
}

function migrateFile(filePath) {
  const rel = path.relative(ROOT, filePath);
  const source = fs.readFileSync(filePath, "utf8");
  const parsed = matter(source);
  const data = { ...(parsed.data || {}) };
  const body = parsed.content || "";

  const originalCategory = data.category;
  const canonicalCategory = resolveCanonicalCategory(originalCategory, rel);

  if (!canonicalCategory) {
    console.warn(
      `[WARN] ${rel} :: No category resolved; skipping preset/stage defaults.`,
    );
  } else {
    data.category = canonicalCategory;

    // layoutPreset – only set if missing
    if (!data.layoutPreset) {
      const preset = PRESET_BY_CATEGORY[canonicalCategory];
      if (preset) {
        data.layoutPreset = preset;
      }
    }

    // funnel stage – set both stage and funnelStage if missing
    const defaultStage = STAGE_BY_CATEGORY[canonicalCategory];
    if (defaultStage) {
      if (!data.stage) data.stage = defaultStage;
      if (!data.funnelStage) data.funnelStage = defaultStage;
    }
  }

  const changed =
    data.category !== parsed.data.category ||
    data.layoutPreset !== parsed.data.layoutPreset ||
    data.stage !== parsed.data.stage ||
    data.funnelStage !== parsed.data.funnelStage;

  if (!changed) {
    return { rel, changed: false };
  }

  if (DRY_RUN) {
    console.log(
      `[DRY-RUN] ${rel} :: category="${parsed.data.category}" → "${data.category}", layoutPreset="${data.layoutPreset}", stage="${data.stage}"`,
    );
    return { rel, changed: true };
  }

  const next = matter.stringify(body, data);
  fs.writeFileSync(filePath, next, "utf8");

  console.log(
    `[UPDATE] ${rel} :: category="${parsed.data.category}" → "${data.category}", layoutPreset="${data.layoutPreset}", stage="${data.stage}"`,
  );
  return { rel, changed: true };
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`[ERROR] Blog content directory not found: ${BLOG_DIR}`);
    process.exitCode = 1;
    return;
  }

  const files = findMdxFiles(BLOG_DIR);

  if (files.length === 0) {
    console.log("[INFO] No MDX files found under src/content/blog.");
    return;
  }

  console.log(
    `[INFO] Found ${files.length} MDX file(s). DRY_RUN=${DRY_RUN ? "yes" : "no"}`,
  );

  let changedCount = 0;

  for (const file of files) {
    const result = migrateFile(file);
    if (result.changed) changedCount++;
  }

  console.log(
    `[DONE] Processed ${files.length} file(s); ${changedCount} file(s) updated.`,
  );

  if (DRY_RUN) {
    console.log(
      "[NOTE] Run again WITHOUT --dry-run to apply these changes to disk.",
    );
  }
}

main();

/**
 * File: scripts/validate-blog-ia.ts
 *
 * Fix Plan 205.1.4 – IA Validation / Linting for MDX
 *
 * Purpose:
 * - Scan MDX blog posts using the new layout (`layoutVersion: "blog-post-v1"`).
 * - Enforce IA expectations for core SEO pieces (pillar, tactical, FAQ-type):
 *   - Presence and order of key H2 sections:
 *     Context → Framework → Steps → Mistakes → Examples → Implementation Checklist → DIY vs Expert.
 *   - Warnings when `keyTakeaways` or `checklist` are missing from frontmatter where required.
 * - Fail with a non-zero exit code when IA is significantly violated (missing / out-of-order core sections).
 *
 * Usage (from project root):
 *   npx ts-node scripts/validate-blog-ia.ts
 *   # or compile with tsc and run:
 *   node dist/scripts/validate-blog-ia.js
 *
 * Dependencies (install if not already present):
 *   npm install --save-dev gray-matter
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type Severity = "error" | "warning";

interface Issue {
  file: string;
  severity: Severity;
  code:
    | "missing-section"
    | "section-out-of-order"
    | "missing-key-takeaways"
    | "missing-checklist"
    | "steps-missing-subheadings"
    | "invalid-layout-preset";
  message: string;
}

interface Heading {
  depth: 2 | 3;
  text: string;
}

interface BlogFrontmatter {
  layoutVersion?: string;
  articleType?: string;
  layoutPreset?: unknown;
  keyTakeaways?: unknown;
  checklist?: unknown;
  [key: string]: unknown;
}

// Required IA H2 sequence for core SEO posts (pillar / tactical / FAQ-type)
const REQUIRED_H2_SEQUENCE = [
  {
    key: "context",
    label: "Context",
    match: (t: string) => t.includes("context"),
  },
  {
    key: "framework",
    label: "Framework",
    match: (t: string) => t.includes("framework"),
  },
  {
    key: "steps",
    label: "Steps",
    match: (t: string) => t.includes("step"),
  },
  {
    key: "mistakes",
    label: "Mistakes",
    match: (t: string) => t.includes("mistake"),
  },
  {
    key: "examples",
    label: "Examples",
    match: (t: string) => t.includes("example"),
  },
  {
    key: "checklist",
    label: "Implementation Checklist",
    match: (t: string) => t.includes("checklist"),
  },
  {
    key: "diy-vs-expert",
    label: "DIY vs Expert",
    match: (t: string) =>
      t.includes("diy") || (t.includes("do it yourself") && t.includes("expert")),
  },
] as const;

type RequiredSectionKey = (typeof REQUIRED_H2_SEQUENCE)[number]["key"];

const CORE_ARTICLE_TYPES = ["pillar", "tactical", "faq"] as const;

/**
 * Allowed layoutPreset values for BlogPostLayout (Fix Plan 005-09).
 * This must stay in sync with:
 * - Route-level bridge in /pages/blog/[category]/[slug].astro
 * - BlogPostLayout preset resolution logic
 */
const ALLOWED_LAYOUT_PRESETS = [
  "conversionArticle",
  "editorialArticle",
  "analysisArticle",
  "shortInsight",
  "campaignLanding",
] as const;

type LayoutPreset = (typeof ALLOWED_LAYOUT_PRESETS)[number];

/**
 * Entry point.
 */
async function main() {
  const root = process.cwd();
  const contentDir = path.join(root, "src", "content", "blog");

  if (!fs.existsSync(contentDir)) {
    console.error(`[validate-blog-ia] Content directory not found: ${contentDir}`);
    process.exitCode = 1;
    return;
  }

  const mdxFiles = findMdxFiles(contentDir);
  if (mdxFiles.length === 0) {
    console.log("[validate-blog-ia] No MDX files found under src/content/blog.");
    return;
  }

  const issues: Issue[] = [];

  for (const file of mdxFiles) {
    const source = fs.readFileSync(file, "utf8");
    const { data, content } = matter(source);

    const frontmatter = data as BlogFrontmatter;
    if (!shouldValidate(frontmatter)) {
      continue;
    }

    const relative = path.relative(root, file);
    const headings = extractHeadings(content);
    const fileIssues = validateFile(relative, frontmatter, headings);
    issues.push(...fileIssues);
  }

  reportIssues(issues);

  const hasErrors = issues.some((i) => i.severity === "error");
  if (hasErrors) {
    process.exitCode = 1;
  }
}

/**
 * Recursively find all .mdx files under a directory.
 */
function findMdxFiles(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMdxFiles(full));
    } else if (entry.isFile() && full.toLowerCase().endsWith(".mdx")) {
      results.push(full);
    }
  }

  return results;
}

/**
 * Determine whether IA validation should run for this post.
 *
 * Rules:
 * - Only validate posts using the new layout (`layoutVersion === "blog-post-v1"`).
 * - Only validate core SEO article types: pillar, tactical, FAQ-type.
 */
function shouldValidate(frontmatter: BlogFrontmatter): boolean {
  const layout = String(frontmatter.layoutVersion || "").toLowerCase();
  if (layout !== "blog-post-v1") return false;

  const type = String(frontmatter.articleType || "").toLowerCase();
  return CORE_ARTICLE_TYPES.includes(type as (typeof CORE_ARTICLE_TYPES)[number]);
}

/**
 * Extract H2 and H3 headings from MDX body.
 *
 * Implementation:
 * - Simple line-based parser.
 * - Skips fenced code blocks (```).
 * - Keeps only headings starting with "## " or "### ".
 */
function extractHeadings(content: string): Heading[] {
  const lines = content.split(/\r?\n/);
  const headings: Heading[] = [];
  let inFence = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Toggle fenced-code mode
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (line.startsWith("### ")) {
      headings.push({ depth: 3, text: line.slice(4).trim() });
    } else if (line.startsWith("## ")) {
      headings.push({ depth: 2, text: line.slice(3).trim() });
    }
  }

  return headings;
}

/**
 * Normalise a heading’s text for matching.
 * - Lowercase
 * - Strip punctuation
 * - Collapse whitespace
 */
function normaliseHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Run IA validations for a single MDX file.
 */
function validateFile(
  file: string,
  frontmatter: BlogFrontmatter,
  headings: Heading[],
): Issue[] {
  const issues: Issue[] = [];

  // 0) Enforce allowed layoutPreset values (Fix Plan 005-09)
  const rawPreset = frontmatter.layoutPreset;
  const preset =
    typeof rawPreset === "string" && rawPreset.trim().length > 0
      ? (rawPreset.trim() as string)
      : "";

  if (preset) {
    const isAllowed = (ALLOWED_LAYOUT_PRESETS as readonly string[]).includes(
      preset,
    );
    if (!isAllowed) {
      issues.push({
        file,
        severity: "error",
        code: "invalid-layout-preset",
        message: `Invalid layoutPreset "${preset}". Allowed values: ${ALLOWED_LAYOUT_PRESETS.join(
          ", ",
        )}.`,
      });
    }
  }

  const h2 = headings.filter((h) => h.depth === 2);
  const normalisedH2 = h2.map((h) => normaliseHeading(h.text));

  // 1) Enforce presence of key H2 sections
  const foundIndexByKey = new Map<RequiredSectionKey, number>();

  for (const def of REQUIRED_H2_SEQUENCE) {
    const index = normalisedH2.findIndex((t) => def.match(t));
    if (index === -1) {
      issues.push({
        file,
        severity: "error",
        code: "missing-section",
        message: `Missing required H2 section "${def.label}".`,
      });
    } else {
      foundIndexByKey.set(def.key, index);
    }
  }

  // 2) Enforce order of the required H2 sections (where present)
  const presentIndexes = REQUIRED_H2_SEQUENCE.map((def) => ({
    key: def.key,
    label: def.label,
    index: foundIndexByKey.get(def.key as RequiredSectionKey),
  })).filter((x) => typeof x.index === "number") as {
    key: RequiredSectionKey;
    label: string;
    index: number;
  }[];

  for (let i = 1; i < presentIndexes.length; i++) {
    const prev = presentIndexes[i - 1];
    const curr = presentIndexes[i];
    if (prev.index > curr.index) {
      issues.push({
        file,
        severity: "error",
        code: "section-out-of-order",
        message: `Section "${curr.label}" appears before "${prev.label}" in the H2 sequence.`,
      });
    }
  }

  // 3) Steps H2 should have H3 subheadings (soft requirement)
  const stepsIndex = foundIndexByKey.get("steps");
  if (typeof stepsIndex === "number") {
    const globalIndexOfStepsH2 = headings.findIndex(
      (h) => h.depth === 2 && normaliseHeading(h.text) === normalisedH2[stepsIndex],
    );

    if (globalIndexOfStepsH2 !== -1) {
      const hasH3AfterStepsBeforeNextH2 = (() => {
        for (let i = globalIndexOfStepsH2 + 1; i < headings.length; i++) {
          const h = headings[i];
          if (h.depth === 2) return false; // next H2 reached
          if (h.depth === 3) return true; // at least one H3 inside steps block
        }
        return false;
      })();

      if (!hasH3AfterStepsBeforeNextH2) {
        issues.push({
          file,
          severity: "warning",
          code: "steps-missing-subheadings",
          message:
            'Steps section should contain H3 sub-sections (e.g. "Step 1", "Step 2", etc.) but none were found.',
        });
      }
    }
  }

  // 4) Frontmatter: keyTakeaways presence
  const articleType = String(frontmatter.articleType || "").toLowerCase();

  const keyTakeaways = frontmatter.keyTakeaways;
  const hasKeyTakeawaysArray =
    Array.isArray(keyTakeaways) && (keyTakeaways as unknown[]).length > 0;

  if ((articleType === "pillar" || articleType === "tactical") && !hasKeyTakeawaysArray) {
    issues.push({
      file,
      severity: "warning",
      code: "missing-key-takeaways",
      message:
        "keyTakeaways is required for pillar and tactical articles but is missing or empty in frontmatter.",
    });
  }

  if (articleType === "faq" && !hasKeyTakeawaysArray) {
    issues.push({
      file,
      severity: "warning",
      code: "missing-key-takeaways",
      message:
        "keyTakeaways is strongly recommended for FAQ articles but is missing or empty in frontmatter.",
    });
  }

  // 5) Frontmatter: checklist presence for posts that should expose an implementation checklist
  const checklist = frontmatter.checklist;
  const hasChecklist =
    checklist != null &&
    (typeof checklist === "object" || Array.isArray(checklist));

  if ((articleType === "pillar" || articleType === "tactical") && !hasChecklist) {
    issues.push({
      file,
      severity: "warning",
      code: "missing-checklist",
      message:
        "Implementation checklist is expected for pillar and tactical articles but `checklist` is missing in frontmatter.",
    });
  }

  return issues;
}

/**
 * Print issues to stdout in a compact, CI-friendly format.
 */
function reportIssues(issues: Issue[]): void {
  if (issues.length === 0) {
    console.log("[validate-blog-ia] All validated posts satisfy IA checks.");
    return;
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  for (const issue of issues) {
    const tag = issue.severity === "error" ? "ERROR" : "WARN";
    console.log(`[${tag}] ${issue.file} :: ${issue.message}`);
  }

  console.log("");
  console.log(
    `[validate-blog-ia] Summary: ${errors.length} error(s), ${warnings.length} warning(s).`,
  );
}

void main();

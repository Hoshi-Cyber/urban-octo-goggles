import { globby } from "globby";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import YAML from "yaml";

const SITE = "https://cvwriting.co.ke";
const allowed = new Set([
  "cv-tips",
  "linkedin",
  "career-growth",
  "kenya-market",
]);
const mapCategory = (c) =>
  ({
    "cv-and-cover-letter-tips": "cv-tips",
    "linkedin-and-personal-branding": "linkedin",
    "kenya-job-market-insights": "kenya-market",
  })[c] || c;

const stripBOM = (s) => s.replace(/^\uFEFF/, "");
const filenameSlug = (fp) => path.basename(fp, ".md");
const canonicalOf = (category, slug, current) => {
  if (!current || current.startsWith("/"))
    return `${SITE}/blog/${category}/${slug}`;
  try {
    new URL(current);
    return current;
  } catch {
    return `${SITE}/blog/${category}/${slug}`;
  }
};

const fixTags = (tags) => (Array.isArray(tags) ? tags.map(String) : []);

const run = async () => {
  const files = await globby("src/content/blog/**/*.md");
  let changed = 0;
  for (const fp of files) {
    let raw = fs.readFileSync(fp, "utf8");
    raw = stripBOM(raw);
    if (!raw.trim().startsWith("---")) {
      console.warn("[WARN] No frontmatter:", fp);
      continue;
    }

    const parsed = matter(raw);
    const data = parsed.data || {};
    const body = parsed.content || "";

    data.slug = String(data.slug || filenameSlug(fp));
    data.category = mapCategory(
      String(data.category || path.basename(path.dirname(fp))),
    );
    if (!allowed.has(data.category)) {
      console.warn("[WARN] Bad category -> career-growth:", fp, data.category);
      data.category = "career-growth";
    }
    data.canonical = canonicalOf(data.category, data.slug, data.canonical);

    if (String(data.draft).toLowerCase() === "true") data.draft = true;
    if (String(data.draft).toLowerCase() === "false") data.draft = false;
    data.tags = fixTags(data.tags);

    if (
      typeof data.ogImage === "string" &&
      data.ogImage.startsWith("/assets/images/blog/")
    ) {
      const parts = data.ogImage.split("/");
      if (parts.length >= 6) {
        parts[5] = data.category;
        data.ogImage = parts.join("/");
      }
    }

    const yaml = YAML.stringify(data, { aliasDuplicateObjects: false }).trim();
    const out = `---\n${yaml}\n---\n\n${body.trim()}\n`;
    if (out !== raw) {
      fs.writeFileSync(fp, out, "utf8");
      changed++;
    }
  }
  console.log(`Fixed ${changed} file(s).`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

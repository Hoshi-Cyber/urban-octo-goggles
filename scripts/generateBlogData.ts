import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

const OUTPUT_DIR = path.join(process.cwd(), "public", "blog", "_data");
const SEARCH_GLOBS = [
  "src/content/blog/**/*.{md,mdx}",
  "src/pages/blog/**/*.{md,mdx}",
];

type PostRecord = {
  slug: string;
  title: string;
  url: string;
  date: string; // ISO
  tags: string[];
  estReadMin: number;
  cover: { src: string | null; alt: string | null };
};

function inferCategory(fp: string, fmCategory?: unknown): string {
  const fromFM =
    typeof fmCategory === "string" && fmCategory.trim().length > 0
      ? fmCategory.trim()
      : null;
  if (fromFM) return slugify(fromFM);

  const parts = fp.replaceAll("\\", "/").split("/");
  const blogIdx = parts.lastIndexOf("blog");
  if (blogIdx >= 0 && parts.length > blogIdx + 1)
    return slugify(parts[blogIdx + 1]);
  return "general";
}

function urlFromPost(category: string, slug: string): string {
  return `/blog/${category}/${slug}/`;
}

function strOrNull(v: unknown): string | null {
  return typeof v === "string" && v.trim().length ? v.trim() : null;
}
function arrOfString(v: unknown): string[] {
  return Array.isArray(v)
    ? (v.filter((x) => typeof x === "string") as string[])
    : [];
}
function basenameNoExt(fp: string): string {
  const base = path.basename(fp);
  return base.replace(/\.[^.]+$/, "");
}
function fallbackTitleFromPath(fp: string): string | null {
  const b = basenameNoExt(fp).replace(/[-_]/g, " ");
  return b.length ? b : null;
}
function slugifyReadable(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .toLowerCase();
}
function slugify(s: string): string {
  return slugifyReadable(s).replace(/\s+/g, "-");
}
function estimateReadMinutes(text: string): number {
  const words = text
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean).length;
  const wpm = 220;
  return Math.max(1, Math.ceil(words / wpm));
}
function toIsoDate(v: unknown): string | null {
  if (!v) return null;
  const d = new Date(String(v));
  return Number.isFinite(d.getTime()) ? d.toISOString() : null;
}
function fileCtime(fp: string): Date {
  try {
    return fs.statSync(fp).ctime ?? new Date();
  } catch {
    return new Date();
  }
}
function deepGet<T>(obj: any, pathArr: (string | number)[]): T | null {
  try {
    let cur: any = obj;
    for (const k of pathArr) {
      if (cur == null) return null;
      cur = cur[k as any];
    }
    return (cur as T) ?? null;
  } catch {
    return null;
  }
}

async function main() {
  const files = await fg(SEARCH_GLOBS, { dot: false });

  if (files.length === 0) {
    console.warn(
      "[generateBlogData] No markdown posts found under:",
      SEARCH_GLOBS.join(", "),
    );
  }

  const records: PostRecord[] = [];

  for (const fp of files) {
    const raw = await fsp.readFile(fp, "utf8");
    const { data: fm, content } = matter(raw);

    const title = strOrNull(fm.title) ?? fallbackTitleFromPath(fp);
    const dateIso = toIsoDate(fm.date) ?? toIsoDate(fileCtime(fp));
    const tags = arrOfString(fm.tags).map(slugifyReadable);
    const category = inferCategory(fp, fm.category);
    const slug = strOrNull(fm.slug) ?? slugify(basenameNoExt(fp));
    const coverSrc = deepGet<string>(fm, ["cover", "src"]) ?? null;
    const coverAlt =
      deepGet<string>(fm, ["cover", "alt"]) ??
      (title ? `Cover image for ${title}` : null);
    const estReadMin = estimateReadMinutes(content);

    const rec: PostRecord = {
      slug,
      title: title ?? slug,
      url: urlFromPost(category, slug),
      date: dateIso ?? new Date().toISOString(),
      tags,
      estReadMin,
      cover: { src: coverSrc, alt: coverAlt },
    };
    records.push(rec);
  }

  const byCategory = new Map<string, PostRecord[]>();
  for (const r of records) {
    const category = r.url.split("/")[2] || "general"; // /blog/<category>/...
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category)!.push(r);
  }

  await fsp.mkdir(OUTPUT_DIR, { recursive: true });

  for (const [category, arr] of byCategory) {
    const sorted = [...arr].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const outPath = path.join(OUTPUT_DIR, `${category}.json`);
    await fsp.writeFile(outPath, JSON.stringify(sorted, null, 2), "utf8");
    console.log(`[generateBlogData] Wrote ${outPath} (${sorted.length} posts)`);
  }

  const allSorted = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const allPath = path.join(OUTPUT_DIR, `_all.json`);
  await fsp.writeFile(allPath, JSON.stringify(allSorted, null, 2), "utf8");
  console.log(
    `[generateBlogData] Wrote ${allPath} (${allSorted.length} posts)`,
  );
  console.log("[generateBlogData] Done.");
}

main().catch((err) => {
  console.error("[generateBlogData] Fatal:", err);
  process.exit(1);
});

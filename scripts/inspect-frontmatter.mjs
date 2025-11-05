import fs from "fs";
import matter from "gray-matter";

const fp =
  "src/content/blog/cv-tips/2025-cv-format-that-wins-interviews-in-kenya.md";
const raw = fs.readFileSync(fp, "utf8");
const fm = matter(raw);
console.log("Keys:", Object.keys(fm.data));
console.log("slug:", fm.data.slug);
console.log("category:", fm.data.category);
console.log("canonical:", fm.data.canonical);
console.log(
  "--- YAML ---\n" +
    matter.stringify("", fm.data).split("\n").slice(0, 30).join("\n"),
);

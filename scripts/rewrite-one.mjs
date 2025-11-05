import fs from "fs";
import matter from "gray-matter";

const fp =
  "src/content/blog/cv-tips/2025-cv-format-that-wins-interviews-in-kenya.md";
const SITE = "https://cvwriting.co.ke";

// read raw and parse
let raw = fs.readFileSync(fp, "utf8").replace(/^\uFEFF/, "");
const parsed = matter(raw);

// build a clean, minimal front-matter object
const data = {
  title: "2025 CV format that wins interviews in Kenya",
  description:
    "A practical playbook to structure your CV around outcomes so you get more interviews in Kenya.",
  date: "2025-10-20",
  updated: "2025-10-20",
  author: "Sev",
  category: "cv-tips",
  tags: ["Kenya CV format", "ATS", "bullet points"],
  slug: "2025-cv-format-that-wins-interviews-in-kenya",
  draft: false,
  canonical:
    SITE + "/blog/cv-tips/2025-cv-format-that-wins-interviews-in-kenya",
  ogImage:
    "/assets/images/blog/cv-tips/2025-cv-format-that-wins-interviews-in-kenya-hero.webp",
  schemaType: "Article",
  readingTimeMinutes: 7,
  ctaPrimary: {
    label: "Download the Job Market Toolkit",
    url: "/toolkit?utm_source=blog&utm_medium=content&utm_campaign=evergreen_toolkit&utm_content=2025-cv-format-that-wins-interviews-in-kenya",
  },
  ctaSecondary: {
    label: "CV Bullet Generator",
    url: "/cv-bullets?utm_source=blog&utm_medium=content&utm_campaign=evergreen_toolkit&utm_content=2025-cv-format-that-wins-interviews-in-kenya",
  },
  sources: [
    {
      label: "World Bank Kenya Economic Update",
      url: "https://www.worldbank.org/en/country/kenya/publication/kenya-economic-update-keu",
    },
    {
      label: "Kenya Labour Market Profile 2024/2025",
      url: "https://www.ulandssekretariatet.dk/wp-content/uploads/2024/09/Kenya-LMP-2024-final1.pdf",
    },
  ],
};

// stringify with gray-matter to ensure clean YAML
const out = matter.stringify(parsed.content.trim() + "\n", data);
fs.writeFileSync(fp, out, "utf8");
console.log("Rewrote:", fp);

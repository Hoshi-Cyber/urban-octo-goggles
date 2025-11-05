# CVWriting.co.ke Astro Website

This repository contains the source code for **cvwriting.co.ke**, a conversion‑focused CV writing service for the Kenyan market. The project is built with [Astro](https://astro.build/) and uses Markdown for content. It follows modern web standards (WCAG 2.1 AA accessibility, Core Web Vitals performance and technical SEO).

## Getting Started

1. **Install dependencies** (requires Node.js ≥18):

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` in your browser to view the site. Changes to Markdown, Astro components or styles will hot‑reload.

3. **Build for production**:

   ```bash
   npm run build
   npm run preview
   ```

   The compiled site will be output to the `dist/` directory.

## Updating Content

- **Services, pricing and process**: Edit the Markdown files in `src/pages/services/`, `src/data/pricing.json` and `src/pages/process/` to update copy, tiers and steps. The pricing table automatically reflects changes to `pricing.json`.
- **Blog posts**: Add new Markdown files under `src/content/blog/<category>/`. Use the frontmatter schema defined in the expansion pack (title, description, slug, date, category, layout, seo, readingTime). Blog listings are generated automatically.
- **Samples and testimonials**: Modify `src/pages/samples/index.md` and `src/pages/testimonials/index.md` to update anonymised examples and client quotes.
- **Navigation and footer**: Update `src/data/nav.json` and `src/data/footer.json` to alter menu items, CTAs and footer links.
- **Site metadata**: Edit `site.config.json` to change the site URL, default title or description. Structured data scripts in the layout automatically reflect these values.

## Extending the System

- **Components**: Reusable UI blocks live in `src/components/`. Follow existing patterns when adding new components (e.g. create a component in a relevant subfolder and import it into your pages).
- **Styles**: Global design tokens and utilities reside in `src/styles/`. Use the CSS custom properties defined in `tokens.css` and add new utility classes sparingly. Avoid inline styles and keep component‑specific styles within scoped `<style>` tags.
- **SEO & Schema**: Custom SEO tags and structured data can be added via the `seo` property in page frontmatter. Use `script[type="application/ld+json"]` blocks to extend schema for individual pages or posts.
- **Deployment**: After running `npm run build`, deploy the contents of the `dist/` directory to any static hosting provider (e.g. Netlify, Vercel, GitHub Pages). Ensure that `site.config.json` is updated with the final domain before generating the sitemap.

## Contributing

This project is architected to be modular and maintainable. Adhere to the existing directory structure and coding conventions. Ensure that new pages are accessible, performant and adhere to technical SEO best practices. When in doubt, refer back to the expansion pack guidelines for alignment with the strategic vision.

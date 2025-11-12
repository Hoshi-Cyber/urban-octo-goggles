// File: src/components/blog/islands/readingProgress.ts
// Tiny reading progress indicator (Fix Plan 185)
// Updates CSS var --p on #read-progress. ≤2–3KB gzip, no deps.

(() => {
  const bar = document.getElementById("read-progress") as HTMLElement | null;
  if (!bar) return;

  // Respect reduced motion
  const prefersReduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  // Target content region: prefer the post article, fall back to <main>
  const article =
    (document.querySelector("article.post") as HTMLElement | null) ||
    (document.getElementById("post-main") as HTMLElement | null) ||
    (document.getElementById("main") as HTMLElement | null);
  if (!article) return;

  let ticking = false;

  const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

  const compute = () => {
    // Distance from top of document to start of the article
    const articleTop = article.getBoundingClientRect().top + window.scrollY;
    // Total scrollable distance across the article
    const total = Math.max(1, article.scrollHeight - window.innerHeight);
    const progress = clamp01((window.scrollY - articleTop) / total);
    bar.style.setProperty("--p", String(progress));
  };

  const onScrollOrResize = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      compute();
      ticking = false;
    });
  };

  // Initial paint (after styles/images may shift heights)
  if (document.readyState === "complete") {
    compute();
  } else {
    window.addEventListener("load", compute, { once: true, passive: true });
    document.addEventListener("DOMContentLoaded", compute, { once: true });
  }

  // Passive listeners for perf
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") onScrollOrResize();
  });

  // Recompute when images inside the article load (affects height)
  const imgs = article.getElementsByTagName("img");
  for (let i = 0; i < imgs.length; i++) {
    if (!imgs[i].complete) imgs[i].addEventListener("load", onScrollOrResize, { once: true, passive: true });
  }

  // Optional cleanup on soft navigations or bfcache restores
  window.addEventListener(
    "pagehide",
    () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    },
    { passive: true }
  );
})();

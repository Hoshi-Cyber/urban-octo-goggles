// src/scripts/analytics/cta-listeners.ts
// Fix Plan 123.3 — Step 3: Analytics Listener Integration

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

(function initCTAListeners() {
  // Ensure dataLayer
  if (!Array.isArray(window.dataLayer)) window.dataLayer = [];

  // Push helper
  const dlPush = (payload: Record<string, unknown>) => {
    try {
      window.dataLayer.push(payload);
    } catch {
      /* no-op */
    }
  };

  // Click delegation for [data-cta]
  const handleClick = (e: Event) => {
    const target = e.target as Element | null;
    if (!target) return;

    const el = target.closest<HTMLElement>("[data-cta]");
    if (!el) return;

    const section = el.getAttribute("data-cta") || "unknown";
    const label =
      el.getAttribute("data-label") ||
      el.getAttribute("aria-label") ||
      (el.textContent ? el.textContent.trim().slice(0, 120) : "cta");

    // Try to resolve href safely
    let href = "";
    if (el instanceof HTMLAnchorElement) href = el.href || "";
    else href = el.getAttribute("href") || el.dataset.href || "";

    dlPush({
      event: "cta_click",
      section,
      label,
      href,
    });
  };

  // Scroll depth tracking at 25, 50, 75
  const thresholds = [25, 50, 75];
  const fired = new Set<number>();
  let ticking = false;

  const getDocMetrics = () => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollTop = doc.scrollTop || body.scrollTop || 0;
    const viewport = window.innerHeight || doc.clientHeight || 0;
    const fullHeight = Math.max(
      body.scrollHeight,
      doc.scrollHeight,
      body.offsetHeight,
      doc.offsetHeight,
      body.clientHeight,
      doc.clientHeight,
    );
    return { scrollTop, viewport, fullHeight };
  };

  const checkDepth = () => {
    ticking = false;
    const { scrollTop, viewport, fullHeight } = getDocMetrics();
    if (fullHeight <= 0) return;

    const seen = Math.min(((scrollTop + viewport) / fullHeight) * 100, 100);

    for (const t of thresholds) {
      if (seen >= t && !fired.has(t)) {
        fired.add(t);
        dlPush({ event: "scroll_depth", percent: t });
      }
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(checkDepth);
    }
  };

  // Bind listeners once DOM is ready
  const bind = () => {
    document.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial check in case of short pages
    requestAnimationFrame(checkDepth);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }
})();

export {};

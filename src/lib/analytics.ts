// Consent-mode aware analytics bootstrap with zero PII (Fix Plan 185)

type Ctx = Record<string, string | number | boolean | undefined>;
let context: Ctx = {};

/** Merge contextual fields that will be appended to all events */
export function setContext(partial: Ctx) {
  context = { ...context, ...partial };
}

/** Safe push into the first-party dataLayer */
function push(event: Record<string, unknown>) {
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ ...event, ...context });
}

/** Lazy GA4 loader. Only run after consent. */
function loadGA4(measurementId: string) {
  if (!measurementId) return;

  // Inject gtag.js
  const s = document.createElement("script");
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  s.async = true;
  document.head.appendChild(s);

  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag() {
    (window as any).dataLayer.push(arguments);
  }
  (window as any).gtag = gtag;

  gtag("js", new Date());
  gtag("config", measurementId, { anonymize_ip: true });
}

/** Read GA4 ID from <meta name="x-ga4-id"> when not provided via opts */
function resolveGa4Id(explicit?: string) {
  if (explicit) return explicit;
  const meta = document.querySelector('meta[name="x-ga4-id"]') as HTMLMetaElement | null;
  return meta?.content || undefined;
}

/** Returns true if prior choice is "granted" */
function hasGrantedCookie() {
  const m = document.cookie.match(/(?:^|;\s*)consent_analytics=([^;]+)/);
  return m?.[1] === "granted";
}

/** Initialize analytics after consent. Safe to call multiple times. */
export function initAnalytics(opts: { ga4?: { measurementId?: string } } = {}) {
  const measurementId = resolveGa4Id(opts.ga4?.measurementId);

  const start = () => {
    if (!measurementId) return;
    loadGA4(measurementId);
    push({ event: "consent_ready", consent: "analytics_granted" });
  };

  // If user already consented earlier, bootstrap immediately
  if (hasGrantedCookie()) start();

  // Otherwise wait for CMP signal
  window.addEventListener(
    "cmp:accept",
    () => {
      start();
    },
    { once: true }
  );
}

/** Default listeners required by Fix Plan 185 */
export function bindDefaultListeners() {
  // 1) CTA clicks (elements with [data-cta])
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target as Element | null;
      if (!t) return;
      const el = t.closest("[data-cta]") as HTMLElement | null;
      if (!el) return;
      const cta = el.getAttribute("data-cta") || "cta";
      push({ event: "cta_click", cta });
    },
    { capture: true }
  );

  // 2) TOC clicks
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target as Element | null;
      if (!t) return;
      const a = t.closest('.post__toc a, .toc-details .toc-list a') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const slug = href.startsWith("#") ? href.slice(1) : href;
      push({ event: "toc_click", slug });
    },
    { capture: true }
  );

  // 3) Share clicks (copy, WhatsApp, X, LinkedIn)
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target as Element | null;
      if (!t) return;

      // Prefer explicit data-share when present
      const shareEl = t.closest("[data-share]") as HTMLElement | null;
      if (shareEl) {
        const network = shareEl.getAttribute("data-share") || "share";
        push({ event: "share_click", network });
        return;
      }

      // Heuristics on known share links in post footer
      const a = t.closest(".post__share a, .post__share button") as HTMLElement | null;
      if (!a) return;

      let network = "share";
      if (a instanceof HTMLAnchorElement) {
        const href = a.href || "";
        if (/wa\.me|whatsapp\.com/i.test(href)) network = "whatsapp";
        else if (/x\.com|twitter\.com/i.test(href)) network = "x";
        else if (/linkedin\.com/i.test(href)) network = "linkedin";
      } else if (a instanceof HTMLButtonElement) {
        network = "copy";
      }
      push({ event: "share_click", network });
    },
    { capture: true }
  );

  // 4) Pager navigation (prev/next within post navigation)
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target as Element | null;
      if (!t) return;
      const nav = t.closest('nav[aria-label="Post navigation"]') as HTMLElement | null;
      if (!nav) return;
      const a = t.closest("a") as HTMLAnchorElement | null;
      if (!a) return;

      let dir: "prev" | "next" | "unknown" = "unknown";
      const rel = a.getAttribute("rel");
      if (rel === "prev") dir = "prev";
      else if (rel === "next") dir = "next";
      else if (/prev/i.test(a.textContent || "")) dir = "prev";
      else if (/next/i.test(a.textContent || "")) dir = "next";

      // Avoid PII: only send the path
      const url = (() => {
        try {
          const u = new URL(a.href, location.origin);
          return u.pathname + u.search;
        } catch {
          return a.getAttribute("href") || "";
        }
      })();

      push({ event: "pager_nav", dir, url });
    },
    { capture: true }
  );

  // 5) Related clicks
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target as Element | null;
      if (!t) return;
      const relList = t.closest(".post__relatedList") as HTMLElement | null;
      if (!relList) return;
      const a = t.closest("a") as HTMLAnchorElement | null;
      if (!a) return;

      const url = (() => {
        try {
          const u = new URL(a.href, location.origin);
          return u.pathname + u.search;
        } catch {
          return a.getAttribute("href") || "";
        }
      })();

      push({ event: "related_click", url });
    },
    { capture: true }
  );

  // 6) Email subscribe submit (lead magnet). Do not read email value.
  document.addEventListener(
    "submit",
    (e) => {
      const form = e.target as HTMLFormElement | null;
      if (!form) return;
      const action = (form.getAttribute("action") || "").toLowerCase();
      if (!/^\/api\/subscribe\/?/.test(action)) return;
      push({ event: "email_submit" });
    },
    { capture: true }
  );

  // 7) Read depth (25/50/75/100). No PII. Uses viewport relative progress.
  const sent = new Set<number>();
  function onScroll() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const y = Math.max(0, window.scrollY);
    const p = h > 0 ? Math.round((y / h) * 100) : 0;
    [25, 50, 75, 100].forEach((mark) => {
      if (p >= mark && !sent.has(mark)) {
        sent.add(mark);
        push({ event: "read_depth", percent: mark });
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
}

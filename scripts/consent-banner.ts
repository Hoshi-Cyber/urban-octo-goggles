// File: src/scripts/consent-banner.ts
// CSP-friendly consent banner controller.
// - No inline JS required
// - Persists choice in localStorage + cookie
// - Dispatches site-wide consent events
// - Keeps a reserved spacer in-flow to avoid CLS

/* -------------------------------------------------------------------------- */
/* Types & globals                                                            */
/* -------------------------------------------------------------------------- */

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (...args: any[]) => void;
    openCookieBanner?: () => void;
  }
}

const LS_KEY = "consent.analytics.choice"; // 'granted' | 'denied'
const COOKIE_NAME = "consent_analytics";

/* -------------------------------------------------------------------------- */
/* DOM helpers                                                                */
/* -------------------------------------------------------------------------- */

const $ = (id: string) => document.getElementById(id);

/* -------------------------------------------------------------------------- */
/* Storage helpers                                                            */
/* -------------------------------------------------------------------------- */

function getChoice(): "granted" | "denied" | null {
  try {
    const v = localStorage.getItem(LS_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function setChoice(value: "granted" | "denied") {
  try {
    localStorage.setItem(LS_KEY, value);
  } catch {}
  try {
    // Add Secure when on HTTPS. SameSite=Lax prevents cross-site leakage.
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie =
      `${COOKIE_NAME}=${encodeURIComponent(value)}; Max-Age=${3600 * 24 * 365}; Path=/; SameSite=Lax${secure}`;
  } catch {}
}

/* -------------------------------------------------------------------------- */
/* Consent Mode bridge                                                        */
/* -------------------------------------------------------------------------- */

function gtagShim(...args: any[]) {
  window.dataLayer = window.dataLayer || [];
  // Push either an event object or a gtag envelope for later processing
  window.dataLayer.push(args.length === 1 ? args[0] : { event: "gtag", args });
}

function updateConsent(granted: boolean) {
  const payload = granted
    ? {
        analytics_storage: "granted",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        functionality_storage: "granted",
        security_storage: "granted",
      }
    : {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        functionality_storage: "granted",
        security_storage: "granted",
      };

  const gtag = window.gtag || gtagShim;
  gtag("consent", "update", payload);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "consent_choice",
    consent: granted ? "granted" : "denied",
  });

  // Site-wide hooks for analytics bootstrap and UX
  window.dispatchEvent(new CustomEvent(granted ? "cookie:accept" : "cookie:decline"));
  if (granted) window.dispatchEvent(new CustomEvent("cmp:accept"));
}

/* -------------------------------------------------------------------------- */
/* Layout stability (reserved spacer)                                         */
/* -------------------------------------------------------------------------- */

function observeHeight(banner: HTMLElement) {
  const reserve = $("cookie-banner-reserve");
  if (!reserve) return () => {};

  if (typeof ResizeObserver === "function") {
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect?.height) {
        document.documentElement.style.setProperty("--cb-height", `${rect.height}px`);
      }
    });
    ro.observe(banner);
    return () => ro.disconnect();
  }

  // Fallback: single measure
  const h = banner.getBoundingClientRect().height;
  if (h) document.documentElement.style.setProperty("--cb-height", `${h}px`);
  return () => {};
}

/* -------------------------------------------------------------------------- */
/* UI helpers                                                                 */
/* -------------------------------------------------------------------------- */

function show(el?: HTMLElement | null, reserve?: HTMLElement | null) {
  if (el) el.hidden = false;
  if (reserve) reserve.hidden = false;
}

function hide(el?: HTMLElement | null, reserve?: HTMLElement | null) {
  if (el) el.hidden = true;
  if (reserve) reserve.hidden = true;
}

/* -------------------------------------------------------------------------- */
/* Controller                                                                 */
/* -------------------------------------------------------------------------- */

(function run() {
  const banner = $("cookie-banner");
  const reserve = $("cookie-banner-reserve");
  const accept = $("cb-accept");
  const decline = $("cb-decline");

  if (!banner) return;

  // Re-open hook (e.g., footer “Manage cookies” action)
  window.openCookieBanner = function () {
    show(banner, reserve);
    observeHeight(banner as HTMLElement)();
  };

  // First paint: respect prior choice or present banner CLS-safe
  const prior = getChoice();
  if (prior === "granted" || prior === "denied") {
    hide(banner, reserve);
  } else {
    show(banner, reserve);
    observeHeight(banner as HTMLElement)();
  }

  // Wire buttons
  accept?.addEventListener(
    "click",
    () => {
      setChoice("granted");
      updateConsent(true);
      hide(banner, reserve);
    },
    { passive: true }
  );

  decline?.addEventListener(
    "click",
    () => {
      setChoice("denied");
      updateConsent(false);
      hide(banner, reserve);
    },
    { passive: true }
  );

  // Keep height in sync on resize and when tab becomes visible again
  const debounced = (() => {
    let t = 0 as unknown as number;
    return (fn: () => void) => {
      window.clearTimeout(t);
      t = window.setTimeout(fn, 100);
    };
  })();

  const sync = () => {
    if (!banner) return;
    observeHeight(banner as HTMLElement)();
  };

  window.addEventListener("resize", () => debounced(sync), { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") sync();
  });

  // Cross-tab synchronization
  window.addEventListener("storage", (e) => {
    if (e.key === LS_KEY) {
      const v = getChoice();
      if (v === "granted" || v === "denied") hide(banner, reserve);
    }
  });
})();

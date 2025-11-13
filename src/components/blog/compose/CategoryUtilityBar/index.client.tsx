// File: src/components/blog/compose/CategoryUtilityBar/index.client.tsx
// React island for client-side sort/filter + pagination on category pages.
// Mount: <CategoryUtilityBar client:load category={category} pageSize={PER_PAGE} mountId="category-client-list" />

import React, { useEffect, useMemo, useState } from "react";

type Post = {
  slug?: string;
  title: string;
  url: string;
  date: string;               // ISO
  tags: string[];
  estReadMin: number | null;

  // Preferred SSR-parity fields
  thumbnailSrc?: string | null;
  thumbnailAlt?: string | null;
  thumbnailW?: number | null;
  thumbnailH?: number | null;

  // Legacy back-compat
  cover?: { src: string | null; alt: string | null } | null;
};

type Props = {
  category: string;   // e.g., "cv-tips"
  pageSize: number;   // must match server default PER_PAGE
  mountId?: string;   // id of the server grid container to replace (the <ol>)
};

type SortKey = "newest" | "oldest" | "read";

function parseSearch(): { sort: SortKey; tag: string; page: number } {
  if (typeof window === "undefined") return { sort: "newest", tag: "", page: 1 };
  const sp = new URLSearchParams(window.location.search);
  const s = (sp.get("sort") || "newest").toLowerCase();
  const sort: SortKey = s === "oldest" ? "oldest" : s === "read" ? "read" : "newest";
  const tag = sp.get("tag") || "";
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
  return { sort, tag, page };
}

function applySort(arr: Post[], sort: SortKey) {
  const copy = [...arr];
  if (sort === "newest") return copy.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  if (sort === "oldest") return copy.sort((a, b) => +new Date(a.date) - +new Date(b.date));
  // "read" = shortest read first, then newest
  return copy.sort((a, b) => {
    const ar = a.estReadMin ?? Number.MAX_SAFE_INTEGER;
    const br = b.estReadMin ?? Number.MAX_SAFE_INTEGER;
    return ar - br || +new Date(b.date) - +new Date(a.date);
  });
}

function paginate<T>(arr: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return arr.slice(start, start + pageSize);
}

function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }) as const)[c]!
  );
}

/**
 * Build a client dataset from the SSR fallback grid (no network).
 * Looks for: section.ssr-grid ol.pfl__grid li article
 * - title:    h3 a (supports .pfl__cardTitle or .pfl__title)
 * - url:      from the same anchor
 * - date:     time[dateTime]
 * - read:     parsed from .pfl__meta ("· N min read")
 * - image:    .pfl__media img
 */
function readFromSSR(): Post[] {
  if (typeof document === "undefined") return [];
  const container = document.querySelector("section.ssr-grid ol.pfl__grid");
  if (!container) return [];
  const items = Array.from(container.querySelectorAll("li"));
  return items.map((li) => {
    const a =
      (li.querySelector("h3 a") as HTMLAnchorElement | null) ||
      (li.querySelector(".pfl__cardTitle a") as HTMLAnchorElement | null) ||
      (li.querySelector(".pfl__title a") as HTMLAnchorElement | null);
    const url = a?.getAttribute("href") || "#";
    const title = (a?.textContent || "").trim();

    const timeEl = li.querySelector("time") as HTMLTimeElement | null;
    const dateISO = (timeEl?.getAttribute("dateTime") || "").trim();

    const metaText = (li.querySelector(".pfl__meta")?.textContent || "").trim();
    const readMatch = metaText.match(/(\d+)\s*min\s*read/i);
    const estReadMin = readMatch ? Number(readMatch[1]) : null;

    const img = li.querySelector(".pfl__media img") as HTMLImageElement | null;
    const thumbnailSrc = img?.getAttribute("src") || null;
    const thumbnailAlt = img?.getAttribute("alt") || null;
    const thumbnailW = img?.getAttribute("width") ? Number(img.getAttribute("width")) : null;
    const thumbnailH = img?.getAttribute("height") ? Number(img.getAttribute("height")) : null;

    return {
      title,
      url,
      date: dateISO || new Date().toISOString(),
      tags: [],
      estReadMin,
      thumbnailSrc,
      thumbnailAlt,
      thumbnailW,
      thumbnailH,
      cover: null,
    } as Post;
  });
}

export default function CategoryUtilityBar({ category, pageSize, mountId }: Props) {
  const [{ sort, tag, page }, setState] = useState(() => parseSearch());
  const [all, setAll] = useState<Post[] | null>(null);

  // Ensure URL-derived state is applied on mount
  useEffect(() => {
    setState(parseSearch());
  }, []);

  // Load dataset once from SSR (no fetch; no /blog/data/*.json)
  useEffect(() => {
    const fromSSR = readFromSSR();
    if (fromSSR.length > 0) {
      setAll(fromSSR);
    } else {
      // If nothing found, keep SSR as-is by leaving `all` null.
      setAll(null);
    }
  }, []);

  // Back/forward support
  useEffect(() => {
    const onPop = () => setState(parseSearch());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Derived lists
  const filtered = useMemo(() => {
    if (!all) return [];
    const base = tag ? all.filter((p) => p.tags?.includes(tag)) : all;
    return applySort(base, sort);
  }, [all, sort, tag]);

  const totalPages = useMemo(() => {
    if (!all) return 1;
    const n = tag ? all.filter((p) => p.tags?.includes(tag)).length : all.length;
    return Math.max(1, Math.ceil(n / pageSize));
  }, [all, pageSize, tag]);

  const pageItems = useMemo(() => paginate(filtered, page, pageSize), [filtered, page, pageSize]);

  // Clamp page after data load
  useEffect(() => {
    if (page > totalPages) pushState({ page: totalPages });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  // URL/state sync
  function pushState(next: { sort?: string; tag?: string; page?: number }) {
    const sp = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    if (next.sort !== undefined) sp.set("sort", String(next.sort));
    if (next.tag !== undefined) {
      if (next.tag) sp.set("tag", String(next.tag));
      else sp.delete("tag");
    }
    if (next.page !== undefined) sp.set("page", String(Math.max(1, next.page)));
    const qs = sp.toString();
    const nextUrl =
      typeof window !== "undefined"
        ? qs
          ? `${window.location.pathname}?${qs}`
          : `${window.location.pathname}`
        : "";
    if (typeof window !== "undefined") window.history.pushState({}, "", nextUrl);
    setState(parseSearch());
  }

  /**
   * DOM takeover:
   * - If `all` is null, do nothing (preserves SSR grid entirely).
   * - If `all` is non-null (we parsed SSR), we render into the mount host.
   */
  useEffect(() => {
    if (typeof document === "undefined" || !mountId) return;
    if (all === null) return; // leave SSR intact

    const host = document.getElementById(mountId);
    if (!host) return;

    // Ensure host has the grid class used by PostFeedLatest
    host.classList.add("pfl__grid");

    host.innerHTML =
      pageItems.length === 0
        ? `<li class="pfl__card" aria-live="polite"><article><div class="pfl__body"><p class="pfl__meta">No posts found.</p></div></article></li>`
        : pageItems
            .map((p, i) => {
              const src = p.thumbnailSrc ?? p.cover?.src ?? null;
              const alt = (p.thumbnailAlt ?? p.cover?.alt ?? p.title ?? "").trim();
              const w = p.thumbnailW ?? 1200;
              const h = p.thumbnailH ?? 675;

              // First visible card gets eager/high priority to protect LCP; others lazy
              const loading = i === 0 ? "eager" : "lazy";
              const fetchpriority = i === 0 ? ' fetchpriority="high"' : "";
              const img = src
                ? `<img src="${src}" alt="${escapeHtml(alt)}" width="${w}" height="${h}" loading="${loading}" decoding="async"${fetchpriority} />`
                : "";

              const read =
                typeof p.estReadMin === "number" && isFinite(p.estReadMin) ? p.estReadMin : "—";

              return `
<li class="pfl__card" data-url="${p.url}">
  <article>
    <a class="pfl__media" href="${p.url}">
      ${img}
    </a>
    <div class="pfl__body">
      <h3 class="pfl__title"><a href="${p.url}">${escapeHtml(p.title)}</a></h3>
      <p class="pfl__meta">${new Date(p.date).toLocaleDateString()} · ${read} min read</p>
    </div>
  </article>
</li>`;
            })
            .join("");
  }, [all, pageItems, mountId]);

  // Tags: build from dataset if available; otherwise empty (controls still usable for sort/pagination)
  const tagsSorted = useMemo(() => {
    if (!all) return [];
    const set = new Set<string>();
    for (const p of all) for (const t of p.tags || []) if (t) set.add(t);
    return Array.from(set).sort();
  }, [all]);

  return (
    <section className="cu-wrap" aria-label="Category controls">
      <form className="cu-controls" onSubmit={(e) => e.preventDefault()}>
        <label className="cu-field">
          <span>Sort</span>
          <select value={sort} onChange={(e) => pushState({ sort: e.target.value, page: 1 })}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="read">Shortest read</option>
          </select>
        </label>

        <label className="cu-field">
          <span>Tag</span>
          <select value={tag} onChange={(e) => pushState({ tag: e.target.value, page: 1 })}>
            <option value="">All</option>
            {tagsSorted.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        {tag && (
          <button type="button" className="cu-clear" onClick={() => pushState({ tag: "", page: 1 })}>
            Clear filters
          </button>
        )}
      </form>

      <nav className="cu-pagination" aria-label="Client pagination">
        <button type="button" disabled={page <= 1} onClick={() => pushState({ page: page - 1 })}>
          Prev
        </button>
        <span className="cu-page">
          {page} / {totalPages}
        </span>
        <button type="button" disabled={page >= totalPages} onClick={() => pushState({ page: page + 1 })}>
          Next
        </button>
      </nav>
    </section>
  );
}

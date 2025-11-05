// React island for client-side sort/filter + pagination on category pages.
// Mount: <CategoryUtilityBar client:load category={category} pageSize={PER_PAGE} mountId="category-client-list" />
// Data:  /blog/_data/<category>.json (from Step 1)

import React, { useEffect, useMemo, useState } from "react";

type Post = {
  slug: string;
  title: string;
  url: string;
  date: string; // ISO
  tags: string[];
  estReadMin: number | null; // tolerate nulls
  cover: { src: string | null; alt: string | null };
};

type Props = {
  category: string; // e.g., "cv-tips"
  pageSize: number; // must match server default PER_PAGE
  mountId?: string; // id of the server grid container to replace
};

type SortKey = "newest" | "oldest" | "read";

function parseSearch(): { sort: SortKey; tag: string; page: number } {
  if (typeof window === "undefined") {
    // SSR-safe defaults; real URL state will be applied on mount
    return { sort: "newest", tag: "", page: 1 };
  }
  const sp = new URLSearchParams(window.location.search);
  const s = (sp.get("sort") || "newest").toLowerCase();
  const sort: SortKey =
    s === "oldest" ? "oldest" : s === "read" ? "read" : "newest";
  const tag = sp.get("tag") || "";
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10));
  return { sort, tag, page };
}

function applySort(arr: Post[], sort: SortKey) {
  const copy = [...arr];
  if (sort === "newest")
    return copy.sort((a, b) => +new Date(b.date) - +new Date(a.date));
  if (sort === "oldest")
    return copy.sort((a, b) => +new Date(a.date) - +new Date(b.date));
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
    (c) =>
      (
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }) as const
      )[c]!,
  );
}

export default function CategoryUtilityBar({
  category,
  pageSize,
  mountId,
}: Props) {
  // Lazy initializer ensures parseSearch runs once and is SSR-safe
  const [{ sort, tag, page }, setState] = useState(() => parseSearch());
  const [all, setAll] = useState<Post[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // On mount, re-sync state from real URL (in case SSR defaults were used)
  useEffect(() => {
    setState(parseSearch());
  }, []);

  // Load data once
  useEffect(() => {
    let cancel = false;
    const url = `/blog/_data/${category}.json`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} loading ${url}`);
        return r.json();
      })
      .then((data: Post[]) => {
        if (!cancel) setAll(data);
      })
      .catch((e) => {
        if (!cancel) setError(String(e));
      });
    return () => {
      cancel = true;
    };
  }, [category]);

  // Back/forward sync
  useEffect(() => {
    const onPop = () => setState(parseSearch());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Derived
  const filtered = useMemo(() => {
    if (!all) return [];
    const base = tag ? all.filter((p) => p.tags?.includes(tag)) : all;
    return applySort(base, sort);
  }, [all, sort, tag]);

  const totalPages = useMemo(() => {
    if (!all) return 1;
    const n = tag
      ? all.filter((p) => p.tags?.includes(tag)).length
      : all.length;
    return Math.max(1, Math.ceil(n / pageSize));
  }, [all, pageSize, tag]);

  const pageItems = useMemo(
    () => paginate(filtered, page, pageSize),
    [filtered, page, pageSize],
  );

  // Clamp page after data load
  useEffect(() => {
    if (page > totalPages) pushState({ page: totalPages });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  // URL/state sync
  function pushState(next: { sort?: string; tag?: string; page?: number }) {
    const sp = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : "",
    );
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
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", nextUrl);
    }
    setState(parseSearch());
  }

  // Replace server grid markup
  useEffect(() => {
    if (typeof document === "undefined" || !mountId) return;
    const host = document.getElementById(mountId);
    if (!host) return;

    host.innerHTML = pageItems
      .map((p) => {
        const img = p.cover?.src
          ? `<img src="${p.cover.src}" alt="${escapeHtml(p.cover?.alt ?? "")}" loading="lazy" width="1200" height="675" />`
          : "";
        const read =
          typeof p.estReadMin === "number" && isFinite(p.estReadMin)
            ? p.estReadMin
            : "—";
        return `
      <li class="c-card" data-url="${p.url}">
        <article>
          <a class="c-card__media" href="${p.url}">
            ${img}
          </a>
          <div class="c-card__body">
            <h3 class="c-card__title"><a href="${p.url}">${escapeHtml(p.title)}</a></h3>
            <p class="c-card__meta">${new Date(p.date).toLocaleDateString()} · ${read} min read</p>
            ${
              p.tags?.length
                ? `<ul class="c-card__tags">${p.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`
                : ""
            }
          </div>
        </article>
      </li>`;
      })
      .join("");
  }, [pageItems, mountId]);

  if (error) {
    return (
      <div className="cu-error" role="status">
        Failed to load category data. {error}
      </div>
    );
  }

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
          <select
            value={sort}
            onChange={(e) => pushState({ sort: e.target.value, page: 1 })}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="read">Shortest read</option>
          </select>
        </label>

        <label className="cu-field">
          <span>Tag</span>
          <select
            value={tag}
            onChange={(e) => pushState({ tag: e.target.value, page: 1 })}
          >
            <option value="">All</option>
            {tagsSorted.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        {tag && (
          <button
            type="button"
            className="cu-clear"
            onClick={() => pushState({ tag: "", page: 1 })}
          >
            Clear filters
          </button>
        )}
      </form>

      <nav className="cu-pagination" aria-label="Client pagination">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => pushState({ page: page - 1 })}
        >
          Prev
        </button>
        <span className="cu-page">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => pushState({ page: page + 1 })}
        >
          Next
        </button>
      </nav>
    </section>
  );
}

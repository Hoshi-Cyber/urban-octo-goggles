// File: src/components/blog/compose/mdx/index.ts
// MDX core element overrides + editorial shortcodes for the single post page.
//
// Fix Plan 006 Step 5.1 – MDX Mapping:
// - Centralise mappings for inline editorial components used in intros, tips,
//   frameworks, and inline CTAs.
// - Keep this file as the single source of truth for:
//   • Safe, brand-consistent links and images inside prose.
//   • Code-related blocks (multi-line + inline) with accessibility tweaks.
//   • Editorial shortcodes: Callout, Note, Warn, Footnote, Code.
//
// NOTE:
// - All components remain drop-in compatible with existing MDX content.
// - New behaviour is additive and non-breaking.

import type { MDXComponents } from "astro:content";
import type { JSX } from "astro/jsx-runtime";

import Callout from "./Callout/index.astro";
import Code from "./Code/index.astro";
import Footnote from "./Footnote/index.astro";
import Note from "./Note/index.astro";
import Warn from "./Warn/index.astro";

/* -------------------------------------------------------------------------- */
/*  Utilities                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Determine whether a given href should be treated as an external URL.
 *
 * Rules:
 * - Hash links (#...) → internal.
 * - Root-/relative paths ("/", "./", "../") → internal.
 * - mailto:, tel:, and other non-http(s) schemes → treated as internal
 *   from a "window.open" perspective (we do not force a new tab).
 * - http(s):// and protocol-relative (//example.com) → external.
 */
const isExternalHref = (href?: string): boolean => {
  if (!href) return false;

  const value = href.trim();

  if (value.startsWith("#")) return false;
  if (value.startsWith("/")) return false;
  if (value.startsWith(".")) return false;

  // Allow mailto:, tel:, and other schemes to behave like internal links.
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value) && !/^https?:/i.test(value)) {
    return false;
  }

  if (value.startsWith("//")) return true;

  return /^https?:\/\//i.test(value);
};

/* -------------------------------------------------------------------------- */
/*  SafeLink – secure, styled anchor wrapper                                  */
/* -------------------------------------------------------------------------- */

/**
 * SafeLink:
 * - Preserves all semantics of a normal <a>.
 * - Automatically applies:
 *   • target="_blank" and rel="noopener noreferrer" for external links.
 *   • No extra attributes for internal links.
 * - Allows callers to override rel/target explicitly when needed.
 */
export const SafeLink = (props: JSX.IntrinsicElements["a"]) => {
  const { href = "", rel, target, ...rest } = props;

  const external = isExternalHref(href);

  const finalRel =
    rel ?? (external ? "noopener noreferrer" : undefined);

  const finalTarget = target ?? (external ? "_blank" : undefined);

  return (
    <a
      href={href}
      rel={finalRel}
      target={finalTarget}
      {...rest}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  SmartImage – responsive, CLS-conscious image wrapper                      */
/* -------------------------------------------------------------------------- */

/**
 * SmartImage:
 * - Ensures images inside MDX respect content width and avoid layout shift.
 * - Defaults:
 *   • loading="lazy" for in-article images.
 *   • decoding="async" for better performance.
 * - Allows inline style overrides while preserving max-width + height:auto.
 */
export const SmartImage = (props: JSX.IntrinsicElements["img"]) => {
  const { loading, decoding, style, ...rest } = props;

  const combinedStyle: JSX.IntrinsicElements["img"]["style"] = {
    maxWidth: "100%",
    height: "auto",
    ...style,
  };

  return (
    <img
      loading={loading ?? "lazy"}
      decoding={decoding ?? "async"}
      style={combinedStyle}
      {...rest}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*  CodeBlock – multi-line code blocks with safe scroll                       */
/* -------------------------------------------------------------------------- */

/**
 * CodeBlock:
 * - Wraps <pre> blocks with horizontal scrolling when needed.
 * - Adds tabIndex=0 by default so keyboard users can scroll horizontally.
 * - Visual styling is handled by the MDX Code component / global code styles.
 */
export const CodeBlock = (props: JSX.IntrinsicElements["pre"]) => {
  const { children, tabIndex, style, ...rest } = props;

  const combinedStyle: JSX.IntrinsicElements["pre"]["style"] = {
    overflowX: "auto",
    ...style,
  };

  return (
    <pre
      tabIndex={tabIndex ?? 0}
      style={combinedStyle}
      {...rest}
    >
      {children}
    </pre>
  );
};

/* -------------------------------------------------------------------------- */
/*  InlineCode – inline code styling within prose                             */
/* -------------------------------------------------------------------------- */

/**
 * InlineCode:
 * - Pass-through wrapper for inline <code> elements.
 * - Visual styling is supplied by prose/code CSS tokens.
 */
export const InlineCode = (props: JSX.IntrinsicElements["code"]) => {
  return <code {...props} />;
};

/* -------------------------------------------------------------------------- */
/*  MDX Components Map                                                        */
/* -------------------------------------------------------------------------- */

/**
 * mdxComponents:
 * - Central mapping for all MDX overrides used in BlogPostLayout.
 * - Covers both core HTML element overrides and editorial shortcodes.
 *
 * Editorial usage examples in MDX:
 * - <Callout>Intro framing or key idea</Callout>
 * - <Note>Supporting context or nuance</Note>
 * - <Warn>Critical warning / caveat</Warn>
 * - <Footnote id="1">Clarification or reference</Footnote>
 * - <Code language="ts">const x = 1;</Code>
 */
export const mdxComponents: MDXComponents = {
  // Core HTML element overrides
  a: SafeLink,
  img: SmartImage,
  pre: CodeBlock,
  code: InlineCode,

  // Editorial shortcodes (used directly in MDX)
  Callout,
  Code,
  Footnote,
  Note,
  Warn,
};

export default mdxComponents;

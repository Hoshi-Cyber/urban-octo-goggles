// File: src/components/blog/compose/mdx/index.ts
// MDX core element overrides + editorial shortcodes for the single post page.

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

const isExternalHref = (href?: string): boolean => {
  if (!href) return false;
  if (href.startsWith("#")) return false;
  if (href.startsWith("/") || href.startsWith(".")) return false;
  return /^https?:\/\//i.test(href);
};

/* -------------------------------------------------------------------------- */
/*  SafeLink – secure, styled anchor wrapper                                  */
/* -------------------------------------------------------------------------- */

export const SafeLink = (props: JSX.IntrinsicElements["a"]) => {
  const { href = "", rel, target, ...rest } = props;

  const external = isExternalHref(href);

  const finalRel =
    rel ??
    (external ? "noreferrer noopener" : undefined);

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

export const InlineCode = (props: JSX.IntrinsicElements["code"]) => {
  // Visual styling is handled by global prose/code styles.
  return <code {...props} />;
};

/* -------------------------------------------------------------------------- */
/*  MDX Components Map                                                        */
/* -------------------------------------------------------------------------- */

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

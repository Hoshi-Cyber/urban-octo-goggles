// File: src/components/blog/compose/mdx.tsx

/* MDX components — lazy images + intrinsic sizing, safe links, focusable code
   Fix Plan 185 (Closeout):
   - All content images: loading="lazy", decoding="async".
   - Intrinsic size: use width/height when provided, else aspect-ratio fallback.
   - Dev guard: warn when alt is missing.
   - Safe external links: target=_blank + rel=noopener (and keep user-provided rel).
   - Focusable <pre> for keyboard users.
*/

import React from "react";
import type {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  AnchorHTMLAttributes,
  HTMLAttributes,
} from "react";

// ---------- Image with intrinsic sizing + lazy policy ----------
type ImgProps = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  /** Optional override for fallback aspect ratio when width/height missing, e.g., "4/3" */
  ratio?: `${number}/${number}`;
};

function MDXImage({
  loading,
  decoding,
  width,
  height,
  ratio,
  alt,
  style,
  ...rest
}: ImgProps) {
  // Intrinsic sizing check: numeric width and height prevent CLS
  const numeric = (v: unknown) =>
    typeof v === "number" || (typeof v === "string" && /^\d+$/.test(v));
  const hasIntrinsic = numeric(width) && numeric(height);

  // Default fallback aspect ratio if no explicit dimensions
  const fallbackRatio = ratio || "16/9";

  // Dev-time guardrail for accessibility
  if (import.meta.env?.DEV && (alt === undefined || alt === null)) {
    // eslint-disable-next-line no-console
    console.warn(
      "[mdx/img] Missing alt text. Provide alt or alt=\"\" for decorative images."
    );
  }

  const composedStyle: React.CSSProperties = {
    maxWidth: "100%",
    height: "auto",
    ...(hasIntrinsic ? {} : { aspectRatio: fallbackRatio, width: "100%" }),
    ...style,
  };

  return (
    <img
      {...rest}
      alt={alt ?? ""} // never omit alt
      loading={loading || "lazy"}
      decoding={decoding || "async"}
      width={width}
      height={height}
      style={composedStyle}
      sizes={rest.sizes || "(max-width: 768px) 100vw, 800px"}
    />
  );
}

// ---------- Safe external links ----------
type AProps = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;
function SafeLink({ rel, target, href, ...rest }: AProps) {
  const isExternal = !!href && /^https?:\/\//i.test(href);
  // preserve user rel, but ensure noopener on external
  const mergedRel = [
    rel,
    isExternal ? "noopener" : undefined, // prevent tab-nabbing
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <a
      {...rest}
      href={href}
      target={target ?? (isExternal ? "_blank" : undefined)}
      rel={mergedRel || undefined}
    />
  );
}

// ---------- Pre/Code wrappers ----------
function Pre(
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) {
  // Focusable for keyboard users; no style assumptions here
  return <pre {...props} tabIndex={0} />;
}

// ---------- Export map for MDX ----------
export const mdxComponents = {
  img: MDXImage,
  a: SafeLink,
  pre: Pre,
};

export default mdxComponents;

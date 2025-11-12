// File: src/components/blog/compose/index.ts
export { default as BlogHero } from "./BlogHero/index.astro";
export { default as BottomCTA } from "./BottomCTA/index.astro";
export { default as CategoryGrid } from "./CategoryGrid/index.astro";
export { default as CategoryHero } from "./CategoryHero/index.astro";
export * from "./CategoryUtilityBar";
export { default as CollectionSchema } from "./CollectionSchema/index.astro";
export { default as EditorsPicks } from "./EditorsPicks/index.astro";
export { default as LeadMagnetStrip } from "./LeadMagnetStrip/index.astro";
export { default as Pagination } from "./Pagination/index.astro";
export { default as PostCard } from "./PostCard/index.astro";
export { default as PostCover } from "./PostCover/index.astro";
export { default as PostCTAs } from "./PostCTAs/index.astro";
export { default as PostFeedLatest } from "./PostFeedLatest/index.astro";
export { default as PostFooter } from "./PostFooter/index.astro";
export { default as PostHeader } from "./PostHeader/index.astro";
export { default as PostMeta } from "./PostMeta/index.astro";
export { default as PostSources } from "./PostSources/index.astro";
export { default as PostTags } from "./PostTags/index.astro";
export { default as PostToc } from "./PostToc/index.astro";
export { default as PostUpdatedBadge } from "./PostUpdatedBadge/index.astro";
export { default as RelatedCategories } from "./RelatedCategories/index.astro";
export { default as TeaserGrid } from "./TeaserGrid/index.astro";
export { default as TrendingList } from "./TrendingList/index.astro";

/** MDX components: enforce lazy images + intrinsic sizing (Fix Plan 185) */
export { mdxComponents } from "./mdx";
/** Optional default export for convenience imports */
export { mdxComponents as default } from "./mdx";

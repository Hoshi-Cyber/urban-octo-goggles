// src/components/blog/compose/PostToc/types.ts

export type TocDepth = 2 | 3;

export interface TocHeading {
  depth: TocDepth;
  slug: string;
  text: string;
}

export interface TocProps {
  headings?: TocHeading[];
}

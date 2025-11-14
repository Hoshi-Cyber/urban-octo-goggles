// src/components/blog/compose/LeadMagnetStrip/types.ts

export interface LeadMagnetStripProps {
  /**
   * Optional small label above the title, e.g. "Free guide".
   */
  eyebrow?: string;

  /**
   * Main headline for the lead magnet strip.
   */
  title?: string;

  /**
   * Supporting body copy explaining the value of the offer.
   */
  body?: string;

  /**
   * Label for the primary CTA (required when URL provided).
   */
  primaryCtaLabel?: string;

  /**
   * URL for the primary CTA.
   */
  primaryCtaHref?: string;

  /**
   * Optional label for a secondary CTA.
   */
  secondaryCtaLabel?: string;

  /**
   * Optional URL for the secondary CTA.
   */
  secondaryCtaHref?: string;

  /**
   * Optional fine-print / reassurance copy (e.g. "No spam, ever.").
   */
  finePrint?: string;

  /**
   * Optional id applied to the section wrapper.
   */
  id?: string;

  /**
   * Optional additional class name merged onto the root element.
   */
  className?: string;
}

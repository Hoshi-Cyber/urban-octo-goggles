// src/data/pages/testimonials.ts
import rawTestimonials from "../testimonials.json";

type RawTestimonial = {
  quote: string;
  author: string;
  role: string;
};

// Base typed array
const allTestimonials = rawTestimonials as RawTestimonial[];

/**
 * 1) Full testimonials grid (testimonials page)
 *    – you can later extend with careerLevel/serviceType if needed.
 */
export const testimonialsGridItems = allTestimonials.map(
  (t, index) => ({
    id: `t-${index + 1}`,
    quote: t.quote,
    author: t.author,
    role: t.role,
    careerLevel: null,
    serviceType: null,
  })
);

/**
 * 2) Homepage highlight strip (e.g. top 3 only)
 */
export const homepageHighlightTestimonials =
  allTestimonials.slice(0, 3);

/**
 * 3) Any other context-specific slices you need
 *    (FAQ support strip, service pages, etc.)
 */
export const faqSupportTestimonials =
  allTestimonials.slice(3, 6);

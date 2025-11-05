---
layout: ../../components/layout/BaseLayout.astro
title: "Testimonials"
description: "Hear from professionals across Kenya who trusted us with their CVs."
seo:
  canonical: "/testimonials/"
---

import TestimonialCard from '../../components/common/TestimonialCard.astro'

## What Our Clients Say

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <TestimonialCard name="Mary N." role="Entry‑Level Marketing" content="I landed my first job within weeks of using my new CV. The team captured my internships and projects beautifully." />
  <TestimonialCard name="James O." role="Senior Engineer" content="The rewrite emphasised my leadership experience and helped me transition into a managerial role." />
  <TestimonialCard name="Aisha K." role="Nonprofit Project Manager" content="My cover letter finally told my story. Recruiters responded immediately." />
  <TestimonialCard name="Peter M." role="Graduate Developer" content="I didn’t know how to showcase my school projects. The team positioned them as real accomplishments." />
  <TestimonialCard name="Esther L." role="Finance Executive" content="The premium package transformed my LinkedIn profile; I’ve received several headhunting messages." />
  <TestimonialCard name="Samuel G." role="Healthcare Professional" content="Highly recommend! They understood the nuances of healthcare hiring and delivered a polished CV." />
</div>

<div class="text-center mt-8">
  <a href="/contact/" class="btn btn-accent">Work With Us</a>
</div>

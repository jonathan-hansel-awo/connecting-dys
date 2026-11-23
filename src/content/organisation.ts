import supplied from "./supplied-copy.json";

// Wording comes directly from the supplied documents; only page routing is defined here.
export const organisationPages = {
  about: { label: "About Us", source: "about-intro", intro: supplied["about-intro"].blocks[0].text },
  "what-we-do": { label: "What We Do", source: "work-intro", intro: supplied["work-intro"].blocks[0].text },
  "our-approach": { label: "Our Approach", source: "approach-intro", intro: supplied["approach-intro"].blocks[0].text },
  values: { label: "Our Values", source: "values-summary", intro: "Everything we do is guided by our BRIDGE values:" },
} as const;
export type OrganisationSlug = keyof typeof organisationPages;

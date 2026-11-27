import supplied from "./supplied-copy.json";
import { brandCopy } from "@/lib/brand-copy";

// Wording comes directly from the supplied documents; only page routing is defined here.
export const organisationPages = {
  about: { label: "About Us", source: "about-intro", intro: brandCopy(supplied["about-intro"].blocks[0].text) },
  "our-story": { label: "Our Story", source: "story", intro: brandCopy(supplied.story.blocks[0].text) },
  "founders-message": { label: "Founder’s Message", source: "founder", intro: brandCopy(supplied.founder.blocks[0].text) },
  "what-we-do": { label: "What We Do", source: "work-intro", intro: brandCopy(supplied["work-intro"].blocks[0].text) },
  "our-approach": { label: "Our Approach", source: "approach-intro", intro: brandCopy(supplied["approach-intro"].blocks[0].text) },
  values: { label: "Our Values", source: "values-summary", intro: "Everything we do is guided by our BRIDGE values:" },
} as const;
export type OrganisationSlug = keyof typeof organisationPages;

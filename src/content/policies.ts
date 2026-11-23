import supplied from "./supplied-copy.json";
import keys from "./policy-source-keys.json";

export type Policy = { title: string; intro: string; download?: string; sources: string[] };
export const policies: Record<string, Policy> = {
  safeguarding: { title: supplied["safeguarding-meta"].title, intro: "Connecting DYS CIC is committed to safeguarding and promoting the welfare of:", download: "/documents/safeguarding-policy.pdf", sources: keys.safeguarding },
  complaints: { title: "Complaints Policy", intro: "We recognise that concerns or dissatisfaction may arise.", download: "/documents/complaints-policy.pdf", sources: keys.complaints },
  equality: { title: "Equality, Diversity & Inclusion (EDI) Policy", intro: "Connecting DYS CIC is committed to promoting equality, valuing diversity, and creating inclusive environments across all areas of our work.", download: "/documents/equality-diversity-inclusion-policy.pdf", sources: keys.equality },
  privacy: { title: "Privacy Notice & Data Protection Policy", intro: "We do not sell personal information.", download: "/documents/data-protection-privacy-policy.pdf", sources: ["privacy-notice", ...keys["privacy-policy"]] },
  confidentiality: { title: "Confidentiality Statement", intro: "Safeguarding always takes priority over confidentiality.", sources: ["confidentiality"] },
  cookies: { title: "Website Cookies Policy", intro: "This policy is reviewed annually or when website functionality changes.", sources: ["cookies-original"] },
  disclaimer: { title: "Website Disclaimer", intro: "Last updated: 26/02/2026", sources: ["disclaimer"] },
  "data-retention": { title: "Data Retention Schedule", intro: "Connecting DYS CIC retains data only as long as necessary and in line with legal requirements.", sources: ["data-retention"] },
};

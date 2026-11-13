/** Verified against the existing public site on 13 November 2026. See docs/content-audit.md. */
export const brand = {
  name: "Connecting Dys",
  tagline: "A home for every DYS mind.",
  logo: "/brand/connecting_dys_logo.png",
  email: "hello@connectingdys.org",
  legacy: "https://dys-connect-hub.base44.app",
};

export const differences = [
  {
    slug: "dyslexia",
    name: "Dyslexia",
    area: "Reading & language",
    description:
      "A learning difference that can affect reading, spelling and processing written language.",
    note: "Everyone’s experience is different. Difficulties with written words do not define someone’s intelligence or potential.",
    colour: "teal",
    source: "Dyslexia",
  },
  {
    slug: "dyspraxia",
    name: "Dyspraxia",
    area: "Movement & coordination",
    description:
      "A difference that can affect movement, coordination and the planning of everyday tasks.",
    note: "The experience goes beyond what others can see. Giving people time, space and a chance to explain can make a difference.",
    colour: "coral",
    source: "Dyspraxia",
  },
  {
    slug: "dyscalculia",
    name: "Dyscalculia",
    area: "Numbers & quantities",
    description:
      "A learning difference that can affect understanding numbers, quantities and mathematical information.",
    note: "Everyday number tasks can take extra effort. Clear explanations and different ways of sharing information can help make conversations more accessible.",
    colour: "amber",
    source: "Dyscalculia",
  },
  {
    slug: "dysgraphia",
    name: "Dysgraphia",
    area: "Writing & expression",
    description:
      "A learning difference that can affect handwriting and expressing ideas in writing.",
    note: "The ideas someone wants to share may be very different from what they can comfortably put on paper. Make room for different ways to communicate.",
    colour: "blue",
    source: "Dysgraphia",
  },
] as const;

export const connectionStory = [
  {
    number: "01",
    title: "Start with listening.",
    text: "There is no single DYS experience. We start with the people living it: their questions, their ideas and what matters to them.",
    word: "Listen",
  },
  {
    number: "02",
    title: "Make space for understanding.",
    text: "Connection can begin with a shared experience, a different perspective or simply the chance to be heard. There is room for all of those things here.",
    word: "Connect",
  },
  {
    number: "03",
    title: "Build it together.",
    text: "Connecting Dys is in its early stages. Young people and families are helping shape what comes next, with lived experience at the centre.",
    word: "Grow",
  },
];

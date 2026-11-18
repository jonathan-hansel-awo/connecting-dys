// Paraphrased from Marie's November 2026 website recommendations and BRIDGE email.
// Future activities remain explicitly in development; governance evidence is not a public claim.
export const organisationPages = {
  about: {
    label: "Our story",
    title: "A community that gets you.",
    intro: "For teenagers, young adults and families navigating dyslexia, dyspraxia, dyscalculia and dysgraphia. Diagnosed, waiting for answers, or unsure where you fit — you are welcome.",
  },
  "what-we-do": {
    label: "What we do",
    title: "Community first. Growing together.",
    intro: "We’re bringing people together, listening to lived experience and building the foundations for lasting support.",
  },
  "our-approach": {
    label: "Our approach",
    title: "We ask. We listen. We build together.",
    intro: "People with lived experience help lead the way. Our community shapes what we build, how it works and how it grows.",
  },
  values: {
    label: "Our values",
    title: "BRIDGE: what brings us together.",
    intro: "Six values guide how we welcome people, make decisions and care for our community.",
  },
} as const;
export type OrganisationSlug = keyof typeof organisationPages;

export const purpose = [
  { icon: "connection", title: "Our mission", cue: "Less isolation. More connection.", text: "Build inclusive spaces where DYS individuals and families feel understood through shared experience." },
  { icon: "sun", title: "Our vision", cue: "Connected, confident, understood.", text: "A society where DYS individuals and families grow with communities that understand them." },
  { icon: "home", title: "Our goal", cue: "A community built to last.", text: "Create trusted spaces and networks that people can shape, support and lead over time." },
] as const;

export const currentWork = [
  { icon: "connection", title: "Make connections", text: "Bring young people and families together through early conversations and community outreach." },
  { icon: "listen", title: "Listen to experience", text: "Learn about daily challenges, gaps in support and what belonging means to you." },
  { icon: "sun", title: "Make every DYS visible", text: "Raise awareness of all four DYS conditions, challenge stigma and recognise different strengths." },
] as const;

export const futureWork = [
  { icon: "connection", title: "Peer support spaces", text: "Places to talk openly, exchange strategies and build confidence together.", detail: "Young people will help shape discussions and how each group develops. Participation by under-18s will need guardian consent and appropriate safeguarding." },
  { icon: "home", title: "Family & carer gatherings", text: "Time to share concerns, learn from one another and shape future support." },
  { icon: "tools", title: "Workshops & practical support", text: "Sessions designed with members around what would help in everyday life.", detail: "Possible topics include education, workplace confidence, wellbeing, assistive technology, routines and life skills. Topics will depend on what the community asks for." },
  { icon: "listen", title: "Listening events & open forums", text: "Opportunities to try ideas, give honest feedback and check what works for everyone." },
  { icon: "sun", title: "Awareness & advocacy", text: "Projects that increase understanding and celebrate DYS strengths, creativity and identity." },
] as const;

export const bridgeValues = [
  { letter: "B", name: "Belonging", icon: "home", text: "A place to feel accepted and connected.", practice: "We aim to offer a clear welcome, choices in how you communicate and support to help people connect with one another." },
  { letter: "R", name: "Respect", icon: "connection", text: "Lived experience helps lead our decisions.", practice: "People with DYS experience should have a voice in decisions and time to share their views." },
  { letter: "I", name: "Inclusion", icon: "choice", text: "Shape things with us, in your own way.", practice: "We offer ways to contribute through words, conversation or visuals. Taking part is a choice, without pressure." },
  { letter: "D", name: "Dignity", icon: "shield", text: "Safety, choice and care for every person.", practice: "Our commitment is to trauma-informed spaces: clear language, predictable routines and room to pause or find quiet." },
  { letter: "G", name: "Guardianship", icon: "hands", text: "Care for stories, privacy and resources.", practice: "We commit to protecting personal stories and handling the community’s trust and resources responsibly." },
  { letter: "E", name: "Empathy", icon: "listen", text: "Listen to understand. Adapt with care.", practice: "We respect different ways of thinking and aim to adjust our pace, communication and surroundings to individual needs." },
] as const;

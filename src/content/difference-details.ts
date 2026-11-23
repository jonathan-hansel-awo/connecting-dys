// Shortened from the public individual DYS pages reviewed on 23 November 2026:
// https://dys-connect-hub.base44.app/{Dyspraxia,Dyscalculia,Dysgraphia,Dyslexia}
// Keep these as introductions, without diagnostic checklists or prevalence claims.
export const differenceDetails = {
  dyspraxia: {
    introduction: "Also known as Developmental Coordination Disorder (DCD).",
    about: "Dyspraxia can affect movement, coordination, planning and the sequencing of everyday tasks.",
    experiences: ["Fine motor tasks, such as handwriting or fastening buttons", "Planning and completing multi-step tasks", "Balance, coordination and the effort involved in everyday activities"],
    education: "A learner may understand the subject but find recording an answer, organising work or taking part in physical activities more demanding.",
    everyday: "Tasks involving coordination, time management or several steps can take more effort. Fast-paced activities may feel overwhelming.",
  },
  dyscalculia: {
    introduction: "A learning difference involving numbers, quantities and number sense.",
    about: "Dyscalculia affects how a person processes and understands numbers, quantities and mathematical concepts.",
    experiences: ["Understanding quantities and number relationships", "Working with arithmetic and calculations", "Telling the time, estimating or managing money"],
    education: "Maths-based subjects may need a different teaching approach. Working with numbers under pressure can be particularly demanding.",
    everyday: "Budgeting, planning a journey or working with schedules and measurements can involve extra effort.",
  },
  dysgraphia: {
    introduction: "A learning difference involving handwriting and written expression.",
    about: "Dysgraphia can affect the physical act of writing and the organisation of thoughts on paper. It can occur alongside other DYS experiences.",
    experiences: ["Handwriting that is difficult to read or inconsistent", "Writing slowly or finding writing physically tiring", "Organising ideas in written form"],
    education: "Taking notes, writing assignments or completing written exams may be demanding even when someone understands the subject well.",
    everyday: "Handwritten tasks and producing written information quickly can take more effort. Written output does not tell the whole story of someone’s understanding.",
  },
  dyslexia: {
    introduction: "A learning difference involving reading, spelling and language processing.",
    about: "Dyslexia affects how a person processes written and spoken language. Experiences can include differences in reading fluency, spelling and working with written information.",
    experiences: ["Reading accurately or fluently", "Spelling and decoding unfamiliar words", "Reading or producing written information under time pressure"],
    education: "Text-heavy subjects, timed tests and written assignments can take more effort. A text-based task may not reflect the full extent of someone’s understanding.",
    everyday: "Reading aloud, filling in forms, writing emails or working through reports can be demanding and may affect confidence or participation.",
  },
} as const;

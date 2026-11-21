// Public summaries of the supplied November 2026 organisational policies.
// Keep website-specific disclosures aligned with the actual implementation.
export type PolicySection = { title: string; paragraphs?: string[]; items?: string[] };
export type Policy = { title: string; intro: string; download?: string; sections: PolicySection[] };
export const policies: Record<string, Policy> = {
  safeguarding: {
    title: "Safeguarding", intro: "Safety, dignity and care for children, young adults and adults at risk.",
    download: "/documents/safeguarding-policy.pdf",
    sections: [
      { title: "If someone is in immediate danger", paragraphs: ["Call 999. Email is not an emergency reporting service and may not be read straight away."] },
      { title: "Raise a concern", paragraphs: ["Email connectingdys@gmail.com with the subject ‘Safeguarding concern’. Ask for your concern to be passed to the Designated Safeguarding Lead. Share only the information needed to explain the concern; you do not need to investigate it yourself.", "You can ask a parent, carer or trusted adult to help you communicate. Concerns involving a representative of Connecting Dys should be raised too."] },
      { title: "What safeguarding means here", paragraphs: ["Our policy covers under-18s, young adults aged 18–24 and adults at risk. It includes emotional, psychological, online and physical safety, clear boundaries and protection from exploitation.", "Our work is community-based and non-clinical. Peer support does not replace counselling, therapy or professional care."] },
      { title: "Safe spaces as we grow", items: ["A minimum of two adults in under-18 online sessions, with no private one-to-one online meetings with under-18s.", "Organisation-controlled platforms, access controls and clear reporting routes.", "Safer recruitment, role-appropriate checks, training and a code of conduct.", "Risk assessments and parent or guardian consent before in-person participation by under-18s."] },
      { title: "Handling concerns", paragraphs: ["The policy requires concerns to be reported promptly to the safeguarding lead, who assesses risk and makes referrals where needed. The Board of Directors has overall accountability.", "We cannot promise absolute confidentiality. Information may need to be shared with safeguarding or emergency services to protect someone. Access is restricted to those who need it."] },
      { title: "About the full policy", paragraphs: ["Our full policy is version 1.0, approved 11 January 2026. It sets out regular review and review after incidents. The full document explains responsibilities, disclosures, allegations and record keeping."] },
    ],
  },
  complaints: {
    title: "Complaints & feedback", intro: "Tell us when something has gone wrong. You can raise a concern without being treated unfairly.",
    download: "/documents/complaints-policy.pdf",
    sections: [
      { title: "How to complain", paragraphs: ["Email connectingdys@gmail.com with the subject ‘Complaint’. Tell us your name and contact details, what happened, when it happened and the outcome you would like, if you know.", "You can write, send an audio explanation or ask a trusted adult to help. Contact us if you need a different format or a reasonable adjustment. Under-18s may complain directly or through a parent or guardian."] },
      { title: "What happens next", items: ["We acknowledge a formal complaint within 5 working days.", "An appropriate person investigates. We aim to conclude within 20 working days; complex cases may take longer.", "We send a written outcome explaining findings, relevant action and options for review. Some details may remain private for confidentiality or safeguarding reasons."] },
      { title: "If you are unhappy with the outcome", paragraphs: ["Ask the Board of Directors for a review within 10 working days of the outcome. If the complaint concerns the Operations Lead, address it to the Board. If it concerns a Director, the Director concerned must not handle the complaint.", "Depending on the issue, external routes may include the ICO, the local safeguarding authority or the CIC Regulator."] },
      { title: "Safety and confidentiality", paragraphs: ["Immediate risks follow our safeguarding procedure and should not wait for the complaints process. Call 999 if someone is in immediate danger.", "Complaint information is shared only where needed. Records are retained for at least 6 years, or longer where safeguarding requirements apply. Raising a concern in good faith will not lead to a penalty or unfair treatment."] },
      { title: "Policy review", paragraphs: ["Owned by the Board of Directors and reviewed annually. Next scheduled review: 11 January 2027."] },
    ],
  },
  equality: {
    title: "Equality, diversity & inclusion", intro: "A community where different backgrounds, identities and ways of thinking are respected.",
    download: "/documents/equality-diversity-inclusion-policy.pdf",
    sections: [
      { title: "Our commitment", paragraphs: ["We aim to remove barriers, challenge discrimination and make participation safe and inclusive. This applies to our activities, communications, volunteering, partnerships and the way we handle concerns.", "We recognise that experiences overlap: race, gender, faith, disability, economic circumstances and other aspects of identity can shape access to support."] },
      { title: "Respect for everyone", paragraphs: ["Our policy recognises the Equality Act’s protected characteristics: age, disability, gender reassignment, marriage and civil partnership, pregnancy and maternity, race, religion or belief, sex and sexual orientation.", "Bullying, harassment, hate speech, victimisation and discrimination are not tolerated. You do not need a formal DYS diagnosis for respectful treatment or for us to consider reasonable adjustments."] },
      { title: "Taking part in your own way", items: ["Ask about written summaries or different communication formats.", "Discuss flexible ways to contribute and a pace that works for you.", "As sessions develop, request adjustments such as cameras off online or quiet spaces in person.", "Tell us about practical or digital barriers so these can inform planning."] },
      { title: "Raise an inclusion concern", paragraphs: ["Email connectingdys@gmail.com. You can raise a concern informally or use our complaints procedure. If someone is at risk, the safeguarding procedure takes priority."] },
      { title: "Policy review", paragraphs: ["The Board oversees this policy. It is reviewed annually and when circumstances change. Next scheduled review: 11 January 2027."] },
    ],
  },
  privacy: {
    title: "Privacy & data protection", intro: "What information we use, why we use it and how to ask about your data.",
    download: "/documents/data-protection-privacy-policy.pdf",
    sections: [
      { title: "Who is responsible", paragraphs: ["Connecting Dys CIC is the data controller. Contact connectingdys@gmail.com for privacy questions or to exercise your data rights. The Operations Lead handles day-to-day data protection, with oversight from the Board."] },
      { title: "Using this website", paragraphs: ["You can browse without an account. This website does not run analytics, advertising trackers, embedded social feeds or an online membership database. Downloading a blank form does not send your answers to us.", "Reading choices and acknowledgement of the privacy notice are stored on your device. See Cookies & device storage for the names, purposes and duration.", "The website is hosted on Vercel. Serving pages involves technical information such as IP address, requested pages and browser information. Contact us for questions about hosting records. Following an external link or using your email provider is subject to that provider’s own privacy information."] },
      { title: "When you contact us or express interest", paragraphs: ["We receive the information you choose to email, including contact details and the contents of your message. Membership interest forms ask for your name, preferred name, age or age band, contact details and how you would like to receive information. The under-18 form also asks for parent or guardian details.", "You do not need to send diagnostic reports or a detailed health history to express interest. Please share only what is needed. If you voluntarily share learning differences, health information or access needs, this may be sensitive personal data."] },
      { title: "Why information is used", items: ["Responding to enquiries and sending the membership information you request.", "Planning safe, accessible participation and responding to safeguarding concerns.", "Managing volunteering, activities and feedback as these become available.", "Meeting legal and governance duties. We do not sell personal data or use automated decision-making."] },
      { title: "Lawful grounds", paragraphs: ["Our lawful grounds include consent, contract, legitimate interests, legal obligations and vital interests, depending on the purpose. Optional marketing needs appropriate consent; an enquiry or membership interest does not automatically subscribe you to a newsletter.", "Sensitive information requires an additional lawful condition, such as explicit consent or an applicable safeguarding condition. The relevant ground depends on the circumstances; not every ground applies to every interaction."] },
      { title: "Sharing and keeping information safe", paragraphs: ["Access is limited to authorised people who need it for their role. Information may be shared with professional advisers, insurers, safeguarding authorities or emergency services where necessary and justified.", "Our policy requires secure systems, restricted access, confidentiality and secure deletion. Safeguarding concerns can require sharing without consent. We do not promise absolute confidentiality."] },
      { title: "How long information is kept", paragraphs: ["We retain information only as long as needed. The data retention page lists our retention schedule, including 12 months for general enquiries and specific safeguarding periods. Legal or safeguarding requirements may affect an individual record."] },
      { title: "Your rights", paragraphs: ["You can ask to access or correct your information, request deletion or restricted use where applicable, object to processing, or withdraw consent. Withdrawing consent does not undo earlier lawful processing. Some rights have limits, including where safeguarding or legal obligations apply.", "Contact connectingdys@gmail.com. Requests can be made verbally or in writing; identity checks may be needed. The usual response period is one month, subject to any lawful extension or exemption. You can also complain to the Information Commissioner’s Office at ico.org.uk."] },
      { title: "About the full policy", paragraphs: ["Our Data Protection & Privacy Policy was approved on 11 January 2026 and gives a next review date of 11 January 2027. This page describes the website’s current features as well as the organisation’s wider policy."] },
    ],
  },
  confidentiality: {
    title: "Confidentiality", intro: "Your experiences deserve care, respect and clear boundaries.",
    sections: [
      { title: "Our commitment", paragraphs: ["We treat personal experiences, educational concerns, emotional concerns and diagnostic information with sensitivity. We will not normally disclose personal information outside Connecting Dys without explicit permission."] },
      { title: "Who may need access", paragraphs: ["Authorised staff, volunteers, facilitators or Directors may share information internally on a strict need-to-know basis to support participation, deliver activities safely, meet safeguarding responsibilities or comply with legal obligations."] },
      { title: "Limits to confidentiality", items: ["A child, young person or adult is at risk of serious harm.", "There is a safeguarding concern or risk of criminal activity.", "Disclosure is required by law or a court order."] },
      { title: "When information must be shared", paragraphs: ["Where possible and appropriate, we aim to tell you first. If doing so would increase risk, information may be shared without prior notice. Safeguarding takes priority over confidentiality.", "Please avoid sending sensitive details in an initial enquiry. You can ask how to share information safely by emailing connectingdys@gmail.com."] },
    ],
  },
  cookies: {
    title: "Cookies & device storage", intro: "A quiet website, with no advertising or analytics tracking.",
    sections: [
      { title: "What this site uses", paragraphs: ["Cookies are small files stored by a website. Similar rules can apply to other device storage, including local storage. This website does not currently set analytics or advertising cookies, and it has no third-party video or social embeds.", "There are no optional tracking categories to accept or reject. The notice’s ‘OK, understood’ button acknowledges this information; it does not grant consent to future tracking."] },
      { title: "Reading preferences", paragraphs: ["The local storage entry connecting-dys-reading-settings remembers the font, size, spacing, background, texture and motion settings you choose. It stays on this device until you reset the settings or clear site data. It is not sent to Connecting Dys.", "These settings support the reading experience you request. They remain available without agreeing to marketing or analytics."] },
      { title: "Remembering the privacy notice", paragraphs: ["The local storage entry connecting-dys-privacy-notice remembers that you have acknowledged the current notice for up to six months. After that, or when the notice version changes, it is shown again. No acknowledgement is written until you press the button.", "If your browser blocks storage, the site and controls still work for the current visit, but the notice may return when you reload."] },
      { title: "Change or clear your settings", paragraphs: ["Use ‘Cookie information’ in the footer to reopen the notice at any time. Reset your reading preferences in Reading settings. You can remove all stored entries through your browser’s site-data controls.", "External websites and email providers have their own cookie policies. If optional tracking is added here in future, this information and the controls must be updated before it runs."] },
      { title: "Young visitors", paragraphs: ["We avoid behavioural advertising and unnecessary tracking. You can read the site without creating an account or sharing your age, diagnosis or contact details."] },
    ],
  },
  disclaimer: {
    title: "Website disclaimer", intro: "A starting point for community and general information.",
    sections: [
      { title: "General information", paragraphs: ["We aim to keep information accurate and useful, but cannot guarantee that every page is complete or up to date. Content may change as the organisation develops."] },
      { title: "Professional support", paragraphs: ["Website information is not medical, legal, educational or psychological advice. Connecting Dys does not provide clinical diagnosis, assessment, therapy, counselling, medical advice or legal advice. Consult an appropriately qualified professional for advice about your circumstances."] },
      { title: "External links", paragraphs: ["Links to other organisations are provided for information. Connecting Dys does not control or guarantee their content, services or products. Their own terms and policies apply."] },
      { title: "Individual experiences", paragraphs: ["If individual stories are featured, they describe that person’s experience. They do not promise that someone else will have the same outcome."] },
      { title: "Liability", paragraphs: ["To the extent permitted by law, Connecting Dys does not accept liability for loss arising from use of this website or reliance on its general information. Nothing in this statement excludes liability or rights that cannot lawfully be excluded."] },
    ],
  },
  "data-retention": {
    title: "Data retention", intro: "We keep records only as long as needed, then securely delete or destroy them.",
    sections: [{ title: "How the schedule works", paragraphs: ["The table below sets out our record retention schedule. A legal duty or safeguarding requirement can affect how long a particular record must be kept. Contact connectingdys@gmail.com if you have a question about your information."] }],
  },
};

export const retention = [
  ["General enquiries", "12 months"], ["Event attendance", "2 years"],
  ["Peer participation records", "3 years"], ["Child safeguarding records", "Until the person’s 25th birthday"],
  ["Adult safeguarding records", "7 years after closure"], ["Unsuccessful volunteer applications", "6 months"],
  ["Active volunteer records", "Duration of involvement + 6 years"], ["Financial records", "6 years"],
  ["Director records", "Duration of role + 6 years"], ["Newsletter details, where subscribed", "Until consent is withdrawn"],
  ["Complaints records", "At least 6 years; safeguarding requirements may extend this"],
];

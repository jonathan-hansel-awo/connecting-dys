import Link from "next/link";
import { brand } from "@/content/site";

const groups = [
  { id: "young-people", title: "Young people", ages: "Ages 13–17", file: "young-people-interest.docx", text: "A short form for you and your parent or guardian.", details: ["Ages 13–15: your parent or guardian’s details are the main contact for membership information.", "Ages 16–17: provide your own contact details and your parent or guardian’s details.", "The form asks for your name, preferred name, age, contact details and how you would like to receive information. Your own phone number is optional."] },
  { id: "young-adults", title: "Young adults", ages: "Ages 18–24", file: "young-adults-interest.docx", text: "A short form you can complete for yourself.", details: ["Choose your age band: 18–20 or 21–24.", "Share your name, preferred name and email. Your phone number is optional.", "Choose an information pack by email, or ask for someone to contact you first."] },
];
export function MembershipPage() {
  return <main id="main-content" tabIndex={-1} className="organisation-page membership-page wrap">
    <Link href="/get-involved" className="breadcrumb">Ways to get involved</Link>
    <header className="organisation-heading"><p className="eyebrow">Connecting Dys CIC / Membership interest</p><h1>A first step. At your pace.</h1><p className="lead">Interested in our community? Request information before deciding whether to join. You do not need a diagnosis to express interest.</p></header>
    <aside className="organisation-note"><h2>This is an expression of interest.</h2><p>It does not enrol you as a member or book an activity. You will receive membership information to read before you decide.</p></aside>
    <section className="organisation-section" aria-labelledby="interest-how"><h2 id="interest-how">How to express interest</h2><ol className="membership-steps"><li>Choose the form for your age below.</li><li>Download it and complete it on your device. Nothing is submitted by this website.</li><li>Email the completed form to <a href={`mailto:${brand.email}`}>{brand.email}</a>, with the subject “Membership interest”.</li></ol><p>You can also <a href={`mailto:${brand.email}?subject=Membership%20information%20request`}>request information by email</a> or ask for help with a form. There is no need to send a diagnostic report or detailed health information.</p></section>
    <div className="membership-options">{groups.map(group => <section id={group.id} key={group.id} className="membership-option surface-soft"><p className="eyebrow">{group.ages}</p><h2>{group.title}</h2><p>{group.text}</p><ul>{group.details.map(text => <li key={text}>{text}</li>)}</ul><p><a href={`/documents/${group.file}`} download className="button">Download {group.ages.toLowerCase()} form (Word)</a></p></section>)}</div>
    <section className="organisation-section" aria-labelledby="interest-privacy"><h2 id="interest-privacy">Your information, handled with care</h2><p>The form is used to respond to your interest and provide membership information. It does not sign you up to marketing. Read <Link href="/privacy">how we use personal information</Link> and our <Link href="/safeguarding">safeguarding guide</Link> before sending it.</p><p>Parents, carers, prospective volunteers and partners can <Link href="/contact">contact us directly</Link> about getting involved.</p></section>
  </main>;
}

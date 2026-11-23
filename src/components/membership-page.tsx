import { ParagraphPanels } from "@/components/source-panel";
import { BackgroundDoodles } from "@/components/background-doodles";
import Link from "next/link";
import { brand } from "@/content/site";
import { MembershipInterestForm } from "@/components/membership-interest-form";
export function MembershipPage() {
  return <main id="main-content" tabIndex={-1} className="organisation-page membership-page wrap">
    <Link href="/get-involved" className="breadcrumb">Ways to get involved</Link>
    <header className="organisation-heading copy-panel panel-blue"><p className="eyebrow">Connecting Dys CIC / Interest form</p><h1>Register Your Interest</h1><p className="lead">A home for every DYS mind.</p></header>
    <aside className="organisation-note copy-panel panel-amber"><h2>This is an expression of interest.</h2><p>It does not enrol you as a member or book an activity. You will receive membership information to read before you decide.</p></aside>
    <section className="organisation-section copy-panel panel-teal" aria-labelledby="interest-how"><h2 id="interest-how">How to express interest</h2><ol className="membership-steps"><li>Complete the form for your age below.</li><li>Select “Open email with my answers”.</li><li>Your email app will open a message addressed to <a href={`mailto:${brand.email}`}>{brand.email}</a>. Review your answers, then press Send in your email app.</li></ol><p>You can also <a href={`mailto:${brand.email}?subject=Membership%20information%20request`}>request information by email</a> or ask for help with a form. There is no need to send a diagnostic report or detailed health information.</p></section>
    <nav className="membership-type-links" aria-label="Choose your interest form"><a href="#young-people">Ages 13–17</a><a href="#young-adults">Ages 18–24</a></nav>
    <div className="membership-options"><MembershipInterestForm kind="young-people" /><MembershipInterestForm kind="young-adults" /></div>
    <section className="organisation-section source-section" aria-labelledby="interest-privacy"><ParagraphPanels tone="teal"><h2 id="interest-privacy">Your information, handled with care</h2><p>The form is used to respond to your interest and provide membership information. It does not sign you up to marketing. Read <Link href="/privacy">how we use personal information</Link> and our <Link href="/safeguarding">safeguarding guide</Link> before sending it.</p><p>Parents, carers, prospective volunteers and partners can <Link href="/contact">contact us directly</Link> about getting involved.</p></ParagraphPanels></section>
  <BackgroundDoodles /></main>;
}

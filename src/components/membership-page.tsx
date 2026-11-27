import { EdgeDoodle } from "@/components/edge-doodle";
import { ParagraphPanels } from "@/components/source-panel";
import { BackgroundDoodles } from "@/components/background-doodles";
import { CommunityImage } from "@/components/community-image";
import Link from "next/link";
import { brand } from "@/content/site";
import { MembershipInterestForm } from "@/components/membership-interest-form";

export function MembershipPage() {
  return <main id="main-content" tabIndex={-1} className="organisation-page membership-page wrap">
    <header className="editorial-heading">
      <div><p className="eyebrow">Connecting DYS</p><h1>Get involved</h1><p>A home for every DYS mind.</p></div>
      <CommunityImage variant="involvement" />
    </header>
    <div id="register-interest">
      <div className="membership-options">
        <details className="membership-disclosure" id="young-people"><summary><span><strong>Ages 13–17</strong><span>Young People's Membership Interest Form</span></span><span className="disclosure-indicator" aria-hidden="true" /></summary><MembershipInterestForm kind="young-people" decoration={<EdgeDoodle motif="inclusion" />} /></details>
        <details className="membership-disclosure" id="young-adults"><summary><span><strong>Ages 18–24</strong><span>Young Adults' Membership Interest Form</span></span><span className="disclosure-indicator" aria-hidden="true" /></summary><MembershipInterestForm kind="young-adults" decoration={<EdgeDoodle motif="connection" />} /></details>
      </div>
    </div>
    <section className="organisation-section source-section" aria-labelledby="interest-privacy"><ParagraphPanels tone="teal"><h2 id="interest-privacy">Your information, handled with care</h2><p>The form is used to respond to your interest and provide membership information. It does not sign you up to marketing. Read <Link href="/privacy">how we use personal information</Link> and our <Link href="/safeguarding">safeguarding guide</Link> before sending it.</p><p>Parents, carers, prospective volunteers and partners can <a href="#contact">contact us directly</a> about getting involved.</p></ParagraphPanels></section>
    <section id="contact" className="copy-panel panel-amber has-edge-doodle" aria-labelledby="contact-title">
      <EdgeDoodle motif="mail" /><h2 id="contact-title">Contact us</h2>
      <p><a className="contact-email" href={`mailto:${brand.email}`}>{brand.email}</a></p>
      <p>We are based in Nottingham, but our community is open to every DYS mind nationwide.</p>
    </section>
    <nav className="article-links" aria-label="Useful links">
      <Link href="/paths-to-belonging">Paths to Belonging</Link>
      <Link href="/accessibility">Accessibility &amp; reading</Link>
      <Link href="/support">Information &amp; support</Link>
    </nav>
    <BackgroundDoodles />
  </main>;
}

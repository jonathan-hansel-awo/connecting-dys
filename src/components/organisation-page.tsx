import Link from "next/link";
import { ArrowLeft, Ear, HeartHandshake, House, MessageCircle, ShieldCheck, Sprout, Sun, Wrench, type LucideIcon } from "lucide-react";
import { bridgeValues, currentWork, futureWork, organisationPages, purpose, type OrganisationSlug } from "@/content/organisation";

const icons: Record<string, LucideIcon> = {
  connection: HeartHandshake, home: House, listen: Ear, sun: Sun,
  tools: Wrench, choice: MessageCircle, shield: ShieldCheck, hands: Sprout,
};
function PictureCue({ name }: { name: string }) {
  const Icon = icons[name];
  return <span className="picture-cue" aria-hidden="true"><Icon strokeWidth={1.5} /></span>;
}

export function OrganisationPage({ slug }: { slug: OrganisationSlug }) {
  const page = organisationPages[slug];
  return (
    <main id="main-content" tabIndex={-1} className="organisation-page wrap">
      <Link href="/" className="breadcrumb"><ArrowLeft size={17} aria-hidden="true" />Back to home</Link>
      <header className="organisation-heading">
        <p className="eyebrow">Connecting Dys CIC / {page.label}</p>
        <h1>{page.title}</h1>
        <p className="lead">{page.intro}</p>
      </header>
      <nav className="organisation-nav" aria-label="About Connecting Dys">
        {Object.entries(organisationPages).map(([key, item]) => (
          <Link key={key} href={`/${key}`} aria-current={slug === key ? "page" : undefined}>{item.label}</Link>
        ))}
      </nav>

      {slug === "about" && <>
        <section className="organisation-split" aria-labelledby="who-title">
          <div className="belonging-picture surface-soft surface-inset" aria-hidden="true">
            <House strokeWidth={1} /><span>Your mind is at home here.</span>
            <div className="belonging-path"><span /><span /><span /></div>
          </div>
          <div>
            <h2 id="who-title">Here for the in-between.</h2>
            <p>Waiting for an assessment, finding your way after diagnosis or facing a gap in support can feel isolating.</p>
            <p>We’re building a community where young people and families can meet others who understand.</p>
            <p>Led by Marie Johnson, Connecting Dys is a UK Community Interest Company based in Nottingham, welcoming DYS minds nationwide.</p>
          </div>
        </section>
        <section aria-labelledby="purpose-title" className="organisation-section">
          <h2 id="purpose-title">Why we’re here</h2>
          <div className="purpose-list">
            {purpose.map(item => <article key={item.title} className="purpose-row">
              <PictureCue name={item.icon} /><div><h3>{item.title}</h3><p className="purpose-cue">{item.cue}</p><p>{item.text}</p></div>
            </article>)}
          </div>
        </section>
        <aside className="organisation-note"><p>Our support is social and non-clinical. We work alongside existing services. We do not provide diagnosis or treatment.</p></aside>
      </>}

      {slug === "what-we-do" && <>
        <aside className="organisation-note" aria-label="Our current stage"><h2>We’re at the beginning.</h2><p>Full services are not yet being delivered. We’re building slowly, safely and with the community.</p></aside>
        <section className="organisation-section" aria-labelledby="now-title">
          <p className="eyebrow">Right now</p><h2 id="now-title">Laying the foundations</h2>
          <div className="work-now">{currentWork.map(item => <article key={item.title}><PictureCue name={item.icon} /><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </section>
        <section className="organisation-section" aria-labelledby="next-title">
          <p className="eyebrow">In development</p><h2 id="next-title">What we’re preparing</h2>
          <p>These are plans we’ll shape with members as the community grows.</p>
          <div className="future-list">{futureWork.map(item => <article key={item.title} className="future-row">
            <PictureCue name={item.icon} /><div><h3>{item.title}</h3><p>{item.text}</p>
              {"detail" in item && <details className="more-detail"><summary>More about {item.title.toLowerCase()}</summary><p>{item.detail}</p></details>}
            </div><span className="development-label">In development</span>
          </article>)}</div>
        </section>
      </>}

      {slug === "our-approach" && <>
        <section className="organisation-section" aria-labelledby="together-title">
          <h2 id="together-title">Your experience shapes what comes next.</h2>
          <ol className="approach-path">
            <li><PictureCue name="listen" /><h3>Listen</h3><p>You share what matters and what would make life easier.</p></li>
            <li><PictureCue name="choice" /><h3>Shape</h3><p>We explore ideas together, with choices about taking part.</p></li>
            <li><PictureCue name="hands" /><h3>Grow</h3><p>We try ideas, hear feedback and adapt at the community’s pace.</p></li>
          </ol>
        </section>
        <section className="organisation-split approach-principles" aria-labelledby="connection-first-title">
          <div><p className="eyebrow">Connection first</p><h2 id="connection-first-title">Belonging comes before programmes.</h2><p>Feeling understood is a starting point. Our work focuses on social connection and shared experience, alongside existing services.</p><p>Members will help shape decisions and lead the community as it grows.</p></div>
          <div className="commitment-panel surface-soft"><PictureCue name="shield" /><h2>Care at every step</h2><ul><li>Safeguarding and privacy come first.</li><li>Volunteers and staff should be trained, supported and valued.</li><li>We grow at a pace that protects the community.</li></ul></div>
        </section>
        <section className="organisation-section" aria-labelledby="welcome-title"><h2 id="welcome-title">Different voices. Shared ownership.</h2><p>We welcome people from all backgrounds, including ethnic minority communities and others whose experiences are under-represented.</p><p>You can contribute through conversation, writing or visuals. We listen, adapt and build with you.</p><Link className="text-link" href="/values">Explore our BRIDGE values</Link></section>
      </>}

      {slug === "values" && <section className="organisation-section" aria-labelledby="bridge-title">
        <h2 id="bridge-title" className="sr-only">Our six BRIDGE values</h2>
        <div className="bridge-list">{bridgeValues.map(value => <article key={value.letter} className="bridge-row">
          <span className="bridge-letter surface-raised" aria-hidden="true">{value.letter}</span>
          <div><h3>{value.name}</h3><p>{value.text}</p><details className="more-detail"><summary>{value.name} in practice</summary><p>{value.practice}</p></details></div>
          <PictureCue name={value.icon} />
        </article>)}</div>
      </section>}

      <section className="organisation-invitation surface-soft" aria-labelledby="conversation-title"><div><h2 id="conversation-title">You can help shape this.</h2><p>A question, an idea or your own experience — we’d like to hear from you.</p></div><Link className="button" href="/contact">Start a conversation</Link></section>
    </main>
  );
}

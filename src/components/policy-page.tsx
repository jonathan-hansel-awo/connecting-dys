import Link from "next/link";
import { brand } from "@/content/site";
import { policies, retention } from "@/content/policies";

export function PolicyPage({ slug }: { slug: string }) {
  const hub = slug === "policies";
  const policy = policies[slug];
  return <main id="main-content" tabIndex={-1} className="reading-page policy-page wrap">
    <Link className="breadcrumb" href={hub ? "/" : "/policies"}>{hub ? "Back to home" : "All policies"}</Link>
    <p className="eyebrow">Connecting Dys CIC / Care & trust</p>
    <h1>{hub ? "Our policies. Your peace of mind." : policy.title}</h1>
    <p className="lead">{hub ? "Clear information about safety, inclusion, privacy and your choices. Start with a short guide, or download a full policy." : policy.intro}</p>
    {hub ? <>
      <nav className="policy-index" aria-label="Organisation policies">
        {Object.entries(policies).map(([key, item]) => <Link href={`/${key}`} key={key}><h2>{item.title}</h2><p>{item.intro}</p></Link>)}
        <Link href="/accessibility"><h2>Accessibility & reading</h2><p>Personalise the website or ask for another format.</p></Link>
      </nav>
      <aside className="article-note"><h2>Need a different format?</h2><p>Email <a href={`mailto:${brand.email}`}>{brand.email}</a>. You can ask for help understanding a policy or send an audio explanation of a concern.</p></aside>
    </> : <>
      <nav className="policy-contents" aria-label="On this page"><p>On this page</p><ul>{policy.sections.map((section, i) => <li key={section.title}><a href={`#section-${i}`}>{section.title}</a></li>)}</ul></nav>
      {policy.download && <p><a href={policy.download} download className="text-link">Download the full {policy.title.toLowerCase()} policy (PDF)</a></p>}
      <div className="article-body">{policy.sections.map((section, i) => <section id={`section-${i}`} key={section.title}>
        <h2>{section.title}</h2>{section.paragraphs?.map(text => <p key={text}>{text}</p>)}
        {section.items && <ul>{section.items.map(text => <li key={text}>{text}</li>)}</ul>}
      </section>)}</div>
      {slug === "data-retention" && <div className="retention-scroll" role="region" aria-label="Data retention schedule" tabIndex={0}><table className="retention-table"><caption>Organisation record retention periods</caption><thead><tr><th scope="col">Record type</th><th scope="col">Retention period</th></tr></thead><tbody>{retention.map(([record, duration]) => <tr key={record}><th scope="row">{record}</th><td>{duration}</td></tr>)}</tbody></table></div>}
      {slug === "privacy" && <p><Link href="/data-retention">Read the data retention schedule</Link> · <Link href="/cookies">Cookies & device storage</Link> · <a href="https://ico.org.uk/">Information Commissioner’s Office</a></p>}
      {slug === "safeguarding" && <p><Link href="/confidentiality">Read our confidentiality commitment</Link></p>}
      {slug === "equality" && <p><Link href="/complaints">How to make a complaint</Link> · <Link href="/accessibility">Accessibility support</Link></p>}
      <p className="policy-date">Website information updated 21 November 2026.</p>
    </>}
    <nav className="article-links" aria-label="Related information"><Link href="/policies">All policies</Link><Link href="/contact">Contact Connecting Dys</Link></nav>
  </main>;
}

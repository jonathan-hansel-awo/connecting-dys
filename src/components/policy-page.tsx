import { BackgroundDoodles } from "@/components/background-doodles";
import Link from "next/link";
import { brand } from "@/content/site";
import { policies } from "@/content/policies";
import { SourcePanel, SourcePanels, sourceCopy, ParagraphPanels } from "@/components/source-panel";

export function PolicyPage({ slug }: { slug: string }) {
  const hub = slug === "policies";
  const policy = policies[slug];
  return <main id="main-content" tabIndex={-1} className="reading-page policy-page wrap">
    <Link className="breadcrumb" href={hub ? "/" : "/policies"}>{hub ? "Back to home" : "All policies"}</Link>
    <header className="copy-panel panel-blue"><h1>{hub ? "Our Policies" : policy.title}</h1></header>
    {hub ? <nav className="policy-index" aria-label="Organisation policies">
      {Object.entries(policies).map(([key, item], i) => <Link className={`copy-panel panel-${i % 2 ? "amber" : "blue"}`} href={`/${key}`} key={key}><h2>{item.title}</h2><p>{item.intro}</p></Link>)}
      <Link className="copy-panel panel-teal" href="/accessibility"><h2>Accessibility Statement</h2><p>Need Support?</p></Link>
    </nav> : <>
      <nav className="policy-contents copy-panel panel-cream" aria-label="On this page"><p>On this page</p><ul>{policy.sources.map(source => <li key={source}><a href={`#source-${source}`}>{sourceCopy[source].title}</a></li>)}</ul></nav>
      {policy.download && <p className="copy-panel panel-cream"><a href={policy.download} download className="text-link">Download the original policy (PDF)</a></p>}
      {(slug === "privacy" || slug === "cookies") && <section className="source-section" aria-labelledby="website-implementation"><ParagraphPanels tone="teal"><h2 id="website-implementation">Using this website today</h2>
        <p>The organisation’s supplied policy is reproduced below. This website currently has no analytics, advertising trackers, embedded social feeds or online membership database. The policy’s references to these features do not mean they are enabled here.</p>
        <p>The interest forms prepare a draft in your own email app. Review the draft and press Send there to email Connecting Dys.</p>
        <p>Reading preferences are stored on this device under <code>connecting-dys-reading-settings</code> until reset or cleared. The entry <code>connecting-dys-privacy-notice</code> remembers acknowledgement of the notice for up to six months. Neither entry is used for tracking. There are no optional tracking categories to accept, reject or withdraw consent for on this website.</p>
        <p>Use “Cookie information” in the footer to reopen the notice. Reset reading choices in Reading settings, or clear site data in your browser. External websites and email providers have their own privacy information.</p>
        {slug === "privacy" && <p>This website is hosted on Vercel. Page delivery involves technical information such as IP address, requested pages and browser information. Contact <a href={`mailto:${brand.email}`}>{brand.email}</a> with questions about your information.</p>}
      </ParagraphPanels></section>}
      <SourcePanels sources={policy.sources} />
      {slug === "safeguarding" && <SourcePanel source="confidentiality" tone="cream" />}
    </>}
    <nav className="article-links copy-panel panel-cream" aria-label="Related information"><Link href="/policies">All policies</Link><Link href="/contact">Contact Connecting Dys</Link><Link href="/data-retention">Data Retention Schedule</Link></nav>
  <BackgroundDoodles /></main>;
}

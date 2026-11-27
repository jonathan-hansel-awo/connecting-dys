import { EdgeDoodle, motifForContent } from "@/components/edge-doodle";
import { BackgroundDoodles } from "@/components/background-doodles";
import { PolicyControls } from "@/components/policy-controls";
import Link from "next/link";
import { brand } from "@/content/site";
import { policies } from "@/content/policies";
import { SourcePanel, SourcePanels, sourceCopy, ParagraphPanels } from "@/components/source-panel";

export function PolicyPage({ slug }: { slug: string }) {
  const hub = slug === "policies";
  const policy = policies[slug];
  return <main id="main-content" tabIndex={-1} className="reading-page policy-page wrap">
    {!hub && <Link className="breadcrumb" href="/policies">All policies</Link>}
    <header className="copy-panel panel-blue has-edge-doodle"><EdgeDoodle motif="shield" /><h1>{hub ? "Our Policies" : policy.title}</h1></header>
    {hub ? <nav className="policy-index" aria-label="Organisation policies">
      {Object.entries(policies).map(([key, item], i) => <Link className={`copy-panel panel-${i % 2 ? "amber" : "blue"} has-edge-doodle`} href={`/${key}`} key={key}><EdgeDoodle motif={motifForContent(item.title)} /><h2>{item.title}</h2><p>{item.intro}</p></Link>)}
      <Link className="copy-panel panel-teal has-edge-doodle" href="/accessibility"><EdgeDoodle motif="accessibility" /><h2>Accessibility Statement</h2><p>Need Support?</p></Link>
    </nav> : <>
      <details className="policy-contents copy-panel panel-cream has-edge-doodle"><summary><EdgeDoodle motif="document" />On this page</summary><ul>{policy.sources.map(source => <li key={source}><a href={`#source-${source}`}>{sourceCopy[source].title}</a></li>)}</ul></details>
      {policy.download && <p className="copy-panel panel-cream has-edge-doodle"><EdgeDoodle motif="document" /><a href={policy.download} download className="text-link">Download the original policy (PDF)</a></p>}
      {(slug === "privacy" || slug === "cookies") && <details className="policy-disclosure source-section" aria-labelledby="website-implementation"><summary><EdgeDoodle motif="document" /><h2 id="website-implementation">Using this website today</h2><span className="disclosure-indicator" aria-hidden="true" /></summary><div className="policy-implementation"><ParagraphPanels tone="teal">
        <p>The organisation’s supplied policy is reproduced below. This website currently has no analytics, advertising trackers, embedded social feeds or online membership database. The policy’s references to these features do not mean they are enabled here.</p>
        <p>The interest forms prepare a draft in your own email app. Review the draft and press Send there to email Connecting DYS.</p>
        <p>Reading preferences are stored on this device under <code>connecting-dys-reading-settings</code> until reset or cleared. The entry <code>connecting-dys-privacy-notice</code> remembers acknowledgement of the notice for up to six months. Neither entry is used for tracking. There are no optional tracking categories to accept, reject or withdraw consent for on this website.</p>
        <p>Use “Cookie information” in the footer to reopen the notice. Reset reading choices in Reading settings, or clear site data in your browser. External websites and email providers have their own privacy information.</p>
        {slug === "privacy" && <p>This website is hosted on Vercel. Page delivery involves technical information such as IP address, requested pages and browser information. Contact <a href={`mailto:${brand.email}`}>{brand.email}</a> with questions about your information.</p>}
      </ParagraphPanels></div></details>}
      <PolicyControls />
      <SourcePanels sources={policy.sources} collapsible />
      {slug === "safeguarding" && <SourcePanel source="confidentiality" tone="cream" collapsible />}
    </>}
    <nav className="article-links copy-panel panel-cream has-edge-doodle" aria-label="Related information"><EdgeDoodle motif="path" /><Link href="/policies">All policies</Link><Link href="/get-involved#contact">Contact Connecting DYS</Link><Link href="/data-retention">Data Retention Schedule</Link></nav>
  <BackgroundDoodles /></main>;
}

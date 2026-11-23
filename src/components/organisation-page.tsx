import { BackgroundDoodles } from "@/components/background-doodles";
import Link from "next/link";
import { organisationPages, type OrganisationSlug } from "@/content/organisation";
import { SourcePanel, SourcePanels } from "@/components/source-panel";

export function OrganisationPage({ slug }: { slug: OrganisationSlug }) {
  const page = organisationPages[slug];
  return <main id="main-content" tabIndex={-1} className="organisation-page wrap">
    <Link href="/" className="breadcrumb">Back to home</Link>
    <nav className="organisation-nav" aria-label="About Connecting Dys">
      {Object.entries(organisationPages).map(([key, item]) => <Link key={key} href={`/${key}`} aria-current={slug === key ? "page" : undefined}>{item.label}</Link>)}
    </nav>
    {slug === "about" ? <header className="copy-panel panel-blue"><h1>About Us</h1></header> : <SourcePanel source={page.source} level={1} tone="blue" />}
    {slug === "about" && <>
      <SourcePanels sources={["why"]} />
      <div id="mission-and-vision" className="copy-panels">
        <SourcePanel source="mission" tone="amber" />
        <SourcePanel source="vision" tone="blue" />
        <SourcePanel source="goal" tone="teal" />
      </div>
      <SourcePanels sources={["about-work"]} />
    </>}
    {slug === "our-story" && <SourcePanels sources={["about-intro", "founder", "different", "purpose"]} />}
    {slug === "what-we-do" && <SourcePanels sources={["work-1", "work-2", "work-3", "work-4", "work-5", "work-6", "work-7", "work-8", "goal-young"]} />}
    {slug === "our-approach" && <SourcePanels sources={["how", "commitment", "approach-community", "approach-design", "approach-grow", "approach-social", "approach-awareness", "approach-infrastructure", "approach-gets", "approach-goals", "approach-intend"]} />}
    {slug === "values" && <SourcePanels sources={["value-B", "value-R", "value-I", "value-D", "value-G", "value-E"]} />}
    <nav className="article-links copy-panel panel-cream" aria-label="Keep exploring"><Link href="/membership">Register Your Interest</Link><Link href="/contact">Work With Us</Link><Link href="/values">Our Values</Link></nav>
  <BackgroundDoodles /></main>;
}

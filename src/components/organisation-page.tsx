import { EdgeDoodle } from "@/components/edge-doodle";
import { CommunityPhoto } from "@/components/community-photo";
import { BackgroundDoodles } from "@/components/background-doodles";
import Link from "next/link";
import Image from "next/image";
import { BridgeArtwork } from "@/components/bridge-artwork";
import { CommunityImage } from "@/components/community-image";
import { brand } from "@/content/site";
import { organisationPages, type OrganisationSlug } from "@/content/organisation";
import { SourcePanel, SourcePanels } from "@/components/source-panel";

export function OrganisationPage({ slug }: { slug: OrganisationSlug }) {
  const page = organisationPages[slug];
  return <main id="main-content" tabIndex={-1} className="organisation-page wrap">
    <Link href="/" className="breadcrumb">Back to home</Link>
    {slug === "about" ? <header className="editorial-heading"><div><p className="eyebrow">Connecting DYS CIC</p><h1>About Us</h1><p>Why we exist, and the community we are building.</p></div><figure className="editorial-brand"><Image src={brand.logo} alt="Connecting Dys — A home for every DYS mind. The word-heart logo surrounding two embracing figures." width={1330} height={1182} sizes="(max-width: 760px) 90vw, 42vw" /></figure></header> : <SourcePanel source={page.source} level={1} tone="blue" artwork={
      slug === "our-story" ? <CommunityPhoto /> :
      slug === "what-we-do" ? <CommunityPhoto scene="reading" /> :
      slug === "values" ? <BridgeArtwork /> :
      slug === "founders-message" ? <figure className="founder-embrace"><Image src={brand.symbol} alt="The Connecting Dys logo, with DYS names forming a heart around embracing figures." width={1330} height={1182} /><figcaption>Lived experience at the heart of Connecting Dys.</figcaption></figure> : <CommunityImage />
    } interlude={slug === "our-story" ? { after: 8, content: <CommunityPhoto scene="books" /> } : undefined} />}
    {slug === "about" && <>
      <SourcePanels sources={["why"]} />
      <div id="mission-and-vision" className="copy-panels">
        <SourcePanel source="mission" tone="amber" />
        <SourcePanel source="vision" tone="blue" artwork={<BridgeArtwork />} />
        <SourcePanel source="goal" tone="teal" />
      </div>
      <SourcePanels sources={["about-work"]} />
    </>}
    {slug === "what-we-do" && <SourcePanels sources={["work-1", "work-2", "work-3", "work-4", "work-5", "work-6", "work-7", "work-8", "goal-young"]} />}
    {slug === "our-approach" && <SourcePanels sources={["how", "commitment", "approach-community", "approach-design", "approach-grow", "approach-social", "approach-awareness", "approach-infrastructure", "approach-gets", "approach-goals", "approach-intend"]} />}
    {slug === "values" && <SourcePanels sources={["value-B", "value-R", "value-I", "value-D", "value-G", "value-E"]} />}
    <nav className="article-links copy-panel panel-cream has-edge-doodle" aria-label="Keep exploring"><EdgeDoodle motif="path" /><Link href="/membership">Register Your Interest</Link><Link href="/contact">Work With Us</Link><Link href="/values">Our Values</Link></nav>
  <BackgroundDoodles /></main>;
}

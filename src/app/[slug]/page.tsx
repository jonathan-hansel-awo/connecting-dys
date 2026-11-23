import { BackgroundDoodles } from "@/components/background-doodles";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrganisationPage } from "@/components/organisation-page";
import { organisationPages, type OrganisationSlug } from "@/content/organisation";
import { brand, differences, originalSite } from "@/content/site";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";
import { MembershipPage } from "@/components/membership-page";
import { DysConnections } from "@/components/dys-connections";
import { SourcePanel, SourcePanels, SourceBlocks, sourceCopy, ParagraphPanels } from "@/components/source-panel";

const pages = [...Object.keys(organisationPages), ...Object.keys(policies), "policies", "membership", "support", "get-involved", "contact", "accessibility"];
const titles: Record<string, string> = {
  ...Object.fromEntries(Object.entries(organisationPages).map(([slug, page]) => [slug, page.label])),
  support: "Information & Support", "get-involved": "Get Involved", contact: "Contact Connecting DYS", accessibility: "Accessibility Statement", membership: "Membership Interest", policies: "Our Policies",
  ...Object.fromEntries(Object.entries(policies).map(([slug, policy]) => [slug, policy.title])),
};
export function generateStaticParams() { return [...pages, ...differences.map(d => d.slug)].map(slug => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const difference = differences.find(d => d.slug === slug);
  return { title: difference?.name || titles[slug], description: difference?.description || organisationPages[slug as OrganisationSlug]?.intro || policies[slug]?.intro };
}
export default async function ReadingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const difference = differences.find(d => d.slug === slug);
  if (!difference && !pages.includes(slug)) notFound();
  if (slug === "policies" || Object.hasOwn(policies, slug)) return <PolicyPage slug={slug} />;
  if (slug === "membership") return <MembershipPage />;
  if (Object.hasOwn(organisationPages, slug)) return <OrganisationPage slug={slug as OrganisationSlug} />;
  return <main id="main-content" tabIndex={-1} className="reading-page wrap">
    <Link href={difference ? "/#explore" : "/"} className="breadcrumb">{difference ? "Explore DYS" : "Back to home"}</Link>
    <header className="copy-panel panel-blue"><h1>{difference?.name || titles[slug]}</h1>{difference && <p>{difference.description}</p>}</header>
    {difference && <>
      <section className="copy-panel panel-amber" aria-labelledby="topic-community"><h2 id="topic-community">Your mind is at home here.</h2><SourceBlocks blocks={sourceCopy["home-conditions"].blocks.slice(-1)} /><p><a className="text-link" href={`${originalSite}/${difference.name}`}>Connecting DYS {difference.name}</a></p></section>
      <SourcePanel source="who-join" tone="teal" />
    </>}
    {slug === "support" && <><SourcePanels sources={["support-peer", "support-family", "support-workshops", "support-forums"]} /><DysConnections /></>}
    {slug === "get-involved" && <><section className="copy-panel panel-amber" aria-labelledby="get-involved-title"><h2 id="get-involved-title">Join us in creating something meaningful.</h2><p>We are developing a lasting community built on trust, collaborative design, and collective ownership.</p><Link href="/membership" className="button">Register Your Interest</Link></section><SourcePanels sources={["who-join", "approach-intend"]} /></>}
    {slug === "contact" && <section className="source-section" aria-labelledby="email-title"><ParagraphPanels tone="amber"><h2 id="email-title">Email Connecting DYS</h2><p><a className="contact-email" href={`mailto:${brand.email}`}>{brand.email}</a></p><p>We are based in Nottingham, but our community is open to every DYS mind nationwide.</p><p>You can write to us, send an audio explanation or ask someone you trust to help. Please avoid including sensitive personal information in an initial enquiry.</p><p>This mailbox is not an emergency service. If someone is in immediate danger, call 999.</p><p><Link href="/membership">Membership information</Link> · <Link href="/complaints">Complaints Policy</Link> · <Link href="/safeguarding">Safeguarding</Link> · <Link href="/privacy">Privacy Notice</Link></p></ParagraphPanels></section>}
    {slug === "accessibility" && <>
      <SourcePanel source="accessibility" tone="amber" />
      <section className="source-section" aria-labelledby="reading-options"><ParagraphPanels tone="teal"><h2 id="reading-options">Choose how you read</h2><p>Open Reading settings just below the navigation to choose Open Sans, Arial, Verdana, Atkinson Hyperlegible or OpenDyslexic. You can change text size, line spacing, letter spacing, background colour and texture, or choose dark mode.</p><p>Use Reduce decorative motion to turn off decorative scroll animation. Your device’s reduced-motion setting is always respected. Font preferences are personal; specialist fonts are options.</p><p>Reading preferences are saved in your browser’s local storage when you change them. Read our <Link href="/cookies">cookie information</Link>. To report a barrier, email <a href={`mailto:${brand.email}?subject=Accessibility%20Support`}>{brand.email}</a>.</p></ParagraphPanels></section>
    </>}
    <nav className="article-links copy-panel panel-cream" aria-label="Keep exploring"><Link href="/support">Information &amp; Support</Link><Link href="/membership">Register Your Interest</Link><Link href="/contact">Contact Connecting DYS</Link></nav>
  <BackgroundDoodles /></main>;
}

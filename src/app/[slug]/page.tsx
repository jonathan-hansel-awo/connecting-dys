import { EdgeDoodle } from "@/components/edge-doodle";
import { BackgroundDoodles } from "@/components/background-doodles";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { OrganisationPage } from "@/components/organisation-page";
import { organisationPages, type OrganisationSlug } from "@/content/organisation";
import { brand, differences } from "@/content/site";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";
import { BridgeArtwork } from "@/components/bridge-artwork";
import { CommunityImage } from "@/components/community-image";
import { DifferencePage } from "@/components/difference-page";
import { PathsToBelongingSection } from "@/features/paths-to-belonging/section";
import { MembershipPage } from "@/components/membership-page";
import { DysConnections } from "@/components/dys-connections";
import { SourcePanel, SourcePanels, ParagraphPanels } from "@/components/source-panel";

const pages = [...Object.keys(organisationPages), ...Object.keys(policies), "policies", "paths-to-belonging", "membership", "support", "get-involved", "contact", "accessibility"];
const titles: Record<string, string> = {
  ...Object.fromEntries(Object.entries(organisationPages).map(([slug, page]) => [slug, page.label])),
  support: "Information & Support", "get-involved": "Get involved", contact: "Contact Connecting DYS", accessibility: "Accessibility Statement", membership: "Register Your Interest", "paths-to-belonging": "Paths to Belonging", policies: "Our Policies",
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
  if (slug === "membership") redirect("/get-involved#register-interest");
  if (slug === "contact") redirect("/get-involved#contact");
  if (slug === "policies" || Object.hasOwn(policies, slug)) return <PolicyPage slug={slug} />;
  if (difference) return <DifferencePage difference={difference} />;
  if (slug === "paths-to-belonging") return <main id="main-content" tabIndex={-1} className="game-page"><div className="wrap"><header className="editorial-heading"><div><h1>A little path to connection</h1></div></header></div><PathsToBelongingSection /><BackgroundDoodles /></main>;
  if (slug === "get-involved") return <MembershipPage />;
  if (Object.hasOwn(organisationPages, slug)) return <OrganisationPage slug={slug as OrganisationSlug} />;
  return <main id="main-content" tabIndex={-1} className="reading-page wrap">
    <header className="editorial-heading"><div><h1>{titles[slug]}</h1></div>{slug === "support" ? <CommunityImage /> : slug === "accessibility" ? <BridgeArtwork /> : null}</header>
    {slug === "support" && <><SourcePanels sources={["support-peer", "support-family", "support-workshops", "support-forums"]} /><DysConnections /></>}
    {slug === "accessibility" && <>
      <SourcePanel source="accessibility" tone="amber" />
      <section className="source-section" aria-labelledby="reading-options"><ParagraphPanels tone="teal"><h2 id="reading-options">Choose how you read</h2><p>Open Reading settings just below the navigation to choose Open Sans, Arial, Verdana, Atkinson Hyperlegible or OpenDyslexic. You can change text size, line spacing, letter spacing, background colour and texture, or choose dark mode.</p><p>Use Reduce decorative motion to turn off decorative scroll animation. Your device’s reduced-motion setting is always respected. Font preferences are personal; specialist fonts are options.</p><p>Reading preferences are saved in your browser’s local storage when you change them. Read our <Link href="/cookies">cookie information</Link>. To report a barrier, email <a href={`mailto:${brand.email}?subject=Accessibility%20Support`}>{brand.email}</a>.</p></ParagraphPanels></section>
    </>}
    <nav className="article-links copy-panel panel-cream has-edge-doodle" aria-label="Keep exploring"><EdgeDoodle motif="path" /><Link href="/support">Information &amp; Support</Link><Link href="/get-involved#register-interest">Register Your Interest</Link><Link href="/get-involved#contact">Contact Connecting DYS</Link></nav>
  <BackgroundDoodles /></main>;
}

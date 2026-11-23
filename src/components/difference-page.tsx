import Link from "next/link";
import { BackgroundDoodles } from "@/components/background-doodles";
import { DifferenceArtwork } from "@/components/story-art";
import { differences } from "@/content/site";
import { differenceDetails } from "@/content/difference-details";

type Difference = (typeof differences)[number];
export function DifferencePage({ difference }: { difference: Difference }) {
  const detail = differenceDetails[difference.slug];
  return <main id="main-content" tabIndex={-1} className={`reading-page wrap difference-page theme-${difference.theme}`}>
    <Link href="/" className="breadcrumb">Back to home</Link>
    <header className="editorial-heading topic-heading"><div><p className="eyebrow">Understanding DYS · {difference.cue}</p><h1>{difference.name}</h1><p>{detail.introduction}</p></div><div className="topic-art"><DifferenceArtwork index={difference.artIndex} /></div></header>
    <section className="copy-panel panel-blue" aria-labelledby="difference-about"><h2 id="difference-about">What is {difference.name.toLowerCase()}?</h2><p>{detail.about}</p><p>Everyone’s experience is different. These examples are an introduction, rather than a checklist or a diagnosis.</p></section>
    <section className="difference-experiences" aria-labelledby="experience-title"><h2 id="experience-title">What it can feel like</h2><ul>{detail.experiences.map(item => <li key={item}>{item}</li>)}</ul></section>
    <section aria-labelledby="everyday-title"><h2 id="everyday-title">In everyday life</h2><div className="building-columns"><article className="copy-panel panel-amber"><h3>Learning and education</h3><p>{detail.education}</p></article><article className="copy-panel panel-teal"><h3>Life, work and connection</h3><p>{detail.everyday}</p></article></div></section>
    <section className="topic-invitation copy-panel panel-cream" aria-labelledby="topic-community"><h2 id="topic-community">Your mind is at home here.</h2><p>Connecting DYS is building a community rooted in lived experience and shared understanding. You are welcome whether you have a diagnosis, are waiting for one or are unsure where you fit.</p><Link className="button" href="/membership">Register Your Interest</Link></section>
    <nav className="article-links" aria-label="Other DYS pages">{differences.filter(d => d.slug !== difference.slug).map(d => <Link key={d.slug} href={`/${d.slug}`}>{d.name}</Link>)}</nav>
    <BackgroundDoodles />
  </main>;
}

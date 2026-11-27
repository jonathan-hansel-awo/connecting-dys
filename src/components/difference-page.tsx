import Link from "next/link";
import { BackgroundDoodles } from "@/components/background-doodles";
import { ConditionArtwork } from "@/components/condition-artwork";
import { differences } from "@/content/site";
import { differenceDetails } from "@/content/difference-details";

type Difference = (typeof differences)[number];
export function DifferencePage({ difference }: { difference: Difference }) {
  const detail = differenceDetails[difference.slug];
  const artIndex = differences.findIndex(item => item.slug === difference.slug);
  return <main id="main-content" tabIndex={-1} className={`reading-page wrap difference-page theme-${difference.theme}`}>
    <header className="editorial-heading topic-heading"><div><h1>{difference.name}</h1><p>{detail.introduction}</p></div><div className="topic-art"><ConditionArtwork index={artIndex} /></div></header>
    <section className="copy-panel panel-blue" aria-labelledby="difference-about"><h2 id="difference-about">{detail.aboutHeading}</h2><p>{detail.about}</p></section>
    <section className="condition-signs" aria-labelledby="signs-title"><h2 id="signs-title">Key Signs</h2><ul className="condition-sign-grid">{detail.signs.map(item => <li className="copy-panel panel-cream" key={item}>{item}</li>)}</ul></section>
    <section className="condition-impact" aria-labelledby="impact-title"><h2 id="impact-title">Everyday Impact</h2><div className="condition-impact-list"><article className="copy-panel panel-blue"><h3>Education</h3><p>{detail.education}</p></article><article className="copy-panel panel-amber"><h3>Social and Community Life</h3><p>{detail.social}</p></article><article className="copy-panel panel-blue"><h3>Work</h3><p>{detail.work}</p></article></div></section>
    <div className="condition-comparison"><section className="copy-panel panel-teal" aria-labelledby="strengths-title"><h2 id="strengths-title">Strengths</h2><ul>{detail.strengths.map(item => <li key={item}>{item}</li>)}</ul></section><section className="copy-panel panel-cream" aria-labelledby="challenges-title"><h2 id="challenges-title">Challenges</h2><ul>{detail.challenges.map(item => <li key={item}>{item}</li>)}</ul></section></div>
    <section className="condition-prevalence copy-panel panel-amber" aria-labelledby="prevalence-title"><h2 id="prevalence-title">Prevalence</h2><p>{detail.prevalence}</p></section>
    <nav className="article-links" aria-label="Other DYS pages">{differences.filter(d => d.slug !== difference.slug).map(d => <Link key={d.slug} href={`/${d.slug}`}>{d.name}</Link>)}</nav>
    <BackgroundDoodles />
  </main>;
}

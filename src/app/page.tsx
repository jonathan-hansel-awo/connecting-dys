import { BackgroundDoodles } from "@/components/background-doodles";
import Image from "next/image";
import Link from "next/link";
import { brand, connectionChapters, differences } from "@/content/site";
import { DifferenceArtwork } from "@/components/story-art";
import { HeroDysEmbrace } from "@/components/hero-dys-embrace";
import { DysConnections } from "@/components/dys-connections";
import { HomeStoryMotion } from "@/components/home-story-motion";
import { ConnectionTrail } from "@/components/connection-trail";
import { DiscoveryTrail } from "@/components/discovery-trail";
import { HeroTransitionArt } from "@/components/hero-transition-art";
import { FinalePath } from "@/components/finale-path";
import { PathsToBelongingSection } from "@/features/paths-to-belonging/section";
import { SourcePanel } from "@/components/source-panel";

export default function HomePage() {
  return <main id="main-content" tabIndex={-1} data-home-story>
    <HomeStoryMotion />
    <section className="hero wrap surface-paper" aria-labelledby="hero-title" data-welcome-scene>
      <div className="section-backdrop" aria-hidden="true" />
      <div className="hero-copy source-section">
        <div className="copy-panel panel-blue">
        <h1 id="hero-title">A home for<br />every <span className="dys-word">DYS</span> mind.</h1>
        </div>
        <SourcePanel source="home-intro" tone="amber" />
        <div className="hero-actions copy-panel panel-cream"><Link href="/membership" className="button">Join Our Community</Link><Link href="/get-involved" className="text-link">Work With Us</Link></div>
      </div>
      <div className="hero-composition">
        <HeroTransitionArt />
        <div className="hero-note note-top surface-raised">Your mind is at home here.</div>
        <div className="logo-stage"><HeroDysEmbrace /><div className="hero-lockup"><span className="hero-wordmark">Connecting Dys</span><span className="hero-tagline">{brand.tagline}</span></div></div>
      </div>
      <div className="hero-bottom copy-panel panel-cream"><a href="#recognition">Who We Are</a><span>Connecting DYS CIC exists so no one has to navigate their DYS journey alone.</span></div>
    </section>

    <section id="recognition" className="recognition surface-scene surface-panel" aria-labelledby="recognition-title">
      <div className="recognition-sheet" data-recognition-sheet aria-hidden="true" />
      <div className="wrap recognition-grid">
        <div className="recognition-art"><figure className="recognition-figure"><div className="recognition-media surface-inset"><Image src="/images/community-reading.webp" alt="Five people sitting together around a table with books." fill sizes="(max-width: 1000px) 90vw, 45vw" className="recognition-photo" /></div><figcaption>Photo provided by Connecting Dys. Background edited for privacy.</figcaption></figure></div>
        <div className="recognition-copy"><SourcePanel source="home-stand" id="recognition-title" tone="blue"><Link href="/values" className="text-link">Learn About Our Values</Link></SourcePanel></div>
      </div>
    </section>

    <section id="explore" className="discovery wrap surface-quiet" aria-labelledby="explore-title">
      <div className="section-backdrop" aria-hidden="true" />
      <SourcePanel source="home-conditions" id="explore-title" tone="amber" />
      <div className="difference-list">{differences.map((d, index) => <Link href={`/${d.slug}`} className={`difference-row copy-panel panel-${d.theme === "amber" ? "amber" : d.theme === "coral" ? "coral" : "blue"} theme-${d.theme}`} key={d.slug}>
        <DiscoveryTrail /><span className="row-number" aria-hidden="true">0{index + 1}</span><DifferenceArtwork index={index} /><div className="difference-name"><h3>{d.name}</h3></div><p>{d.description}</p>
      </Link>)}</div>
      <DysConnections placement="home" />
    </section>

    <section id="community" className="connection surface-soft surface-panel" aria-labelledby="community-title" data-has-interactive-journey>
      <div className="wrap">
        <div className="connection-heading"><SourcePanel source="home-approach" id="community-title" tone="teal" /></div>
        <div className="connection-layout"><PathsToBelongingSection embedded /><div className="connection-chapters">{connectionChapters.map((chapter, index) => <article className="connection-chapter copy-panel panel-blue" key={chapter.number}>
          <div className="chapter-wash" aria-hidden="true" /><ConnectionTrail index={index} /><span className="chapter-number">{chapter.number}</span><h3>{chapter.title}</h3><p>{chapter.text}</p>
        </article>)}</div></div>
        <div className="community-note copy-panel panel-cream"><p>We are not delivering full services yet.</p><Link className="text-link" href="/what-we-do">See What We are Building</Link></div>
      </div>
    </section>

    <section className="support wrap surface-quiet" aria-labelledby="support-title">
      <div className="section-backdrop" aria-hidden="true" />
      <SourcePanel source="home-work" id="support-title" tone="amber" />
      <nav className="support-links copy-panel panel-blue" aria-label="Explore Connecting Dys"><Link href="/what-we-do">See What We are Building</Link><Link href="/support">Peer Support Spaces</Link><Link href="/get-involved">Get Involved</Link></nav>
    </section>

    <section className="about-home surface-scene surface-panel" aria-labelledby="about-title">
      <div className="wrap about-layout"><div className="about-statement"><figure className="approved-logo"><div className="about-logo-frame"><div className="about-frame-edge" aria-hidden="true" /><Image className="approved-logo-image" src={brand.logo} alt="Connecting Dys — A home for every DYS mind. The original embracing-figures logo." width={1536} height={1024} sizes="(max-width: 1000px) 90vw, 45vw" /></div><figcaption>The embrace at the heart of Connecting Dys.</figcaption></figure></div>
        <div className="about-copy"><SourcePanel source="home-who" id="about-title" tone="cream"><div className="about-caption"><Link href="/about">About Us</Link> · <Link href="/about#mission-and-vision">Our Mission &amp; Vision</Link> · <Link href="/values">Our Values</Link></div></SourcePanel></div>
      </div>
    </section>

    <section className="invitation wrap surface-paper" aria-labelledby="invitation-title">
      <div className="section-backdrop" aria-hidden="true" /><div className="invitation-decoration" aria-hidden="true"><FinalePath /></div>
      <div className="copy-panel panel-teal" ><h2 id="invitation-title">Join us in creating something meaningful.</h2><p>We are developing a lasting community built on trust, collaborative design, and collective ownership.</p><div className="hero-actions"><Link href="/membership" className="button">Register Your Interest</Link><Link href="/contact" className="text-link">Join Our Mailing List</Link><Link href="/get-involved" className="text-link">Get Involved</Link></div></div>
      <a href="#main-content" className="back-top">Back to the beginning ↑</a>
    </section>
  <BackgroundDoodles /></main>;
}

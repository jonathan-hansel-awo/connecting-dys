import Image from "next/image";
import Link from "next/link";
import { BackgroundDoodles } from "@/components/background-doodles";
import { HeroMarginCurves } from "@/components/hero-margin-curves";
import { HeroDysEmbrace } from "@/components/hero-dys-embrace";
import { HomeStoryMotion } from "@/components/home-story-motion";
import { BridgeArtwork } from "@/components/bridge-artwork";
import { PathsToBelongingSection } from "@/features/paths-to-belonging/section";
import { FinalePath } from "@/components/finale-path";

const principles = [
  { tone: "blue", text: "Community over isolation" },
  { tone: "coral", text: "Lived experience over assumptions" },
  { tone: "teal", text: "Inclusion over exclusion" },
  { tone: "amber", text: "Strengths over stigma" },
];

export default function HomePage() {
  return <main id="main-content" tabIndex={-1} data-home-story className="calm-home">
    <HomeStoryMotion />
    <section className="hero welcome-hero wrap surface-paper" aria-labelledby="hero-title" data-welcome-scene>
      <div className="section-backdrop" aria-hidden="true" />
      <HeroMarginCurves />
      <div className="hero-composition" data-hero-backdrop aria-hidden="true"><div className="logo-stage"><HeroDysEmbrace /></div></div>
      <div className="hero-copy">
        <h1 id="hero-title">Welcome to<br />Connecting <span className="dys-word">DYS</span></h1>
        <p className="hero-intro">Building community and connection for teenagers, young adults and families affected by dyspraxia, dyscalculia, dysgraphia and dyslexia.</p>
        <div className="hero-actions"><Link href="/get-involved#register-interest" className="button">Join Our Community</Link></div>
      </div>
    </section>

    <PathsToBelongingSection />

    <section className="home-principles wrap" aria-labelledby="stand-title">
      <div className="section-backdrop" aria-hidden="true" />
      <h2 id="stand-title">What we stand for</h2>
      <p className="section-intro">A community where DYS differences are recognised, understood and valued.</p>
      <ul className="principle-list">{principles.map(({ tone, text }, index) => <li key={text} className={`principle-card copy-panel panel-${tone}`}><span className="principle-art" data-principle-art={index} aria-hidden="true"><Image src="/images/principles-atlas.png" alt="" width={1024} height={1024} sizes="360px" className="principle-atlas" /></span><h3>{text}</h3></li>)}</ul>
      <Link href="/values" className="text-link">Our BRIDGE values</Link>
    </section>

    <section id="recognition" className="recognition surface-scene surface-panel" aria-labelledby="recognition-title">
      <div className="recognition-sheet" data-recognition-sheet aria-hidden="true" />
      <div className="wrap recognition-grid">
        <figure className="recognition-figure"><div className="recognition-media surface-inset"><Image src="/images/community-reading.webp" alt="Five people sitting together around a table with books." fill sizes="(max-width: 1000px) 90vw, 45vw" className="recognition-photo" /></div><figcaption>Photo provided by Connecting DYS. Background edited for privacy.</figcaption></figure>
        <div className="recognition-copy"><p className="eyebrow">Connection starts with people</p><h2 id="recognition-title">Real people.<br />Real community.</h2><p>A space to connect with people who understand. Built on lived experience, shared understanding and a sense of belonging.</p><Link href="/our-story" className="text-link">Read our story</Link></div>
      </div>
    </section>

    <section className="home-building wrap" aria-labelledby="support-title">
      <div className="section-backdrop" aria-hidden="true" />
      <header><h2 id="support-title">What We Do</h2></header>
      <div className="home-nested-panel copy-panel panel-blue">
        <p className="nested-intro">Connecting DYS is in its early stages. Right now, we are building the foundations for long term, community led support.</p>
        <div className="building-columns">
          <div className="nested-panel copy-panel panel-cream"><h3>We are currently:</h3><ul><li>Bringing DYS young people and families together</li><li>Listening to lived experiences</li><li>Identifying gaps in support</li><li>Raising awareness of all DYS conditions</li><li>Building the community that will shape our future services</li></ul></div>
          <div className="nested-panel copy-panel panel-cream"><h3>As we grow, we will introduce:</h3><ul><li>Peer Support Spaces</li><li>Family &amp; Carer Gatherings</li><li>Co Designed Workshops</li><li>Awareness &amp; Advocacy Projects</li><li>Open Forums &amp; Listening Events</li></ul></div>
        </div>
        <p className="nested-closing">We are building slowly, safely and sustainably with you at the centre.</p>
      </div>
      <Link href="/what-we-do" className="text-link">See What We&apos;re Building</Link>
    </section>

    <section className="home-approach wrap" aria-labelledby="approach-title">
      <div className="section-backdrop" aria-hidden="true" />
      <h2 id="approach-title">Our Approach</h2>
      <div className="home-nested-panel copy-panel panel-teal">
        <div className="approach-opening"><div className="approach-pillars"><p className="nested-panel">Community first.</p><p className="nested-panel">Co designed.</p><p className="nested-panel">Grounded in lived experience.</p></div><BridgeArtwork /></div>
        <p className="nested-intro">We don&apos;t impose ready made solutions. We listen, collaborate and build together.</p>
        <div className="nested-panel copy-panel panel-cream"><h3>Our approach is rooted in:</h3><ul><li>Belonging before services</li><li>Lived experience shaping every decision</li><li>Inclusive, non clinical social support</li><li>Sustainable community infrastructure</li><li>Shared ownership and collective leadership</li></ul></div>
        <div className="nested-closing"><p>Because connection matters.</p><p>Understanding matters.</p><p>Community matters.</p></div>
      </div>
      <Link href="/our-approach" className="text-link">Discover our approach</Link>
    </section>

    <section className="invitation wrap surface-paper" aria-labelledby="invitation-title">
      <div className="section-backdrop" aria-hidden="true" /><div className="invitation-decoration" aria-hidden="true"><FinalePath /></div>
      <h2 id="invitation-title">Your mind is at home here.</h2><p>Help shape the community we’re building.</p><div className="hero-actions"><Link href="/get-involved#register-interest" className="button">Register Your Interest</Link><Link href="/get-involved#contact" className="text-link">Get in touch</Link></div>
    </section>
    <BackgroundDoodles />
  </main>;
}

import Image from "next/image";
import Link from "next/link";
import { Heart, Handshake, Users, Fingerprint } from "lucide-react";
import { BackgroundDoodles } from "@/components/background-doodles";
import { HeroMarginCurves } from "@/components/hero-margin-curves";
import { HeroDysEmbrace } from "@/components/hero-dys-embrace";
import { HomeStoryMotion } from "@/components/home-story-motion";
import { HeroTransitionArt } from "@/components/hero-transition-art";
import { BridgeArtwork } from "@/components/bridge-artwork";
import { PathsToBelongingSection } from "@/features/paths-to-belonging/section";
import { FinalePath } from "@/components/finale-path";

const principles = [
  { icon: Users, text: "Community over isolation" },
  { icon: Heart, text: "Lived experience over assumptions" },
  { icon: Handshake, text: "Inclusion over exclusion" },
  { icon: Fingerprint, text: "Strengths over stigma" },
];

export default function HomePage() {
  return <main id="main-content" tabIndex={-1} data-home-story className="calm-home">
    <HomeStoryMotion />
    <section className="hero wrap surface-paper" aria-labelledby="hero-title" data-welcome-scene>
      <div className="section-backdrop" aria-hidden="true" />
      <HeroMarginCurves />
      <div className="hero-copy">
        <p className="eyebrow">Connecting DYS CIC</p>
        <h1 id="hero-title">A home for<br />every <span className="dys-word">DYS</span> mind.</h1>
        <p className="hero-intro">Building community and connection for teenagers, young adults and families affected by dyspraxia, dyscalculia, dysgraphia and dyslexia.</p>
        <div className="hero-actions"><Link href="/membership" className="button">Join Our Community</Link><Link href="/get-involved" className="text-link">Work With Us</Link></div>
      </div>
      <div className="hero-composition"><HeroTransitionArt /><div className="hero-note note-top surface-raised">Your mind is at home here.</div><div className="logo-stage"><HeroDysEmbrace /><div className="hero-lockup"><span className="hero-wordmark">Connecting Dys</span></div></div></div>
    </section>

    <PathsToBelongingSection />

    <section className="home-principles wrap" aria-labelledby="stand-title">
      <div className="section-backdrop" aria-hidden="true" />
      <h2 id="stand-title">What we stand for</h2>
      <p className="section-intro">A community where DYS differences are recognised, understood and valued.</p>
      <ul className="principle-list">{principles.map(({ icon: Icon, text }) => <li key={text}><Icon size={36} strokeWidth={1.5} aria-hidden="true" /><h3>{text}</h3></li>)}</ul>
      <Link href="/values" className="text-link">Our BRIDGE values</Link>
    </section>

    <section id="recognition" className="recognition surface-scene surface-panel" aria-labelledby="recognition-title">
      <div className="recognition-sheet" data-recognition-sheet aria-hidden="true" />
      <div className="wrap recognition-grid">
        <figure className="recognition-figure"><div className="recognition-media surface-inset"><Image src="/images/community-reading.webp" alt="Five people sitting together around a table with books." fill sizes="(max-width: 1000px) 90vw, 45vw" className="recognition-photo" /></div><figcaption>Photo provided by Connecting Dys. Background edited for privacy.</figcaption></figure>
        <div className="recognition-copy"><p className="eyebrow">Connection starts with people</p><h2 id="recognition-title">Real people.<br />Real community.</h2><p>A space to connect with people who understand. Built on lived experience, shared understanding and a sense of belonging.</p><Link href="/our-story" className="text-link">Read our story</Link></div>
      </div>
    </section>

    <section className="home-building wrap" aria-labelledby="support-title">
      <div className="section-backdrop" aria-hidden="true" />
      <header><p className="eyebrow">Growing together</p><h2 id="support-title">What we do</h2><p>We are in our early stages, building the foundations for lasting, community-led support.</p></header>
      <div className="building-columns">
        <div className="copy-panel panel-blue"><h3>Right now</h3><ul><li>Bringing young people and families together</li><li>Listening to lived experiences</li><li>Raising awareness of all DYS conditions</li></ul></div>
        <div className="copy-panel panel-amber"><h3>As we grow</h3><ul><li>Peer support spaces</li><li>Family and carer gatherings</li><li>Co-designed workshops and listening events</li></ul><p className="small">These are being developed, rather than full services available today.</p></div>
      </div>
      <Link href="/what-we-do" className="text-link">See what we’re building</Link>
    </section>

    <section className="home-approach wrap" aria-labelledby="approach-title">
      <div className="section-backdrop" aria-hidden="true" />
      <BridgeArtwork />
      <div><p className="eyebrow">Our approach</p><h2 id="approach-title">Community first.</h2><p>Co-designed. Grounded in lived experience.</p><p>We listen, collaborate and build together, with you at the centre.</p><Link href="/our-approach" className="text-link">Discover our approach</Link></div>
    </section>

    <section className="invitation wrap surface-paper" aria-labelledby="invitation-title">
      <div className="section-backdrop" aria-hidden="true" /><div className="invitation-decoration" aria-hidden="true"><FinalePath /></div>
      <h2 id="invitation-title">Your mind is at home here.</h2><p>Help shape the community we’re building.</p><div className="hero-actions"><Link href="/membership" className="button">Register Your Interest</Link><Link href="/contact" className="text-link">Get in touch</Link></div>
    </section>
    <BackgroundDoodles />
  </main>;
}

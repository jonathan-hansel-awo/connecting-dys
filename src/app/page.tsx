import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { brand, connectionChapters, differences } from "@/content/site";
import { DifferenceArtwork } from "@/components/story-art";
import { HeroDysEmbrace } from "@/components/hero-dys-embrace";
import { AnimatedDysWords } from "@/components/animated-dys-words";
import { DysConnections } from "@/components/dys-connections";
import { HomeStoryMotion } from "@/components/home-story-motion";
import { ConnectionTrail } from "@/components/connection-trail";
import { DiscoveryTrail } from "@/components/discovery-trail";
import { HeroTransitionArt } from "@/components/hero-transition-art";
import { FinalePath } from "@/components/finale-path";
import { PathsToBelongingSection } from "@/features/paths-to-belonging/section";

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} data-home-story>
      <HomeStoryMotion />
      <section
        className="hero wrap surface-paper"
        aria-labelledby="hero-title"
        data-welcome-scene
      >
        <div className="section-backdrop" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            Different minds. Shared belonging.
          </p>
          <h1 id="hero-title">
            A home for
            <br />
            every{" "}
            <span className="dys-word">
              DYS
              <svg viewBox="0 0 250 22" fill="none" aria-hidden="true">
                <path
                  d="M5 14Q112 0 244 11M15 20Q115 9 221 17"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            mind.
          </h1>
          <p className="hero-intro">
            Come as you are.
            <br />
            You don’t have to figure it all out alone.
          </p>
          <p className="hero-description">
            We’re building a community for teenagers and young adults navigating
            dyslexia, dyspraxia, dyscalculia and dysgraphia, alongside their families.
          </p>
          <div className="hero-actions">
            <Link href="/support" className="button">
              Explore support <ArrowUpRight aria-hidden="true" size={20} />
            </Link>
            <a href="#community" className="text-link">
              Find your community <ArrowRight aria-hidden="true" size={19} />
            </a>
          </div>
        </div>
        <div className="hero-composition">
          <HeroTransitionArt />
          <div className="hero-note note-top surface-raised">
            A little more understood.
          </div>
          <div className="logo-stage">
            <HeroDysEmbrace />
            <div className="hero-lockup">
              <span className="hero-wordmark">Connecting Dys</span>
              <span className="hero-tagline">{brand.tagline}</span>
            </div>
          </div>
          <div className="hero-note note-bottom">
            <span aria-hidden="true">↳</span> A place to begin. A space to be
            you.
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#recognition">
            Find your own way through <ArrowDown size={17} aria-hidden="true" />
          </a>
          <span>Connection starts with understanding.</span>
        </div>
      </section>

      <section
        id="recognition"
        className="recognition surface-scene surface-panel"
        aria-labelledby="recognition-title"
      >
        <div className="recognition-sheet" data-recognition-sheet aria-hidden="true" />
        <div className="wrap recognition-grid">
          <div className="recognition-art">
            <span className="eyebrow">01 / A shared starting point</span>
            <figure className="recognition-figure">
              <div className="recognition-media surface-inset">
                <Image
                  src="/images/community-reading.webp"
                  alt="Five people sitting together around a table with books."
                  fill
                  sizes="(max-width: 1000px) 90vw, 45vw"
                  className="recognition-photo"
                />
              </div>
              <figcaption>
                Photo provided by Connecting Dys. Background edited for privacy.
              </figcaption>
            </figure>
          </div>
          <div className="recognition-copy">
            <p className="eyebrow">You are more than a label</p>
            <h2 id="recognition-title">
              Different paths.
              <br />
              <span>Room for all of them.</span>
            </h2>
            <p>
              Diagnosed, waiting for answers, or unsure where you fit —
              your experience matters. You don’t need a diagnosis to belong.
            </p>
            <p>
              We’re creating space to meet people who understand, share
              experiences and find connection.
            </p>
            <a href="#explore" className="text-link light-link">
              Start with understanding{" "}
              <ArrowDown size={19} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section
        id="explore"
        className="discovery wrap surface-quiet"
        aria-labelledby="explore-title"
      >
        <div className="section-backdrop" aria-hidden="true" />
        <div className="discovery-heading">
          <div>
            <p className="eyebrow">02 / Make sense of your experience</p>
            <h2 id="explore-title">
              Four names.
              <br />
              So many ways <span className="text-teal">to be.</span>
            </h2>
          </div>
          <p>
            No two experiences are the same. Explore what feels relevant to you
            — or learn a little more about someone else’s world.
          </p>
        </div>
        <div className="difference-list">
          {differences.map((d, index) => (
            <Link
              href={`/${d.slug}`}
              className={`difference-row theme-${d.theme}`}
              key={d.slug}
            >
              <DiscoveryTrail />
              <span className="row-number" aria-hidden="true">
                0{index + 1}
              </span>
              <DifferenceArtwork index={index} />
              <div className="difference-name">
                <span className="small">{d.cue}</span>
                <h3>{d.name}</h3>
              </div>
              <p>{d.description}</p>
              <span className="round-arrow">
                <ArrowUpRight size={25} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
        <p className="discovery-footnote">
          You might recognise more than one. You don’t need a diagnosis to start
          exploring.
        </p>
        <DysConnections placement="home" />
      </section>

      <section
        id="community"
        className="connection surface-soft surface-panel"
        aria-labelledby="community-title"
      >
        <div className="wrap">
          <div className="connection-heading">
            <p className="eyebrow">03 / Connection, at your pace</p>
            <h2 id="community-title">
              Belonging isn’t fitting in.
              <br />
              It’s finding <span className="text-teal">your people.</span>
            </h2>
            <p>Community first. Shaped by lived experience.</p>
          </div>
          <div className="connection-layout">
            <AnimatedDysWords />
            <div className="connection-chapters">
              {connectionChapters.map((chapter, index) => (
                <article className="connection-chapter" key={chapter.number}>
                  <div className="chapter-wash" aria-hidden="true" />
                  <ConnectionTrail index={index} />
                  <span className="chapter-number">{chapter.number}</span>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.text}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="community-note">
            <span className="status-dot" />
            <p>
              We’re growing our community and building the foundations for
              future support. Full services are not yet being delivered.
            </p>
            <Link className="text-link" href="/what-we-do">
              See what we’re building{" "}
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section
        className="support wrap surface-quiet"
        aria-labelledby="support-title"
      >
        <div className="section-backdrop" aria-hidden="true" />
        <div className="support-heading">
          <p className="eyebrow">04 / A useful next step</p>
          <h2 id="support-title">
            Start wherever
            <br />
            you are.
          </h2>
          <p>
            No rush. No right order.
            <br />
            Just a few ways to move forward.
          </p>
        </div>
        <div className="support-links">
          <div className="support-surface" aria-hidden="true" />
          <Link href="/support">
            <div>
              <h3>Find information & support</h3>
              <p>
                Understand your options and explore the information available.
              </p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link href="/get-involved">
            <div>
              <h3>Be part of what comes next</h3>
              <p>
                Young people, families and supporters — bring your perspective.
              </p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link href="/contact">
            <div>
              <h3>Start a conversation</h3>
              <p>
                Have a question, an idea or a wish to connect? Get in touch.
              </p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section
        className="about-home surface-scene surface-panel"
        aria-labelledby="about-title"
      >
        <div className="wrap about-layout">
          <div className="about-statement">
            <p className="eyebrow">05 / Meet Connecting Dys</p>
            <figure className="approved-logo">
              <div className="about-logo-frame">
                <div className="about-frame-edge" aria-hidden="true" />
                <Image
                  className="approved-logo-image"
                  src={brand.logo}
                  alt="Connecting Dys — A home for every DYS mind. The original embracing-figures logo."
                  width={1536}
                  height={1024}
                  sizes="(max-width: 1000px) 90vw, 45vw"
                />
              </div>
              <figcaption>
                The embrace at the heart of Connecting Dys.
              </figcaption>
            </figure>
          </div>
          <div className="about-copy">
            <h2 id="about-title">
              A community.
              <br />A shared purpose.
            </h2>
            <p>
              Connecting Dys is a UK Community Interest Company.
              We’re building a community around lived experience,
              connection and shared understanding. Our mission is to reduce
              isolation for DYS individuals and families.
            </p>
            <p>
              Based in Nottingham and welcoming DYS minds nationwide, our focus
              is teenagers, young adults and the people alongside them.
            </p>
            <Link href="/about" className="text-link">
              Our story & purpose <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <div className="about-caption">
              <Link href="/about#mission-and-vision">Our mission & vision</Link> · <Link href="/values">Our BRIDGE values</Link> · <Link href="/our-approach">How we work</Link>
            </div>
          </div>
        </div>
      </section>

      <section
        className="invitation wrap surface-paper"
        aria-labelledby="invitation-title"
      >
        <div className="section-backdrop" aria-hidden="true" />
        <div className="invitation-decoration" aria-hidden="true">
          <FinalePath />
        </div>
        <p className="eyebrow">A beginning, whenever you’re ready</p>
        <h2 id="invitation-title">
          There’s room
          <br />
          for <span className="text-teal">you.</span>
        </h2>
        <p>
          You don’t need all the answers.
          <br />A hello is a good place to start.
        </p>
        <Link href="/membership" className="button">
          Express your interest <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
        <a href="#main-content" className="back-top">
          Back to the beginning ↑
        </a>
      </section>
      <PathsToBelongingSection />
    </main>
  );
}

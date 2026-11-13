import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { brand, connectionChapters, differences } from "@/content/site";
import { DifferenceArtwork, CommunityArtwork } from "@/components/story-art";
import { HomeStoryMotion } from "@/components/home-story-motion";

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <HomeStoryMotion />
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
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
            dyslexia, dyspraxia, dyscalculia and dysgraphia.
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
          <div className="hero-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="hero-note note-top">A little more understood.</div>
          <div className="logo-stage">
            <Image
              src={brand.symbol}
              alt="Two figures embracing inside a heart."
              width={1024}
              height={1024}
              sizes="(max-width: 700px) 90vw, (max-width: 1100px) 65vw, 46vw"
              preload
            />
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
        className="recognition"
        aria-labelledby="recognition-title"
      >
        <div className="wrap recognition-grid">
          <div className="recognition-art">
            <span className="eyebrow">01 / A shared starting point</span>
            <figure className="recognition-figure">
              <div className="recognition-media">
                <Image
                  src="/images/shared-moment.webp"
                  alt="An illustrative scene of four young adults talking together in a relaxed shared space."
                  fill
                  sizes="(max-width: 1000px) 90vw, 45vw"
                  className="recognition-photo"
                />
              </div>
              <figcaption>
                AI-created illustrative scene. Not Connecting Dys members.
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
              Some things may take a little more time. Some things may need a
              different approach. Your experience is your own.
            </p>
            <p>
              Here, the starting point is simple: listening to each other,
              making space and finding connection.
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
        className="discovery wrap"
        aria-labelledby="explore-title"
      >
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
      </section>

      <section
        id="community"
        className="connection"
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
            <p>What we’re working towards, together.</p>
          </div>
          <div className="connection-layout">
            <div className="connection-visual" aria-hidden="true">
              <div className="landscape-label">
                Every path has a place here.
              </div>
              <CommunityArtwork />
              <div className="landscape-caption">
                <span>Different perspectives.</span>
                <span>Shared possibility.</span>
              </div>
              <div className="connection-progress">
                <span />
              </div>
            </div>
            <div className="connection-chapters">
              {connectionChapters.map((chapter) => (
                <article className="connection-chapter" key={chapter.number}>
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
            <Link className="text-link" href="/get-involved">
              Help shape what’s next{" "}
              <ArrowUpRight size={19} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="support wrap" aria-labelledby="support-title">
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

      <section className="about-home" aria-labelledby="about-title">
        <div className="wrap about-layout">
          <div className="about-statement">
            <p className="eyebrow">05 / Meet Connecting Dys</p>
            <figure className="approved-logo">
              <Image
                src={brand.logo}
                alt="Connecting Dys — A home for every DYS mind. The original embracing-figures logo."
                width={1536}
                height={1024}
                sizes="(max-width: 1000px) 90vw, 45vw"
              />
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
              Connecting Dys is a UK Community Interest Company, led by Marie
              Johnson. We’re building a community around lived experience,
              connection and shared understanding.
            </p>
            <p>
              Based in Nottingham and welcoming DYS minds nationwide, our focus
              is teenagers, young adults and the people alongside them.
            </p>
            <Link href="/about" className="text-link">
              Get to know us <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <div className="about-caption">
              Community led. Together from the start.
            </div>
          </div>
        </div>
      </section>

      <section className="invitation wrap" aria-labelledby="invitation-title">
        <div className="invitation-decoration" aria-hidden="true">
          <span />
          <span />
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
        <Link href="/contact" className="button">
          Let’s connect <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
        <a href="#main-content" className="back-top">
          Back to the beginning ↑
        </a>
      </section>
    </main>
  );
}

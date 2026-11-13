import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { brand, connectionStory, differences } from "@/content/site";
import { HomeMotion } from "@/components/home-motion";
import { ConnectionArt, DifferenceArt, PathArt } from "@/components/story-art";

export default function HomePage() {
  return (
    <HomeMotion>
      <main id="main-content" tabIndex={-1}>
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="small-star" aria-hidden="true">
                ✳
              </span>{" "}
              Different minds. Shared understanding.
            </p>
            <h1 id="hero-title">
              A home for
              <br /> every <span>DYS mind.</span>
            </h1>
            <p className="hero-intro">
              You don’t have to fit a mould to find your people.
            </p>
            <p className="hero-description">
              A community for teenagers and young adults navigating dyslexia,
              dyspraxia, dyscalculia and dysgraphia. Come as you are.
            </p>
            <div className="hero-actions">
              <Link href="/support" className="button button-teal">
                Explore support <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
              <Link href="/community" className="text-link">
                Find your community <ArrowRight size={19} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="hero-composition">
            <div className="hero-orbit" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="logo-mat">
              <div className="mat-topline" aria-hidden="true">
                <span>A little connection.</span>
                <Sparkles size={18} />
              </div>
              <Image
                src={brand.logo}
                alt="Connecting Dys: two embracing figures inside a heart. A home for every DYS mind."
                width={1536}
                height={1024}
                preload
                sizes="(max-width: 700px) 90vw, (max-width: 1100px) 70vw, 44vw"
                className="hero-logo"
              />
              <div className="mat-bottomline" aria-hidden="true">
                <span>A world of belonging.</span>
                <span>↗</span>
              </div>
            </div>
            <span className="hero-sticker" aria-hidden="true">
              Come as
              <br />
              <strong>you are.</strong>
            </span>
            <div className="composition-caption">
              <span aria-hidden="true" className="caption-line" />
              Every mind brings something different.
            </div>
          </div>
          <a href="#recognition" className="journey-link">
            <span className="circle-arrow">
              <ArrowDown size={17} aria-hidden="true" />
            </span>{" "}
            A little further, a little more connected
          </a>
          <div className="hero-footnote">
            <span>Community led.</span>
            <span>Grounded in lived experience.</span>
          </div>
        </section>

        <section
          id="recognition"
          className="recognition"
          aria-labelledby="recognition-title"
        >
          <div className="wrap recognition-grid">
            <div>
              <p className="eyebrow">01 / A familiar feeling</p>
              <h2 id="recognition-title">
                Different paths.
                <br />
                <span>A place to meet.</span>
              </h2>
              <p>
                Some things are easier to explore with people who understand.
                You can bring your questions, your experiences, or just
                yourself.
              </p>
            </div>
            <div className="recognition-drawing">
              <PathArt />
              <p>
                No two minds take
                <br />
                exactly the same route.
              </p>
            </div>
            <div className="recognition-bottom">
              <p>You are more than a label.</p>
              <p>You can go at your own pace.</p>
              <p>You don’t need all the answers.</p>
            </div>
          </div>
        </section>

        <section
          id="explore"
          className="discovery wrap"
          aria-labelledby="explore-title"
        >
          <div className="section-heading">
            <p className="eyebrow">02 / Get to know DYS</p>
            <div className="heading-split">
              <h2 id="explore-title">
                Different experiences.
                <br />
                <span>One community.</span>
              </h2>
              <p>
                There is no single way to be a DYS mind. Start wherever feels
                relevant to you.
              </p>
            </div>
          </div>
          <div className="difference-grid">
            {differences.map((item, i) => (
              <Link
                href={`/understand/${item.slug}`}
                key={item.slug}
                className={`difference-link difference-${item.colour}`}
              >
                <div className="difference-top">
                  <span className="difference-index">0{i + 1}</span>
                  <span>{item.area}</span>
                  <ArrowUpRight size={24} aria-hidden="true" />
                </div>
                <DifferenceArt index={i} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="difference-cta">
                  Understand {item.name.toLowerCase()}{" "}
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
          <p className="discovery-note">
            A diagnosis can be part of your story. It doesn’t have to be your
            starting point here.
          </p>
        </section>

        <section
          id="connection"
          className="connection"
          aria-labelledby="connection-title"
        >
          <div className="wrap">
            <p className="eyebrow">03 / Connection, in the making</p>
            <div className="heading-split">
              <h2 id="connection-title">
                Belonging starts
                <br />
                <span>with being heard.</span>
              </h2>
              <p>
                We’re building a community with people, shaped by the
                experiences they bring.
              </p>
            </div>
            <div className="connection-body">
              <div className="connection-visual" aria-hidden="true">
                <div className="connection-window">
                  <div className="connection-track">
                    {connectionStory.map((item, i) => (
                      <div className="connection-scene" key={item.number}>
                        <ConnectionArt scene={i} />
                        <span className="scene-word">
                          {item.word}
                          <span>0{i + 1}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="story-progress">
                  <span className="story-progress-fill" />
                </div>
                <div className="visual-caption">
                  <span>Small moments. Meaningful connections.</span>
                  <span>01 — 03</span>
                </div>
              </div>
              <div className="connection-copy">
                {connectionStory.map((item) => (
                  <article className="story-step" key={item.number}>
                    <span className="step-number">{item.number}</span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
            <Link href="/community" className="text-link connection-link">
              Get to know our community{" "}
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section
          className="support-section wrap"
          aria-labelledby="support-title"
        >
          <div className="support-intro">
            <p className="eyebrow">04 / A useful next step</p>
            <h2 id="support-title">
              A little clarity.
              <br />
              <span>At your pace.</span>
            </h2>
            <p>
              Whether you’re exploring for yourself or supporting someone else,
              start with what you need today.
            </p>
            <Link href="/support" className="button button-dark">
              Explore support <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          </div>
          <div className="support-pathways">
            <Link href="/#explore">
              <span className="pathway-number">01</span>
              <div>
                <h3>Understand a learning difference</h3>
                <p>Plain-language introductions to the four DYS differences.</p>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/community">
              <span className="pathway-number">02</span>
              <div>
                <h3>Find out where you fit</h3>
                <p>Get to know our approach to community and connection.</p>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
            <Link href="/contact">
              <span className="pathway-number">03</span>
              <div>
                <h3>Start a conversation</h3>
                <p>
                  For young people, families, supporters and potential partners.
                </p>
              </div>
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="about-section" aria-labelledby="about-title">
          <div className="wrap about-grid">
            <div className="about-composition" aria-hidden="true">
              <div className="about-arch">
                <span>
                  Built with
                  <br />
                  people.
                  <br />
                  <i>For people.</i>
                </span>
                <span className="about-star">✳</span>
              </div>
              <div className="about-label">Lived experience at the centre.</div>
            </div>
            <div className="about-copy">
              <p className="eyebrow">05 / Meet Connecting Dys</p>
              <h2 id="about-title">
                Community first.
                <br />
                <span>Always.</span>
              </h2>
              <p>
                Led by Marie Johnson, Connecting Dys is a UK Community Interest
                Company, based in Nottingham and open to DYS minds across the
                country.
              </p>
              <p>
                We’re laying the foundations for lasting, community-led
                connection. Listening first. Building carefully. Making room for
                the people who will shape what comes next.
              </p>
              <Link href="/about" className="text-link">
                Read our story <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="invitation wrap" aria-labelledby="invitation-title">
          <p className="eyebrow">06 / Your next chapter</p>
          <div className="invitation-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <h2 id="invitation-title">
            There’s room
            <br />
            <span>for you here.</span>
          </h2>
          <p>
            You don’t have to have it all figured out.
            <br />
            Let’s start with a connection.
          </p>
          <Link href="/contact" className="button button-teal">
            Say hello <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
          <Link href="/community" className="text-link">
            A little more about belonging{" "}
            <ArrowRight size={19} aria-hidden="true" />
          </Link>
        </section>
      </main>
    </HomeMotion>
  );
}

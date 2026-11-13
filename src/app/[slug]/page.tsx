import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { brand, differences, originalSite } from "@/content/site";

const pages = ["about", "support", "get-involved", "contact", "accessibility"];
const titles: Record<string, string> = {
  about: "Our story",
  support: "Information & support",
  "get-involved": "Help shape what comes next",
  contact: "A hello is a good place to start.",
  accessibility: "Your reading experience",
};
export function generateStaticParams() {
  return [...pages, ...differences.map((d) => d.slug)].map((slug) => ({
    slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const difference = differences.find((d) => d.slug === slug);
  return {
    title: difference?.name || titles[slug],
    description: difference?.description,
  };
}
export default async function ReadingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const difference = differences.find((d) => d.slug === slug);
  if (!difference && !pages.includes(slug)) notFound();
  return (
    <main id="main-content" tabIndex={-1} className="reading-page wrap">
      <Link href={difference ? "/#explore" : "/"} className="breadcrumb">
        <ArrowLeft size={17} aria-hidden="true" />
        {difference ? "Explore DYS" : "Back to home"}
      </Link>
      <p className="eyebrow">
        Connecting Dys CIC / {difference ? "Understanding DYS" : titles[slug]}
      </p>
      <h1>{difference?.name || titles[slug]}</h1>
      {difference ? (
        <>
          <p className="lead">{difference.description}</p>
          <div className="article-body">
            <h2>A starting point for understanding</h2>
            <p>{difference.detail}</p>
            <h2>In everyday life</h2>
            <p>{difference.everyday}</p>
            <div className="article-note">
              <p>
                Everyone’s experience is different. Learning differences can
                overlap, and this introduction is not a checklist or an
                assessment.
              </p>
            </div>
            <h2>Explore at your own pace</h2>
            <p>
              You can read more on the{" "}
              <a href={`${originalSite}/${difference.name}`}>
                existing Connecting Dys {difference.name} page
              </a>
              , or <Link href="/contact">get in touch</Link> to ask about the
              community we’re building.
            </p>
            <p>You do not need a diagnosis to begin a conversation.</p>
          </div>
        </>
      ) : (
        <div className="article-body">
          {slug === "about" && (
            <>
              <p className="lead">Belonging begins with connection.</p>
              <h2>Who we are</h2>
              <p>
                Connecting Dys is a UK Community Interest Company, led by Marie
                Johnson. We’re building a community for teenagers and young
                adults navigating dyslexia, dyspraxia, dyscalculia and
                dysgraphia, alongside families and supporters.
              </p>
              <p>
                We are based in Nottingham and welcome DYS minds nationwide,
                including people who are waiting for a diagnosis, newly
                diagnosed, or unsure where they fit.
              </p>
              <h2>Community comes first</h2>
              <p>
                Our purpose is to bring people together around lived experience,
                connection and shared understanding. We want young people and
                families to help shape what comes next.
              </p>
              <div className="article-note">
                <p>
                  We are currently building the community and foundations for
                  future support. Full services are not yet being delivered.
                </p>
              </div>
              <Link className="button" href="/get-involved">
                Get involved <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </>
          )}
          {slug === "support" && (
            <>
              <p className="lead">
                Find a starting point that feels useful to you.
              </p>
              <h2>Understand a learning difference</h2>
              <ul>
                {differences.map((d) => (
                  <li key={d.slug}>
                    <Link href={`/${d.slug}`}>{d.name}</Link> — {d.description}
                  </li>
                ))}
              </ul>
              <h2>Ask about Connecting Dys</h2>
              <p>
                If you’re a young person, family member, educator or supporter,
                you’re welcome to{" "}
                <Link href="/contact">start a conversation</Link> about the
                community.
              </p>
              <div className="article-note">
                <p>
                  Connecting Dys is developing its community and future support.
                  Full services are not yet being delivered. We cannot promise
                  individual support, assessment or a response within a
                  particular time.
                </p>
              </div>
              <h2>More from the organisation</h2>
              <p>
                Visit the{" "}
                <a href={`${originalSite}/Support`}>existing support page</a>{" "}
                for information currently published by Connecting Dys.
              </p>
            </>
          )}
          {slug === "get-involved" && (
            <>
              <p className="lead">
                A community takes shape through the people in it.
              </p>
              <h2>Bring your perspective</h2>
              <p>
                Young people, families, educators, prospective partners and
                supporters are welcome to get in touch. Tell us what connection
                means to you and what you would like to help shape.
              </p>
              <h2>Start with a conversation</h2>
              <p>
                We’re building the foundations for a community led by shared
                experience. Contact us to find out where things stand and
                discuss how you might contribute.
              </p>
              <Link href="/contact" className="button">
                Talk to Connecting Dys{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <h2>Explore the existing website</h2>
              <p>
                You can also read the organisation’s current{" "}
                <a href={`${originalSite}/GetInvolved`}>
                  get involved information
                </a>{" "}
                and <a href={`${originalSite}/Partner`}>partner information</a>.
              </p>
            </>
          )}
          {slug === "contact" && (
            <>
              <p className="lead">
                A question, an idea, or simply a wish to connect — you’re
                welcome to get in touch.
              </p>
              <h2>Email Connecting Dys</h2>
              <p>
                <a className="contact-email" href={`mailto:${brand.email}`}>
                  {brand.email}
                </a>
              </p>
              <p>
                This opens your email application. You can also copy the address
                and use your preferred email service.
              </p>
              <h2>Prefer the existing contact page?</h2>
              <p>
                The organisation’s{" "}
                <a href={`${originalSite}/Contact`}>existing contact page</a> is
                also available. That website manages its own contact form and
                data handling.
              </p>
              <div className="article-note">
                <p>
                  Connecting Dys is a community led organisation and may not
                  respond immediately. Please avoid including sensitive personal
                  information in an initial enquiry.
                </p>
              </div>
            </>
          )}
          {slug === "accessibility" && (
            <>
              <p className="lead">Make this space comfortable for you.</p>
              <h2>Choose how you read</h2>
              <p>
                Open Reading settings in the header to choose Open Sans, Arial,
                Verdana, Atkinson Hyperlegible or OpenDyslexic. You can change
                text size, line spacing, letter spacing and the reading
                background.
              </p>
              <p>
                Font preferences are personal. Specialist fonts are options, not
                a guarantee of easier reading for everyone.
              </p>
              <h2>Motion and navigation</h2>
              <p>
                Use Reduce decorative motion to turn off smooth scrolling and
                decorative scroll animation. Your device’s reduced-motion
                setting is always respected.
              </p>
              <p>
                The page content follows its natural reading order. Use the skip
                link, keyboard navigation or direct menu links to go straight to
                what you need.
              </p>
              <h2>Your preferences and privacy</h2>
              <p>
                Reading preferences are saved in your browser’s local storage.
                This site does not add analytics, tracking cookies, account
                registration or a contact database. External websites and email
                services manage their own data.
              </p>
              <h2>Tell us about a barrier</h2>
              <p>
                We target WCAG 2.2 AA and continue to review the experience. If
                something makes the site difficult to use,{" "}
                <Link href="/contact">contact Connecting Dys</Link> and describe
                the page and the issue.
              </p>
            </>
          )}
        </div>
      )}
      <nav className="article-links" aria-label="Keep exploring">
        <Link className="text-link" href="/support">
          Support & information <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
        <Link className="text-link" href="/contact">
          Get in touch <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </nav>
    </main>
  );
}

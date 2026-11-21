import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { OrganisationPage } from "@/components/organisation-page";
import { organisationPages, type OrganisationSlug } from "@/content/organisation";
import { brand, differences, originalSite } from "@/content/site";
import { policies } from "@/content/policies";
import { PolicyPage } from "@/components/policy-page";
import { MembershipPage } from "@/components/membership-page";
import { DysConnections } from "@/components/dys-connections";

const pages = [...Object.keys(organisationPages), ...Object.keys(policies), "policies", "membership", "support", "get-involved", "contact", "accessibility"];
const titles: Record<string, string> = {
  ...Object.fromEntries(Object.entries(organisationPages).map(([slug, page]) => [slug, page.label])),
  support: "Information & support",
  "get-involved": "Help shape what comes next",
  contact: "A hello is a good place to start.",
  accessibility: "Your reading experience",
  membership: "Membership interest",
  policies: "Our policies",
  ...Object.fromEntries(Object.entries(policies).map(([slug, policy]) => [slug, policy.title])),
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
    description: difference?.description || organisationPages[slug as OrganisationSlug]?.intro || policies[slug]?.intro,
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
  if (slug === "policies" || Object.hasOwn(policies, slug)) return <PolicyPage slug={slug} />;
  if (slug === "membership") return <MembershipPage />;
  if (Object.hasOwn(organisationPages, slug)) {
    return <OrganisationPage slug={slug as OrganisationSlug} />;
  }
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
          {slug === "support" && (
            <>
              <p className="lead">
                Find a starting point that feels useful to you. You don’t need a diagnosis to explore or get in touch.
              </p>
              <h2>Understand a learning difference</h2>
              <ul>
                {differences.map((d) => (
                  <li key={d.slug}>
                    <Link href={`/${d.slug}`}>{d.name}</Link> — {d.description}
                  </li>
                ))}
              </ul>
              <h2>Community support, growing with you</h2>
              <p>We’re preparing peer spaces, family gatherings and practical workshops with the community. <Link href="/what-we-do">See what we’re building</Link> and what’s still in development.</p>
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
              <DysConnections />
              <h2>A safe next step</h2>
              <p><Link href="/membership">Express interest in membership</Link>, or read our <Link href="/safeguarding">safeguarding information</Link> before getting in touch.</p>
            </>
          )}
          {slug === "get-involved" && (
            <>
              <p className="lead">
                A community takes shape through the people in it.
              </p>
              <h2>There’s room for you</h2>
              <p>Our focus is teenagers and young adults with DYS, alongside families and carers. Diagnosed, awaiting assessment or unsure where you fit — you’re welcome to start a conversation.</p>
              <h2>Bring your perspective</h2>
              <p>
                Young people, families, educators, prospective partners and
                supporters are welcome to get in touch. Tell us what connection
                means to you and what you would like to help shape.
              </p>
              <p>You can share an experience, suggest an idea or ask about working with us. <Link href="/our-approach">See how we build with the community</Link>.</p>
              <h2>Interested in membership?</h2>
              <p>
                If you are aged 13–17 or 18–24, you can request membership information using our short interest forms. This is a first enquiry, so you can read more before deciding whether to join.
              </p>
              <Link href="/membership" className="button">
                Express your interest{" "}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              <h2>Volunteer or work with us</h2><p>Families, carers, educators, prospective volunteers and partners can <Link href="/contact">start a conversation</Link> about contributing. We’re building slowly, with safeguarding and sustainable growth at the centre.</p>
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
              <h2>Choose the right starting point</h2>
              <p><Link href="/membership">Membership information</Link> · <Link href="/complaints">Complaints & feedback</Link> · <Link href="/safeguarding">Raise a safeguarding concern</Link></p>
              <p>Based in Nottingham, welcoming DYS minds nationwide. You can write to us, send an audio explanation or ask someone you trust to help.</p>
              <div className="article-note">
                <p>
                  Connecting Dys is a community led organisation and may not
                  respond immediately. Please avoid including sensitive personal
                  information in an initial enquiry.
                </p>
              </div>
              <p>Read <Link href="/privacy">how we handle your information</Link>. This mailbox is not an emergency service. If someone is in immediate danger, call 999.</p>
            </>
          )}
          {slug === "accessibility" && (
            <>
              <p className="lead">Make this space comfortable for you.</p>
              <h2>Choose how you read</h2>
              <p>
                Open Reading settings just below the navigation to choose Open
                Sans, Arial, Verdana, Atkinson Hyperlegible or OpenDyslexic. You
                can change text size, line spacing, letter spacing and the
                reading background.
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
                Reading preferences are saved in your browser’s local storage when you change them.
                This site does not add analytics, tracking cookies, account
                registration or a contact database. External websites and email
                services manage their own data. Read our <Link href="/cookies">cookies & device storage information</Link> or our <Link href="/privacy">privacy notice</Link>.
              </p>
              <h2>Tell us about a barrier</h2>
              <p>
                We target WCAG 2.2 AA and continue to review the experience. If
                something makes the site difficult to use, email <a href={`mailto:${brand.email}?subject=Accessibility%20Support`}>{brand.email}</a> with the subject “Accessibility Support”. Describe the page and the issue, or ask for information in another format. You can send an audio explanation or ask about reasonable adjustments.
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

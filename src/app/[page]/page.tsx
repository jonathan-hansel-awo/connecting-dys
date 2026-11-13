import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ReadingPage } from "@/components/reading-page";
import { brand, differences } from "@/content/site";

const pages = {
  about: {
    eyebrow: "Our story",
    title: "Community first. Always.",
    intro:
      "Connecting Dys is a community-led UK Community Interest Company for teenagers and young adults navigating dyslexia, dyspraxia, dyscalculia and dysgraphia.",
  },
  support: {
    eyebrow: "Find support",
    title: "Start with what you need today.",
    intro:
      "Exploring a learning difference, looking for connection, or supporting someone else? Take your next step at your own pace.",
  },
  community: {
    eyebrow: "Our community",
    title: "A place to bring your whole self.",
    intro:
      "You might have a diagnosis, be waiting for one, or be unsure where you fit. You are welcome to find out more about Connecting Dys.",
  },
  contact: {
    eyebrow: "Get in touch",
    title: "Let’s start with hello.",
    intro:
      "Young people, families, educators, supporters and potential partners: we’d love to hear from you.",
  },
} as const;
type PageKey = keyof typeof pages;
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page } = await params;
  const content = Object.hasOwn(pages, page)
    ? pages[page as PageKey]
    : undefined;
  return {
    title: content?.eyebrow || "Page not found",
    description: content?.intro,
  };
}
export default async function ContentPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const content = Object.hasOwn(pages, page)
    ? pages[page as PageKey]
    : undefined;
  if (!content) notFound();
  return (
    <ReadingPage {...content}>
      {page === "about" && (
        <>
          <h2>Belonging before services</h2>
          <p>
            Led by Marie Johnson and based in Nottingham, Connecting Dys is open
            to DYS minds across the UK. Our purpose is to bring young people and
            families together through lived experience, connection and shared
            understanding.
          </p>
          <p>
            Connecting Dys is in its early stages. We are listening to
            experiences, identifying gaps in support and building a community
            that will shape future activities.
          </p>
          <h2>Built with people</h2>
          <p>
            Community, inclusion and lived experience guide our approach. We
            want the people who will use future spaces and activities to help
            shape them.
          </p>
          <h2>About the organisation</h2>
          <p>
            Connecting Dys CIC is a Community Interest Company registered in
            England and Wales, company number 16833399.
          </p>
          <Link className="button button-teal" href="/contact">
            Start a conversation <ArrowUpRight aria-hidden="true" size={20} />
          </Link>
        </>
      )}
      {page === "support" && (
        <>
          <h2>Understand a learning difference</h2>
          <ul className="reading-links">
            {differences.map((item) => (
              <li key={item.slug}>
                <Link href={`/understand/${item.slug}`}>
                  {item.name}
                  <ArrowUpRight size={20} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <h2>Make reading more comfortable</h2>
          <p>
            Open Reading settings at the top of the page to choose a font, size,
            spacing and background that work for you. You can also reduce
            decorative motion. Your browser’s zoom controls work throughout the
            site.
          </p>
          <h2>Looking for connection?</h2>
          <p>
            We’re building our community and listening to what people need.{" "}
            <Link href="/community">Find out about our community</Link>, or get
            in touch to share a question or an idea.
          </p>
          <div className="reading-callout">
            <p>
              Our focus is community and non-clinical social connection. These
              introductions do not provide diagnosis or clinical advice.
            </p>
          </div>
          <Link className="button button-teal" href="/contact">
            Get in touch <ArrowUpRight aria-hidden="true" size={20} />
          </Link>
        </>
      )}
      {page === "community" && (
        <>
          <h2>Connection, in the making</h2>
          <p>
            We bring together DYS young people and families, listen to lived
            experiences and raise awareness of the four DYS differences. We are
            building slowly and carefully, with the community at the centre.
          </p>
          <h2>You don’t need a diagnosis to belong</h2>
          <p>
            Our existing membership information welcomes individuals, families
            and supporters who share our values. Membership is voluntary and
            free. Under-18 membership requires parent or guardian consent.
          </p>
          <h2>Help shape what comes next</h2>
          <p>
            Peer spaces, gatherings and workshops are part of our future plans.
            We are still building the foundations, so they are not presented
            here as bookable activities.
          </p>
          <p>
            To ask about membership or share an idea, email us. You do not need
            to explain your whole story to start a conversation.
          </p>
          <Link href="/contact" className="button button-teal">
            Ask about getting involved{" "}
            <ArrowUpRight aria-hidden="true" size={20} />
          </Link>
        </>
      )}
      {page === "contact" && (
        <>
          <h2>Email Connecting Dys</h2>
          <p>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </p>
          <p>
            You can ask about the community, membership, getting involved or
            working together. Share only what you feel comfortable sharing.
          </p>
          <p>
            We are based in Nottingham, with a community open across the UK. As
            a community-led organisation, we may not be able to respond
            immediately.
          </p>
          <a className="button button-teal" href={`mailto:${brand.email}`}>
            Write an email <ArrowUpRight aria-hidden="true" size={20} />
          </a>
          <h2>Before you write</h2>
          <p>
            This link opens your email app. There is no registration or message
            form on this website.
          </p>
          <p>
            <a href={`${brand.legacy}/OurPolicies`}>
              Read our policies on the existing website ↗
            </a>
          </p>
        </>
      )}
    </ReadingPage>
  );
}

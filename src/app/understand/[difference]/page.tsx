import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ReadingPage } from "@/components/reading-page";
import { brand, differences } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return differences.map((item) => ({ difference: item.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ difference: string }>;
}): Promise<Metadata> {
  const { difference } = await params;
  const item = differences.find((item) => item.slug === difference);
  return {
    title: item?.name || "Learning differences",
    description: item?.description,
  };
}
export default async function DifferencePage({
  params,
}: {
  params: Promise<{ difference: string }>;
}) {
  const { difference } = await params;
  const item = differences.find((item) => item.slug === difference);
  if (!item) notFound();
  return (
    <ReadingPage
      eyebrow="Understand DYS"
      title={item.name}
      intro={item.description}
    >
      <h2>A person, beyond a label</h2>
      <p>{item.note}</p>
      <p>
        Learning differences can overlap, and experiences vary from person to
        person. This is an introduction, rather than an assessment or a way to
        diagnose yourself.
      </p>
      <h2>Start with the individual</h2>
      <p>
        Ask what feels useful, rather than assuming what someone needs. Leave
        room for questions, different ways of communicating and time to process
        information.
      </p>
      <div className="reading-callout">
        <p>
          Adjust the font, text size, spacing and background using Reading
          settings at the top of every page. Choose what feels comfortable for
          you.
        </p>
      </div>
      <h2>Keep exploring</h2>
      <p>
        <a href={`${brand.legacy}/${item.source}`}>
          Read more about {item.name.toLowerCase()} on our existing website ↗
        </a>
      </p>
      <ul className="reading-links">
        {differences
          .filter((other) => other.slug !== item.slug)
          .map((other) => (
            <li key={other.slug}>
              <Link href={`/understand/${other.slug}`}>
                {other.name}
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            </li>
          ))}
      </ul>
      <Link href="/community" className="button button-teal">
        Get to know our community <ArrowUpRight size={20} aria-hidden="true" />
      </Link>
    </ReadingPage>
  );
}

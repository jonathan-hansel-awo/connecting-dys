import Link from "next/link";
import Image from "next/image";
import { differences } from "@/content/site";

// The supplied drawing keeps its original lettering. Separate links adapt to
// reading preferences without covering or duplicating text inside the artwork.
export function DysConnections({ placement = "support" }: { placement?: "home" | "support" }) {
  const prefix = `dys-hearts-${placement}`;
  return <section className={`dys-connections dys-connections-${placement}`} aria-labelledby={`${prefix}-title`}>
    <div className="dys-connections-copy copy-panel panel-blue"><h2 id={`${prefix}-title`}>Your mind is at home here.</h2>
    <p>DYS stands for Dyspraxia, Dyscalculia, Dysgraphia and Dyslexia, including those waiting for a diagnosis or unsure where they fit.</p>
      <nav className="dys-heart-links" aria-label="Explore the four DYS experiences">{differences.map(difference => <Link key={difference.slug} href={`/${difference.slug}`}>{difference.name}</Link>)}</nav>
    </div>
    <div className="dys-hearts">
      <Image src="/images/dys-connected-hearts-transparent.png" alt="Four hand-drawn interconnected hearts labelled Dysgraphia, Dyspraxia, Dyscalculia and Dyslexia, with DYS Connect in the middle." width={1254} height={1254} sizes="(max-width: 760px) 88vw, 45vw" />
    </div>
  </section>;
}

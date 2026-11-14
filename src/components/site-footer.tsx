import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand, differences, originalSite } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer surface-scene">
      <div className="footer-top">
        <div>
          <Link href="/" className="footer-brand">
            Connecting Dys<span aria-hidden="true">↗</span>
          </Link>
          <p>{brand.tagline}</p>
          <p className="small">A UK Community Interest Company.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/about">Our story</Link>
          <Link href="/support">Support & resources</Link>
          <Link href="/get-involved">Get involved</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <nav aria-label="Learning differences">
          {differences.map((d) => (
            <Link key={d.slug} href={`/${d.slug}`}>
              {d.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <span>Connecting Dys CIC · Built around belonging.</span>
        <a href={`${originalSite}/OurPolicies`}>
          Organisation policies <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only"> (existing website)</span>
        </a>
        <Link href="/accessibility">Accessibility & reading</Link>
      </div>
    </footer>
  );
}

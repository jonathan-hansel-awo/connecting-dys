import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top wrap">
        <div className="footer-brand">
          <Image
            src={brand.logo}
            alt="Connecting Dys — A home for every DYS mind."
            width={1536}
            height={1024}
            sizes="240px"
          />
          <p>Connection. Understanding. Community.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/about">Our story</Link>
          <Link href="/support">Find support</Link>
          <Link href="/community">Our community</Link>
          <Link href="/contact">Get in touch</Link>
          <a href={`${brand.legacy}/OurPolicies`}>
            Our policies <ArrowUpRight size={14} aria-hidden="true" />
            <span className="sr-only"> (existing website)</span>
          </a>
        </nav>
        <div className="footer-contact">
          <p>Let’s start a conversation.</p>
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
          <p>
            Based in Nottingham.
            <br />A community across the UK.
          </p>
        </div>
      </div>
      <div className="footer-bottom wrap">
        <p>Connecting Dys CIC · Community Interest Company</p>
        <p>Company no. 16833399 · England and Wales</p>
        <a href="#main-content">Back to content ↑</a>
      </div>
    </footer>
  );
}

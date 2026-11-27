import Link from "next/link";
import Image from "next/image";
import { brand, differences } from "@/content/site";
import { CookieInformation } from "@/components/cookie-notice";

export function SiteFooter() {
  return (
    <footer id="site-footer" tabIndex={-1} className="site-footer surface-scene">
      <div className="footer-top">
        <div>
          <Link href="/" className="footer-brand">
            <Image src={brand.logo} alt="" width={80} height={72} /><span>Connecting DYS</span>
          </Link>
          <p>{brand.tagline}</p>
          <p className="small footer-registration">Connecting DYS CIC • Community Interest Company<br />Company Number: 16833399 • Registered in England and Wales.</p>
        </div>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/about">About us</Link>
          <Link href="/our-story">Our story</Link>
          <Link href="/founders-message">Founder’s message</Link>
          <Link href="/what-we-do">What we do</Link>
          <Link href="/our-approach">Our approach</Link>
          <Link href="/values">Our values</Link>
          <Link href="/support">Support & resources</Link>
          <Link href="/get-involved">Get involved</Link>
          <Link href="/get-involved#register-interest">Register your interest</Link>
          <Link href="/get-involved#contact">Contact</Link>
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
        <span>Connecting DYS A community where every DYS mind feels at home.</span>
        <Link href="/policies">Our policies</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/safeguarding">Safeguarding</Link>
        <CookieInformation />
        <Link href="/accessibility">Accessibility & reading</Link>
        <a href="https://lordicon.com/">Doodle icons by Lordicon.com</a>
      </div>
    </footer>
  );
}

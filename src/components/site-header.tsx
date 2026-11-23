import Link from "next/link";
import Image from "next/image";
import { ReadingSettings } from "./reading-settings";
import { MobileNavigation } from "./mobile-navigation";
import { brand } from "@/content/site";

const links = [
  ["/about", "About us"],
  ["/our-story", "Our story"],
  ["/what-we-do", "What we do"],
  ["/#explore", "Explore DYS"],
  ["/support", "Find support"],
  ["/contact", "Get in touch"],
];
export function SiteHeader() {
  return (
    <>
      <div id="page-start" aria-hidden="true" />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="site-header surface-paper">
        <Link
          href="/#page-start"
          className="brand-link"
          aria-label="Connecting Dys — home"
        >
          <Image src={brand.symbol} alt="" width={48} height={48} />
          <span>
            Connecting <b>Dys</b>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([href, label]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-controls">
          <MobileNavigation links={links} />
        </div>
      </header>
      <div className="reading-toolbar wrap" aria-label="Reading preferences">
        <ReadingSettings />
      </div>
    </>
  );
}

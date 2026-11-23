import Link from "next/link";
import Image from "next/image";
import { ReadingSettings } from "./reading-settings";
import { SiteNavigation } from "./site-navigation";
import { brand } from "@/content/site";

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
          <Image src={brand.symbol} alt="" width={64} height={64} />
          <span>
            Connecting <b>Dys</b>
          </span>
        </Link>
        <SiteNavigation />
      </header>
      <div className="reading-toolbar wrap" aria-label="Reading preferences">
        <ReadingSettings />
      </div>
    </>
  );
}

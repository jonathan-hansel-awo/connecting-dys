"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Menu, ArrowUpRight } from "lucide-react";
import { ReadingSettings } from "@/components/reading-settings";
import { brand } from "@/content/site";

const links = [
  { href: "/about", label: "Our story" },
  { href: "/#explore", label: "Understand DYS" },
  { href: "/support", label: "Find support" },
];
export function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link
            href="/"
            aria-label="Connecting Dys home"
            className="brand-link"
          >
            <Image
              src={brand.logo}
              alt="Connecting Dys: two people embracing inside a heart"
              width={1536}
              height={1024}
              sizes="132px"
              className="header-logo"
            />
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <ReadingSettings />
            <Link className="header-contact" href="/contact">
              Get in touch
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <details
              ref={menu}
              className="mobile-menu"
              onKeyDown={(e) => {
                if (e.key === "Escape" && menu.current) {
                  menu.current.open = false;
                  menu.current.querySelector("summary")?.focus();
                }
              }}
            >
              <summary aria-label="Navigation menu">
                <Menu size={23} aria-hidden="true" />
              </summary>
              <nav
                aria-label="Mobile navigation"
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("a") && menu.current)
                    menu.current.open = false;
                }}
              >
                {links.map((link) => (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                  </Link>
                ))}
                <Link href="/contact">Get in touch</Link>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { differences } from "@/content/site";

const groups = [
  { label: "About", links: [["/our-story", "Our story"], ["/about", "About us"], ["/founders-message", "Founder’s message"], ["/what-we-do", "What we do"], ["/our-approach", "Our approach"], ["/values", "Our BRIDGE values"], ["/policies", "Our policies"]] },
];

// Native disclosures keep every destination usable before JavaScript loads.
export function SiteNavigation() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const closeAll = () => root.current?.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(detail => { detail.open = false; });
  useEffect(() => {
    const dismiss = (event: PointerEvent | FocusEvent) => {
      if (!root.current?.contains(event.target as Node)) closeAll();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("focusin", dismiss);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("focusin", dismiss);
    };
  }, []);
  const items = () => <>
    <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>Home</Link>
    {groups.map(group => <details className="nav-group" key={group.label} onToggle={event => {
      const current = event.currentTarget;
      if (!current.open) return;
      current.parentElement?.querySelectorAll<HTMLDetailsElement>(":scope > details[open]").forEach(sibling => {
        if (sibling !== current) sibling.open = false;
      });
    }}>
      <summary>{group.label}<ChevronDown size={16} aria-hidden="true" /></summary>
      <div className="nav-dropdown">{group.links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</div>
    </details>)}
    <Link href="/get-involved" aria-current={pathname === "/get-involved" ? "page" : undefined}>Get involved</Link>
    {differences.map(d => <Link key={d.slug} href={`/${d.slug}`} aria-current={pathname === `/${d.slug}` ? "page" : undefined}>{d.name}</Link>)}
  </>;
  return <div ref={root} className="site-navigation" onClick={event => {
    if ((event.target as Element).closest("a")) closeAll();
  }} onKeyDown={event => {
    if (event.key !== "Escape") return;
    const detail = (event.target as Element).closest<HTMLDetailsElement>("details[open]");
    if (detail) {
      event.preventDefault(); event.stopPropagation();
      detail.open = false; detail.querySelector("summary")?.focus();
    }
  }}>
    <nav className="desktop-nav grouped-nav" aria-label="Main navigation">{items()}</nav>
    <details className="mobile-nav nav-shell"><summary>Menu<ChevronDown size={18} aria-hidden="true" /></summary><nav className="grouped-nav" aria-label="Mobile navigation">{items()}</nav></details>
  </div>;
}

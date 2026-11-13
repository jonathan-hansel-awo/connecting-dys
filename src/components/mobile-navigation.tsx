"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function MobileNavigation({ links }: { links: string[][] }) {
  const details = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (
        details.current?.open &&
        !details.current.contains(event.target as Node)
      )
        details.current.open = false;
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);
  return (
    <details
      ref={details}
      className="mobile-nav"
      onKeyDown={(event) => {
        if (event.key === "Escape" && details.current?.open) {
          details.current.open = false;
          details.current.querySelector("summary")?.focus();
        }
      }}
    >
      <summary>Menu</summary>
      <nav aria-label="Mobile navigation">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            onClick={() => {
              if (details.current) details.current.open = false;
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </details>
  );
}

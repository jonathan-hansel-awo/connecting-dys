"use client";

import { useEffect, useSyncExternalStore } from "react";
const subscribe = () => () => {};

export function PolicyControls() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  useEffect(() => {
    const reveal = (hash: string) => {
      try { document.getElementById(decodeURIComponent(hash.slice(1)))?.closest<HTMLDetailsElement>("details.policy-disclosure")?.setAttribute("open", ""); } catch { /* An invalid fragment should not affect reading. */ }
    };
    const changed = () => reveal(location.hash);
    const follow = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#source-"]');
      if (link) reveal(link.hash);
    };
    let opened: HTMLDetailsElement[] = [];
    const printing = () => { opened = [...document.querySelectorAll<HTMLDetailsElement>("details.policy-disclosure:not([open])")]; opened.forEach(detail => { detail.open = true; }); };
    const printed = () => { opened.forEach(detail => { detail.open = false; }); opened = []; };
    changed(); document.addEventListener("click", follow); window.addEventListener("hashchange", changed);
    window.addEventListener("beforeprint", printing); window.addEventListener("afterprint", printed);
    return () => { document.removeEventListener("click", follow); window.removeEventListener("hashchange", changed); window.removeEventListener("beforeprint", printing); window.removeEventListener("afterprint", printed); };
  }, []);
  const setAll = (open: boolean) => document.querySelectorAll<HTMLDetailsElement>("details.policy-disclosure").forEach(detail => { detail.open = open; });
  return <div className="policy-controls js-only"><button type="button" disabled={!ready} onClick={() => setAll(true)}>Expand all sections</button><button type="button" disabled={!ready} onClick={() => setAll(false)}>Collapse all sections</button></div>;
}

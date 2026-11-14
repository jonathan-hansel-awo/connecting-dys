"use client";

import { useLayoutEffect } from "react";

const key = "connectingDysTopicReturn";
type ReturnPoint = { source: string; destination: string; top: number; keyboard: boolean };

// A small bookmark on the existing history entry survives cached page lifecycles.
// This is navigation data, independent of the reading-preference storage.
export function useTopicReturnRestoration(pathname: string) {
  useLayoutEffect(() => {
    let frame = 0;
    const remember = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element)?.closest<HTMLAnchorElement>("#explore a.difference-row");
      if (!link || link.target === "_blank") return;
      const destination = new URL(link.href, location.href);
      if (destination.origin !== location.origin) return;
      const point: ReturnPoint = { source: location.href, destination: destination.pathname, top: link.getBoundingClientRect().top, keyboard: event.detail === 0 };
      // Preserve the framework's existing entry data and URL. Do not push a new
      // entry or change scrollRestoration, navigation, focus or event defaults.
      history.replaceState({ ...history.state, [key]: point }, "");
    };
    document.addEventListener("click", remember, true);
    const saved = history.state?.[key] as ReturnPoint | undefined;
    if (pathname === "/" && saved?.source === location.href && typeof saved.destination === "string" && Number.isFinite(saved.top)) {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          const link = [...document.querySelectorAll<HTMLAnchorElement>("#explore a.difference-row")]
            .find((el) => el.getAttribute("href") === saved.destination);
          if (location.href !== saved.source || !link || link.getClientRects().length === 0) return;
          const heading = link.querySelector("h3")!.getBoundingClientRect();
          const header = document.querySelector(".site-header")!.getBoundingClientRect();
          // Keep a correct native restoration. Repair only the short-screen
          // hash jump that leaves the visited topic's heading out of view.
          if (heading.top < header.bottom || heading.bottom > innerHeight) {
            window.scrollTo({ top: scrollY + link.getBoundingClientRect().top - saved.top, behavior: "instant" });
          }
          if (saved.keyboard) link.focus({ preventScroll: true });
        });
      });
    }
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", remember, true);
    };
  }, [pathname]);
}

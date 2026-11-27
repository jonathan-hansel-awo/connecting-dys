"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PREFERENCES_EVENT } from "@/lib/preferences";
import { placeDoodles } from "@/lib/doodle-layout";

// Calm solid colours and the visitor's chosen reading font keep these
// recognisable as background decoration rather than competing content.
const collage = [
  ["Dyspraxia", "teal"], ["Dyscalculia", "amber"],
  ["Dysgraphia", "coral"], ["Dyslexia", "ink"],
] as const;

// Protect complete cards and illustration/motion regions, not just their ink.
// Ancestor rectangles also protect transparent parts of the supplied artwork.
const protectedSelector = [
  ".copy-panel", "nav", "form", "figure", "table", "details",
  ".hero-copy", ".recognition-copy", ".principle-list", ".building-columns",
  ".difference-experiences", ".editorial-scene",
  "ul", "ol", "li", "blockquote", "figcaption", "[data-paths-section]",
  ".connection-layout", ".recognition-art", ".about-statement",
  ".dys-hearts", ".invitation-decoration", "[data-paths-game]", ".word-cloud",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "button", "input", "select",
  "textarea", "label", "summary", "legend", "img", "svg", "canvas", "video", "iframe",
].join(",");

export function BackgroundDoodles() {
  const pathname = usePathname();
  const anchor = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    // Bind to this page even while streaming/cache activation temporarily hides
    // it. ResizeObserver then lays out the words when the surface becomes visible.
    // A root-layout query could run before any visible main and never retry.
    const main = anchor.current?.closest("main");
    if (!main || !pathname) return;
    const surfaces = main.matches("[data-home-story]")
      ? Array.from(main.querySelectorAll<HTMLElement>(":scope > section")) : [main];
    let active = true;
    let frame = 0;
    const records = surfaces.map((surface, index) => {
      const layer = document.createElement("div");
      layer.className = "background-doodles";
      layer.setAttribute("aria-hidden", "true");
      layer.inert = true;
      layer.style.visibility = "hidden";
      surface.setAttribute("data-doodle-surface", "");
      surface.append(layer);
      return { surface, layer, index };
    });

    function arrange() {
      frame = 0;
      if (!active) return;
      const root = document.documentElement;
      if (root.dataset.spacious === "true" || root.dataset.texture === "off") return;
      const viewportWidth = root.clientWidth;
      for (const { surface, layer, index } of records) {
        const surfaceRect = surface.getBoundingClientRect();
        const height = surface.offsetHeight;
        if (height < 60 || viewportWidth < 240) continue;
        layer.style.left = `${-surfaceRect.left}px`;
        layer.style.width = `${viewportWidth}px`;
        const count = Math.min(48, Math.max(12, Math.ceil(height / 240) * 4));
        const words = Array.from({ length: count }, (_, i) => {
          const [word, colour] = collage[(i + index * 3) % collage.length];
          const span = document.createElement("span");
          span.className = `background-doodle doodle-${colour}`;
          span.textContent = word;
          // Flat words can fit narrow inter-card gaps on small screens.
          const angle = (viewportWidth < 600 ? [0, -5, 6, 0, -7, 5] : [-12, 8, -6, 12, 0, -8])[(i + index) % 6];
          span.style.fontSize = `${viewportWidth < 600 ? 15 + i % 2 : 19 + i % 4}px`;
          span.style.setProperty("--doodle-angle", `${angle}deg`);
          return { span, angle };
        });
        layer.replaceChildren(...words.map(word => word.span));
        const origin = layer.getBoundingClientRect();
        const obstacles = Array.from(surface.querySelectorAll<HTMLElement>(protectedSelector))
          .filter(element => !element.closest(".background-doodles, [data-hero-backdrop]"))
          .map(element => element.getBoundingClientRect())
          .filter(rect => rect.width > 0 && rect.height > 0)
          .map(rect => ({ x: rect.left - origin.left, y: rect.top - origin.top, width: rect.width, height: rect.height }));
        // Keep overflow outside ancestor boxes protected as well.
        const sizes = words.map(({ span, angle }) => ({ width: span.offsetWidth + 2, height: span.offsetHeight + 2, angle }));
        const seed = [...pathname].reduce((value, char) => Math.imul(value, 31) + char.charCodeAt(0) | 0, index + 733);
        const placements = placeDoodles(viewportWidth, height, obstacles, sizes, seed, viewportWidth < 600 ? 20 : 24, true);
        const byIndex = new Map(placements.map(placement => [placement.index, placement]));
        words.forEach(({ span }, i) => {
          const placement = byIndex.get(i);
          if (!placement) { span.hidden = true; return; }
          span.classList.toggle("doodle-interior", placement.centerX > viewportWidth * .2 && placement.centerX < viewportWidth * .8);
          span.style.left = `${placement.centerX}px`;
          span.style.top = `${placement.centerY}px`;
        });
        layer.style.visibility = "visible";
      }
    }
    function schedule() {
      // Hide old positions immediately when layout changes, before the next paint.
      records.forEach(({ layer }) => { layer.style.visibility = "hidden"; });
      if (!active || frame) return;
      frame = requestAnimationFrame(arrange);
    }
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    records.forEach(({ surface }) => resize?.observe(surface));
    const mutations = new MutationObserver(changes => {
      if (changes.some(change => !(change.target as Element).closest?.(".background-doodles"))) schedule();
    });
    records.forEach(({ surface }) => mutations.observe(surface, { childList: true, subtree: true }));
    window.addEventListener("resize", schedule);
    window.addEventListener(PREFERENCES_EVENT, schedule);
    document.addEventListener("load", schedule, true);
    document.fonts?.addEventListener("loadingdone", schedule);
    document.fonts?.ready.then(() => { if (active) schedule(); });
    schedule();
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      resize?.disconnect();
      mutations.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener(PREFERENCES_EVENT, schedule);
      document.removeEventListener("load", schedule, true);
      document.fonts?.removeEventListener("loadingdone", schedule);
      records.forEach(({ surface, layer }) => { layer.remove(); surface.removeAttribute("data-doodle-surface"); });
    };
  }, [pathname]);
  return <span ref={anchor} hidden aria-hidden="true" data-doodle-anchor />;
}

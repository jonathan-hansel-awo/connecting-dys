"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PREFERENCES_EVENT } from "@/lib/preferences";
import { placeDoodles } from "@/lib/doodle-layout";

// Colour variants follow the supplied word collage. This is a separate, static
// decoration; the existing animated word artwork remains unchanged.
const collage = [
  ["Dyscalculia", "olive"], ["Dyspraxia", "mint-blue"], ["Dyslexia", "ink"],
  ["Dysgraphia", "teal-yellow"], ["Dysgraphia", "amber"], ["Dysgraphia", "ink"],
  ["Dyspraxia", "mauve"], ["Dyscalculia", "ink"], ["Dyspraxia", "ink"],
  ["Dyscalculia", "coral"], ["Dyslexia", "green-purple"], ["Dyslexia", "amber"],
] as const;

// Protect complete cards and illustration/motion regions, not just their ink.
// Ancestor rectangles also protect transparent parts of the supplied artwork.
const protectedSelector = [
  ".copy-panel", "header", "nav", "form", "figure", "table", "details",
  ".hero-composition", ".connection-layout", ".recognition-art", ".about-statement",
  ".dys-hearts", ".invitation-decoration", "[data-paths-game]", ".word-cloud",
  "h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "button", "input", "select",
  "textarea", "label", "summary", "legend", "img", "svg", "canvas", "video", "iframe",
].join(",");

export function BackgroundDoodles() {
  const pathname = usePathname();
  useEffect(() => {
    // Cached routes may remain hidden in the DOM; decorate only the visible page.
    const main = Array.from(document.querySelectorAll<HTMLElement>("main"))
      .find(element => element.getBoundingClientRect().width > 0);
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
        const count = Math.min(48, Math.max(8, Math.ceil(height / 400) * 2));
        const words = Array.from({ length: count }, (_, i) => {
          const [word, colour] = collage[(i + index * 3) % collage.length];
          const span = document.createElement("span");
          span.className = `background-doodle doodle-${colour}`;
          span.textContent = word;
          // Flat words can fit narrow inter-card gaps on small screens.
          const angle = (viewportWidth < 600 ? [0, -8, 12, 0, -18, 9] : [-32, 18, -16, 42, 0, -48])[(i + index) % 6];
          span.style.fontSize = `${viewportWidth < 600 ? 13 + i % 2 : 17 + i % 5}px`;
          span.style.setProperty("--doodle-angle", `${angle}deg`);
          return { span, angle };
        });
        layer.replaceChildren(...words.map(word => word.span));
        const origin = layer.getBoundingClientRect();
        const obstacles = Array.from(surface.querySelectorAll<HTMLElement>(protectedSelector))
          .filter(element => !element.closest(".background-doodles"))
          .map(element => element.getBoundingClientRect())
          .filter(rect => rect.width > 0 && rect.height > 0)
          .map(rect => ({ x: rect.left - origin.left, y: rect.top - origin.top, width: rect.width, height: rect.height }));
        // Keep overflow outside ancestor boxes protected as well.
        const sizes = words.map(({ span, angle }) => ({ width: span.offsetWidth, height: span.offsetHeight, angle }));
        const seed = [...pathname].reduce((value, char) => Math.imul(value, 31) + char.charCodeAt(0) | 0, index + 733);
        const placements = placeDoodles(viewportWidth, height, obstacles, sizes, seed, viewportWidth < 600 ? 4 : 12);
        const byIndex = new Map(placements.map(placement => [placement.index, placement]));
        words.forEach(({ span }, i) => {
          const placement = byIndex.get(i);
          if (!placement) { span.hidden = true; return; }
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
      document.fonts?.removeEventListener("loadingdone", schedule);
      records.forEach(({ surface, layer }) => { layer.remove(); surface.removeAttribute("data-doodle-surface"); });
    };
  }, [pathname]);
  return null;
}

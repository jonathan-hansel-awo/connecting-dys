"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { createConnectionMotion } from "@/lib/connection-motion";
import { PREFERENCES_EVENT } from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HomeStoryMotion() {
  useGSAP(() => {
    let media: gsap.MatchMedia | undefined;
    let timer = 0;
    const rebuild = () => {
      media?.revert();
      media = undefined;
      if (
        document.documentElement.dataset.reduceMotion === "true" ||
        document.documentElement.dataset.spacious === "true"
      )
        return;
      media = gsap.matchMedia();
      media.add(
        {
          desktop:
            "(min-width: 1100px) and (min-height: 700px) and (pointer: fine)",
          motion: "(prefers-reduced-motion: no-preference)",
          forcedColours: "(forced-colors: active)",
          tall: "(min-height: 520px)",
          portraitOverlap: "(max-width: 699px) and (min-height: 650px)",
        },
        (context) => {
          if (!context.conditions?.motion || context.conditions.forcedColours)
            return;
          const desktop = context.conditions.desktop;
          const hero = document.querySelector<HTMLElement>("[data-welcome-scene]");
          const path = hero?.querySelector<SVGPathElement>("[data-hero-path]");
          const plane = hero?.querySelector<HTMLElement>("[data-hero-plane]");
          const nodes = hero?.querySelector<SVGGElement>("[data-hero-nodes]");
          const sheet = document.querySelector<HTMLElement>("[data-recognition-sheet]");
          // Scope new targets to the welcome artwork. No logo, text, link,
          // frame or caption is included in either timeline's transform set.
          if (context.conditions.tall && hero && path && plane && nodes && sheet) {
            const welcome = gsap.timeline({
              scrollTrigger: {
                id: "welcome-path",
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: desktop ? 0.35 : true,
                invalidateOnRefresh: true,
              },
            });
            welcome
              .fromTo(path,
                { strokeDasharray: "1 1", strokeDashoffset: 0.92 },
                { strokeDashoffset: 0, autoRound: false, ease: "none" }, 0)
              .fromTo(plane,
                { x: 0, y: 0 },
                { x: desktop ? 14 : 0, y: desktop ? -12 : -34, ease: "none" }, 0)
              .fromTo(nodes,
                { y: 0 },
                { y: desktop ? -6 : -18, ease: "none" }, 0);
            // offsetTop is resolved layout geometry, not an unparsed CSS clamp.
            // Only the paint lip moves; 1.5× overlap is reserved before controls.
            const overlap = () => Math.max(0, -sheet.offsetTop);
            gsap.fromTo(sheet,
              { y: () => overlap() * (desktop ? 0.3 : 0.75) },
              {
                y: () => -overlap() * (desktop ? 0.1 : 0.25),
                ease: "none",
                scrollTrigger: {
                  id: "welcome-recognition",
                  trigger: "#recognition",
                  start: "top 96%",
                  end: "top 36%",
                  scrub: desktop ? 0.3 : true,
                  invalidateOnRefresh: true,
                },
              });
          }
          // Both modes keep native document order. Only decorative art may pin.
          gsap.to(".hero-orbit", {
            y: desktop ? -35 : -12,
            rotation: desktop ? -8 : -10,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: desktop ? 0.6 : true,
            },
          });
          // The frame, caption and copy stay still; only the contained image pans.
          gsap.fromTo(
            ".recognition-photo",
            { xPercent: -1.2, scale: 1.05 },
            {
              xPercent: 1.2,
              scale: 1.05,
              ease: "none",
              scrollTrigger: {
                trigger: ".recognition-media",
                start: "top bottom",
                end: "bottom top",
                scrub: desktop ? 0.5 : true,
              },
            },
          );
          // Each topic is a short unpinned beat. The real link and its copy
          // never become animation targets; artwork stays within its SVG disc.
          if (context.conditions.tall) {
            const rows = document.querySelectorAll<HTMLElement>("#explore .difference-row");
            rows.forEach((row, index) => {
              const line = row.querySelector(".discovery-path");
              const art = row.querySelector(".difference-art-drift");
              const wash = row.querySelector(".discovery-wash");
              if (!line || !art || !wash) return;
              const direction = index % 2 ? -1 : 1;
              const drift = desktop ? 6 : 4;
              const passage = gsap.timeline({
                scrollTrigger: {
                  id: `discovery-${index}`,
                  trigger: row,
                  start: "top 85%",
                  end: "bottom 25%",
                  scrub: desktop ? 0.3 : true,
                  invalidateOnRefresh: true,
                },
              });
              passage
                .fromTo(line,
                  { strokeDasharray: "1 1", strokeDashoffset: 1 },
                  { strokeDashoffset: 0, autoRound: false, ease: "none", duration: 1 }, 0)
                .fromTo(art,
                  { x: -direction * drift },
                  { x: direction * drift, ease: "none", duration: 1 }, 0)
                .fromTo(wash,
                  { opacity: 0.05 },
                  { opacity: 0.8, ease: "none", duration: 0.5 }, 0)
                .to(wash, { opacity: 0.05, ease: "none", duration: 0.5 }, 0.5);
            });
          }
          createConnectionMotion(Boolean(desktop), Boolean(context.conditions.portraitOverlap), Boolean(context.conditions.tall));
        },
      );
      ScrollTrigger.refresh();
    };
    const changed = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(rebuild, 120);
    };
    rebuild();
    // Refresh handles positions; rebuild also rechecks whether the art safely
    // fits after font loading, orientation and responsive layout changes.
    let geometry = "";
    const resized = () => {
      const targets = [".connection-visual", ".connection-chapters", ".site-header"];
      const next = [innerWidth, innerHeight, ...targets.flatMap((selector) => {
        const el = document.querySelector<HTMLElement>(selector);
        return [el?.offsetWidth || 0, el?.offsetHeight || 0];
      })].join(":");
      if (geometry && geometry !== next) changed();
      geometry = next;
    };
    resized();
    const observer = new ResizeObserver(resized);
    for (const selector of [".connection-visual", ".connection-chapters", ".site-header"]) {
      const element = document.querySelector(selector);
      if (element) observer.observe(element);
    }
    document.fonts.addEventListener("loadingdone", changed);
    document.addEventListener("load", changed, true);
    window.addEventListener("pageshow", changed);
    window.addEventListener("resize", resized);
    window.addEventListener(PREFERENCES_EVENT, changed);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(PREFERENCES_EVENT, changed);
      media?.revert();
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", changed);
      document.removeEventListener("load", changed, true);
      window.removeEventListener("pageshow", changed);
      window.removeEventListener("resize", resized);
    };
  });
  return null;
}

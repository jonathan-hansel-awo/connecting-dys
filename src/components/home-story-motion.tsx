"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
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
        },
        (context) => {
          if (!context.conditions?.motion) return;
          const desktop = context.conditions.desktop;
          // Both modes keep native document order. Compact/touch mode never pins.
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
          const visual =
            document.querySelector<HTMLElement>(".connection-visual");
          const chapters = document.querySelector<HTMLElement>(
            ".connection-chapters",
          );
          if (!visual || !chapters) return;
          if (desktop) {
            ScrollTrigger.create({
              id: "connection-art",
              trigger: visual,
              start: "top 140px",
              end: () =>
                `+=${Math.max(0, chapters.offsetHeight - visual.offsetHeight)}`,
              pin: visual,
              pinSpacing: false,
              invalidateOnRefresh: true,
            });
          }
          const timeline = gsap.timeline({
            scrollTrigger: {
              id: desktop ? "connection-desktop" : "connection-compact",
              trigger: desktop ? chapters : visual,
              start: desktop ? "top 55%" : "top 90%",
              end: desktop ? "bottom 70%" : "bottom 20%",
              scrub: desktop ? 0.7 : true,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .fromTo(
              ".connection-visual .art-landscape",
              { x: desktop ? 45 : 18 },
              { x: desktop ? -45 : -18, ease: "none" },
              0,
            )
            .fromTo(
              ".connection-visual .journey-path",
              { strokeDasharray: 1, strokeDashoffset: 0.95 },
              { strokeDashoffset: 0, ease: "none" },
              0,
            )
            .fromTo(
              ".connection-progress span",
              { scaleX: 0 },
              { scaleX: 1, ease: "none" },
              0,
            );
        },
      );
      ScrollTrigger.refresh();
    };
    const changed = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(rebuild, 120);
    };
    rebuild();
    window.addEventListener(PREFERENCES_EVENT, changed);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(PREFERENCES_EVENT, changed);
      media?.revert();
    };
  });
  return null;
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PREFERENCES_EVENT } from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HomeStoryMotion() {
  const marker = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
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
          "(min-width: 1100px) and (min-height: 700px) and (prefers-reduced-motion: no-preference) and (pointer: fine)",
          () => {
            const hero = document.querySelector(".hero-composition");
            if (hero)
              gsap.to(".hero-orbit", {
                y: -35,
                rotation: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: ".hero",
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.6,
                },
              });
            gsap.fromTo(
              ".recognition .journey-path",
              { strokeDasharray: 1, strokeDashoffset: 0.8 },
              {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: ".recognition",
                  start: "top 85%",
                  end: "bottom 40%",
                  scrub: 0.5,
                },
              },
            );
            // Pin only decorative artwork: reading text and links always stay in natural flow.
            const visual =
              document.querySelector<HTMLElement>(".connection-visual");
            const chapters = document.querySelector<HTMLElement>(
              ".connection-chapters",
            );
            if (visual && chapters) {
              const end = () =>
                `+=${Math.max(0, chapters.offsetHeight - visual.offsetHeight)}`;
              ScrollTrigger.create({
                id: "connection-art",
                trigger: visual,
                start: "top 140px",
                end,
                pin: visual,
                pinSpacing: false,
                invalidateOnRefresh: true,
              });
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger: chapters,
                  start: "top 55%",
                  end: "bottom 70%",
                  scrub: 0.7,
                  invalidateOnRefresh: true,
                },
              });
              timeline
                .fromTo(
                  ".connection-visual .art-landscape",
                  { x: 80 },
                  { x: -65, ease: "none" },
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
            }
          },
        );
        ScrollTrigger.refresh();
      };
      const changed = () => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          rebuild();
        }, 120);
      };
      rebuild();
      window.addEventListener(PREFERENCES_EVENT, changed);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener(PREFERENCES_EVENT, changed);
        media?.revert();
      };
    },
    { scope: undefined },
  );
  return <span ref={marker} hidden aria-hidden="true" />;
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PREFERENCES_EVENT } from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HomeMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let frame = 0;
      function initialise() {
        mm.revert();
        if (document.documentElement.dataset.reduceMotion === "true") return;
        mm.add(
          {
            desktop:
              "(min-width: 1100px) and (min-height: 720px) and (pointer: fine)",
            reduced: "(prefers-reduced-motion: reduce)",
          },
          (context) => {
            if (context.conditions?.reduced) return;
            const scope = root.current;
            if (!scope) return;
            const paths = scope.querySelectorAll<SVGPathElement>(".story-path");
            paths.forEach((path) => {
              const length = path.getTotalLength();
              gsap.fromTo(
                path,
                { strokeDasharray: length, strokeDashoffset: length * 0.6 },
                {
                  strokeDashoffset: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: ".recognition",
                    start: "top bottom",
                    end: "bottom center",
                    scrub: 0.6,
                  },
                },
              );
            });
            gsap.to(".hero-orbit", {
              y: -32,
              rotation: 8,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 0.8,
              },
            });
            const readingSize = parseFloat(
              getComputedStyle(document.documentElement).fontSize,
            );
            if (!context.conditions?.desktop || readingSize > 20) return;
            const visual =
              scope.querySelector<HTMLElement>(".connection-visual");
            const story = scope.querySelector<HTMLElement>(".connection-body");
            if (!visual || !story) return;
            // Only decorative artwork moves. All story copy and links remain in normal document flow.
            const timeline = gsap.timeline({
              scrollTrigger: {
                id: "connection-story",
                trigger: visual,
                start: "top 150px",
                end: () =>
                  `+=${Math.max(0, story.offsetHeight - visual.offsetHeight)}`,
                pin: true,
                pinSpacing: false,
                scrub: 0.7,
                invalidateOnRefresh: true,
              },
            });
            timeline.to(
              ".connection-track",
              { xPercent: (-100 * 2) / 3, ease: "none" },
              0,
            );
            timeline.to(".story-progress-fill", { scaleX: 1, ease: "none" }, 0);
            visual.dataset.pinned = "true";
            return () => {
              delete visual.dataset.pinned;
            };
          },
        );
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      }
      // Rebuild only when mode/reflow requirements change; the matched media context owns every tween/pin.
      let previousMode = "";
      const onPreferences = () => {
        const mode = `${document.documentElement.dataset.reduceMotion}:${parseFloat(getComputedStyle(document.documentElement).fontSize) > 20}`;
        if (mode !== previousMode) {
          previousMode = mode;
          initialise();
        } else {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => ScrollTrigger.refresh());
        }
      };
      initialise();
      window.addEventListener(PREFERENCES_EVENT, onPreferences);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener(PREFERENCES_EVENT, onPreferences);
        mm.revert();
      };
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}

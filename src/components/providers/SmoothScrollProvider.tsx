"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: Lenis | null = null;

    const tick = (time: number) => {
      lenis?.raf(time * 1000);
    };

    const destroy = () => {
      gsap.ticker.remove(tick);

      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
        lenis.destroy();
        lenis = null;
      }
    };

    const initialise = () => {
      destroy();

      const userReducedMotion =
        document.documentElement.dataset.reduceMotion === "true";

      if (media.matches || userReducedMotion) {
        ScrollTrigger.refresh();
        return;
      }

      lenis = new Lenis({
        duration: 1.15,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        autoRaf: false,
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);

      ScrollTrigger.refresh();
    };

    // Keep GSAP and Lenis on the same animation clock.
    gsap.ticker.lagSmoothing(0);

    initialise();

    media.addEventListener("change", initialise);
    window.addEventListener("connecting-dys:preferences", initialise);

    return () => {
      media.removeEventListener("change", initialise);
      window.removeEventListener("connecting-dys:preferences", initialise);
      destroy();
    };
  }, []);

  return <>{children}</>;
}


"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let lenis: Lenis | null = null;

    const update = (time: number) => {
      lenis?.raf(time * 1000);
    };

    const initialise = () => {
      // Clean up the previous instance.
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
      lenis?.destroy();
      lenis = null;

      // Fall back to native scrolling.
      if (motionPreference.matches) return;

      lenis = new Lenis({
        autoRaf: false,
        duration: 1.15,
        smoothWheel: true,
        anchors: true,
      });

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(update);
    };

    initialise();

    motionPreference.addEventListener("change", initialise);

    return () => {
      motionPreference.removeEventListener("change", initialise);
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}

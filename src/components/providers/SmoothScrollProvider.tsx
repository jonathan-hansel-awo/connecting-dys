"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PREFERENCES_EVENT } from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger);

/** One clock for the whole application. Native browser scroll is always the underlying scroller. */
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia(
      "(min-width: 1000px) and (pointer: fine)",
    );
    let lenis: Lenis | null = null;
    let frame = 0;
    let disposed = false;
    const tick = (time: number) => lenis?.raf(time * 1000);
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        lenis?.resize();
        ScrollTrigger.refresh();
      });
    };
    function destroy() {
      gsap.ticker.remove(tick);
      lenis?.off("scroll", ScrollTrigger.update);
      lenis?.destroy();
      lenis = null;
    }
    function initialise() {
      const root = document.documentElement;
      const enabled =
        desktop.matches &&
        !reduced.matches &&
        root.dataset.reduceMotion !== "true";
      if (!enabled) destroy();
      else if (!lenis) {
        lenis = new Lenis({
          duration: 0.9,
          smoothWheel: true,
          syncTouch: false,
          autoRaf: false,
          anchors: false,
        });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
      }
      refresh();
    }
    // Anchors, find, focus and history use native browser behaviour; cancel any outstanding interpolation.
    const stopInterpolation = () => {
      if (lenis) lenis.scrollTo(window.scrollY, { immediate: true });
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        [
          "Tab",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          "ArrowDown",
          "ArrowUp",
          " ",
        ].includes(event.key)
      )
        stopInterpolation();
    };
    initialise();
    reduced.addEventListener("change", initialise);
    desktop.addEventListener("change", initialise);
    window.addEventListener(PREFERENCES_EVENT, initialise);
    window.addEventListener("pageshow", refresh);
    window.addEventListener("popstate", stopInterpolation);
    window.addEventListener("hashchange", stopInterpolation);
    window.addEventListener("keydown", onKey);
    document.addEventListener("focusin", stopInterpolation);
    document.fonts.ready.then(() => {
      if (!disposed) refresh();
    });
    document.fonts.addEventListener("loadingdone", refresh);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      reduced.removeEventListener("change", initialise);
      desktop.removeEventListener("change", initialise);
      window.removeEventListener(PREFERENCES_EVENT, initialise);
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("popstate", stopInterpolation);
      window.removeEventListener("hashchange", stopInterpolation);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("focusin", stopInterpolation);
      document.fonts.removeEventListener("loadingdone", refresh);
      destroy();
    };
  }, [pathname]);
  return <>{children}</>;
}

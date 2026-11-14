"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTopicReturnRestoration } from "@/lib/use-topic-return-restoration";
import { PREFERENCES_EVENT } from "@/lib/preferences";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useTopicReturnRestoration(pathname);
  useEffect(() => {
    // Native fragment navigation creates a null-state history entry. Register
    // its URL through Next's documented History API integration while the
    // matching page is still active, so Back can restore its cached route.
    // Keep the browser's anchor scroll/focus and do not add a history entry.
    const syncNativeFragment = () => {
      if (location.hash && history.state === null)
        history.replaceState(null, "", location.href);
    };
    window.addEventListener("hashchange", syncNativeFragment);
    syncNativeFragment();
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const forcedColours = window.matchMedia("(forced-colors: active)");
    let disposeLenis: (() => void) | undefined;
    let active = true;
    let generation = 0;
    let enabled: boolean | undefined;
    let refreshFrame = 0;
    let debounce = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => {
        if (active) ScrollTrigger.refresh();
      });
    };
    const configure = async () => {
      const shouldEnable =
        !media.matches &&
        !forcedColours.matches &&
        finePointer.matches &&
        document.documentElement.dataset.reduceMotion !== "true";
      if (enabled === shouldEnable) {
        refresh();
        return;
      }
      enabled = shouldEnable;
      const current = ++generation;
      disposeLenis?.();
      disposeLenis = undefined;
      if (!shouldEnable) {
        refresh();
        return;
      }
      try {
        const { default: Lenis } = await import("lenis");
        if (!active || current !== generation) return;
        const lenis = new Lenis({
          lerp: 0.085,
          smoothWheel: true,
          syncTouch: false,
          autoRaf: false,
          anchors: false,
        });
        // ONE frame clock; no RAF loop or global ticker configuration to leak.
        const tick = () => lenis.raf(performance.now());
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(tick);
        // Cancel outstanding wheel inertia before native keyboard, anchor and focus jumps.
        // Never preventDefault: browser history, focus and scroll-padding stay native.
        const interrupt = () => {
          lenis.stop();
          lenis.start();
        };
        const onKey = (event: KeyboardEvent) => {
          if (
            [
              "PageUp",
              "PageDown",
              "Home",
              "End",
              "ArrowUp",
              "ArrowDown",
              " ",
            ].includes(event.key)
          )
            interrupt();
        };
        const onAnchor = (event: MouseEvent) => {
          const link = (event.target as Element)?.closest?.("a[href]");
          if (!link) return;
          const url = new URL((link as HTMLAnchorElement).href, location.href);
          // Include same-page links without a hash (the home logo): Next.js may
          // reset scroll before a route-change cleanup would run.
          if (url.origin === location.origin) interrupt();
        };
        document.addEventListener("keydown", onKey, true);
        document.addEventListener("click", onAnchor, true);
        document.addEventListener("focusin", interrupt);
        window.addEventListener("popstate", interrupt);
        window.addEventListener("hashchange", interrupt);
        disposeLenis = () => {
          document.removeEventListener("keydown", onKey, true);
          document.removeEventListener("click", onAnchor, true);
          document.removeEventListener("focusin", interrupt);
          window.removeEventListener("popstate", interrupt);
          window.removeEventListener("hashchange", interrupt);
          gsap.ticker.remove(tick);
          lenis.off("scroll", ScrollTrigger.update);
          lenis.destroy();
        };
        refresh();
      } catch {
        /* Native scroll and the full document remain usable. */
      }
    };
    const changed = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        void configure();
      }, 100);
    };
    const observer = new ResizeObserver(refresh);
    observer.observe(document.body);
    void configure();
    document.fonts.ready.then(refresh);
    document.fonts.addEventListener("loadingdone", refresh);
    document.addEventListener("load", refresh, true);
    media.addEventListener("change", changed);
    finePointer.addEventListener("change", changed);
    forcedColours.addEventListener("change", changed);
    window.addEventListener(PREFERENCES_EVENT, changed);
    window.addEventListener("pageshow", refresh);
    return () => {
      window.removeEventListener("hashchange", syncNativeFragment);
      active = false;
      generation++;
      disposeLenis?.();
      observer.disconnect();
      cancelAnimationFrame(refreshFrame);
      window.clearTimeout(debounce);
      document.fonts.removeEventListener("loadingdone", refresh);
      document.removeEventListener("load", refresh, true);
      media.removeEventListener("change", changed);
      finePointer.removeEventListener("change", changed);
      forcedColours.removeEventListener("change", changed);
      window.removeEventListener(PREFERENCES_EVENT, changed);
      window.removeEventListener("pageshow", refresh);
    };
  }, [pathname]);
  return <>{children}</>;
}

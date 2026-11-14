import gsap from "gsap";

// Runs in HomeStoryMotion's existing matchMedia context. The final chapters
// are deliberately quiet: only their decorative surfaces/paths change.
export function createFinishMotion(desktop: boolean, tall: boolean) {
  if (!tall) return;
  for (const [target, trigger, id] of [
    [".support-surface", ".support-links", "support-arrival"],
    [".about-frame-edge", ".about-logo-frame", "about-frame"],
  ]) {
    gsap.fromTo(target, { opacity: 0.35 }, {
      opacity: 1, ease: "none",
      scrollTrigger: {
        id, trigger, start: "top 90%", end: "top 55%",
        scrub: desktop ? 0.25 : true, invalidateOnRefresh: true,
      },
    });
  }
  const finale = gsap.timeline({ scrollTrigger: {
    id: "invitation-path", trigger: ".invitation",
    start: "top 90%", end: "bottom 95%", scrub: desktop ? 0.25 : true,
    invalidateOnRefresh: true,
  } });
  finale.fromTo(".finale-path",
    { strokeDasharray: "1 1", strokeDashoffset: 0.85 },
    { strokeDashoffset: 0, autoRound: false, ease: "none" }, 0);
  for (const index of [0, 1]) {
    finale.fromTo(`.finale-node-${index}`,
      { x: index ? 12 : -12, y: -12, scale: 0.8 },
      { x: 0, y: 0, scale: 1, ease: "none" }, 0);
  }
}

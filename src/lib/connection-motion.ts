import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Called inside HomeStoryMotion's matchMedia context: every pin, tween and
// inline style belongs to that context and is reverted with the scene.
export function createConnectionMotion(desktop: boolean, portraitOverlap: boolean, tall: boolean) {
  const visual = document.querySelector<HTMLElement>(".connection-visual");
  const chapters = document.querySelector<HTMLElement>(".connection-chapters");
  const beats = gsap.utils.toArray<HTMLElement>(".connection-chapter");
  if (!visual || !chapters || beats.length !== 3 || !tall) return;
  const inset = () => (document.querySelector(".site-header")?.getBoundingClientRect().height || 80) + 16;
  // Never hold an illustration that cannot fit below the real sticky header.
  const fits = visual.offsetHeight < innerHeight - inset() - 48;
  if (desktop && fits && chapters.offsetHeight > visual.offsetHeight) {
    ScrollTrigger.create({
      id: "connection-art", trigger: visual, start: () => `top ${inset()}px`,
      endTrigger: chapters, end: () => `bottom ${inset() + visual.offsetHeight}px`,
      pin: visual, pinSpacing: false, invalidateOnRefresh: true,
    });
  } else if (portraitOverlap && fits) {
    // A bounded stacking reveal: only the aria-hidden art pauses. The first
    // opaque chapter sheet naturally scrolls OVER it, never behind it.
    ScrollTrigger.create({
      id: "connection-overlap", trigger: visual, start: () => `top ${inset()}px`,
      endTrigger: beats[0], end: () => `top ${inset()}px`,
      pin: visual, pinSpacing: false, invalidateOnRefresh: true,
    });
  }
  const landscape = visual.querySelector(".art-landscape");
  const path = visual.querySelector(".journey-path");
  const progress = visual.querySelector(".connection-progress span");
  const scene = gsap.timeline({ scrollTrigger: {
    id: desktop ? "connection-desktop" : "connection-compact",
    trigger: desktop ? chapters : visual,
    start: desktop ? "top 75%" : "top 85%",
    endTrigger: desktop ? chapters : beats[0],
    end: desktop ? "bottom 65%" : "top 25%",
    scrub: desktop ? 0.35 : true, invalidateOnRefresh: true,
  } });
  scene.fromTo(landscape, { x: desktop ? 30 : 16 }, { x: desktop ? -30 : -16, ease: "none" }, 0)
    .fromTo(path, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, ease: "none" }, 0)
    .fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
  const nodes = visual.querySelectorAll(".community-node");
  const branches = visual.querySelectorAll(".community-branch");
  beats.forEach((beat, index) => {
    const beatTimeline = gsap.timeline({ scrollTrigger: {
      id: `connection-beat-${index}`, trigger: beat,
      start: "top 85%", end: "bottom 40%", scrub: desktop ? 0.25 : true,
      invalidateOnRefresh: true,
    } });
    beatTimeline.fromTo(beat.querySelector(".chapter-path"),
      { strokeDasharray: "1 1", strokeDashoffset: 1 },
      { strokeDashoffset: 0, autoRound: false, ease: "none", duration: 1 }, 0)
      .fromTo(beat.querySelector(".chapter-node"),
        { x: index % 2 ? 12 : -12, scale: 0.65 },
        { x: 0, scale: 1, ease: "none", duration: 1 }, 0)
      .fromTo(beat.querySelector(".chapter-wash"),
        { opacity: 0 }, { opacity: 0.7, ease: "none", duration: 0.5 }, 0)
      .to(beat.querySelector(".chapter-wash"), { opacity: 0, ease: "none", duration: 0.5 }, 0.5);
    // Desktop retains the tableau throughout the three chapters. On compact
    // screens the initial tableau settles before the first sheet covers it;
    // the visible rail then carries the progression through all three beats.
    const nodeTrigger = desktop ? beat : visual;
    const converge = gsap.timeline({ scrollTrigger: {
      id: `connection-node-${index}`, trigger: nodeTrigger,
      start: "top 85%",
      endTrigger: desktop ? beat : beats[0],
      end: desktop ? "bottom 40%" : "top 35%", scrub: true,
      invalidateOnRefresh: true,
    } });
    converge.fromTo(nodes[index], { x: (index - 1) * 28, y: -18 }, { x: 0, y: 0, ease: "none" }, 0)
      .fromTo(branches[index], { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, ease: "none" }, 0);
  });
}

import gsap from "gsap";

// Called inside HomeStoryMotion's matchMedia context: every pin, tween and
// inline style belongs to that context and is reverted with the scene.
export function createConnectionMotion(desktop: boolean, tall: boolean) {
  const visual = document.querySelector<HTMLElement>(".connection-visual");
  const chapters = document.querySelector<HTMLElement>(".connection-chapters");
  const beats = gsap.utils.toArray<HTMLElement>(".connection-chapter");
  if (!visual || !chapters || beats.length !== 3 || !tall) return;
  // The word cloud and its pause control scroll together. Only the chapter
  // rails use scroll choreography; moving artwork is never held off-control.
  const progress = visual.querySelector(".connection-progress span");
  const scene = gsap.timeline({ scrollTrigger: {
    id: desktop ? "connection-desktop" : "connection-compact",
    trigger: desktop ? chapters : visual,
    start: desktop ? "top 75%" : "top 85%",
    endTrigger: desktop ? chapters : beats[0],
    end: desktop ? "bottom 65%" : "top 25%",
    scrub: desktop ? 0.35 : true, invalidateOnRefresh: true,
  } });
  scene.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0);
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
  });
}

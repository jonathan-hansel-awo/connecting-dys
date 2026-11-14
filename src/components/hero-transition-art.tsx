// Decorative material/path only. The approved logo and every word stay separate.
const path = "M548 35C428 39 374 82 397 150S565 233 533 331 359 471 282 482 118 466 54 568";

export function HeroTransitionArt() {
  return (
    <>
      <div className="hero-depth-plane surface-inset" data-hero-plane aria-hidden="true" />
      <svg
        className="hero-path-art"
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path className="hero-path-guide" d={path} />
        <path className="hero-connecting-path" data-hero-path d={path} pathLength="1" />
        <g className="hero-path-nodes" data-hero-nodes>
          <circle cx="487" cy="45" r="9" fill="var(--brand-coral)" />
          <circle cx="520" cy="356" r="8" fill="var(--brand-teal)" />
          <circle cx="112" cy="516" r="11" fill="var(--brand-amber)" />
        </g>
      </svg>
    </>
  );
}

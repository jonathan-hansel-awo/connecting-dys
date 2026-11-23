// The SVGs live in reserved outer gutters; no curve can enter the copy/art grid.
export function HeroMarginCurves() {
  return <div className="hero-margin-curves" aria-hidden="true">
    <svg className="margin-curve curve-left" viewBox="0 0 24 500" preserveAspectRatio="none" focusable="false"><path d="M18 5C-8 95 31 155 9 240S31 390 7 495" /><path className="curve-secondary" d="M8 35C30 100-5 210 18 310S-4 435 17 470" /></svg>
    <svg className="margin-curve curve-right" viewBox="0 0 24 500" preserveAspectRatio="none" focusable="false"><path d="M6 5C32 95-7 155 15 240S-7 390 17 495" /><path className="curve-secondary" d="M16 35C-6 100 29 210 6 310S28 435 7 470" /></svg>
  </div>;
}

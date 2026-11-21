import { HeroRecess } from "@/components/hero-recess";

// Subtle recessed shapes only; the hero artwork has no decorative line overlay.

export function HeroTransitionArt() {
  return (
    <>
      <div className="hero-depth-plane" data-hero-plane aria-hidden="true">
        <HeroRecess shape="heart" />
      </div>
      <div className="hero-house-recess" aria-hidden="true">
        <HeroRecess shape="house" />
      </div>
    </>
  );
}

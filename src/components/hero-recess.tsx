// Pressed paper motifs, separate from the approved embracing-figures identity.
const shapes = {
  heart: "M80 143C65 130 9 92 9 51C9 13 56 5 80 36C104 5 151 13 151 51C151 92 95 130 80 143Z",
  house: "M20 72Q15 67 22 61L73 18Q80 12 87 18L138 61Q145 67 140 72L130 72V133Q130 140 123 140H96V101H64V140H37Q30 140 30 133V72Z",
};

export function HeroRecess({ shape }: { shape: keyof typeof shapes }) {
  const id = `hero-${shape}-inset`;
  return (
    <svg className="hero-recess" viewBox="0 0 160 160" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feOffset in="SourceAlpha" dx="3" dy="4" result="offset" />
          <feGaussianBlur in="offset" stdDeviation="2" result="blur" />
          <feComposite in="SourceAlpha" in2="blur" operator="out" result="inside" />
          <feFlood floodColor="#20354D" floodOpacity="0.22" />
          <feComposite in2="inside" operator="in" />
          <feComposite in2="SourceGraphic" operator="over" result="shadowed" />
          <feOffset in="SourceAlpha" dx="-1" dy="-2" result="lightOffset" />
          <feGaussianBlur in="lightOffset" stdDeviation="1" result="lightBlur" />
          <feComposite in="SourceAlpha" in2="lightBlur" operator="out" result="lightEdge" />
          <feFlood floodColor="white" floodOpacity="0.6" />
          <feComposite in2="lightEdge" operator="in" />
          <feComposite in2="shadowed" operator="over" />
        </filter>
        <pattern id={`${id}-paper`} width="192" height="192" patternUnits="userSpaceOnUse">
          <image className="recess-texture recess-paper" href="/textures/fine-paper.svg" width="192" height="192" />
          <image className="recess-texture recess-linen" href="/textures/linen.svg" width="192" height="192" />
          <image className="recess-texture recess-plaster" href="/textures/plaster.svg" width="192" height="192" />
        </pattern>
      </defs>
      <path className="hero-recess-shape" d={shapes[shape]} filter={`url(#${id})`} />
      <path className="hero-recess-grain" d={shapes[shape]} fill={`url(#${id}-paper)`} />
    </svg>
  );
}

import Link from "next/link";

// Four connected hearts, adapted from the client's Word document. The labels
// remain real links so they follow reading preferences and survive without SVG.
export function DysConnections({ placement = "support" }: { placement?: "home" | "support" }) {
  const prefix = `dys-hearts-${placement}`;
  return <section className={`dys-connections dys-connections-${placement}`} aria-labelledby={`${prefix}-title`}>
    <div className="dys-connections-copy"><p className="eyebrow">Different paths, one community</p><h2 id={`${prefix}-title`}>Four experiences. Connected.</h2>
    <p>Our community brings all four DYS experiences together. They can overlap, and every person’s experience is their own.</p><p>Choose a heart to explore.</p></div>
    <div className="dys-hearts">
      <svg viewBox="0 0 600 600" fill="none" aria-hidden="true" focusable="false"><defs><path id={`${prefix}-shape`} d="M300 300C245 270 100 300 68 210C44 127 123 66 180 126C178 49 274 30 311 101C351 170 317 242 300 300Z" /></defs>{[0, 90, 180, 270].map(angle => <g key={angle} className={`heart-petal heart-petal-${angle}`}><use href={`#${prefix}-shape`} transform={`rotate(${angle} 300 300)`} /><use className="heart-pencil" href={`#${prefix}-shape`} transform={`rotate(${angle + 1} 300 300) translate(2 -2)`} /></g>)}</svg>
      <span className="dys-heart-centre">DYS Connect</span>
      <div className="dys-heart-links"><Link href="/dysgraphia">Dysgraphia</Link><Link href="/dyspraxia">Dyspraxia</Link><Link href="/dyslexia">Dyslexia</Link><Link href="/dyscalculia">Dyscalculia</Link></div>
    </div>
  </section>;
}

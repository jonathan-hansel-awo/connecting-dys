import Link from "next/link";

// Four connected hearts, adapted from the client's Word document. The labels
// remain real links so they follow reading preferences and survive without SVG.
export function DysConnections() {
  return <section className="dys-connections" aria-labelledby="connections-title">
    <h2 id="connections-title">Four experiences. Connected.</h2>
    <p>Our community brings all four DYS experiences together. They can overlap, and every person’s experience is their own.</p>
    <div className="dys-hearts">
      <svg viewBox="0 0 400 400" fill="none" aria-hidden="true"><defs><path id="dys-heart" d="M200 200C154 172 76 165 62 111C46 51 118 24 153 69C177 20 242 41 240 91C238 129 216 170 200 200Z" /></defs>{[0, 90, 180, 270].map(angle => <use href="#dys-heart" key={angle} transform={`rotate(${angle} 200 200)`} />)}</svg>
      <div className="dys-heart-links"><Link href="/dysgraphia">Dysgraphia</Link><Link href="/dyspraxia">Dyspraxia</Link><Link href="/dyslexia">Dyslexia</Link><Link href="/dyscalculia">Dyscalculia</Link></div>
    </div>
  </section>;
}

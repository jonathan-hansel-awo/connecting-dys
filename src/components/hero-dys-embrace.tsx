// Scalable interpretation of the supplied circular DYS-and-embrace visual.
// This is hero artwork; the approved organisation logo remains unchanged.
export function HeroDysEmbrace() {
  const words = ["Dyslexia", "Dyspraxia", "Dyscalculia", "Dysgraphia"];
  const arcs = ["M300 85A215 215 0 0 1 515 300", "M515 300A215 215 0 0 1 300 515", "M300 515A215 215 0 0 1 85 300", "M85 300A215 215 0 0 1 300 85"];
  return <div className="hero-dys-embrace" role="img" aria-label="Dyslexia, dyspraxia, dyscalculia and dysgraphia encircle two people embracing.">
    <svg viewBox="0 0 600 600" fill="none" aria-hidden="true" focusable="false">
      <defs>{arcs.map((d, i) => <path key={d} id={`hero-dys-arc-${i}`} d={d} />)}</defs>
      <circle className="embrace-ring-bed" cx="300" cy="300" r="215" />
      {words.map((word, i) => <text key={word} className={`embrace-ring-word ring-word-${i}`}><textPath href={`#hero-dys-arc-${i}`} startOffset="50%" textAnchor="middle">{word}</textPath></text>)}
      <g className="embrace-people" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="269" cy="233" r="33" /><circle cx="337" cy="262" r="30" />
        <path d="M229 391V321Q229 283 268 283H287" />
        <path d="M295 294L368 309Q390 315 383 334Q378 349 360 343L297 326" />
        <path d="M361 345Q373 365 370 406M247 368V405" />
        <path d="M230 330Q213 324 206 341Q201 353 214 364L270 400Q284 410 296 395L320 363" />
      </g>
      <circle className="embrace-dot" cx="300" cy="85" r="5" /><circle className="embrace-dot" cx="515" cy="300" r="5" /><circle className="embrace-dot" cx="300" cy="515" r="5" /><circle className="embrace-dot" cx="85" cy="300" r="5" />
    </svg>
  </div>;
}

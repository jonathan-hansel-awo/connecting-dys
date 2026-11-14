// Original decorative paths echo the welcome and community trails. The
// conclusion, contact link and reading order never depend on these strokes.
export function FinalePath() {
  const paths = [
    "M65 45C230 40 10 205 185 280S300 485 500 570",
    "M940 60C765 105 1010 240 830 320S690 490 500 570",
  ];
  return (
    <>
      <svg viewBox="0 0 1000 600" fill="none" preserveAspectRatio="none" aria-hidden="true">
        {paths.map((d) => (
          <g key={d}>
            <path className="finale-path-bed" d={d} vectorEffect="non-scaling-stroke" />
            <path className="finale-path" d={d} pathLength="1" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </svg>
      <span className="finale-node finale-node-0" />
      <span className="finale-node finale-node-1" />
      <span className="finale-meeting"><span /></span>
    </>
  );
}

// A decorative continuation of the community path, beside each real chapter.
export function ConnectionTrail({ index }: { index: number }) {
  return (
    <div className="connection-trail" aria-hidden="true">
      <svg viewBox="0 0 72 240" preserveAspectRatio="none" fill="none" focusable="false">
      <path className="chapter-path-bed" d="M36 0C4 55 68 75 36 120S4 185 36 240" />
      <path className="chapter-path" pathLength="1" d="M36 0C4 55 68 75 36 120S4 185 36 240" />
      </svg>
      <span className="chapter-node">
        <span style={{ backgroundColor: index === 0 ? "#D98677" : index === 1 ? "#EAB85C" : "#146C78" }} />
      </span>
    </div>
  );
}

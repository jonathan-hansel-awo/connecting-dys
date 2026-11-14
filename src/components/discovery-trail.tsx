// A decorative connection between ordinary, independently usable topic links.
const curve = "M12 0C2 20 22 30 12 50S2 80 12 100";

export function DiscoveryTrail() {
  return (
    <>
      <span className="discovery-wash" aria-hidden="true" />
      <span className="discovery-waypoint" aria-hidden="true">
        <svg viewBox="0 0 24 100" preserveAspectRatio="none" fill="none" focusable="false">
          <path className="discovery-guide" d={curve} vectorEffect="non-scaling-stroke" />
          <path className="discovery-path" d={curve} pathLength="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="discovery-node" />
      </span>
    </>
  );
}

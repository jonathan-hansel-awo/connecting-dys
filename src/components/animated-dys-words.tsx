"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";

const subscribe = () => () => {};
const words = ["Dyslexia", "Dyspraxia", "Dyscalculia", "Dysgraphia"];
const placements = [
  [22, 14, -17], [72, 15, 14], [45, 30, -8], [18, 43, 16],
  [76, 43, -21], [49, 57, 20], [22, 72, -14], [75, 75, 11],
  [48, 87, -7], [48, 13, 6], [16, 89, 12], [82, 92, -14],
];

export function AnimatedDysWords() {
  const [paused, setPaused] = useState(false);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  return <div className="word-cloud" data-paused={paused || !ready ? "true" : "false"}>
    <div className="word-cloud-controls"><button type="button" className="word-cloud-toggle js-only" disabled={!ready} aria-pressed={paused} aria-controls="dys-word-art" onClick={() => setPaused(value => !value)}>{paused ? "Resume word movement" : "Pause word movement"}</button><span className="word-cloud-static-note">Motion is off in your reading or device settings.</span></div>
    <div className="connection-visual surface-scene surface-inset" aria-hidden="true">
      <div className="landscape-label">Different minds. Shared belonging.</div>
      <div id="dys-word-art" className="word-cloud-art">
        {placements.map(([x, y, tilt], index) => <span key={index} className={`word-anchor word-colour-${index % 4}`} style={{ left: `${x}%`, top: `${y}%`, "--word-tilt": `${tilt}deg`, "--word-x": `${index % 2 ? -13 : 15}px`, "--word-y": `${index % 3 ? 11 : -14}px`, "--word-duration": `${11 + index % 5 * 2}s`, "--word-delay": `${-index * 1.7}s` } as CSSProperties}><span className="word-drift">{words[index % 4]}</span></span>)}
      </div>
      <div className="landscape-caption"><span>Every experience matters.</span><span>Room for yours.</span></div>
      <div className="connection-progress"><span /></div>
    </div>
  </div>;
}

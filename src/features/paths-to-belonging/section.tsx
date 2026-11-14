"use client";

import { Component, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ComponentType, ReactNode } from "react";

type JourneyProps = { onExit: () => void };
const subscribe = () => () => {};

function Unavailable({ onExit }: JourneyProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <div className="paths-message">
    <h3 ref={heading} tabIndex={-1}>The little journey isn&apos;t available right now</h3>
    <p>You can still explore the whole website and get in touch.</p>
    <a className="text-link" href="#site-footer">Continue exploring</a>
    <button type="button" className="paths-control" onClick={onExit}>Return to introduction</button>
  </div>;
}

export class JourneyBoundary extends Component<JourneyProps & { children?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Unavailable onExit={this.props.onExit} /> : this.props.children; }
}

export function PathsToBelongingSection() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [mode, setMode] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [Journey, setJourney] = useState<ComponentType<JourneyProps> | null>(null);
  const launch = useRef<HTMLButtonElement>(null);
  const loading = useRef<HTMLHeadingElement>(null);
  const request = useRef(0);
  const restoreFocus = useRef(false);
  useEffect(() => () => { request.current++; }, []);
  useEffect(() => {
    if (mode === "idle" && restoreFocus.current) { launch.current?.focus(); restoreFocus.current = false; }
    if (mode === "loading") loading.current?.focus();
  }, [mode]);
  function exit() {
    request.current++;
    restoreFocus.current = true;
    setMode("idle");
  }
  async function play() {
    if (Journey) { setMode("playing"); return; }
    const current = ++request.current;
    setMode("loading");
    try {
      // Inside the opt-in handler: no game/engine preload or eager render.
      const loadedJourney = await import("./journey.tsx");
      if (request.current !== current) return;
      setJourney(() => loadedJourney.default);
      setMode("playing");
    } catch {
      if (request.current === current) setMode("error");
    }
  }
  return <section id="paths-to-belonging" className="paths-section surface-paper" aria-labelledby="paths-title" data-paths-section>
    <div className="wrap">
      <div className="paths-intro">
        <p className="eyebrow">A little journey, if you like</p>
        <h2 id="paths-title">Paths to Belonging</h2>
        <p>Discover a way, make connections and create a little network of your own. Three short chapters, at your pace. No timer or score.</p>
        <p>You can skip a chapter or leave whenever you like.</p>
        <div className="paths-actions">
          <button ref={launch} type="button" className="button" disabled={!ready} hidden={mode !== "idle"} onClick={play}>Play the little journey</button>
          <a className="text-link" href="#site-footer">Continue to the footer</a>
        </div>
        <noscript><p>The optional little journey needs JavaScript. Everything else on this page, including contact and support links, is still available.</p></noscript>
      </div>
      {mode === "loading" && <div className="paths-message" aria-busy="true">
        <h3 ref={loading} tabIndex={-1}>Preparing the little journey…</h3>
        <p role="status">The paths are loading. You can leave at any time.</p>
        <button type="button" className="paths-control" onClick={exit}>Exit game</button>
      </div>}
      {mode === "error" && <Unavailable onExit={exit} />}
      {mode === "playing" && Journey && <JourneyBoundary onExit={exit}><Journey onExit={exit} /></JourneyBoundary>}
    </div>
  </section>;
}

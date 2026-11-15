"use client";

import { Component } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";

// Render the first board into the page, with its controls enabled on hydration.
// Keep the interactive code in its own chunk and errors inside this section.
const Journey = dynamic(() => import("./journey.tsx"));

export class JourneyBoundary extends Component<{ children?: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div className="paths-message" role="alert">
      <h3>The little journey isn&apos;t available right now</h3>
      <p>You can still explore the whole website and get in touch.</p>
      <a className="text-link" href="#site-footer">Continue exploring</a>
    </div>;
  }
}

export function PathsToBelongingSection() {
  return <section id="paths-to-belonging" className="paths-section surface-paper" aria-labelledby="paths-title" data-paths-section>
    <div className="wrap">
      <div className="paths-intro">
        <p className="eyebrow">A little journey, if you like</p>
        <h2 id="paths-title">Paths to Belonging</h2>
        <p>Discover a way, make connections and create a little network of your own. Three short chapters, at your pace. No timer or score.</p>
        <p>Pause here to play, or keep scrolling. You can skip a chapter whenever you like.</p>
        <noscript><p>The puzzle controls need JavaScript. You can still explore the picture and use every contact and support link.</p></noscript>
      </div>
      <JourneyBoundary><Journey /></JourneyBoundary>
    </div>
  </section>;
}

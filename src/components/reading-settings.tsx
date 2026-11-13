"use client";

import { useRef, useSyncExternalStore } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  applyPreferences,
  backgrounds,
  defaults,
  fontNames,
  normalisePreferences,
  PREFERENCES_EVENT,
  STORAGE_KEY,
  type Preferences,
} from "@/lib/preferences";

let snapshot = defaults;
function readPreferences() {
  try {
    return normalisePreferences(
      JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"),
    );
  } catch {
    return defaults;
  }
}
function subscribe(callback: () => void) {
  const notify = () => {
    snapshot = readPreferences();
    applyPreferences(snapshot);
    callback();
    window.dispatchEvent(new Event(PREFERENCES_EVENT));
  };
  snapshot = readPreferences();
  applyPreferences(snapshot);
  callback();
  const onChange = () => callback();
  window.addEventListener("storage", notify);
  window.addEventListener("connecting-dys:settings-change", onChange);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("connecting-dys:settings-change", onChange);
  };
}
function save(next: Preferences) {
  snapshot = normalisePreferences(next);
  applyPreferences(snapshot);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* Settings still work for this visit. */
  }
  window.dispatchEvent(new Event("connecting-dys:settings-change"));
  window.dispatchEvent(new Event(PREFERENCES_EVENT));
}

export function ReadingSettings() {
  const preferences = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => defaults,
  );
  const details = useRef<HTMLDetailsElement>(null);
  function close() {
    if (!details.current) return;
    details.current.open = false;
    details.current.querySelector("summary")?.focus();
  }
  function update(p: Partial<Preferences>) {
    save({ ...preferences, ...p });
  }
  return (
    <details
      className="reading-settings"
      ref={details}
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <summary className="settings-trigger">
        <SlidersHorizontal size={17} aria-hidden="true" />
        <span>Reading settings</span>
      </summary>
      <div className="settings-panel" data-lenis-prevent>
        <div className="settings-heading">
          <h2>Make this space yours</h2>
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close reading settings"
          >
            <X size={20} />
          </button>
        </div>
        <p className="settings-note">Different minds. Different preferences.</p>
        <noscript>
          <p>
            Enable JavaScript to save reading settings. Browser zoom is always
            available.
          </p>
        </noscript>
        <label>
          Font family
          <select
            value={preferences.font}
            onChange={(e) => update({ font: e.target.value })}
          >
            {fontNames.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
        </label>
        <p className="font-note">
          Choose what feels comfortable for you. No one font suits everyone.
        </p>
        <label>
          Text size: {preferences.size}px
          <input
            type="range"
            min="16"
            max="28"
            value={preferences.size}
            onChange={(e) => update({ size: Number(e.target.value) })}
          />
        </label>
        <div className="settings-pair">
          <label>
            Line spacing
            <select
              value={preferences.lineHeight}
              onChange={(e) => update({ lineHeight: Number(e.target.value) })}
            >
              <option value="1.5">Standard</option>
              <option value="1.65">Comfortable</option>
              <option value="1.9">Spacious</option>
              <option value="2">Extra spacious</option>
            </select>
          </label>
          <label>
            Letter spacing
            <select
              value={preferences.letterSpacing}
              onChange={(e) =>
                update({ letterSpacing: Number(e.target.value) })
              }
            >
              <option value="0">Normal</option>
              <option value="0.01">Comfortable</option>
              <option value="0.04">Wide</option>
              <option value="0.08">Extra wide</option>
              <option value="0.12">Widest</option>
            </select>
          </label>
        </div>
        <fieldset>
          <legend>Reading background</legend>
          <div className="background-options">
            {backgrounds.map((bg) => (
              <button
                key={bg.value}
                style={{ background: bg.value }}
                aria-pressed={preferences.background === bg.value}
                onClick={() => update({ background: bg.value })}
              >
                {bg.label}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={preferences.reduceMotion}
            onChange={(e) => update({ reduceMotion: e.target.checked })}
          />
          Reduce motion
        </label>
        <p className="font-note">
          Your device’s reduced-motion preference is always respected.
        </p>
        <button
          className="button button-dark reset-settings"
          onClick={() => save(defaults)}
        >
          Reset preferences
        </button>
        <p className="font-note">
          Saved on this device when local storage is available.
        </p>
      </div>
    </details>
  );
}

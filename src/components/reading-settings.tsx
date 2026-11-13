"use client";

import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  applyPreferences,
  backgrounds,
  defaults,
  fonts,
  restorePreferences,
  STORAGE_KEY,
  type Preferences,
} from "@/lib/preferences";

export function ReadingSettings() {
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    // Restore after hydration; the identical runtime already applied styles before paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreferences(restorePreferences());
    const sync = () => setPreferences(restorePreferences());
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) sync();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  function update(next: Preferences) {
    setPreferences(applyPreferences(next));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStorageUnavailable(false);
    } catch {
      setStorageUnavailable(true);
    }
  }
  return (
    <>
      <button
        type="button"
        className="settings-trigger js-only"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        <span>Reading settings</span>
      </button>
      <dialog
        ref={dialog}
        className="reading-dialog"
        aria-labelledby="settings-title"
        data-lenis-prevent
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="dialog-inner">
          <div className="dialog-heading">
            <div>
              <p className="eyebrow">Your space, your way</p>
              <h2 id="settings-title">Reading settings</h2>
            </div>
            <button
              className="icon-button"
              aria-label="Close reading settings"
              onClick={() => dialog.current?.close()}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <p className="small">
            Choose what feels comfortable. There is no single right way to read.
          </p>
          <label>
            Font family
            <select
              value={preferences.font}
              onChange={(e) =>
                update({
                  ...preferences,
                  font: e.target.value as Preferences["font"],
                })
              }
            >
              {Object.keys(fonts).map((font) => (
                <option key={font}>{font}</option>
              ))}
            </select>
          </label>
          <label>
            Text size: {preferences.size}px
            <input
              type="range"
              min="16"
              max="26"
              value={preferences.size}
              onChange={(e) =>
                update({ ...preferences, size: Number(e.target.value) })
              }
            />
          </label>
          <label>
            Line spacing
            <select
              value={preferences.lineHeight}
              onChange={(e) =>
                update({ ...preferences, lineHeight: Number(e.target.value) })
              }
            >
              <option value="1.5">Standard</option>
              <option value="1.65">Comfortable</option>
              <option value="2">Spacious</option>
            </select>
          </label>
          <label>
            Letter spacing
            <select
              value={preferences.letterSpacing}
              onChange={(e) =>
                update({
                  ...preferences,
                  letterSpacing: Number(e.target.value),
                })
              }
            >
              <option value="0">Normal</option>
              <option value="0.01">Comfortable</option>
              <option value="0.04">Wide</option>
              <option value="0.12">Extra wide</option>
            </select>
          </label>
          <fieldset>
            <legend>Reading background</legend>
            <div className="background-options">
              {backgrounds.map((b) => (
                <button
                  key={b.value}
                  aria-pressed={preferences.background === b.value}
                  onClick={() =>
                    update({ ...preferences, background: b.value })
                  }
                >
                  <span style={{ backgroundColor: b.value }} />
                  {b.label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="check-label">
            <input
              type="checkbox"
              checked={preferences.reduceMotion}
              onChange={(e) =>
                update({ ...preferences, reduceMotion: e.target.checked })
              }
            />
            Reduce decorative motion
          </label>
          <p className="small">
            Your device’s reduced-motion setting is always respected.
            Preferences stay in this browser.
          </p>
          {storageUnavailable && (
            <p role="status" className="small">
              Browser storage is unavailable. Your choices work for this visit.
            </p>
          )}
          <button
            className="button button-dark"
            onClick={() => update(defaults)}
          >
            Reset preferences
          </button>
        </div>
      </dialog>
    </>
  );
}

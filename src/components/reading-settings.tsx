"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, SlidersHorizontal, X } from "lucide-react";
import {
  applyPreferences,
  backgrounds,
  defaults,
  fonts,
  textures,
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
      <button
        type="button"
        className="settings-trigger theme-trigger js-only"
        aria-label="Dark mode"
        aria-pressed={preferences.darkMode}
        onClick={() => update({ ...preferences, darkMode: !preferences.darkMode })}
      >
        <Moon size={18} aria-hidden="true" />
        <span>Dark mode</span>
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
          <label className="check-label">
            <input
              type="checkbox"
              checked={preferences.darkMode}
              onChange={(e) => update({ ...preferences, darkMode: e.target.checked })}
            />
            Dark mode
          </label>
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
                  <span style={{ backgroundColor: preferences.darkMode ? b.darkValue : b.value }} />
                  {preferences.darkMode ? b.darkLabel : b.label}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="check-label">
            <input
              type="checkbox"
              checked={preferences.texture}
              aria-describedby="texture-hint"
              onChange={(e) =>
                update({ ...preferences, texture: e.target.checked })
              }
            />
            <span>
              Background texture
              <span className="texture-state" aria-hidden="true">
                {preferences.texture ? "On" : "Off"}
              </span>
            </span>
          </label>
          <label>
            Texture style
            <select
              value={preferences.textureStyle}
              disabled={!preferences.texture}
              aria-describedby="texture-hint"
              onChange={(e) => update({ ...preferences, textureStyle: e.target.value as Preferences["textureStyle"] })}
            >
              {textures.map((texture) => (
                <option key={texture.value} value={texture.value}>{texture.label}</option>
              ))}
            </select>
          </label>
          <div className="texture-preview surface-paper" aria-hidden="true" />
          <p className="small" id="texture-hint">
            Fine paper grain, a soft linen weave or matte plaster. Turn Background
            texture off for a plain surface. Your colour choice stays the same.
          </p>
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

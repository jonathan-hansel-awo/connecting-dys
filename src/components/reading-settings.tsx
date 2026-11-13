/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";

const STORAGE_KEY = "connecting-dys-reading-settings";

type Preferences = {
  font: string;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  background: string;
  reduceMotion: boolean;
};

const defaults: Preferences = {
  font: "Open Sans",
  size: 18,
  lineHeight: 1.65,
  letterSpacing: 0.01,
  background: "#FCF7ED",
  reduceMotion: false,
};

const fonts: Record<string, string> = {
  "Open Sans": "var(--font-open-sans), Arial, sans-serif",
  Arial: "Arial, Helvetica, sans-serif",
  Verdana: "Verdana, Geneva, sans-serif",
  Georgia: "Georgia, serif",
  OpenDyslexic: "OpenDyslexic, Arial, sans-serif",
};

const backgrounds = [
  { label: "Cream", value: "#FCF7ED" },
  { label: "White", value: "#FFFFFF" },
  { label: "Soft blue", value: "#EBF4FA" },
  { label: "Soft peach", value: "#FFF0E4" },
];

function applyPreferences(prefs: Preferences) {
  const root = document.documentElement;

  root.style.setProperty(
    "--reading-font",
    fonts[prefs.font] ?? fonts["Open Sans"],
  );
  root.style.setProperty("--reading-size", `${prefs.size}px`);
  root.style.setProperty("--reading-line-height", String(prefs.lineHeight));
  root.style.setProperty(
    "--reading-letter-spacing",
    `${prefs.letterSpacing}em`,
  );
  root.style.setProperty("--reading-background", prefs.background);

  root.dataset.reduceMotion = String(prefs.reduceMotion);

  window.dispatchEvent(new Event("connecting-dys:preferences"));
}

export function ReadingSettings() {
  const [preferences, setPreferences] = useState<Preferences>(defaults);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        const restored: Preferences = {
          font: fonts[parsed.font] ? parsed.font : defaults.font,
          size: Math.min(24, Math.max(16, Number(parsed.size) || 18)),
          lineHeight: [1.5, 1.65, 1.9].includes(parsed.lineHeight)
            ? parsed.lineHeight
            : defaults.lineHeight,
          letterSpacing: [0, 0.01, 0.04, 0.08].includes(parsed.letterSpacing)
            ? parsed.letterSpacing
            : defaults.letterSpacing,
          background: backgrounds.some((b) => b.value === parsed.background)
            ? parsed.background
            : defaults.background,
          reduceMotion: parsed.reduceMotion === true,
        };

        setPreferences(restored);
        applyPreferences(restored);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function update(next: Preferences) {
    setPreferences(next);
    applyPreferences(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border-2 border-[#146C78] px-4 py-2 font-semibold text-[#20354D]">
        <SlidersHorizontal size={18} aria-hidden="true" />
        Reading settings
      </summary>

      <div className="absolute right-0 z-50 mt-3 max-h-[75vh] w-[min(22rem,90vw)] space-y-5 overflow-y-auto rounded-2xl border border-[#20354D]/15 bg-white p-5 shadow-2xl">
        <h2 className="text-lg font-bold">Make this space yours</h2>

        <label className="block space-y-2">
          <span className="font-semibold">Font family</span>
          <select
            value={preferences.font}
            onChange={(e) => update({ ...preferences, font: e.target.value })}
            className="w-full rounded-lg border border-[#20354D] p-3"
          >
            {Object.keys(fonts).map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="font-semibold">Text size: {preferences.size}px</span>
          <input
            type="range"
            min="16"
            max="24"
            step="1"
            value={preferences.size}
            onChange={(e) =>
              update({
                ...preferences,
                size: Number(e.target.value),
              })
            }
            className="w-full accent-[#146C78]"
          />
        </label>

        <label className="block space-y-2">
          <span className="font-semibold">Line spacing</span>
          <select
            value={preferences.lineHeight}
            onChange={(e) =>
              update({
                ...preferences,
                lineHeight: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-[#20354D] p-3"
          >
            <option value={1.5}>Standard</option>
            <option value={1.65}>Comfortable</option>
            <option value={1.9}>Spacious</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="font-semibold">Letter spacing</span>
          <select
            value={preferences.letterSpacing}
            onChange={(e) =>
              update({
                ...preferences,
                letterSpacing: Number(e.target.value),
              })
            }
            className="w-full rounded-lg border border-[#20354D] p-3"
          >
            <option value={0}>Normal</option>
            <option value={0.01}>Comfortable</option>
            <option value={0.04}>Wide</option>
            <option value={0.08}>Extra wide</option>
          </select>
        </label>

        <fieldset>
          <legend className="mb-2 font-semibold">Reading background</legend>
          <div className="flex gap-3">
            {backgrounds.map((background) => (
              <button
                key={background.value}
                type="button"
                title={background.label}
                aria-label={background.label}
                aria-pressed={preferences.background === background.value}
                onClick={() =>
                  update({
                    ...preferences,
                    background: background.value,
                  })
                }
                className="h-10 w-10 rounded-full border-2 border-[#20354D] aria-pressed:ring-4 aria-pressed:ring-[#146C78]"
                style={{
                  backgroundColor: background.value,
                }}
              />
            ))}
          </div>
        </fieldset>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={preferences.reduceMotion}
            onChange={(e) =>
              update({
                ...preferences,
                reduceMotion: e.target.checked,
              })
            }
            className="h-5 w-5 accent-[#146C78]"
          />
          Reduce decorative motion
        </label>

        <button
          type="button"
          onClick={() => update(defaults)}
          className="w-full rounded-lg bg-[#20354D] px-5 py-3 font-semibold text-white"
        >
          Reset preferences
        </button>
      </div>
    </details>
  );
}

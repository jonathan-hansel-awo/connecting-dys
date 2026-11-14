export const STORAGE_KEY = "connecting-dys-reading-settings";
export const PREFERENCES_EVENT = "connecting-dys:preferences";
export const fonts = {
  "Open Sans": "var(--font-open-sans), Arial, sans-serif",
  Arial: "Arial, Helvetica, sans-serif",
  Verdana: "Verdana, Geneva, sans-serif",
  "Atkinson Hyperlegible": "Atkinson Hyperlegible, Arial, sans-serif",
  OpenDyslexic: "OpenDyslexic, Arial, sans-serif",
};
export const backgrounds = [
  { label: "Cream", value: "#FCF7ED" },
  { label: "White", value: "#FFFFFF" },
  { label: "Soft blue", value: "#EBF4FA" },
  { label: "Soft peach", value: "#FFF0E4" },
];
export type Preferences = {
  font: keyof typeof fonts;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  background: string;
  reduceMotion: boolean;
  texture: boolean;
};
export const defaults: Preferences = {
  font: "Open Sans",
  size: 18,
  lineHeight: 1.65,
  letterSpacing: 0.01,
  background: "#FCF7ED",
  reduceMotion: false,
  texture: true,
};
// This self-contained function also runs before paint. Keep dependencies in config.
function preferenceRuntime(
  config: {
    defaults: Preferences;
    fonts: typeof fonts;
    backgrounds: typeof backgrounds;
  },
  input: unknown,
) {
  const p =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const finite = (v: unknown, fallback: number, min: number, max: number) =>
    typeof v === "number" && Number.isFinite(v)
      ? Math.min(max, Math.max(min, v))
      : fallback;
  const prefs = {
    font:
      typeof p.font === "string" && Object.hasOwn(config.fonts, p.font)
        ? (p.font as Preferences["font"])
        : config.defaults.font,
    size: finite(p.size, 18, 16, 26),
    lineHeight: finite(p.lineHeight, 1.65, 1.5, 2),
    letterSpacing: finite(p.letterSpacing, 0.01, 0, 0.12),
    background: config.backgrounds.some((b) => b.value === p.background)
      ? (p.background as string)
      : config.defaults.background,
    reduceMotion: p.reduceMotion === true,
    // Older saved objects have no texture field. Only a real boolean opts out.
    texture: typeof p.texture === "boolean" ? p.texture : config.defaults.texture,
  };
  const root = document.documentElement;
  root.style.setProperty("--reading-font", config.fonts[prefs.font]);
  root.style.setProperty(
    "--reading-heading-font",
    prefs.font === "Open Sans"
      ? "var(--font-nunito-sans), Arial, sans-serif"
      : config.fonts[prefs.font],
  );
  root.style.setProperty("--reading-size", prefs.size + "px");
  root.style.setProperty("--reading-line-height", String(prefs.lineHeight));
  root.style.setProperty(
    "--reading-letter-spacing",
    prefs.letterSpacing + "em",
  );
  root.style.setProperty("--reading-background", prefs.background);
  root.dataset.reduceMotion = String(prefs.reduceMotion);
  root.dataset.texture = prefs.texture ? "on" : "off";
  root.dataset.readingCustom = String(
    prefs.background !== config.defaults.background,
  );
  root.dataset.spacious = String(
    prefs.size > 20 ||
      prefs.lineHeight > 1.8 ||
      prefs.letterSpacing > 0.04 ||
      prefs.font === "OpenDyslexic",
  );
  root.dataset.js = "true";
  return prefs;
}
const config = { defaults, fonts, backgrounds };
export function applyPreferences(input: unknown) {
  const prefs = preferenceRuntime(config, input);
  window.dispatchEvent(new Event(PREFERENCES_EVENT));
  return prefs;
}
export function restorePreferences() {
  try {
    return applyPreferences(
      JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"),
    );
  } catch {
    return applyPreferences(defaults);
  }
}
// Static, non-user-controlled source; can be allowed by a CSP hash when a CSP is added.
export const preferenceBootstrap = `try{(${preferenceRuntime.toString()})(${JSON.stringify(config)},(()=>{try{return JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||'null')}catch{return null}})())}catch{document.documentElement.dataset.js='true'}`;

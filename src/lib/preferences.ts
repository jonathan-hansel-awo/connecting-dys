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
  { label: "Cream", value: "#FCF7ED", darkLabel: "Warm navy", darkValue: "#162938" },
  { label: "White", value: "#FFFFFF", darkLabel: "Deep navy", darkValue: "#122330" },
  { label: "Soft blue", value: "#EBF4FA", darkLabel: "Slate blue", darkValue: "#1B3044" },
  { label: "Soft peach", value: "#FFF0E4", darkLabel: "Warm charcoal", darkValue: "#2B292B" },
];
export const textures = [
  { value: "paper", label: "Paper" },
  { value: "linen", label: "Linen" },
  { value: "plaster", label: "Plaster" },
] as const;
export type Preferences = {
  font: keyof typeof fonts;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  background: string;
  reduceMotion: boolean;
  texture: boolean;
  textureStyle: (typeof textures)[number]["value"];
  darkMode: boolean;
};
export const defaults: Preferences = {
  font: "Verdana",
  size: 20,
  lineHeight: 1.65,
  letterSpacing: 0.01,
  background: "#FCF7ED",
  reduceMotion: true,
  texture: true,
  textureStyle: "plaster",
  darkMode: false,
};
// This self-contained function also runs before paint. Keep dependencies in config.
function preferenceRuntime(
  config: {
    defaults: Preferences;
    fonts: typeof fonts;
    backgrounds: typeof backgrounds;
    textures: typeof textures;
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
    size: finite(p.size, config.defaults.size, 16, 26),
    lineHeight: finite(p.lineHeight, 1.65, 1.5, 2),
    letterSpacing: finite(p.letterSpacing, 0.01, 0, 0.12),
    background: config.backgrounds.some((b) => b.value === p.background)
      ? (p.background as string)
      : config.defaults.background,
    reduceMotion: typeof p.reduceMotion === "boolean" ? p.reduceMotion : config.defaults.reduceMotion,
    // Older saved objects have no texture field. Only a real boolean opts out.
    texture: typeof p.texture === "boolean" ? p.texture : config.defaults.texture,
    textureStyle: config.textures.some((t) => t.value === p.textureStyle)
      ? (p.textureStyle as Preferences["textureStyle"])
      : config.defaults.textureStyle,
    darkMode: p.darkMode === true,
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
  const background = config.backgrounds.find((b) => b.value === prefs.background)!;
  root.style.setProperty("--reading-background", prefs.darkMode ? background.darkValue : background.value);
  root.dataset.theme = prefs.darkMode ? "dark" : "light";
  // `only` opts out of automatic recolouring in browsers that honour it.
  // High-contrast/forced-colours remains browser-controlled.
  const scheme = prefs.darkMode ? "only dark" : "only light";
  root.style.colorScheme = scheme;
  // Leave the server's initial hint stable: mutating React-managed metadata
  // before hydration would make React insert a duplicate. CSS owns live changes.
  root.dataset.reduceMotion = String(prefs.reduceMotion);
  root.dataset.texture = prefs.texture ? "on" : "off";
  root.dataset.textureStyle = prefs.textureStyle;
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
const config = { defaults, fonts, backgrounds, textures };
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

export const STORAGE_KEY = "connecting-dys-reading-settings";
export const PREFERENCES_EVENT = "connecting-dys:preferences";
export const fontNames = [
  "Open Sans",
  "Arial",
  "Verdana",
  "Atkinson Hyperlegible",
  "OpenDyslexic",
] as const;
export const backgrounds = [
  { label: "Cream", value: "#FCF7ED" },
  { label: "White", value: "#FFFFFF" },
  { label: "Soft blue", value: "#EBF4FA" },
  { label: "Soft peach", value: "#FFF0E4" },
] as const;
export type Preferences = {
  font: string;
  size: number;
  lineHeight: number;
  letterSpacing: number;
  background: string;
  reduceMotion: boolean;
};
export const defaults: Preferences = {
  font: "Open Sans",
  size: 18,
  lineHeight: 1.65,
  letterSpacing: 0.01,
  background: "#FCF7ED",
  reduceMotion: false,
};

// Shared by the pre-paint bootstrap and hydrated controls. Reject arbitrary CSS/storage values.
export function normalisePreferences(value: unknown): Preferences {
  const p =
    value && typeof value === "object" ? (value as Partial<Preferences>) : {};
  return {
    font: fontNames.some((f) => f === p.font) ? p.font! : defaults.font,
    size:
      typeof p.size === "number" && Number.isFinite(p.size)
        ? Math.min(28, Math.max(16, p.size))
        : defaults.size,
    lineHeight: [1.5, 1.65, 1.9, 2].includes(p.lineHeight!)
      ? p.lineHeight!
      : defaults.lineHeight,
    letterSpacing: [0, 0.01, 0.04, 0.08, 0.12].includes(p.letterSpacing!)
      ? p.letterSpacing!
      : defaults.letterSpacing,
    background: backgrounds.some((b) => b.value === p.background)
      ? p.background!
      : defaults.background,
    reduceMotion: p.reduceMotion === true,
  };
}

export function applyPreferences(p: Preferences) {
  const root = document.documentElement;
  root.dataset.readingFont = p.font;
  root.dataset.reduceMotion = String(p.reduceMotion);
  root.dataset.largeReading = String(p.size > 20);
  root.style.setProperty("--reading-size", `${p.size}px`);
  root.style.setProperty("--reading-line-height", String(p.lineHeight));
  root.style.setProperty("--reading-letter-spacing", `${p.letterSpacing}em`);
  root.style.setProperty("--reading-background", p.background);
}

// Trusted static code; stored values are never interpolated into the script itself.
export const preferenceBootstrap = `(()=>{try{const d=${JSON.stringify(defaults)},f=${JSON.stringify(fontNames)},b=${JSON.stringify(backgrounds)},v=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||'null'),p=v&&typeof v==='object'?v:{},r=document.documentElement,s=typeof p.size==='number'&&Number.isFinite(p.size)?Math.min(28,Math.max(16,p.size)):d.size;r.dataset.readingFont=f.includes(p.font)?p.font:d.font;r.dataset.reduceMotion=String(p.reduceMotion===true);r.dataset.largeReading=String(s>20);r.style.setProperty('--reading-size',s+'px');r.style.setProperty('--reading-line-height',String([1.5,1.65,1.9,2].includes(p.lineHeight)?p.lineHeight:d.lineHeight));r.style.setProperty('--reading-letter-spacing',([0,0.01,0.04,0.08,0.12].includes(p.letterSpacing)?p.letterSpacing:d.letterSpacing)+'em');r.style.setProperty('--reading-background',b.some(x=>x.value===p.background)?p.background:d.background)}catch{}})();`;

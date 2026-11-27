// Keep the supplied documents intact while applying the approved display name.
export function brandCopy(text: string) {
  return text.replace(/\bDys\b/g, "DYS").replace(/\bConnecting DYS CIC\b/g, "Connecting DYS");
}

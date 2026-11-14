import { ScrollTrigger } from "gsap/ScrollTrigger";

// Native sticky sheets: a tall chapter scrolls in full before its last screen
// pauses. Its next sibling then covers it, without spacers or extra runway.
// Called inside the homepage media context and disposed when it reverts.
export function createSectionStacking(interaction: { reading: boolean }) {
  const main = document.querySelector<HTMLElement>("main[data-home-story]");
  if (!main) return;
  const sheets = [...main.querySelectorAll<HTMLElement>(":scope > section")];
  interaction.reading ||= main.contains(document.activeElement);
  const clear = () => { delete main.dataset.sectionStack; };
  const measure = () => {
    clear();
    const inset = (document.querySelector(".site-header")?.getBoundingClientRect().height || 80) + 12;
    main.style.setProperty("--sheet-width", `${document.documentElement.clientWidth}px`);
    const heights = sheets.map((sheet) => sheet.offsetHeight);
    sheets.forEach((sheet, index) => {
      sheet.style.setProperty("--sheet-top", `${Math.min(inset, innerHeight - heights[index])}px`);
      sheet.style.setProperty("--sheet-order", String(index + 1));
    });
    if (!interaction.reading) main.dataset.sectionStack = "on";
  };
  // Focus/find/navigation always get the unobstructed natural document. Native
  // sticky positioning never changes layout height, so switching cannot add a
  // scroll jump. Pointer scrolling restores the effect after focus leaves links.
  const read = () => { interaction.reading = true; clear(); };
  const key = (event: KeyboardEvent) => {
    if (["Tab", "PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp", " ", "F3", "Escape"].includes(event.key) ||
      ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "f")) read();
  };
  const focus = (event: FocusEvent) => {
    if (main.contains(event.target as Node)) read();
  };
  const pointer = () => {
    if (!interaction.reading && main.dataset.sectionStack === "on") return;
    if (main.contains(document.activeElement) && document.activeElement?.matches("a,button,input,select,[tabindex]")) return;
    interaction.reading = false;
    measure();
  };
  // ScrollTrigger must measure the natural-flow positions, including during a
  // mid-story font/image/viewport refresh. Only paint becomes sticky afterwards.
  ScrollTrigger.addEventListener("refreshInit", clear);
  ScrollTrigger.addEventListener("refresh", measure);
  document.addEventListener("keydown", key, true);
  document.addEventListener("focusin", focus);
  document.addEventListener("beforematch", read);
  window.addEventListener("wheel", pointer, { passive: true });
  window.addEventListener("touchstart", pointer, { passive: true });
  measure();
  return () => {
    clear();
    main.style.removeProperty("--sheet-width");
    sheets.forEach((sheet) => {
      sheet.style.removeProperty("--sheet-top");
      sheet.style.removeProperty("--sheet-order");
    });
    ScrollTrigger.removeEventListener("refreshInit", clear);
    ScrollTrigger.removeEventListener("refresh", measure);
    document.removeEventListener("keydown", key, true);
    document.removeEventListener("focusin", focus);
    document.removeEventListener("beforematch", read);
    window.removeEventListener("wheel", pointer);
    window.removeEventListener("touchstart", pointer);
  };
}

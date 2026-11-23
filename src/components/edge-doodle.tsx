export type EdgeDoodleMotif = "connection" | "conversation" | "growth" | "bridge" | "book" | "path" | "home" | "care";

// Explicit editorial choices: a few meaningful accents, never one on every box.
export const editorialDoodles: Record<string, Record<number, EdgeDoodleMotif>> = {
  why: { 0: "connection" }, mission: { 0: "path" }, vision: { 0: "bridge" }, goal: { 0: "growth" },
  "about-work": { 0: "conversation" },
  story: { 2: "connection", 5: "path", 10: "home", 22: "care" },
  founder: { 3: "conversation", 6: "connection", 8: "care" },
  "work-1": { 0: "connection" }, "work-2": { 0: "conversation" }, "work-5": { 0: "book" }, "work-8": { 0: "growth" },
  "approach-community": { 0: "connection" }, "approach-design": { 0: "path" }, "approach-grow": { 0: "growth" }, "approach-gets": { 0: "care" },
  "value-B": { 0: "home" }, "value-R": { 0: "conversation" }, "value-I": { 0: "connection" }, "value-E": { 0: "care" },
  "support-peer": { 0: "connection" }, "support-family": { 0: "home" }, "support-workshops": { 0: "book" }, "support-forums": { 0: "conversation" },
  "who-join": { 0: "home" },
};

// Original gently irregular line drawings. No text, motion or focus targets.
export function EdgeDoodle({ motif }: { motif: EdgeDoodleMotif }) {
  return <span className={`edge-doodle edge-doodle-${motif}`} data-edge-motif={motif} aria-hidden="true">
    <svg viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      {motif === "connection" && <>
        <path d="M41 32C29 18 11 27 15 42C17 53 32 55 44 44L51 37M59 47C70 60 89 51 85 36C81 23 68 25 56 36L49 43" />
        <path className="doodle-accent" d="M34 44C45 47 55 32 68 35M12 20L8 15M84 58L90 64" />
      </>}
      {motif === "conversation" && <>
        <path d="M14 18Q33 11 56 19Q64 27 58 43Q47 52 30 46L19 54L20 43Q8 36 14 18Z" />
        <path className="doodle-accent" d="M65 28Q84 26 89 39Q93 51 80 56L80 65L67 57Q57 59 49 54M24 28Q34 25 47 29M24 36L40 37" />
      </>}
      {motif === "growth" && <>
        <path d="M48 60Q55 42 51 23M51 43C33 44 25 31 28 20C44 19 52 29 51 43ZM52 35C68 37 78 26 76 15C60 13 51 24 52 35Z" />
        <path className="doodle-accent" d="M27 61Q50 53 73 62M20 69Q50 63 80 68M31 31L43 36M62 27L69 22" />
      </>}
      {motif === "bridge" && <>
        <path d="M11 55Q50 14 88 55M13 44Q50 2 86 44M22 36L24 46M39 25L40 35M58 25L59 34M75 36L77 46" />
        <path className="doodle-accent" d="M8 59L29 61M72 61L93 59M35 64Q48 59 63 64M40 71Q50 68 59 71" />
      </>}
      {motif === "book" && <>
        <path d="M49 25Q31 13 13 20L17 59Q33 53 50 65Q66 54 85 58L88 18Q66 13 49 25L50 65Z" />
        <path className="doodle-accent" d="M23 30Q33 28 41 34M24 41Q33 39 41 44M60 32Q69 27 78 28M60 43Q68 38 76 39M12 67Q29 60 43 69" />
      </>}
      {motif === "path" && <>
        <path d="M16 63C51 70 23 23 50 23C70 23 55 52 83 45M73 37L85 44L77 54" />
        <path className="doodle-accent" d="M12 47L10 42M37 17L36 11M67 64L70 69" />
        <circle cx="14" cy="63" r="4" /><circle className="doodle-accent" cx="50" cy="23" r="4" />
      </>}
      {motif === "home" && <>
        <path d="M17 39L49 13L83 38M25 34L26 65L73 64L74 33M43 64L43 47Q50 40 57 47L57 64" />
        <path className="doodle-accent" d="M34 31C27 20 40 17 45 27C53 17 63 25 55 34L45 42ZM18 71Q51 75 84 69" />
      </>}
      {motif === "care" && <>
        <path d="M49 25C36 8 17 24 28 39L49 58L72 38C83 22 64 9 49 25Z" />
        <path className="doodle-accent" d="M17 46Q11 58 27 65L44 69M83 46Q91 60 72 65L56 69M17 23L11 20M83 22L89 18" />
      </>}
    </svg>
  </span>;
}

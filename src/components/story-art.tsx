/** Original decorative vector compositions, not representations of members or learning differences. */
export function PathArt() {
  return (
    <svg
      className="path-art"
      viewBox="0 0 600 420"
      fill="none"
      aria-hidden="true"
    >
      <path
        className="story-path"
        d="M-30 65C120 65 40 260 220 210S390 100 440 210S520 380 630 270"
        stroke="#EAB85C"
        strokeWidth="3"
      />
      <path
        className="story-path"
        d="M-30 330C110 330 120 100 240 180S400 340 440 210S540 80 630 100"
        stroke="#D98677"
        strokeWidth="3"
      />
      <path
        className="story-path"
        d="M110-30C110 60 380 20 370 150S340 300 440 210S620 200 620 420"
        stroke="#8DC6C3"
        strokeWidth="3"
      />
      <circle cx="440" cy="210" r="62" fill="#FCF7ED" />
      <path
        d="M419 210h42m-21-21v42"
        stroke="#146C78"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="220" cy="210" r="10" fill="#EAB85C" />
      <circle cx="240" cy="180" r="8" fill="#D98677" />
      <circle cx="370" cy="150" r="8" fill="#8DC6C3" />
    </svg>
  );
}
export function ConnectionArt({ scene }: { scene: number }) {
  return (
    <svg
      viewBox="0 0 500 440"
      fill="none"
      aria-hidden="true"
      className={`connection-art art-${scene}`}
    >
      <path d="M35 370H465" stroke="#20354D" strokeWidth="1.5" opacity=".2" />
      {scene === 0 ? (
        <>
          <path d="M80 370V180a110 110 0 01220 0v190" fill="#EAB85C" />
          <path d="M200 370V230a100 100 0 01200 0v140" fill="#146C78" />
          <circle cx="190" cy="177" r="35" fill="#FCF7ED" />
          <path d="M120 355v-75a70 70 0 01140 0v75" fill="#FCF7ED" />
          <circle cx="305" cy="245" r="29" fill="#D98677" />
          <path d="M253 370v-57a52 52 0 01104 0v57" fill="#D98677" />
          <path
            d="M320 80c45 0 80 30 80 65"
            stroke="#20354D"
            strokeWidth="2"
            strokeDasharray="5 7"
          />
          <path
            d="M324 101c29 0 54 18 54 42"
            stroke="#20354D"
            strokeWidth="2"
            strokeDasharray="5 7"
          />
        </>
      ) : scene === 1 ? (
        <>
          <path d="M70 370V190a100 100 0 01200 0v180" fill="#146C78" />
          <path d="M230 370V190a100 100 0 01200 0v180" fill="#D98677" />
          <path
            d="M170 100c0-70 160-70 160 0"
            stroke="#EAB85C"
            strokeWidth="18"
          />
          <circle cx="170" cy="205" r="29" fill="#FCF7ED" />
          <circle cx="330" cy="205" r="29" fill="#FCF7ED" />
          <path
            d="M119 370v-91c0-43 51-49 71-20l60 70 60-70c20-29 71-23 71 20v91"
            stroke="#FCF7ED"
            strokeWidth="22"
            strokeLinejoin="round"
          />
          <circle cx="250" cy="142" r="8" fill="#EAB85C" />
        </>
      ) : (
        <>
          <path d="M95 370V210a155 155 0 01310 0v160" fill="#EAB85C" />
          <path d="M143 370V214a107 107 0 01214 0v156" fill="#FCF7ED" />
          <circle cx="250" cy="195" r="34" fill="#146C78" />
          <circle cx="165" cy="263" r="25" fill="#D98677" />
          <circle cx="335" cy="263" r="25" fill="#20354D" />
          <path d="M192 370v-84a58 58 0 01116 0v84" fill="#146C78" />
          <path d="M121 370v-39a44 44 0 0188 0v39" fill="#D98677" />
          <path d="M291 370v-39a44 44 0 0188 0v39" fill="#20354D" />
          <path
            d="M57 100l15 13m-3-39v18m-36-1l17 3M428 96l-14 12m15-39v17m22 3l-15 4"
            stroke="#146C78"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}
export function DifferenceArt({ index }: { index: number }) {
  return (
    <span
      className={`difference-art difference-art-${index}`}
      aria-hidden="true"
    >
      <i />
      <i />
      <i />
    </span>
  );
}

// Original decorative artwork. These abstract shapes are not member portraits or a new logo.
export function PathArtwork({
  variant = "recognition",
}: {
  variant?: "recognition" | "connection";
}) {
  return (
    <svg
      className={`path-art path-art-${variant}`}
      viewBox="0 0 760 600"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-landscape">
        <path
          className="landform"
          d="M-90 580C30 295 160 490 283 340S540 230 810 580"
          fill="#EAB85C"
          opacity=".2"
        />
        <path
          d="M-80 430C80 430 106 165 270 210S362 550 535 420 670 130 850 170"
          stroke="#D98677"
          strokeWidth="3"
          strokeDasharray="7 10"
        />
        <path
          className="journey-path"
          pathLength="1"
          d="M-60 330C90 80 170 520 350 280S570 120 790 330"
          stroke="#EAB85C"
          strokeWidth="5"
        />
        <path
          d="M-50 500C150 560 60 230 300 430S580 330 820 480"
          stroke="#FCF7ED"
          strokeWidth="2"
          opacity=".5"
        />
        <g className="art-person person-one" transform="translate(195 260)">
          <circle cx="0" cy="-65" r="28" fill="#EAB85C" />
          <path d="M-52 70V-5C-52-55 52-55 52-5V70" fill="#EAB85C" />
          <path
            d="M-30-5Q15 65 85 10"
            stroke="#20354D"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>
        <g className="art-person person-two" transform="translate(430 340)">
          <circle cx="0" cy="-65" r="25" fill="#D98677" />
          <path d="M-45 70V-8C-45-50 45-50 45-8V70" fill="#D98677" />
          <path
            d="M-25 5Q-80 55-110-10"
            stroke="#20354D"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </g>
        <g className="art-person person-three" transform="translate(610 225)">
          <circle cx="0" cy="-58" r="24" fill="#FCF7ED" />
          <path d="M-42 68V-5C-42-48 42-48 42-5V68" fill="#FCF7ED" />
          <path
            d="M-20 0Q-55 45-85 20"
            stroke="#146C78"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </g>
        <circle cx="76" cy="140" r="10" fill="#D98677" />
        <circle cx="550" cy="490" r="11" fill="#EAB85C" />
        <path
          d="M535 82v28m-14-14h28M300 495v28m-14-14h28"
          stroke="#FCF7ED"
          strokeWidth="3"
        />
      </g>
    </svg>
  );
}
export function DifferenceArtwork({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className="difference-art"
    >
      {index === 0 && (
        <>
          <path
            d="M22 28Q38 18 50 30Q62 18 78 28V74Q62 64 50 77Q38 64 22 74Z"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M50 30v47M30 39h12m-12 12h12m16-12h12m-12 12h12"
            stroke="currentColor"
            strokeWidth="2"
          />
        </>
      )}
      {index === 1 && (
        <>
          <path
            d="M22 72C2 34 72 10 76 40S24 83 38 51 95 55 80 79"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="22" cy="72" r="5" fill="currentColor" />
          <circle cx="80" cy="79" r="5" fill="currentColor" />
        </>
      )}
      {index === 2 && (
        <>
          <circle
            cx="32"
            cy="32"
            r="14"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M58 20h25v25H58zM20 80l16-25 16 25zM62 65h20m-10-10v20"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </>
      )}
      {index === 3 && (
        <>
          <path
            d="M25 73l9-24 33-30 14 15-34 31-22 8Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M34 49l13 16M23 83h57M60 26l14 15"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

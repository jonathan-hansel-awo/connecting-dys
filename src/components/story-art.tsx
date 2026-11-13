// Original decorative scene, not portraits of Connecting Dys members.
// Arms are filled anatomical shapes attached at the shoulders, with hands and sleeves.
export function CommunityArtwork() {
  return (
    <svg
      className="path-art path-art-connection"
      viewBox="0 0 760 600"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="art-landscape">
        <ellipse
          cx="395"
          cy="505"
          rx="287"
          ry="38"
          fill="#20354D"
          opacity=".2"
        />
        <path
          d="M65 480C150 370 215 430 300 404S515 385 699 475V545H65Z"
          fill="#FCF7ED"
          opacity=".08"
        />
        <path
          className="journey-path"
          pathLength="1"
          d="M40 390C130 265 210 480 370 382S565 275 720 380"
          stroke="#EAB85C"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M60 436C190 500 260 315 435 428S605 480 708 415"
          stroke="#D98677"
          strokeWidth="2"
          strokeDasharray="5 10"
          opacity=".7"
        />
        {/* A plant and a shared table give the people a setting and a natural scale. */}
        <g className="scene-plant">
          <path
            d="M93 459V354"
            stroke="#FCF7ED"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M92 399C49 392 52 364 59 347C89 353 102 373 92 399ZM94 375C125 375 145 345 132 324C101 332 88 353 94 375Z"
            fill="#EAB85C"
          />
          <path d="M67 442H120L112 496H76Z" fill="#D98677" />
        </g>
        {/* Left: seated, leaning in, forearms resting naturally towards the table. */}
        <g className="art-person person-one">
          <path d="M168 355H245V371H168Z" fill="#D98677" />
          <path
            d="M177 371L167 487M235 371L249 487"
            stroke="#20354D"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M185 330H228L257 390L239 467H218L231 396L196 365Z"
            fill="#20354D"
          />
          <path d="M181 334H207L208 401L188 469H168L184 396Z" fill="#304D65" />
          <path
            d="M165 463H189L197 484H157Q153 473 165 463ZM215 462H240L255 482H213Z"
            fill="#FCF7ED"
          />
          <path d="M191 229H211V253H191Z" fill="#A86B4A" />
          <path
            d="M170 250Q198 234 224 250L235 335Q209 352 178 337Z"
            fill="#FCF7ED"
          />
          <path
            d="M175 252Q157 257 158 281L165 311L184 321L191 305L179 293L180 270Z"
            fill="#FCF7ED"
          />
          <path
            d="M167 300L181 294L199 309L220 310L220 324L191 328Q178 325 167 312Z"
            fill="#B97C57"
          />
          <path d="M217 309Q232 307 236 315Q235 326 218 324Z" fill="#B97C57" />
          <path
            d="M218 249Q238 249 246 270L260 293L282 302L277 317L248 308Q237 305 228 287L219 274Z"
            fill="#FCF7ED"
          />
          <path
            d="M258 291L283 301L302 299Q311 307 300 315L278 318L253 307Z"
            fill="#B97C57"
          />
          <ellipse cx="200" cy="209" rx="25" ry="29" fill="#B97C57" />
          <path
            d="M176 209Q163 181 186 176Q205 162 221 185L226 202L217 199L211 188Q195 201 177 196Z"
            fill="#20354D"
          />
          <path
            d="M207 211h2M194 211h2"
            stroke="#20354D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M198 223Q205 227 212 221"
            stroke="#72432E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        {/* Middle: standing behind the table, a relaxed bent elbow and an open hand. */}
        <g className="art-person person-two">
          <path
            d="M374 320H423L436 475H414L399 369L387 475H365Z"
            fill="#FCF7ED"
          />
          <path
            d="M362 474H389V491H353Q350 482 362 474ZM412 474H435L447 490H410Z"
            fill="#20354D"
          />
          <path d="M388 198H408V220H388Z" fill="#D59B75" />
          <path
            d="M376 218Q397 207 418 220L428 326Q400 338 369 326Z"
            fill="#D98677"
          />
          <path
            d="M378 221Q363 220 352 238L333 269L315 266L309 281L339 291Q350 288 360 272L377 250Z"
            fill="#D98677"
          />
          <path
            d="M320 269L305 261L300 249Q294 241 288 248L292 269Q297 280 310 281Z"
            fill="#D59B75"
          />
          <path
            d="M415 220Q433 218 441 241L454 278L435 302L422 291L434 274L422 251Z"
            fill="#D98677"
          />
          <path
            d="M434 279L446 287L429 308L414 309Q404 303 412 297L424 294Z"
            fill="#D59B75"
          />
          <ellipse cx="398" cy="175" rx="25" ry="29" fill="#D59B75" />
          <path
            d="M373 174Q364 149 382 143Q400 132 418 150L423 172L412 167L407 153Q393 166 374 163Z"
            fill="#20354D"
          />
          <path
            d="M387 177h2M404 177h2"
            stroke="#20354D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M389 189Q398 195 406 188"
            stroke="#8A583E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        {/* Right: seated sideways, with a sleeve, elbow, forearm and hand in one pose. */}
        <g className="art-person person-three">
          <path d="M550 356H631V373H550Z" fill="#D98677" />
          <path
            d="M561 373L550 487M620 373L633 487"
            stroke="#20354D"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M565 333H603L589 392L572 471H551L565 391L552 362Z"
            fill="#20354D"
          />
          <path
            d="M597 334L622 348L622 408L606 471H585L598 405L583 369Z"
            fill="#304D65"
          />
          <path
            d="M549 466H574L582 486H538Q535 476 549 466ZM584 466H609L622 486H581Z"
            fill="#FCF7ED"
          />
          <path d="M577 230H596V251H577Z" fill="#E1B38C" />
          <path
            d="M560 251Q585 236 611 252L620 336Q589 350 558 337Z"
            fill="#EAB85C"
          />
          <path
            d="M563 251Q543 251 535 272L526 293L506 304L515 320L540 308Q549 304 555 287L568 271Z"
            fill="#EAB85C"
          />
          <path
            d="M529 294L512 301L495 300Q482 305 493 315L511 320L535 307Z"
            fill="#E1B38C"
          />
          <path
            d="M607 251Q627 255 631 281L632 310L611 329L600 315L614 303L611 280Z"
            fill="#EAB85C"
          />
          <path
            d="M611 308L625 318L611 333L594 333Q584 328 591 320L603 319Z"
            fill="#E1B38C"
          />
          <ellipse cx="586" cy="208" rx="25" ry="29" fill="#E1B38C" />
          <path
            d="M562 210Q548 175 579 175Q611 171 615 207L610 244L600 233L601 206L590 189Q578 202 562 201Z"
            fill="#20354D"
          />
          <path
            d="M572 209h2M588 209h2"
            stroke="#20354D"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M574 223Q581 228 589 222"
            stroke="#9E6D4C"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
        <g className="shared-table">
          <path d="M282 325H517L531 341H272Z" fill="#EAB85C" />
          <path
            d="M322 342L302 491M485 342L506 491"
            stroke="#20354D"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path d="M349 315H402V325H349Z" fill="#FCF7ED" />
          <path d="M356 305H410V315H356Z" fill="#D98677" />
          <path d="M448 303H468V323H448Z" fill="#FCF7ED" />
          <path
            d="M468 308Q484 305 480 316Q477 321 468 319"
            stroke="#FCF7ED"
            strokeWidth="4"
          />
        </g>
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

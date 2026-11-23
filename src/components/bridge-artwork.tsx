// Original vector illustration: separate paths meet across a shared bridge.
// It is a metaphor for belonging, never a map or a claim about a service.
export function BridgeArtwork() {
  return <div className="bridge-artwork" aria-hidden="true">
    <svg viewBox="0 0 720 420" fill="none" focusable="false">
      <circle cx="535" cy="100" r="62" fill="#EAB85C" opacity=".65" />
      <path d="M10 320Q100 245 235 310L280 420H10Z" fill="#78A99E" />
      <path d="M450 325Q590 240 710 300V420H430Z" fill="#739FAE" />
      <path d="M235 420Q330 330 472 420" fill="#739FAE" opacity=".2" />
      <path d="M300 384Q355 367 417 386M283 407Q350 390 445 409" stroke="#146C78" strokeWidth="3" strokeLinecap="round" opacity=".4" />
      <path d="M150 305Q355 72 570 305L552 321Q355 120 168 321Z" fill="#D98677" />
      <path d="M147 298Q355 68 574 298" stroke="#20354D" strokeWidth="8" strokeLinecap="round" />
      <path d="M153 255Q355 35 569 255" stroke="#20354D" strokeWidth="5" strokeLinecap="round" />
      {[0,1,2,3,4,5,6].map(i => {
        const x=170+i*62; const y=110+Math.pow((x-356)/186,2)*130;
        return <path key={i} d={`M${x} ${y}v43`} stroke="#20354D" strokeWidth="5" strokeLinecap="round" />;
      })}
      <path d="M54 354Q84 315 155 302M566 303Q626 307 668 351" stroke="#FCF7ED" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 14" />
      <g transform="translate(247 122)"><circle cx="0" cy="-16" r="14" fill="#A86B4A" /><path d="M-17 8Q0-3 17 8L14 52H-14Z" fill="#EAB85C" /><path d="M-8 52L-16 85M9 52L20 76" stroke="#20354D" strokeWidth="9" strokeLinecap="round" /><path d="M-13 13L-26 36M14 12L34 22" stroke="#A86B4A" strokeWidth="8" strokeLinecap="round" /></g>
      <g transform="translate(451 122)"><circle cx="0" cy="-16" r="14" fill="#714B37" /><path d="M-17 8Q0-3 17 8L14 52H-14Z" fill="#146C78" /><path d="M-9 52L-20 76M8 52L16 85" stroke="#20354D" strokeWidth="9" strokeLinecap="round" /><path d="M-14 12L-34 22M13 13L26 36" stroke="#714B37" strokeWidth="8" strokeLinecap="round" /></g>
      <path d="M338 148C313 129 331 106 349 121C366 104 385 127 360 146L349 155Z" fill="#D98677" />
      <path d="M80 281V228M80 251Q49 251 55 229Q80 226 80 251M81 240Q112 238 107 215Q82 214 81 240" stroke="#146C78" strokeWidth="5" strokeLinecap="round" />
      <path d="M632 278V232M632 254Q608 251 610 232Q633 234 632 254M634 243Q658 241 657 223Q635 224 634 243" stroke="#146C78" strokeWidth="5" strokeLinecap="round" />
    </svg>
  </div>;
}

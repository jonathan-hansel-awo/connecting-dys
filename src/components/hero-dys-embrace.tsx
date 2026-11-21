import Image from "next/image";

// Background-removed and clarified original artwork, with its composition intact.
export function HeroDysEmbrace() {
  return <div className="hero-dys-embrace">
    <Image src="/images/dys-embrace-transparent.png" alt="Dysgraphia, dyslexia, dyspraxia and dyscalculia in coloured lettering around two embracing figures." width={1330} height={1182} sizes="(max-width: 760px) 88vw, (max-width: 1100px) 65vw, 42vw" preload />
  </div>;
}

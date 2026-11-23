import Image from "next/image";

// A self-contained conceptual scene stays legible in every reading theme.
export function BridgeArtwork() {
  return <div className="bridge-artwork editorial-scene">
    <Image src="/images/bridge-belonging.webp" alt="Illustration of three young people meeting on a coral bridge that connects two banks, with all figures grounded on the bridge." width={1536} height={1024} sizes="(max-width: 760px) 90vw, 45vw" />
  </div>;
}

import Image from "next/image";

export function PolicyArtwork() {
  return <div className="editorial-scene policy-artwork">
    <Image src="/images/policy-care.png" alt="Illustration of policy folders, an open book and a shield with a heart." width={1536} height={1024} sizes="(max-width: 760px) 60vw, 20vw" />
  </div>;
}

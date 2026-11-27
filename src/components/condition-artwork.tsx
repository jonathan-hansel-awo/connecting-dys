import Image from "next/image";

export function ConditionArtwork({ index }: { index: number }) {
  return <div className="condition-artwork" data-condition-art={index} aria-hidden="true"><Image src="/images/conditions-atlas.png" alt="" width={1536} height={1536} sizes="(max-width: 760px) 160vw, 640px" /></div>;
}

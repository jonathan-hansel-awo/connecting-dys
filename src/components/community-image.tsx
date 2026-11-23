import Image from "next/image";

export function CommunityImage() {
  return <div className="editorial-scene community-scene">
    <Image src="/images/community-conversation.webp" alt="Illustration of four young people listening and talking around a teal table in a warm, welcoming space." width={1536} height={1024} sizes="(max-width: 760px) 90vw, 45vw" />
  </div>;
}

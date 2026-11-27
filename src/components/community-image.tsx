import Image from "next/image";

export function CommunityImage({ variant = "conversation" }: { variant?: "conversation" | "involvement" }) {
  const involvement = variant === "involvement";
  return <div className="editorial-scene community-scene">
    <Image src={involvement ? "/images/community-library.png" : "/images/community-conversation.webp"} alt={involvement ? "Illustration of young people sharing stories, listening and welcoming one another in a library community space." : "Illustration of four young people listening and talking around a teal table in a warm, welcoming space."} width={1536} height={1024} sizes={involvement ? "(max-width: 760px) 90vw, 32vw" : "(max-width: 760px) 90vw, 45vw"} />
  </div>;
}

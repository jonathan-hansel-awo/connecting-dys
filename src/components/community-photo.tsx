import Image from "next/image";

export function CommunityPhoto({ scene = "shared" }: { scene?: "shared" | "reading" | "books" }) {
  const photos = {
    shared: { src: "/images/shared-reading.webp", alt: "Two people sitting together with an open book.", caption: "A moment of shared reading." },
    reading: { src: "/images/quiet-reading.webp", alt: "A person reading a book beside a colourful wall.", caption: "Room for your own way of discovering." },
    books: { src: "/images/exploring-books.webp", alt: "A person browsing books between library shelves.", caption: "Curiosity, at your own pace." },
  };
  const photo = photos[scene];
  return <figure className="community-photo"><Image src={photo.src} alt={photo.alt} width={900} height={1200} sizes="(max-width: 760px) 85vw, 38vw" /><figcaption>{photo.caption}</figcaption></figure>;
}

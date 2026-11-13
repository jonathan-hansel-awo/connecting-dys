import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ReadingPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" tabIndex={-1} className="reading-page wrap">
      <Link href="/" className="breadcrumb">
        <ArrowLeft size={17} aria-hidden="true" />
        Back to home
      </Link>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lede">{intro}</p>
      <div className="reading-body">{children}</div>
    </main>
  );
}

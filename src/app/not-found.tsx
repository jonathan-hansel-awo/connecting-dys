import Link from "next/link";
import { ReadingPage } from "@/components/reading-page";
export default function NotFound() {
  return (
    <ReadingPage
      eyebrow="Page not found"
      title="Let’s find your way back."
      intro="We couldn’t find that page. You can return home or explore support."
    >
      <Link href="/support" className="button button-teal">
        Explore support
      </Link>
    </ReadingPage>
  );
}

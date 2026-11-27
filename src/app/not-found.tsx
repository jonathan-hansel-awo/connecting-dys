import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="reading-page wrap">
      <header className="editorial-heading"><div><p className="eyebrow">Page not found</p><h1>Let’s find your way back.</h1></div></header>
      <p>
        This page could not be found. You can explore the homepage or find
        information and support.
      </p>
      <div className="article-links">
        <Link className="button" href="/">
          Go to homepage
        </Link>
        <Link className="text-link" href="/support">
          Find support
        </Link>
      </div>
    </main>
  );
}

import Image from "next/image";
import { ReadingSettings } from "@/components/reading-settings";
import Link from "next/link";

const learningDifferences = [
  {
    name: "Dyslexia",
    description: "Explore reading, writing and language differences.",
    color: "#E4F1EF",
  },
  {
    name: "Dyspraxia",
    description: "Understand differences in movement and coordination.",
    color: "#FBE8DF",
  },
  {
    name: "Dyscalculia",
    description: "Learn about differences in processing numbers.",
    color: "#FCEDD5",
  },
  {
    name: "Dysgraphia",
    description: "Discover differences affecting written expression.",
    color: "#E6EFF2",
  },
];

export default function HomePage() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-4"
      >
        Skip to main content
      </a>

      <header className="relative z-20 border-b border-[#20354D]/10">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5"
        >
          <Link href="/" className="text-xl font-bold tracking-tight">
            Connecting <span className="text-[#146C78]">Dys</span>
          </Link>

          <ReadingSettings />
        </nav>
      </header>

      <main id="main-content">
        <section
          aria-labelledby="hero-title"
          className="relative overflow-hidden px-6 py-20 lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            <div className="space-y-8">
              <span className="inline-flex rounded-full bg-[#DDEFEA] px-5 py-2 text-sm font-semibold text-[#20354D]">
                You belong here
              </span>

              <h1
                id="hero-title"
                className="max-w-2xl text-5xl font-bold leading-tight tracking-tight md:text-6xl"
              >
                A home for every{" "}
                <span className="text-[#146C78]">DYS mind.</span>
              </h1>

              <p className="reading-content text-lg">
                Connecting Dys is a welcoming community for young people with
                dyslexia, dyspraxia, dyscalculia and dysgraphia.
              </p>

              <p className="reading-content">
                A place to feel understood, discover support and connect with
                people who share your experiences.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="#community"
                  className="rounded-full bg-[#146C78] px-7 py-4 font-semibold text-white transition-colors hover:bg-[#105762]"
                >
                  Discover our community
                </a>

                <a
                  href="#explore"
                  className="rounded-full border-2 border-[#20354D] px-7 py-4 font-semibold"
                >
                  Explore support
                </a>
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute -inset-5 rounded-[3rem] bg-[#EAB85C]/20 blur-3xl"
                aria-hidden="true"
              />

              <div className="relative overflow-hidden rounded-[2.5rem] shadow-xl">
                <Image
                  src="/brand/connecting-dys-logo.png"
                  alt="Connecting Dys logo showing two people embracing inside a heart"
                  width={1536}
                  height={1024}
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="explore"
          aria-labelledby="explore-title"
          className="bg-[#E8F3F0] px-6 py-24"
        >
          <div className="mx-auto max-w-7xl">
            <h2
              id="explore-title"
              className="mb-4 text-3xl font-bold md:text-4xl"
            >
              Different experiences. One community.
            </h2>

            <p className="reading-content mb-12">
              Explore the learning differences represented within Connecting
              Dys.
            </p>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {learningDifferences.map((item) => (
                <article
                  key={item.name}
                  className="rounded-3xl p-7"
                  style={{ backgroundColor: item.color }}
                >
                  <h3 className="mb-4 text-2xl font-bold">{item.name}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="community"
          aria-labelledby="community-title"
          className="px-6 py-24"
        >
          <div className="mx-auto max-w-4xl text-center">
            <h2 id="community-title" className="mb-6 text-4xl font-bold">
              There&apos;s room for you here.
            </h2>

            <p className="mx-auto max-w-2xl text-lg">
              Everyone&apos;s experience is different. No one should have to face it
              alone.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

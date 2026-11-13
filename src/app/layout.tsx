import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { preferenceBootstrap } from "@/lib/preferences";
import "lenis/dist/lenis.css";
import "./globals.css";

const openSans = localFont({
  src: "../../public/fonts/open-sans-latin-variable.woff2",
  variable: "--font-open-sans",
  display: "swap",
  weight: "300 800",
});
const nunito = localFont({
  src: "../../public/fonts/nunito-sans-latin-variable.woff2",
  variable: "--font-heading",
  display: "swap",
  weight: "200 900",
});
export const metadata: Metadata = {
  icons: { icon: "/brand/connecting_dys_logo.png" },
  title: {
    default: "Connecting Dys | A home for every DYS mind.",
    template: "%s | Connecting Dys",
  },
  description:
    "A community for teenagers and young adults navigating dyslexia, dyspraxia, dyscalculia and dysgraphia. Connecting Dys CIC: a home for every DYS mind.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${openSans.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="reading-preferences"
          dangerouslySetInnerHTML={{ __html: preferenceBootstrap }}
        />
      </head>
      <body>
        <SmoothScrollProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

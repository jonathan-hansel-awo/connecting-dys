import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { preferenceBootstrap } from "@/lib/preferences";
import "lenis/dist/lenis.css";
import "./globals.css";
import "../styles/surfaces.css";
import "../styles/hero-transition.css";
import "../styles/discovery.css";

const openSans = localFont({
  src: [
    { path: "../fonts/open-sans-regular.woff2", weight: "400" },
    { path: "../fonts/open-sans-semibold.woff2", weight: "600" },
  ],
  variable: "--font-open-sans",
  display: "swap",
  fallback: ["Arial"],
});
const nunitoSans = localFont({
  src: "../fonts/nunito-sans-extrabold.woff2",
  variable: "--font-nunito-sans",
  weight: "800",
  display: "swap",
  fallback: ["Arial"],
});
export const metadata: Metadata = {
  title: {
    default: "Connecting Dys | A home for every DYS mind.",
    template: "%s | Connecting Dys",
  },
  icons: { icon: "/brand/connecting_dys_logo.png" },
  description:
    "A home for every DYS mind. Connecting Dys CIC is building a community for teenagers and young adults navigating dyslexia, dyspraxia, dyscalculia and dysgraphia.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${openSans.variable} ${nunitoSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceBootstrap }} />
      </head>
      <body className="surface-paper">
        <SmoothScrollProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

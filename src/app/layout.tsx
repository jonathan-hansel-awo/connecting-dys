import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";


export const metadata: Metadata = {
  title: "Connecting Dys",
  description: "A home for dys minds",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

/**
 * Noto Sans Georgian (variable), with a real Georgian subset drawn for the
 * script plus Latin and numerals in the same family. Loaded here so Georgian
 * text never falls back to a system font (see DESIGN_SYSTEM.md §2).
 */
const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  display: "swap",
  variable: "--font-sans",
});

const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Accelerate",
  description: "მომწოდებლები და რესტორნები — ერთ სივრცეში.",
  openGraph: {
    title: "Accelerate",
    description: "მომწოდებლები და რესტორნები — ერთ სივრცეში.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka" className={notoSansGeorgian.variable}>
      <body className="min-h-dvh bg-surface text-ink">
        {/* Below sm: edge-to-edge, exactly as before — this is what a buyer
           or supplier sees on their phone. sm and up (a laptop screen during
           a pitch): the mobile column reads as a deliberate app frame instead
           of a sliver of content lost in an otherwise-blank browser window.
           576px = Screen's own 520px column + its sm:px-6 padding. The two
           floating demo controls (PersonaSwitcher, CartBar) read this same
           576px constant to stay pinned to *this* frame's corners instead of
           the browser window's, once the two stop being the same box. */}
        <div className="mx-auto min-h-dvh w-full bg-paper sm:my-8 sm:max-w-[576px] sm:rounded-2xl sm:border sm:border-line sm:shadow-float md:my-12">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}

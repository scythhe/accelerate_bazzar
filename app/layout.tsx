import type { Metadata, Viewport } from "next";
import { Fraunces, Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
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

/** Headings. A serif with real Georgian drawing gives the app a voice of its
 *  own, the way a printed menu or market sign would. */
const notoSerifGeorgian = Noto_Serif_Georgian({
  subsets: ["georgian", "latin"],
  display: "swap",
  variable: "--font-display",
});

/** The wordmark only — soft, warm, a little old-world. */
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-logo",
});

const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Bazzar",
  description: "მომწოდებლები და რესტორნები — ერთ სივრცეში.",
  openGraph: {
    title: "Bazzar",
    description: "მომწოდებლები და რესტორნები — ერთ სივრცეში.",
    type: "website",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7e1f2e",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ka"
      className={`${notoSansGeorgian.variable} ${notoSerifGeorgian.variable} ${fraunces.variable}`}
    >
      <body className="min-h-dvh bg-canvas text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

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
      <body className="min-h-dvh bg-paper text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

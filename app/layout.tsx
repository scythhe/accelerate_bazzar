import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accelerate",
  description: "მომწოდებლები და რესტორნები — ერთ სივრცეში.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbfbf9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body className="min-h-dvh bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}

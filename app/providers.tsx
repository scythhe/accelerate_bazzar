"use client";

import { DemoProvider } from "@/lib/store/DemoContext";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { CartBar } from "@/components/CartBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      {children}
      <CartBar />
      <PersonaSwitcher />
    </DemoProvider>
  );
}

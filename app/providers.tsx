"use client";

import { DemoProvider } from "@/lib/store/DemoContext";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { CartBar } from "@/components/CartBar";
import { Toast } from "@/components/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      {children}
      <Toast />
      <CartBar />
      <PersonaSwitcher />
    </DemoProvider>
  );
}

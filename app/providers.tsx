"use client";

import { DemoProvider } from "@/lib/store/DemoContext";
import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { CartBar } from "@/components/CartBar";
import { Toast } from "@/components/Toast";
import { Sidebar } from "@/components/screens/Sidebar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <div className="lg:flex lg:min-h-dvh">
        <Sidebar />
        <div className="lg:min-w-0 lg:flex-1">{children}</div>
      </div>
      <Toast />
      <CartBar />
      <PersonaSwitcher />
    </DemoProvider>
  );
}

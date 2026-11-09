"use client";

import { useEffect } from "react";
import { DemoProvider, useDemo } from "@/lib/store/DemoContext";
import { CartBar } from "@/components/CartBar";
import { Toast } from "@/components/Toast";
import { AppBar } from "@/components/screens/AppBar";
import { Login } from "@/components/screens/Login";
import { Sidebar } from "@/components/screens/Sidebar";
import { TabBar } from "@/components/screens/TabBar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <AuthGate>{children}</AuthGate>
    </DemoProvider>
  );
}

// A gate rather than a /login route: a deep link survives signing in, and there
// is no redirect to wait through. Renders nothing until stored state is read so
// a returning user never sees the login screen flash.
function AuthGate({ children }: { children: React.ReactNode }) {
  const { hydrated, loggedIn, persona } = useDemo();

  // On the root element so portalled sheets pick up the band colour too.
  useEffect(() => {
    document.documentElement.dataset.persona = persona;
  }, [persona]);

  if (!hydrated) return null;
  if (!loggedIn) return <Login />;

  return (
    <>
      <div className="lg:flex lg:min-h-dvh">
        <Sidebar />
        <div className="lg:min-w-0 lg:flex-1">
          <AppBar />
          {children}
        </div>
      </div>
      <Toast />
      <CartBar />
      <TabBar />
    </>
  );
}

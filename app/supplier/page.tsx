"use client";

import { useEffect } from "react";
import { SupplierInbox } from "@/components/screens/SupplierInbox";
import { useDemo } from "@/lib/store/DemoContext";

// Direct route to the supplier inbox — flips the persona if reached directly so
// the switcher and route guards stay consistent.
export default function SupplierPage() {
  const { persona, setPersona } = useDemo();

  useEffect(() => {
    if (persona !== "supplier") setPersona("supplier");
  }, [persona, setPersona]);

  return <SupplierInbox />;
}

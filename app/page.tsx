"use client";

import { useDemo } from "@/lib/store/DemoContext";
import { BuyerHome } from "@/components/screens/BuyerHome";
import { SupplierInbox } from "@/components/screens/SupplierInbox";

// The app opens straight into a live persona — no auth. Root renders the buyer
// home or the supplier inbox depending on who is active (DEMO_PROMPT.md).
export default function RootPage() {
  const { persona } = useDemo();
  return persona === "buyer" ? <BuyerHome /> : <SupplierInbox />;
}

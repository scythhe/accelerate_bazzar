"use client";

import { useDemo } from "@/lib/store/DemoContext";
import { BuyerHome } from "@/components/screens/BuyerHome";
import { SupplierInbox } from "@/components/screens/SupplierInbox";

// Root renders the buyer home or the supplier inbox depending on who is active.
export default function RootPage() {
  const { persona } = useDemo();
  return persona === "buyer" ? <BuyerHome /> : <SupplierInbox />;
}

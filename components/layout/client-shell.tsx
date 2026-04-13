"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/header";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import Footer from "./footer";

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
    </>
  );
}
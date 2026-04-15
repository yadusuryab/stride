import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import React from "react";
import { Preloader } from "@/components/ui/preloader";
import { ClientShell } from "@/components/layout/client-shell";

// ─── Fonts ────────────────────────────────────────────────────────────────────

const dmSans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const OG_IMAGE = process.env.NEXT_PUBLIC_OG_IMAGE || "/default-og.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: `${process.env.NEXT_PUBLIC_APP_NAME} | ${process.env.NEXT_PUBLIC_BRAND_DESC}`,
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  },
  description: `${process.env.NEXT_PUBLIC_APP_NAME} is ${process.env.NEXT_PUBLIC_BRAND_DESC}. Shop ${process.env.NEXT_PUBLIC_PRODUCT_DESC} at affordable prices.`,
  keywords: [
    process.env.NEXT_PUBLIC_APP_NAME || "",
    process.env.NEXT_PUBLIC_BRAND_DESC || "",
    process.env.NEXT_PUBLIC_PRODUCT_DESC || "",
    "Online Store",
    "Kerala Shopping",
    "Affordable Products",
  ],
  openGraph: {
    title: `${process.env.NEXT_PUBLIC_APP_NAME} | ${process.env.NEXT_PUBLIC_BRAND_DESC}`,
    description: `${process.env.NEXT_PUBLIC_APP_NAME} – Shop ${process.env.NEXT_PUBLIC_PRODUCT_DESC}. Premium quality at the best prices.`,
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${process.env.NEXT_PUBLIC_APP_NAME} Collection` }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: `${process.env.NEXT_PUBLIC_APP_NAME} – ${process.env.NEXT_PUBLIC_BRAND_DESC}.`,
    images: [OG_IMAGE],
  },
  authors: [{ name: "shopigo", url: "https://myshopigo.shop" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${dmSans.variable}
          ${cormorant.variable}
          ${dmMono.variable}
          font-sans antialiased
        `}
      >
        <Preloader />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <ClientShell>{children}</ClientShell>
          </div>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
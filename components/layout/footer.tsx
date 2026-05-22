import React from "react";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import BrandIcon from "../utils/brand-icon";
import Brand from "../utils/brand";

const NAV_LINKS = [
  { href: "/terms",                           label: "Terms"       },
  { href: "/contact",                         label: "Contact"     },
  { href: "/privacy",           label: "Privacy", external: true },
  { href: "/cookies",           label: "Cookies", external: true },

  { href: process.env.NEXT_PUBLIC_INSTA || "#", label: "Instagram", external: true },
  {
    href: `https://wa.me/${process.env.NEXT_PUBLIC_PHONE}`,
    label: "WhatsApp",
    external: true,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-10 border-t border-zinc-100 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-5 flex flex-col gap-4">

        {/* ── Row 1: brand + nav links ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <Brand />
          <span className="hidden sm:block w-px h-4 bg-zinc-200 shrink-0" />
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {NAV_LINKS.map(({ href, label, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className="text-xs text-zinc-400 hover:text-zinc-800 transition-colors duration-150 whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Row 2: phone · copyright · crafted by ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-3 border-t border-zinc-100">

          <Link
            href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-150"
          >
            <PhoneCall size={13} className="shrink-0" />
            {process.env.NEXT_PUBLIC_PHONE}
          </Link>

          <p className="text-xs text-zinc-400">
            &copy; {year} {process.env.NEXT_PUBLIC_APP_NAME}
          </p>

          <Link
            href="https://instagram.com/yaduecom"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-400 hover:text-zinc-700 transition-colors duration-150 whitespace-nowrap"
          >
            crafted by{" "}
            <span className="font-semibold text-zinc-600">yaduecom</span>
          </Link>

        </div>
      </div>
    </footer>
  );
}
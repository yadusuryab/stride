"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "https://wa.me/919562124798";
const NUMBER = "+91 9562124798";

export function WhatsAppButton() {
  const [phase, setPhase] = useState<"hidden" | "expanded" | "icon">("hidden");
  const [hovered, setHovered] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // 1. Appear after page loads
    const t1 = setTimeout(() => setPhase("expanded"), 1400);
    // 2. Collapse to icon after 3.2s
    const t2 = setTimeout(() => setPhase("icon"), 4600);
    // 3. Pulse every 8s to attract attention
    const t3 = setTimeout(() => {
      const interval = setInterval(() => {
        setPulse(true);
        setTimeout(() => setPulse(false), 1000);
      }, 8000);
      return () => clearInterval(interval);
    }, 6000);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const isExpanded = phase === "expanded" || hovered;

  if (phase === "hidden") return null;

  return (
    <>
      <style>{`
        @keyframes wa-enter {
          from { opacity: 0; transform: translateY(16px) scale(0.85); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wa-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.45); }
          60%  { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        @keyframes wa-icon-bounce {
          0%,100% { transform: scale(1); }
          30%     { transform: scale(1.18) rotate(-8deg); }
          60%     { transform: scale(0.95) rotate(4deg); }
        }
        .wa-btn {
          animation: wa-enter 0.55s cubic-bezier(0.16,1,0.3,1) both;
        }
        .wa-btn.pulse {
          animation: wa-pulse 1s ease-out;
        }
        .wa-icon-bounce:hover svg {
          animation: wa-icon-bounce 0.5s ease;
        }
      `}</style>

      <div
        className={`wa-btn fixed bottom-6 right-5 z-[100] ${pulse ? "pulse" : ""}`}
        style={{ filter: "drop-shadow(0 8px 24px rgba(37,211,102,0.28))" }}
      >
        <Link
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`wa-icon-bounce flex items-center gap-0 overflow-hidden
            bg-[#22c55e] hover:bg-[#16a34a]
            rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.35)]
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            active:scale-95
            ${isExpanded
              ? "pl-4 pr-5 py-3 gap-2.5"
              : "w-[52px] h-[52px] justify-center"
            }`}
          style={{
            maxWidth: isExpanded ? 260 : 52,
          }}
        >
          {/* WhatsApp SVG icon */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-white shrink-0"
            style={{
              width: isExpanded ? 20 : 24,
              height: isExpanded ? 20 : 24,
              transition: "width 0.4s ease, height 0.4s ease",
            }}
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>

          {/* Expanded label */}
          <span
            className="text-white font-medium whitespace-nowrap overflow-hidden"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              letterSpacing: "0.01em",
              maxWidth: isExpanded ? 180 : 0,
              opacity: isExpanded ? 1 : 0,
              transition: "max-width 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
            }}
          >
            {NUMBER}
          </span>
        </Link>

        {/* Online indicator dot */}
        <span
          className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-white
            flex items-center justify-center"
          style={{
            opacity: !isExpanded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
        </span>
      </div>
    </>
  );
}
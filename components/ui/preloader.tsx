"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MIN_DISPLAY_MS = 1000;

export function Preloader() {
  const [visible, setVisible] = useState(true);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const start = Date.now();

    const dismiss = () => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(() => {
        setHiding(true);
        setTimeout(() => setVisible(false), 700);
      }, remaining);
    };
    
    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss, { once: true });
      return () => window.removeEventListener("load", dismiss);
    }
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes pl-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pl-infinite-progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pl-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        .pl-wrap {
          animation: pl-fade-up 0.5s ease both;
        }
        .pl-progress-container {
          width: 240px;
          height: 2px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
          position: relative;
        }
        .pl-progress-bar {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 60%;
          background: var(--color-primary, #f0c040);
          border-radius: 2px;
          animation: pl-infinite-progress 1.5s ease-in-out infinite;
        }
        .pl-dots {
          display: flex;
          gap: 6px;
          margin-top: 12px;
        }
        .pl-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,0.6);
          animation: pl-pulse 1.4s ease-in-out infinite;
        }
        .pl-dot:nth-child(1) { animation-delay: 0s; }
        .pl-dot:nth-child(2) { animation-delay: 0.2s; }
        .pl-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div
        aria-hidden="true"
        className="bg-primary"
        style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hiding ? 0 : 1,
          transition: "opacity 700ms ease",
          pointerEvents: hiding ? "none" : "auto",
        }}
      >
        <div
          className="pl-wrap"
          style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 28,
            opacity: hiding ? 0 : 1,
            transform: hiding ? "scale(0.96)" : "scale(1)",
            transition: "transform 600ms ease, opacity 600ms ease",
          }}
        >
          <Image alt="Stride" src="/stlbc.png" height={50} width={100} />

          {/* Infinite Progress Bar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div className="pl-progress-container">
              <div className="pl-progress-bar" />
            </div>
            
            {/* Animated dots instead of percentage */}
            <div className="pl-dots">
              <div className="pl-dot" />
              <div className="pl-dot" />
              <div className="pl-dot" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
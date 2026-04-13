"use client";

import { useEffect, useState } from "react";
import Brand from "../utils/brand";

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
        @keyframes pl-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pl-sec {
          to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes pl-min {
          to { transform: translateX(-50%) rotate(360deg); }
        }
        @keyframes pl-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pl-arc {
          position: absolute; inset: 0; border-radius: 50%;
          border: 1.5px solid transparent;
          border-top-color: var(--color-primary);
          border-right-color: var(--color-primary);
          animation: pl-spin 1.4s cubic-bezier(0.4,0,0.2,1) infinite;
        }
        .pl-hand-min {
          position: absolute; bottom: 50%; left: 50%;
          width: 1px; height: 12px;
          background: rgba(255,255,255,0.85);
          transform-origin: bottom center;
          animation: pl-min 10s linear infinite;
        }
        .pl-hand-sec {
          position: absolute; bottom: 50%; left: 50%;
          width: 1px; height: 13px;
          background: #f0c040;
          transform-origin: bottom center;
          animation: pl-sec 1s linear infinite;
        }
        .pl-wrap {
          animation: pl-fade-up 0.5s ease both;
        }
      `}</style>

      <div
        aria-hidden="true"
        className="bg-primary/10 backdrop-blur-3xl "
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
          <Brand />

          {/* Watch dial */}
          <div style={{ position: "relative", width: 72, height: 72 }}>
            {/* Track ring */}
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "1px solid var(--color-border-tertiary)",
            }} />
            {/* Spinning arc */}
            <div className="pl-arc" />
            {/* Dial face */}
            <div style={{
              position: "absolute", inset: 10, borderRadius: "50%",
              background: "var(--color-primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 60 60">
                {[[30,4,30,8],[30,52,30,56],[4,30,8,30],[52,30,56,30]].map(([x1,y1,x2,y2], i) => (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                ))}
              </svg>
              <div style={{ position: "relative", width: 34, height: 34 }}>
                {/* Hour hand — fixed ~10 o'clock */}
                <div style={{
                  position: "absolute", bottom: "50%", left: "50%",
                  width: 1, height: 9, background: "rgba(255,255,255,0.85)",
                  transformOrigin: "bottom center",
                  transform: "translateX(-50%) rotate(-60deg)",
                }} />
                <div className="pl-hand-min" />
                <div className="pl-hand-sec" />
                {/* Center pip */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  width: 3, height: 3, borderRadius: "50%",
                  background: "#f0c040",
                  transform: "translate(-50%, -50%)",
                }} />
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12, letterSpacing: "0.12em" }} className="text-muted-foreground uppercase">
            Loading
          </p>
        </div>
      </div>
    </>
  );
}
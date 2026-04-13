"use client";

import React from "react";

const items = [
  "Free shipping on orders paid online",
  "Handpicked fashion, curated just for you",
  "Secure checkout · 100% safe payments",
  "Free shipping on orders paid online",
  "Handpicked fashion, curated just for you",
  "Secure checkout · 100% safe payments",
];
const Dot = () => (
  <span className="inline-block w-1 h-1 rounded-full bg-white/25 mx-5 align-middle flex-shrink-0" />
);

export default function MarqueeStrip() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 28s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="w-full border-y  bg-primary overflow-hidden py-2.5 select-none">
        <div className="flex items-center whitespace-nowrap marquee-track">
          {items.map((text, i) => (
            <React.Fragment key={i}>
              <span className="text-[10.5px] tracking-[0.13em] uppercase font-medium text-white flex-shrink-0">
                {text}
              </span>
              <Dot />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
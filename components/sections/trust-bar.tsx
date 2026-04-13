"use client";

import React, { useEffect, useRef, useState } from "react";
import { RotateCcw, ShieldCheck, Headphones, Verified } from "lucide-react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const badges = [
  { icon: Verified,    title: "Premium Products", desc: "Quality products at affordable price.",        tag: "01" },
  { icon: RotateCcw,   title: "Easy Returns",     desc: "Hassle-free returns for defective items.",    tag: "02" },
  { icon: ShieldCheck, title: "Secure Checkout",  desc: "100% protected payments, always.",            tag: "03" },
  { icon: Headphones,  title: "24h Support",      desc: "We're here whenever you need us.",            tag: "04" },
];

export default function TrustBar() {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @keyframes trustSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .trust-item { opacity: 0; }
        .trust-item.in { animation: trustSlideIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }

        @keyframes expandSlash {
          from { width: 0; }
          to   { width: 20px; }
        }
        .trust-slash { width: 0; }
        .trust-item.in .trust-slash {
          animation: expandSlash 0.4s ease forwards;
        }
      `}</style>

      <section className="px-4 py-5 ">
        <div ref={ref} className="relative bg-white overflow-hidden ">

          {/* Diagonal grid texture */}
      

          <div className="grid grid-cols-2 md:grid-cols-4">
            {badges.map(({ icon: Icon, title, desc, tag }, i) => {
              const isHov = hovered === i;
              const borderR = i !== badges.length - 1 ? "border-r border-neutral-800" : "";
              const borderB = i < 2 ? "border-b border-neutral-800" : "";

              return (
                <div
                  key={i}
                  className={`trust-item ${visible ? "in" : ""} bg-secondary relative flex flex-col gap-3.5 p-6 md:p-7 cursor-default transition-colors duration-300  ${isHov ? "bg-orange-500/5" : "bg-transparent"}`}
                  style={{ animationDelay: `${i * 90}ms` }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Tag — top right */}
                  <span
                    className="absolute top-3 right-3.5 text-[8px] font-black tracking-[0.25em] text-neutral-700"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    {tag}
                  </span>

                  {/* Icon box */}
                  <div
                    className={`w-10 h-10 rounded-sm flex items-center justify-center border transition-all duration-300 ${
                      isHov
                        ? "border-orange-500/60 bg-orange-500/10"
                        : "border-neutral-700 bg-transparent"
                    }`}
                    style={{ transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, background 0.3s", transform: isHov ? "scale(1.1) rotate(-4deg)" : "scale(1)" }}
                  >
                    <Icon
                      size={15}
                      strokeWidth={2}
                      className={`transition-colors duration-300 ${isHov ? "text-orange-400" : "text-neutral-500"}`}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                    
                      <p className=" text-md font-bold tracking-tighter m-0 leading-none">
                        {title}
                      </p>
                    </div>
                    <p className="text-[9.5px] font-semibold tracking-wider uppercase text-mute m-0 leading-relaxed ">
                      {desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
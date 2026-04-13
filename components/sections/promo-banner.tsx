"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type PromoBannerProps = {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaHref?: string;
  imageUrl?: string;
  tag?: string;
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function PromoBanner({
  heading = "The New Season\nIs Here.",
  subheading = "Discover the latest drops — curated pieces built for the modern wardrobe.",
  ctaText = "Shop the Collection",
  ctaHref = "/products",
  imageUrl = "/hero.avif",
  tag = "SS '25",
}: PromoBannerProps) {
  const { ref, visible } = useReveal();
  const [hovered, setHovered] = useState(false);

  // Split heading into lines for staggered reveal
  const lines = heading.split("\n");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=DM+Mono:wght@300;400&display=swap');

        @keyframes lineReveal {
          from { clip-path: inset(0 100% 0 0); opacity: 0; }
          to   { clip-path: inset(0 0% 0 0);   opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes expandW {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes scaleY {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }

        .promo-cta:hover {
          gap: 14px;
          letter-spacing: 0.18em;
        }
        .promo-cta {
          transition: gap 0.3s ease, letter-spacing 0.3s ease, background 0.3s ease, color 0.3s ease;
        }
        .promo-cta:hover {
          background: #11443d !important;
          color: #111 !important;
        }
        .promo-cta:hover .cta-arrow {
          transform: rotate(12deg) scale(1.1);
        }
        .cta-arrow {
          transition: transform 0.3s ease;
        }
      `}</style>

      <section
        ref={ref}
        style={{ padding: "16px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            background: "#0e0e0e",
            overflow: "hidden",
            position: "relative",
            minHeight: "520px",
          }}
        >
          <style>{`
            @media (min-width: 768px) {
              .promo-grid { grid-template-columns: 1fr 1fr !important; min-height: 560px !important; }
              .promo-img-col { display: block !important; }
              .promo-text-col { padding: 56px 48px !important; }
            }
          `}</style>

          {/* ── Left: Text column ── */}
          <div
            className="promo-text-col"
            style={{
              padding: "44px 28px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 2,
              borderRight: "1px solid rgba(201,168,76,0.18)",
            }}
          >
            {/* Top row: tag + rule */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease 0.1s",
              }}
            >
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#11443d",
                  opacity: 0.85,
                }}
              >
                {tag}
              </span>
              {/* Animated rule */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(201,168,76,0.4)",
                  animation: visible ? "expandW 0.8s ease 0.3s forwards" : "none",
                  width: 0,
                  flex: 1,
                }}
              />
            </div>

            {/* Heading — staggered per line */}
            <div style={{ margin: "auto 0", padding: "32px 0 28px" }}>
              {lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    overflow: "hidden",
                    lineHeight: 1.05,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontSize: "clamp(36px, 6vw, 68px)",
                      fontWeight: 400,
                      fontStyle: i % 2 === 1 ? "italic" : "normal",
                      color: "#f5f0e8",
                      margin: 0,
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                      animation: visible
                        ? `lineReveal 0.75s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.15}s forwards`
                        : "none",
                      opacity: 0,
                    }}
                  >
                    {line}
                  </h2>
                </div>
              ))}

              {/* Gold underline */}
              <div
                style={{
                  height: "1px",
                  background: "linear-gradient(to right, #11443d, transparent)",
                  marginTop: "20px",
                  animation: visible ? "expandW 1s ease 0.6s forwards" : "none",
                  width: 0,
                }}
              />
            </div>

            {/* Bottom: subheading + CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "10.5px",
                  lineHeight: 1.7,
                  color: "rgba(245,240,232,0.45)",
                  letterSpacing: "0.04em",
                  margin: 0,
                  maxWidth: "340px",
                  animation: visible ? "fadeUp 0.6s ease 0.55s forwards" : "none",
                  opacity: 0,
                }}
              >
                {subheading}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  animation: visible ? "fadeUp 0.6s ease 0.65s forwards" : "none",
                  opacity: 0,
                }}
              >
                <Link
                  href={ctaHref}
                  className="promo-cta bg-primary "
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px 24px",
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "9px",
                    fontWeight: 400,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  {ctaText}
                  <ArrowUpRight size={11} className="cta-arrow" />
                </Link>

                {/* Secondary text link */}
                <Link
                  href="/products"
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.3)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(245,240,232,0.15)",
                    paddingBottom: "2px",
                    transition: "color 0.3s ease, border-color 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.7)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,240,232,0.4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(245,240,232,0.3)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,240,232,0.15)";
                  }}
                >
                  Browse all
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right: Image column (hidden on mobile) ── */}
          <div
            className="promo-img-col"
            style={{
              display: "none",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Wipe-in reveal curtain */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "#0e0e0e",
                transformOrigin: "left",
                transform: visible ? "scaleX(0)" : "scaleX(1)",
                transition: "transform 0.9s cubic-bezier(0.76,0,0.24,1) 0.3s",
                zIndex: 3,
              }}
            />

            <Image
              src={imageUrl}
              alt="Promo banner"
              fill
              className="object-cover"
              style={{
                transform: hovered ? "scale(1.06)" : "scale(1.02)",
                transition: "transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)",
                filter: "grayscale(20%) contrast(1.05)",
              }}
              priority
            />

            {/* Dark gradient left-fade to blend with text col */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(14,14,14,0.5) 0%, transparent 40%)",
                zIndex: 1,
              }}
            />

            {/* Bottom overlay: vertical copy */}
            <div
              style={{
                position: "absolute",
                bottom: "28px",
                right: "22px",
                zIndex: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "6px",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease 1s",
              }}
            >
              <div
                style={{
                  width: "1px",
                  height: "36px",
                  background: "rgba(201,168,76,0.5)",
                  animation: visible ? "scaleY 0.6s ease 1.1s forwards" : "none",
                  transformOrigin: "top",
                  transform: "scaleY(0)",
                }}
              />
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "8px",
                  letterSpacing: "0.25em",
                  color: "rgba(201,168,76,0.6)",
                  textTransform: "uppercase",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                  transform: "rotate(180deg)",
                }}
              >
                Collection {tag}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
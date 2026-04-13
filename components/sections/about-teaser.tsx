"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

type AboutTeaserProps = {
  imageUrl?: string;
  tag?: string;
  heading?: string;
  body?: string;
  ctaText?: string;
  ctaHref?: string;
  stat1?: { value: string; label: string };
  stat2?: { value: string; label: string };
  stat3?: { value: string; label: string };
};

export default function AboutTeaser({
  imageUrl = "/hero.avif",
  tag = "Our Story",
  heading = "Designed for the\nmodern wardrobe.",
  body = "We believe fashion should feel effortless. Every piece in our collection is thoughtfully sourced — quality fabrics, considered cuts, and a commitment to lasting style over passing trends.",
  ctaText = "Learn more",
  ctaHref = "/about",
  stat1 = { value: "500+", label: "Curated styles" },
  stat2 = { value: "30k+", label: "Happy customers" },
  stat3 = { value: "4.9★", label: "Avg. rating" },
}: AboutTeaserProps) {
  const { ref, visible } = useReveal();
  const lines = heading.split("\n");
  const stats = [stat1, stat2, stat3];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

        @keyframes aboutWipeX {
          from { clip-path: inset(0 0 0 100%); opacity: 0; }
          to   { clip-path: inset(0 0 0 0%);   opacity: 1; }
        }
        @keyframes aboutFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes aboutExpandH {
          from { width: 0; }
          to   { width: 100%; }
        }
        @keyframes aboutExpandV {
          from { height: 0; }
          to   { height: 100%; }
        }
        @keyframes aboutCountUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .about-cta-link:hover .about-cta-arrow {
          transform: translate(2px, -2px);
        }
        .about-cta-arrow {
          transition: transform 0.3s ease;
        }
        .about-stat:hover .about-stat-val {
          color: #11443d;
          transition: color 0.3s ease;
        }
      `}</style>

      <section
        ref={ref}
        style={{ padding: "16px", background: "#f8f4ee" }}
      >
        {/* ── Full-bleed image container with overlaid content ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            minHeight: "600px",
            overflow: "hidden",
            background: "#0e0e0e",
          }}
        >
          {/* Background image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: visible ? "scale(1.03)" : "scale(1.1)",
              transition: `transform ${visible ? "9s" : "0s"} cubic-bezier(0.25,0.46,0.45,0.94)`,
            }}
          >
            <Image
              src={imageUrl}
              alt="About our brand"
              fill
              style={{
                objectFit: "cover",
                objectPosition: "center",
                filter: "grayscale(15%) brightness(0.75) contrast(1.05)",
              }}
            />
          </div>

          {/* Gradient overlays */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(14,14,14,0.92) 0%, rgba(14,14,14,0.55) 55%, rgba(14,14,14,0.2) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(14,14,14,0.6) 0%, transparent 50%)",
            }}
          />

          {/* Diagonal grain texture */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 10px)",
              pointerEvents: "none",
            }}
          />

          {/* ── Vertical gold rule — left gutter ── */}
          <div
            style={{
              position: "absolute",
              left: "32px",
              top: "10%",
              bottom: "10%",
              width: "1px",
              background: "linear-gradient(to bottom, transparent, #11443d 30%, #11443d 70%, transparent)",
              transformOrigin: "top",
              animation: visible ? "aboutExpandV 0.8s ease 0.3s forwards" : "none",
              transform: "scaleY(0)",
              opacity: 0.5,
            }}
          />

          {/* ── Main content ── */}
          <div
            style={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "600px",
              padding: "48px 28px 44px 56px",
              maxWidth: "600px",
            }}
          >
            {/* Top: tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.5s ease 0.15s",
              }}
            >
              <span
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "9px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "#11443d",
                }}
              >
                {tag}
              </span>
              <div
                style={{
                  height: "1px",
                  background: "rgba(201,168,76,0.4)",
                  animation: visible ? "aboutExpandH 0.8s ease 0.35s forwards" : "none",
                  width: 0,
                  minWidth: "40px",
                  maxWidth: "80px",
                }}
              />
            </div>

            {/* Middle: heading + body */}
            <div style={{ padding: "40px 0 32px" }}>
              {/* Heading lines */}
              <div style={{ marginBottom: "24px" }}>
                {lines.map((line, i) => (
                  <div key={i} style={{ overflow: "hidden" }}>
                    <h2
                      style={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: "clamp(38px, 6.5vw, 72px)",
                        fontWeight: 400,
                        fontStyle: i % 2 === 1 ? "italic" : "normal",
                        color: "#f5f0e8",
                        margin: 0,
                        lineHeight: 1.05,
                        letterSpacing: "-0.015em",
                        animation: visible
                          ? `aboutFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) ${0.25 + i * 0.12}s forwards`
                          : "none",
                        opacity: 0,
                      }}
                    >
                      {line}
                    </h2>
                  </div>
                ))}
              </div>

              {/* Body text */}
              <p
                style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "10px",
                  lineHeight: 1.85,
                  letterSpacing: "0.04em",
                  color: "rgba(245,240,232,0.38)",
                  maxWidth: "380px",
                  margin: 0,
                  animation: visible ? "aboutFadeUp 0.65s ease 0.5s forwards" : "none",
                  opacity: 0,
                }}
              >
                {body}
              </p>
            </div>

            {/* Bottom: stats + CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Stats — horizontal ruled strip */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  borderTop: "1px solid rgba(201,168,76,0.2)",
                  borderBottom: "1px solid rgba(201,168,76,0.2)",
                  padding: "20px 0",
                  animation: visible ? "aboutFadeUp 0.6s ease 0.6s forwards" : "none",
                  opacity: 0,
                }}
              >
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="about-stat"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                      paddingLeft: i > 0 ? "20px" : "0",
                      borderLeft: i > 0 ? "1px solid rgba(201,168,76,0.15)" : "none",
                    }}
                  >
                    <span
                      className="about-stat-val"
                      style={{
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontSize: "clamp(26px, 4vw, 36px)",
                        fontWeight: 300,
                        color: "#f5f0e8",
                        lineHeight: 1,
                        letterSpacing: "-0.01em",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        fontFamily: '"DM Mono", monospace',
                        fontSize: "8px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(201,168,76,0.5)",
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={ctaHref}
                className="about-cta-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                  animation: visible ? "aboutFadeUp 0.6s ease 0.72s forwards" : "none",
                  opacity: 0,
                  width: "fit-content",
                }}
              >
                {/* Animated arrow box */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "1px solid rgba(201,168,76,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(201,168,76,0.08)",
                    flexShrink: 0,
                    transition: "background 0.3s ease, border-color 0.3s ease",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.2)";
                    (e.currentTarget as HTMLElement).style.borderColor = "#11443d";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.45)";
                  }}
                >
                  <ArrowUpRight size={14} color="#11443d" className="about-cta-arrow" />
                </div>

                <span
                  style={{
                    fontFamily: '"DM Mono", monospace',
                    fontSize: "9px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "rgba(245,240,232,0.5)",
                    borderBottom: "1px solid rgba(245,240,232,0.15)",
                    paddingBottom: "2px",
                    transition: "color 0.3s ease",
                  }}
                >
                  {ctaText}
                </span>
              </Link>
            </div>
          </div>

          {/* ── Bottom-right: rotated label ── */}
          <div
            style={{
              position: "absolute",
              bottom: "32px",
              right: "28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s ease 0.9s",
            }}
          >
            <span
              style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: "8px",
                letterSpacing: "0.28em",
                color: "rgba(201,168,76,0.4)",
                textTransform: "uppercase",
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Est. 2020
            </span>
            <div
              style={{
                width: "1px",
                height: "40px",
                background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.4))",
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
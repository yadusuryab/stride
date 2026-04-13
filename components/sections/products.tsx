"use client";

import React, { useEffect, useRef, useState } from "react";
import ProductCard from "../cards/product-card";
import { Product } from "@/lib/queries/product";
import Link from "next/link";
import { ArrowUpRight, MoveRight } from "lucide-react";
import { Button } from "../ui/button";

function ProductSkeleton({ index }: { index: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: "11px", letterSpacing: "0.25em", color: "#c8b89a" }}>
        {String(index + 1).padStart(2, "0")}
      </div>
      <div style={{ width: "100%", aspectRatio: "3/4", background: "#ede8df", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)", animation: "shimmer 1.6s ease-in-out infinite", transform: "translateX(-100%)" }} />
      </div>
      <div style={{ height: "10px", width: "65%", background: "#ede8df", borderRadius: "2px" }} />
      <div style={{ height: "10px", width: "30%", background: "#ede8df", borderRadius: "2px" }} />
    </div>
  );
}

type Props = {
  products: Product[];
  title?: string;
  desc?: string;
  showViewAll?: boolean;
  deskCols?: number;
};

function ProductsSection({
  products,
  title = "Explore",
  desc = "",
  showViewAll = false,
  deskCols = 4,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const colCount = Math.min(Math.max(deskCols, 2), 5);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prod-item { opacity: 0; animation: none; }
        .prod-item.revealed { animation: fadeSlideUp 0.6s ease forwards; }
        .prod-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
        }
        @media (min-width: 768px) {
          .prod-grid { grid-template-columns: repeat(${colCount}, 1fr); }
        }
      `}</style>

      <div ref={sectionRef} style={{ position: "relative" }}>

        {/* ── Header bar ── */}
        <div style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #d4cbbf", padding: "0 28px", display: "flex", alignItems: "stretch", justifyContent: "space-between" }}>
          <div style={{ padding: "20px 0", borderRight: "1px solid #d4cbbf", paddingRight: "32px", flex: "0 0 auto", display: "flex", flexDirection: "column", justifyContent: "center", gap: "4px" }}>
            <span style={{ fontFamily: '"DM Mono", monospace', fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#9c8a72" }}>
              {desc || "Products"}
            </span>
            <h2
              className="tracking-tighter text-2xl font-bold"
              style={{ lineHeight: 0.95, margin: 0, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}
            >
              {title}
            </h2>
          </div>
          <div style={{ padding: "20px 0 20px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
            {showViewAll && (
              <Link href="/products">
                <Button>View all <ArrowUpRight size={10} /></Button>
              </Link>
            )}
          </div>
        </div>

        {/* ── Product grid ── */}
        <div className="prod-grid">
          {loading ? (
            Array.from({ length: colCount * 2 }).map((_, i) => (
              <div key={i} style={{ background: "#f8f4ee", borderLeft: "1px solid #e5ddd3" }}>
                <ProductSkeleton index={i} />
              </div>
            ))
          ) : products.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center" }}>
              <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: "20px", fontStyle: "italic", color: "#9c8a72" }}>
                Nothing here yet.
              </p>
            </div>
          ) : (
            products.map((prod, i) => (
              <div
                key={prod._id}
                className={`prod-item p-2 ${visible ? "revealed" : ""}`}
                style={{
                  borderLeft: i % colCount !== 0 ? "1px solid #e5ddd3" : "none",
                  borderBottom: "1px solid #e5ddd3",
                  animationDelay: visible ? `${i * 60}ms` : "0ms",
                  position: "relative",
                }}
              >
                <ProductCard
                  id={prod._id}
                  name={prod.name}
                  rating={prod.rating}
                  imageUrl={prod.image}
                  price={prod.price}
                  salesPrice={prod.salesPrice}
                />
              </div>
            ))
          )}
        </div>

        {/* ── Bottom CTA ── */}
        {showViewAll && !loading && products.length > 0 && (
          <div style={{ padding: "0 24px", marginTop: "48px", display: "flex", alignItems: "center", gap: "20px", opacity: visible ? 1 : 0, transition: "opacity 0.5s ease 0.4s" }}>
            <div style={{ flex: 1, height: "1px", background: "#d4cbbf" }} />
            <Link href="/products">
              <Button variant="secondary">View more products <MoveRight /></Button>
            </Link>
            <div style={{ flex: 1, height: "1px", background: "#d4cbbf" }} />
          </div>
        )}
      </div>
    </>
  );
}

export default ProductsSection;
"use client";

import React, { useState, useRef } from "react";
import PriceFormat_Sale from "@/components/commerce-ui/price-format-sale";
import StarRating_Basic from "@/components/commerce-ui/star-rating-basic";
import { Button } from "@/components/ui/button";
import AddToCartButton from "../utils/add-to-cart";
import { Check, ChevronDown, Ruler, Truck, RotateCcw, Shield } from "lucide-react";

// ── Size Selector ──────────────────────────────────────────────────────────────
const SizeSelector = ({
  sizes,
  selectedSize,
  onSizeSelect,
}: {
  sizes: string[];
  selectedSize: string | null;
  onSizeSelect: (size: string) => void;
}) => {
  if (!sizes?.length) return null;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold tracking-[0.12em] uppercase text-neutral-500">
          Size
          {selectedSize && (
            <span className="ml-2 font-bold text-neutral-900 normal-case tracking-normal">
              — {selectedSize}
            </span>
          )}
        </span>
        <button className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-800 transition-colors group">
          <Ruler className="w-3 h-3 group-hover:scale-110 transition-transform" />
          Size guide
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              onClick={() => onSizeSelect(size)}
              className={`
                relative min-w-[52px] h-11 px-4 text-sm font-medium rounded-xl
                border transition-all duration-200 select-none
                ${isSelected
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.03]"
                  : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 active:scale-95"
                }
              `}
            >
              {size}
              {isSelected && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-neutral-900 rounded-full flex items-center justify-center shadow">
                  <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Color Selector ─────────────────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  black: "#111111", white: "#F8F8F8", silver: "#C0C0C0", gray: "#808080",
  grey: "#808080", red: "#E53E3E", blue: "#3B82F6", navy: "#1E3A5F",
  green: "#22C55E", olive: "#6B7C2D", yellow: "#FACC15", gold: "#D4A017",
  orange: "#F97316", pink: "#F472B6", purple: "#A855F7", brown: "#92400E",
  beige: "#F5F0E8", cream: "#FFFDD0", burgundy: "#800020", maroon: "#7F1D1D",
  teal: "#0D9488", turquoise: "#2DD4BF", lavender: "#C4B5FD",
  "rose gold": "#B76E79", camel: "#C19A6B", sand: "#C2B280", tan: "#D2B48C",
};

const getColorValue = (name: string): string => {
  const lower = name.toLowerCase();
  if (COLOR_MAP[lower]) return COLOR_MAP[lower];
  for (const [key, val] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  return "#D1D5DB";
};

const isLight = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
};

const ColorSelector = ({
  colors,
  selectedColor,
  onColorSelect,
}: {
  colors: string[];
  selectedColor: string | null;
  onColorSelect: (color: string) => void;
}) => {
  if (!colors?.length) return null;

  return (
    <div className="mt-7">
      <span className="text-xs font-semibold tracking-[0.12em] uppercase text-neutral-500 block mb-3">
        Color
        {selectedColor && (
          <span className="ml-2 font-bold text-neutral-900 normal-case tracking-normal">
            — {selectedColor}
          </span>
        )}
      </span>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const hex = getColorValue(color);
          const light = isLight(hex);
          const isSelected = selectedColor === color;

          return (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              title={color}
              className={`
                relative w-9 h-9 rounded-full transition-all duration-200
                ${isSelected ? "scale-110 shadow-lg" : "hover:scale-105 active:scale-95"}
                ${light ? "border border-neutral-200" : "border border-transparent"}
              `}
              style={{ backgroundColor: hex }}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full ring-2 ring-offset-2 ring-neutral-900">
                  <Check
                    className="w-3.5 h-3.5 stroke-[3]"
                    style={{ color: light ? "#111111" : "#FFFFFF" }}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Trust Badges ───────────────────────────────────────────────────────────────
const TrustBadges = () => (
  <div className="mt-8 grid grid-cols-3 gap-3">
    {[
      { icon: Truck, label: "Free delivery", sub: "Orders over ₹999" },
      { icon: RotateCcw, label: "Easy returns", sub: "Within 30 days" },
      { icon: Shield, label: "Secure pay", sub: "100% protected" },
    ].map(({ icon: Icon, label, sub }) => (
      <div
        key={label}
        className="flex flex-col items-center text-center p-3 rounded-xl bg-neutral-50 border border-neutral-100"
      >
        <Icon className="w-4 h-4 text-neutral-600 mb-1.5" />
        <span className="text-[11px] font-semibold text-neutral-800 leading-tight">{label}</span>
        <span className="text-[10px] text-neutral-400 mt-0.5 leading-tight">{sub}</span>
      </div>
    ))}
  </div>
);

// ── Accordion ─────────────────────────────────────────────────────────────────
const Accordion = ({
  sections,
  openId,
  onToggle,
}: {
  sections: { id: string; title: string; content: React.ReactNode }[];
  openId: string;
  onToggle: (id: string) => void;
}) => (
  <div className="mt-8 divide-y divide-neutral-100 border-t border-neutral-100">
    {sections.map((section) => {
      const isOpen = openId === section.id;
      return (
        <div key={section.id}>
          <button
            onClick={() => onToggle(section.id)}
            className="w-full py-4 flex justify-between items-center text-left group"
          >
            <span className="text-sm font-semibold tracking-wide text-neutral-800 group-hover:text-neutral-600 transition-colors uppercase">
              {section.title}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-96 pb-5" : "max-h-0"
            }`}
          >
            <div className="text-sm text-neutral-500 leading-relaxed">
              {section.content}
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
const ProductDetailsClient = ({ product }: { product: any }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState("description");

  const availableSizes: string[] = product.sizes || [];
  const availableColors: string[] = product.colors || [];

  const toggleSection = (id: string) =>
    setOpenSection((prev) => (prev === id ? "" : id));

  const accordionSections = [
    {
      id: "description",
      title: "Description",
      content: product.description || "No description available.",
    },
    {
      id: "details",
      title: "Details & Features",
      content: product.features?.length ? (
        <ul className="space-y-2">
          {product.features.map((feat: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 mt-0.5 text-neutral-400 shrink-0" />
              {feat}
            </li>
          ))}
        </ul>
      ) : (
        "No details available."
      ),
    },
    {
      id: "shipping",
      title: "Shipping & Returns",
      content: (
        <div className="space-y-2">
          <p>Free standard delivery on orders over ₹999.</p>
          <p>Express delivery available at checkout.</p>
          <p>Returns accepted within 30 days of delivery in original condition.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="lg:pl-8">
      {/* Category tag */}
      {product.category && (
        <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-neutral-400 mb-3">
          {typeof product.category === "object"
            ? product.category.title ?? product.category.name ?? ""
            : product.category}
        </p>
      )}

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-semibold leading-tight text-neutral-900 mb-3">
        {product.name}
      </h1>

      {/* Rating row */}
      <div className="flex items-center gap-2.5 mb-5">
        <StarRating_Basic value={product.rating} readOnly iconSize={15} />
        <span className="text-sm text-neutral-400">
          {product.rating?.toFixed(1)} · {product.reviewCount || 0} reviews
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-neutral-100 mb-5" />

      {/* Price */}
      <div className="mb-1">
        {product.salesPrice ? (
          <PriceFormat_Sale
            originalPrice={product.price}
            salePrice={product.salesPrice}
            prefix="₹"
            showSavePercentage={true}
            classNameSalePrice="text-3xl font-bold text-neutral-900"
            classNameOriginalPrice="text-lg text-neutral-400 line-through"
          />
        ) : (
          <div className="text-3xl font-bold text-neutral-900">
            ₹{product.price?.toLocaleString("en-IN")}
          </div>
        )}
        <p className="text-xs text-neutral-400 mt-1">Inclusive of all taxes</p>
      </div>

      {/* Color */}
      <ColorSelector
        colors={availableColors}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />

      {/* Size */}
      <SizeSelector
        sizes={availableSizes}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
      />

      {/* CTA */}
      <div className="mt-8 space-y-3">
        <AddToCartButton
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          hasSizes={availableSizes.length > 0}
          hasColors={availableColors.length > 0}
          showBuyNow
        />
      </div>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Accordion */}
      <Accordion
        sections={accordionSections}
        openId={openSection}
        onToggle={toggleSection}
      />
    </div>
  );
};

export default ProductDetailsClient;
// components/products/filters.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Star, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriceChips } from "../ui/price-slider";

interface FiltersProps {
  filters: any;
  availableFilters: any;
  categories: Array<{ _id: string; name: string; slug: string }>;
  onFilterChange: (key: string, value: any) => void;
  onArrayFilterChange: (type: string, value: string) => void;
  onPriceChange: (value: [number, number]) => void;
  onToggleFilter: (key: string) => void;
  onClearAll: () => void;
  getActiveFilterCount: () => number;
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

// ─── Collapsible Section ──────────────────────────────────────────────────────
function Section({
  title,
  defaultOpen = true,
  children,
  count,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900">{title}</span>
          {count != null && count > 0 && (
            <span className="w-4 h-4 rounded-full bg-neutral-950 text-white text-[10px] font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-neutral-400 group-hover:text-neutral-700 transition-colors"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Toggle Pill ──────────────────────────────────────────────────────────────
function TogglePill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 border",
        active
          ? "bg-neutral-950 text-white border-neutral-950"
          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
      )}
    >
      {children}
    </button>
  );
}

// ─── Color Swatch ─────────────────────────────────────────────────────────────
function ColorSwatch({
  color,
  active,
  onClick,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  const isLight = ["white", "ivory", "cream", "beige", "yellow", "lime"].some(
    (l) => color.toLowerCase().includes(l)
  );

  return (
    <button
      onClick={onClick}
      title={color}
      className={cn(
        "relative w-8 h-8 rounded-full transition-all active:scale-90",
        active ? "ring-2 ring-offset-2 ring-neutral-950 scale-110" : "ring-1 ring-neutral-200 hover:scale-105"
      )}
      style={{ backgroundColor: color.toLowerCase() }}
    >
      {active && (
        <Check
          className={cn(
            "absolute inset-0 m-auto w-3.5 h-3.5",
            isLight ? "text-neutral-950" : "text-white"
          )}
        />
      )}
    </button>
  );
}

// ─── Brand Row ────────────────────────────────────────────────────────────────
function BrandRow({
  brand,
  count,
  checked,
  onChange,
}: {
  brand: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm transition-all active:scale-[0.98]",
        checked ? "bg-neutral-950 text-white" : "hover:bg-neutral-50 text-neutral-700"
      )}
    >
      <div
        className={cn(
          "w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors",
          checked ? "bg-white border-white" : "border-neutral-300"
        )}
      >
        {checked && <Check className="w-2.5 h-2.5 text-neutral-950" />}
      </div>
      <span className="flex-1 text-left font-medium">{brand}</span>
      <span
        className={cn(
          "text-xs font-semibold tabular-nums",
          checked ? "text-neutral-300" : "text-neutral-400"
        )}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Main Filters Component ───────────────────────────────────────────────────
export const Filters: React.FC<FiltersProps> = ({
  filters,
  availableFilters,
  categories,
  onFilterChange,
  onArrayFilterChange,
  onPriceChange,
  onToggleFilter,
  onClearAll,
  getActiveFilterCount,
  isMobile = false,
  onCloseMobile,
}) => {
  return (
    <div
      className={cn(
        "bg-white",
        !isMobile && "rounded-2xl border border-neutral-100 shadow-sm overflow-hidden sticky top-4"
      )}
    >
      {/* Desktop header */}
      {!isMobile && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-neutral-950">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="w-5 h-5 rounded-full bg-neutral-950 text-white text-[10px] font-bold flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      <div
        className={cn(
          "divide-y divide-neutral-100 px-5",
          !isMobile && "max-h-[calc(100vh-180px)] overflow-y-auto overscroll-contain"
        )}
      >
        {/* ── Quick Filters ── */}
        <Section title="Quick filters" defaultOpen>
          <div className="flex flex-wrap gap-2">
            <TogglePill active={filters.featured} onClick={() => onToggleFilter("featured")}>
              ✦ Featured
            </TogglePill>
            <TogglePill active={filters.onSale} onClick={() => onToggleFilter("onSale")}>
              % On sale
            </TogglePill>
            <TogglePill active={filters.inStock} onClick={() => onToggleFilter("inStock")}>
              ✓ In stock
            </TogglePill>
          </div>
        </Section>

        {/* ── Price ── */}
        <Section
          title="Price"
          count={filters.minPrice > 0 || filters.maxPrice < 50000 ? 1 : 0}
          defaultOpen
        >
          <PriceChips
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={onPriceChange}
            currency="₹"
          />
        </Section>

        {/* ── Categories ── */}
        {categories.length > 0 && (
          <Section title="Category" count={filters.category ? 1 : 0} defaultOpen>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => onFilterChange("category", "")}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                  !filters.category
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => onFilterChange("category", cat.slug)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                    filters.category === cat.slug
                      ? "bg-neutral-950 text-white"
                      : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* ── Brands ── */}
        {availableFilters.brands?.length > 0 && (
          <Section title="Brand" count={filters.brands?.length || 0} defaultOpen={false}>
            <div className="space-y-0.5 max-h-52 overflow-y-auto -mx-1 px-1">
              {availableFilters.brands.map((brand: string) => (
                <BrandRow
                  key={brand}
                  brand={brand}
                  count={availableFilters.brandCounts?.[brand] || 0}
                  checked={filters.brands?.includes(brand) || false}
                  onChange={() => onArrayFilterChange("brands", brand)}
                />
              ))}
            </div>
          </Section>
        )}

        {/* ── Sizes ── */}
        {availableFilters.sizes?.length > 0 && (
          <Section title="Size" count={filters.sizes?.length || 0} defaultOpen={false}>
            <div className="grid grid-cols-4 gap-1.5">
              {availableFilters.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => onArrayFilterChange("sizes", size)}
                  className={cn(
                    "py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95",
                    filters.sizes?.includes(size)
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* ── Colors ── */}
        {availableFilters.colors?.length > 0 && (
          <Section title="Color" count={filters.colors?.length || 0} defaultOpen={false}>
            <div className="flex flex-wrap gap-2.5">
              {availableFilters.colors.map((color: string) => (
                <ColorSwatch
                  key={color}
                  color={color}
                  active={filters.colors?.includes(color) || false}
                  onClick={() => onArrayFilterChange("colors", color)}
                />
              ))}
            </div>
            {/* Color labels for selected */}
            {filters.colors?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {filters.colors.map((c: string) => (
                  <span
                    key={c}
                    className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full capitalize"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </Section>
        )}

        {/* ── Features ── */}
        {availableFilters.features?.length > 0 && (
          <Section title="Features" count={filters.features?.length || 0} defaultOpen={false}>
            <div className="space-y-0.5">
              {availableFilters.features.map((feature: string) => (
                <button
                  key={feature}
                  onClick={() => onArrayFilterChange("features", feature)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]",
                    filters.features?.includes(feature)
                      ? "bg-neutral-950 text-white"
                      : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0",
                      filters.features?.includes(feature)
                        ? "bg-white border-white"
                        : "border-neutral-300"
                    )}
                  >
                    {filters.features?.includes(feature) && (
                      <Check className="w-2.5 h-2.5 text-neutral-950" />
                    )}
                  </div>
                  <span className="font-medium text-left">{feature}</span>
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* ── Rating ── */}
        <Section title="Min. rating" count={filters.rating > 0 ? 1 : 0} defaultOpen={false}>
          <div className="flex flex-col gap-1">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() =>
                  onFilterChange("rating", filters.rating === rating ? 0 : rating)
                }
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98]",
                  filters.rating === rating
                    ? "bg-neutral-950 text-white"
                    : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-3 h-3",
                        i < rating
                          ? filters.rating === rating
                            ? "fill-yellow-300 text-yellow-300"
                            : "fill-yellow-400 text-yellow-400"
                          : filters.rating === rating
                          ? "fill-white/20 text-white/20"
                          : "fill-neutral-200 text-neutral-200"
                      )}
                    />
                  ))}
                </div>
                <span>{rating} & above</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Spacer at bottom for mobile */}
        {isMobile && <div className="h-4" />}
      </div>
    </div>
  );
};
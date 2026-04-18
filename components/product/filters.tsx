// components/products/filters.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, Check, SlidersHorizontal, X } from "lucide-react";
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
        className="w-full flex items-center justify-between py-3.5 text-left group"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 group-hover:text-neutral-800 transition-colors">
            {title}
          </span>
          {count != null && count > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-neutral-950 text-white text-[10px] font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-all duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
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
        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 border",
        active
          ? "bg-neutral-950 text-white border-neutral-950 shadow-sm"
          : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-white hover:border-neutral-400 hover:text-neutral-900"
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
        "relative w-7 h-7 rounded-full transition-all duration-150 active:scale-90",
        active
          ? "ring-2 ring-offset-2 ring-neutral-950 scale-110"
          : "ring-1 ring-black/10 hover:scale-105"
      )}
      style={{ backgroundColor: color.toLowerCase() }}
    >
      {active && (
        <Check
          className={cn(
            "absolute inset-0 m-auto w-3 h-3",
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
        "w-full flex items-center gap-3 py-2 px-2.5 rounded-lg text-sm transition-all duration-150 active:scale-[0.98]",
        checked
          ? "bg-neutral-950 text-white"
          : "hover:bg-neutral-50 text-neutral-700"
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
      <span className="flex-1 text-left font-medium text-[13px]">{brand}</span>
      <span
        className={cn(
          "text-xs tabular-nums",
          checked ? "text-neutral-400" : "text-neutral-400"
        )}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Active Filter Chips ──────────────────────────────────────────────────────
function ActiveChips({
  filters,
  availableFilters,
  categories,
  onFilterChange,
  onArrayFilterChange,
  onToggleFilter,
}: any) {
  const chips: { label: string; onRemove: () => void }[] = [];

  if (filters.featured) chips.push({ label: "Featured", onRemove: () => onToggleFilter("featured") });
  if (filters.onSale) chips.push({ label: "On sale", onRemove: () => onToggleFilter("onSale") });
  if (filters.inStock) chips.push({ label: "In stock", onRemove: () => onToggleFilter("inStock") });
  if (filters.category) {
    const cat = categories.find((c: any) => c.slug === filters.category);
    if (cat) chips.push({ label: cat.name, onRemove: () => onFilterChange("category", "") });
  }
  if (filters.rating > 0) chips.push({ label: `${filters.rating}★+`, onRemove: () => onFilterChange("rating", 0) });
  (filters.brands || []).forEach((b: string) =>
    chips.push({ label: b, onRemove: () => onArrayFilterChange("brands", b) })
  );
  (filters.sizes || []).forEach((s: string) =>
    chips.push({ label: s, onRemove: () => onArrayFilterChange("sizes", s) })
  );
  (filters.colors || []).forEach((c: string) =>
    chips.push({ label: c, onRemove: () => onArrayFilterChange("colors", c) })
  );
  (filters.features || []).forEach((f: string) =>
    chips.push({ label: f, onRemove: () => onArrayFilterChange("features", f) })
  );

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-5 py-3 border-b border-neutral-100 bg-neutral-50/60">
      {chips.map((chip) => (
        <button
          key={chip.label}
          onClick={chip.onRemove}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-medium text-neutral-700 hover:border-neutral-400 hover:text-neutral-950 transition-all active:scale-95"
        >
          {chip.label}
          <X className="w-3 h-3 text-neutral-400" />
        </button>
      ))}
    </div>
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
        !isMobile &&
          "rounded-2xl border border-neutral-100 shadow-sm overflow-hidden sticky top-4"
      )}
    >
      {/* Header */}
      {!isMobile && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Filters
            </span>
            {getActiveFilterCount() > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-neutral-950 text-white text-[10px] font-bold flex items-center justify-center">
                {getActiveFilterCount()}
              </span>
            )}
          </div>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={onClearAll}
              className="text-[11px] font-semibold text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Active filter chips */}
      <ActiveChips
        filters={filters}
        availableFilters={availableFilters}
        categories={categories}
        onFilterChange={onFilterChange}
        onArrayFilterChange={onArrayFilterChange}
        onToggleFilter={onToggleFilter}
      />

      <div
        className={cn(
          "divide-y divide-neutral-100 px-5",
          !isMobile &&
            "max-h-[calc(100vh-180px)] overflow-y-auto overscroll-contain"
        )}
      >
        {/* ── Quick Filters ── */}
        <Section title="Quick filters" defaultOpen>
          <div className="flex flex-wrap gap-1.5">
            <TogglePill
              active={filters.featured}
              onClick={() => onToggleFilter("featured")}
            >
              ✦ Featured
            </TogglePill>
            <TogglePill
              active={filters.onSale}
              onClick={() => onToggleFilter("onSale")}
            >
              % On sale
            </TogglePill>
            <TogglePill
              active={filters.inStock}
              onClick={() => onToggleFilter("inStock")}
            >
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
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => onFilterChange("category", "")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                  !filters.category
                    ? "bg-neutral-950 text-white border-neutral-950"
                    : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => onFilterChange("category", cat.slug)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                    filters.category === cat.slug
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
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
          <Section
            title="Brand"
            count={filters.brands?.length || 0}
            defaultOpen={false}
          >
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
          <Section
            title="Size"
            count={filters.sizes?.length || 0}
            defaultOpen={false}
          >
            <div className="grid grid-cols-4 gap-1.5">
              {availableFilters.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => onArrayFilterChange("sizes", size)}
                  className={cn(
                    "py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                    filters.sizes?.includes(size)
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400"
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
          <Section
            title="Color"
            count={filters.colors?.length || 0}
            defaultOpen={false}
          >
            <div className="flex flex-wrap gap-2">
              {availableFilters.colors.map((color: string) => (
                <ColorSwatch
                  key={color}
                  color={color}
                  active={filters.colors?.includes(color) || false}
                  onClick={() => onArrayFilterChange("colors", color)}
                />
              ))}
            </div>
            {filters.colors?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {filters.colors.map((c: string) => (
                  <span
                    key={c}
                    className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full capitalize"
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
          <Section
            title="Features"
            count={filters.features?.length || 0}
            defaultOpen={false}
          >
            <div className="flex flex-wrap gap-1.5">
              {availableFilters.features.map((feature: string) => (
                <button
                  key={feature}
                  onClick={() => onArrayFilterChange("features", feature)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all active:scale-95",
                    filters.features?.includes(feature)
                      ? "bg-neutral-950 text-white border-neutral-950"
                      : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900"
                  )}
                >
                  {feature}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* ── Rating ── */}
        <Section
          title="Min. rating"
          count={filters.rating > 0 ? 1 : 0}
          defaultOpen={false}
        >
          <div className="flex flex-col gap-0.5">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() =>
                  onFilterChange("rating", filters.rating === rating ? 0 : rating)
                }
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.98]",
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
                <span className="text-[13px]">{rating} & above</span>
              </button>
            ))}
          </div>
        </Section>

        {isMobile && <div className="h-4" />}
      </div>
    </div>
  );
};
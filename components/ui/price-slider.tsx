// components/ui/price-chips.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PriceChipsProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  className?: string;
  currency?: string;
}

export const PriceChips: React.FC<PriceChipsProps> = ({
  value,
  onValueChange,
  className,
  currency = "₹",
}) => {
  const priceRanges = [
    { label: "Under ₹1,000", min: 0, max: 1000 },
    { label: "₹1,000–3,000", min: 1000, max: 3000 },
    { label: "₹3,000–5,000", min: 3000, max: 5000 },
    { label: "All ranges", min: 0, max: 50000 },
  ];

  const isSelected = (min: number, max: number) =>
    value[0] === min && value[1] === max;

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Selected range display */}
      <div className="rounded-xl bg-neutral-950 px-3 py-2.5 text-center">
        <span className="text-xs font-semibold text-white tabular-nums">
          {currency}{value[0].toLocaleString("en-IN")} – {currency}{value[1].toLocaleString("en-IN")}
        </span>
      </div>

      {/* Preset chips */}
      <div className="grid grid-cols-2 gap-1.5">
        {priceRanges.map((range) => (
          <button
            key={`${range.min}-${range.max}`}
            onClick={() => onValueChange([range.min, range.max])}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-semibold transition-all active:scale-95",
              isSelected(range.min, range.max)
                ? "bg-neutral-950 text-white border-neutral-950"
                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
            )}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Custom range inputs */}
      <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 text-center">
          Custom range
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={value[0]}
            onChange={(e) => onValueChange([Number(e.target.value), value[1]])}
            placeholder="Min"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 outline-none focus:border-neutral-400 focus:ring-0 transition-colors"
          />
          <span className="text-neutral-300 text-sm">–</span>
          <input
            type="number"
            value={value[1]}
            onChange={(e) => onValueChange([value[0], Number(e.target.value)])}
            placeholder="Max"
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-800 outline-none focus:border-neutral-400 focus:ring-0 transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
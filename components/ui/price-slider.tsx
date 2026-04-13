// components/ui/price-chips.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
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
    { label: "Under ₹1,000", min: 0, max: 1000, emoji: "💎" },
    { label: "₹1,000-3,000", min: 1000, max: 3000, emoji: "✨" },
    { label: "₹3,000-5,000", min: 3000, max: 5000, emoji: "✨" },
    { label: "All ranges", min: 0, max: 50000, emoji: "" },
  ];

  const isRangeSelected = (min: number, max: number) => {
    return value[0] === min && value[1] === max;
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Selected Range Display */}
      <motion.div 
        className="bg-primary text-primary-foreground p-3  text-center shadow-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <div className="text-sm font-medium">
          {currency}{value[0]?.toLocaleString("en-IN")} - {currency}{value[1]?.toLocaleString("en-IN")}
        </div>
      </motion.div>

      {/* Price Chips */}
      <div className="grid grid-cols-2 gap-2 justify-center">
        {priceRanges.map((range, index) => (
          <motion.button
            key={index}
            className={cn(
              "px-4 py-3  border-2 font-medium transition-all duration-200 flex items-center gap-2",
              "hover:shadow-md hover:-translate-y-0.5",
              isRangeSelected(range.min, range.max)
                ? "bg-black text-white border-transparent "
                : "bg-white border-gray-200 text-gray-700 hover:border-blue-300"
            )}
            onClick={() => onValueChange([range.min, range.max])}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            
            <span>{range.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Quick Custom Input */}
      <div className=" p-3  border">
        <div className="text-xs text-muted-foreground mb-2 text-center">
          Custom range
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input
              type="number"
              value={value[0]}
              onChange={(e) => onValueChange([Number(e.target.value), value[1]])}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Min"
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="flex-1">
            <input
              type="number"
              value={value[1]}
              onChange={(e) => onValueChange([value[0], Number(e.target.value)])}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
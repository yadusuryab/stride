"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Product } from "@/lib/queries/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Search, SlidersHorizontal, ChevronDown, Star, Zap, TrendingUp } from "lucide-react";
import ProductsSection from "@/components/sections/products";
import { Filters } from "@/components/product/filters";
import { Input } from "@/components/ui/input";

// ─── Pill Chip ────────────────────────────────────────────────────────────────
function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
        bg-neutral-900 text-white border border-neutral-700"
    >
      {label}
      <button
        onClick={onRemove}
        className="w-3.5 h-3.5 rounded-full flex items-center justify-center 
          bg-white/20 hover:bg-white/40 transition-colors"
      >
        <X className="w-2 h-2" />
      </button>
    </motion.span>
  );
}

// ─── Sort Sheet (Bottom Sheet for Mobile) ─────────────────────────────────────
const sortOptions = [
  { value: "newest", label: "Newest first", icon: <Zap className="w-4 h-4" /> },
  { value: "price_asc", label: "Price: low to high", icon: <TrendingUp className="w-4 h-4" /> },
  { value: "price_desc", label: "Price: high to low", icon: <TrendingUp className="w-4 h-4 rotate-180" /> },
  { value: "rating", label: "Top rated", icon: <Star className="w-4 h-4" /> },
];

function SortSheet({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl px-4 pt-5 pb-10 safe-area-bottom"
          >
            <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-6" />
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4 px-1">
              Sort by
            </p>
            <div className="space-y-1">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { onChange(opt.value); onClose(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all
                    ${value === opt.value
                      ? "bg-neutral-950 text-white"
                      : "text-neutral-700 hover:bg-neutral-100"}`}
                >
                  <span className={value === opt.value ? "text-white" : "text-neutral-400"}>
                    {opt.icon}
                  </span>
                  {opt.label}
                  {value === opt.value && (
                    <motion.span layoutId="sort-check" className="ml-auto text-white">✓</motion.span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Sticky Search Bar ────────────────────────────────────────────────────────
function StickySearchBar({
  value,
  onChange,
  filterCount,
  onOpenFilters,
  sort,
  onOpenSort,
}: {
  value: string;
  onChange: (v: string) => void;
  filterCount: number;
  onOpenFilters: () => void;
  sort: string;
  onOpenSort: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-neutral-100 px-4 py-3">
      {/* Search input */}
      <motion.div
        animate={{ borderColor: focused ? "#0a0a0a" : "#e5e5e5" }}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-md border bg-neutral-50 transition-colors"
      >
        <Search className="w-4 h-4 text-neutral-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search products…"
          className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 
            outline-none min-w-0 font-medium"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => onChange("")}
              className="w-5 h-5 rounded-full bg-neutral-300 flex items-center justify-center shrink-0"
            >
              <X className="w-3 h-3 text-neutral-600" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Controls row */}
      <div className="flex gap-2 mt-2.5">
        <button
          onClick={onOpenFilters}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold
            transition-all active:scale-95
            ${filterCount > 0
              ? "bg-neutral-950 text-white"
              : "bg-neutral-100 text-neutral-700"}`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {filterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-white text-neutral-950 text-[10px] font-bold flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenSort}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold
            bg-neutral-100 text-neutral-700 transition-all active:scale-95"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          {sortOptions.find(s => s.value === sort)?.label.split(":")[0] || "Sort"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function ProductsPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string; slug: string }>>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [availableFilters, setAvailableFilters] = useState({
    sizes: [] as string[],
    colors: [] as string[],
    features: [] as string[],
    brands: [] as string[],
    brandCounts: {} as Record<string, number>,
    maxPrice: 0,
  });

  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    minPrice: parseInt(searchParams.get("minPrice") || "0"),
    maxPrice: parseInt(searchParams.get("maxPrice") || "50000"),
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "newest",
    page: parseInt(searchParams.get("page") || "1"),
    limit: 12,
    sizes: searchParams.get("sizes")?.split(",").filter(Boolean) || [],
    colors: searchParams.get("colors")?.split(",").filter(Boolean) || [],
    features: searchParams.get("features")?.split(",").filter(Boolean) || [],
    brands: searchParams.get("brands")?.split(",").filter(Boolean) || [],
    rating: searchParams.get("rating") ? parseInt(searchParams.get("rating")!) : 0,
    featured: searchParams.get("featured") === "true",
    inStock: searchParams.get("inStock") !== "false",
    onSale: searchParams.get("onSale") === "true",
  });

  const [pagination, setPagination] = useState({ total: 0, hasNextPage: false });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        setCategories(await res.json());
      } catch {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice < 50000) params.set("maxPrice", filters.maxPrice.toString());
    if (filters.category) params.set("category", filters.category);
    if (filters.sort !== "newest") params.set("sort", filters.sort);
    if (filters.page > 1) params.set("page", filters.page.toString());
    if (filters.sizes.length > 0) params.set("sizes", filters.sizes.join(","));
    if (filters.colors.length > 0) params.set("colors", filters.colors.join(","));
    if (filters.features.length > 0) params.set("features", filters.features.join(","));
    if (filters.brands.length > 0) params.set("brands", filters.brands.join(","));
    if (filters.rating > 0) params.set("rating", filters.rating.toString());
    if (filters.featured) params.set("featured", "true");
    if (!filters.inStock) params.set("inStock", "false");
    if (filters.onSale) params.set("onSale", "true");
    router.replace(`/products?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.q) params.append("q", filters.q);
      params.append("minPrice", filters.minPrice.toString());
      params.append("maxPrice", filters.maxPrice.toString());
      if (filters.category) params.append("category", filters.category);
      params.append("sort", filters.sort);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());
      if (filters.sizes.length > 0) params.append("sizes", filters.sizes.join(","));
      if (filters.colors.length > 0) params.append("colors", filters.colors.join(","));
      if (filters.features.length > 0) params.append("features", filters.features.join(","));
      if (filters.brands.length > 0) params.append("brands", filters.brands.join(","));
      if (filters.rating > 0) params.append("minRating", filters.rating.toString());
      if (filters.featured) params.append("featured", "true");
      if (!filters.inStock) params.append("excludeSoldOut", "true");
      if (filters.onSale) params.append("onSale", "true");

      const res = await fetch(`/api/product?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
        setPagination({ total: data.pagination.total, hasNextPage: data.pagination.hasNextPage });

        if (data.data.length > 0) {
          const sizes = new Set<string>();
          const colors = new Set<string>();
          const features = new Set<string>();
          const brands = new Set<string>();
          const brandCounts: Record<string, number> = {};
          let maxPrice = 0;

          data.data.forEach((p: Product) => {
            p.sizes?.forEach((s: string) => sizes.add(s));
            p.colors?.forEach((c: string) => colors.add(c));
            p.features?.forEach((f: string) => features.add(f));
            const brand = p.brand || p.name.split(" ")[0];
            if (brand) { brands.add(brand); brandCounts[brand] = (brandCounts[brand] || 0) + 1; }
            if (p.price > maxPrice) maxPrice = p.price;
          });

          setAvailableFilters({
            sizes: Array.from(sizes).sort(),
            colors: Array.from(colors).sort(),
            features: Array.from(features).sort(),
            brands: Array.from(brands).sort(),
            brandCounts,
            maxPrice: Math.ceil(maxPrice / 1000) * 1000,
          });
        }
      } else {
        throw new Error(data.message || "Failed to fetch products");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [filters]);

  const handleFilterChange = (key: string, value: any) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const handleArrayFilterChange: any = (type: "sizes" | "colors" | "features" | "brands", value: string) =>
    setFilters((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((i: string) => i !== value)
        : [...prev[type], value],
      page: 1,
    }));

  const handlePriceChange = (value: [number, number]) =>
    setFilters((prev) => ({ ...prev, minPrice: value[0], maxPrice: value[1], page: 1 }));

  const handleToggleFilter: any = (key: "featured" | "inStock" | "onSale") =>
    setFilters((prev) => ({ ...prev, [key]: !prev[key], page: 1 }));

  const clearAllFilters = () =>
    setFilters({
      q: "", minPrice: 0, maxPrice: 50000, category: "", sort: "newest",
      page: 1, limit: 12, sizes: [], colors: [], features: [], brands: [],
      rating: 0, featured: false, inStock: true, onSale: false,
    });

  const getActiveFilterCount = () => {
    let n = 0;
    if (filters.minPrice > 0) n++;
    if (filters.maxPrice < 50000) n++;
    if (filters.category) n++;
    if (filters.sizes.length > 0) n++;
    if (filters.colors.length > 0) n++;
    if (filters.features.length > 0) n++;
    if (filters.brands.length > 0) n++;
    if (filters.rating > 0) n++;
    if (filters.featured) n++;
    if (!filters.inStock) n++;
    if (filters.onSale) n++;
    return n;
  };

  const handlePageChange = (p: number) => {
    setFilters((prev) => ({ ...prev, page: p }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount = getActiveFilterCount();

  // ── Active chips ─────────────────────────────────────────────────────
  const activeChips: Array<{ label: string; onRemove: () => void }> = [
    ...(filters.category ? [{
      label: categories.find((c) => c.slug === filters.category)?.name || filters.category,
      onRemove: () => handleFilterChange("category", ""),
    }] : []),
    ...filters.brands.map((b) => ({ label: b, onRemove: () => handleArrayFilterChange("brands", b) })),
    ...filters.sizes.map((s) => ({ label: s, onRemove: () => handleArrayFilterChange("sizes", s) })),
    ...filters.colors.map((c) => ({ label: c, onRemove: () => handleArrayFilterChange("colors", c) })),
    ...(filters.rating > 0 ? [{ label: `${filters.rating}★+`, onRemove: () => handleFilterChange("rating", 0) }] : []),
    ...(filters.onSale ? [{ label: "On sale", onRemove: () => handleToggleFilter("onSale") }] : []),
    ...(filters.featured ? [{ label: "Featured", onRemove: () => handleToggleFilter("featured") }] : []),
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Mobile Search + Controls (sticky) ── */}
      <div className="md:hidden">
        <StickySearchBar
          value={filters.q}
          onChange={(v) => handleFilterChange("q", v)}
          filterCount={activeFilterCount}
          onOpenFilters={() => setMobileFiltersOpen(true)}
          sort={filters.sort}
          onOpenSort={() => setSortOpen(true)}
        />
      </div>

      {/* ── Desktop Header ── */}
      <div className="hidden md:block container mx-auto px-6 pt-8 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">
              {filters.category
                ? categories.find((c) => c.slug === filters.category)?.name
                : "All Products"}
            </h1>
            {pagination.total > 0 && (
              <p className="text-sm text-neutral-400 mt-0.5">{pagination.total} items</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                placeholder="Search…"
                value={filters.q}
                onChange={(e) => handleFilterChange("q", e.target.value)}
                className="pl-9 w-64 rounded-xl border-neutral-200 bg-neutral-50 
                  focus:border-neutral-900 focus:bg-white transition-all text-sm"
              />
            </div>

            {/* Sort desktop */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange("sort", e.target.value)}
              className="text-sm font-medium text-neutral-700 border border-neutral-200 rounded-xl 
                px-3 py-2 bg-white focus:outline-none focus:border-neutral-900 cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Active Filter Chips ── */}
      <AnimatePresence>
        {activeChips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 md:container md:mx-auto md:px-6 py-2.5 overflow-x-auto"
          >
            <div className="flex gap-2 w-max">
              <motion.button
                layout
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold
                  border-2 border-neutral-950 text-neutral-950 hover:bg-neutral-950 hover:text-white 
                  transition-colors shrink-0"
              >
                Clear all
              </motion.button>
              {activeChips.map((chip, i) => (
                <Chip key={i} label={chip.label} onRemove={chip.onRemove} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Body ── */}
      <div className="container mx-auto  py-4 md:py-6">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <Filters
              filters={filters}
              availableFilters={availableFilters}
              categories={categories}
              onFilterChange={handleFilterChange}
              onArrayFilterChange={handleArrayFilterChange}
              onPriceChange={handlePriceChange}
              onToggleFilter={handleToggleFilter}
              onClearAll={clearAllFilters}
              getActiveFilterCount={getActiveFilterCount}
            />
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Mobile result count */}
            <div className="flex px-4 items-center justify-between mb-4 md:hidden">
              <p className="text-xs text-neutral-400 font-medium">
                {loading ? "Loading…" : `${pagination.total} products`}
              </p>
            </div>

            {error ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-3">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                <p className="font-semibold text-neutral-900">Something went wrong</p>
                <p className="text-sm text-neutral-400 mt-1">{error}</p>
                <Button onClick={fetchProducts} className="mt-4 rounded-xl" size="sm">
                  Try again
                </Button>
              </motion.div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${filters.page}-${filters.sort}-${filters.q}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductsSection
                      products={products}
                      deskCols={3}
                      title={
                        filters.category
                          ? `${categories.find((c) => c.slug === filters.category)?.name} Collection`
                          : "All Products"
                      }
                      desc={
                        filters.q
                          ? `Results for "${filters.q}"`
                          : "Discover our complete collection"
                      }
                      showViewAll={false}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                {pagination.total > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-1.5 mt-12 pb-6"
                  >
                    <button
                      disabled={filters.page === 1}
                      onClick={() => handlePageChange(filters.page - 1)}
                      className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center
                        text-sm font-medium text-neutral-500 hover:border-neutral-900 hover:text-neutral-900
                        disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      ‹
                    </button>

                    {Array.from({
                      length: Math.min(5, Math.ceil(pagination.total / filters.limit)),
                    }).map((_, i) => {
                      const total = Math.ceil(pagination.total / filters.limit);
                      let pageNum = filters.page <= 3 ? i + 1
                        : filters.page >= total - 2 ? total - 4 + i
                        : filters.page - 2 + i;

                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all active:scale-95
                            ${filters.page === pageNum
                              ? "bg-neutral-950 text-white"
                              : "border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900"}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      disabled={!pagination.hasNextPage}
                      onClick={() => handlePageChange(filters.page + 1)}
                      className="w-9 h-9 rounded-xl border border-neutral-200 flex items-center justify-center
                        text-sm font-medium text-neutral-500 hover:border-neutral-900 hover:text-neutral-900
                        disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      ›
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Sheet ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 40 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl md:hidden 
                overflow-y-auto overscroll-contain"
            >
              {/* Sheet Header */}
              <div className="sticky top-0 bg-white border-b border-neutral-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-neutral-950">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-neutral-950 text-white text-[10px] 
                      font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs font-semibold text-neutral-400 hover:text-neutral-900 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center
                      hover:bg-neutral-200 transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <Filters
                  filters={filters}
                  availableFilters={availableFilters}
                  categories={categories}
                  onFilterChange={handleFilterChange}
                  onArrayFilterChange={handleArrayFilterChange}
                  onPriceChange={handlePriceChange}
                  onToggleFilter={handleToggleFilter}
                  onClearAll={clearAllFilters}
                  getActiveFilterCount={getActiveFilterCount}
                  isMobile={true}
                  onCloseMobile={() => setMobileFiltersOpen(false)}
                />
              </div>

              {/* Apply button */}
              <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-4">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3.5 rounded-2xl bg-neutral-950 text-white text-sm font-bold
                    active:scale-[0.98] transition-transform"
                >
                  Show {pagination.total} results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Sort Bottom Sheet (mobile) ── */}
      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        value={filters.sort}
        onChange={(v) => handleFilterChange("sort", v)}
      />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-neutral-100 px-4 py-3 md:hidden">
        <div className="h-10 rounded-2xl bg-neutral-100 animate-pulse" />
        <div className="flex gap-2 mt-2.5">
          <div className="flex-1 h-8 rounded-xl bg-neutral-100 animate-pulse" />
          <div className="flex-1 h-8 rounded-xl bg-neutral-100 animate-pulse" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-neutral-100 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <ProductsPageComponent />
    </Suspense>
  );
}
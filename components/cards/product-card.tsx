"use client";
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Heart, ShoppingBag } from 'lucide-react'

type Props = {
  id: string
  name: string
  imageUrl: string
  price: number
  salesPrice: number
  isNew?: boolean
  isBestSeller?: boolean
  rating?: number
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => {
      const filled = i < Math.floor(rating)
      const half = !filled && i < rating
      return (
        <svg key={i} width="9" height="9" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1l1.4 2.8 3.1.5-2.25 2.2.53 3.1L6 8.25 3.22 9.6l.53-3.1L1.5 4.3l3.1-.5z"
            fill={filled ? '#111' : half ? 'url(#half)' : 'none'}
            stroke={filled || half ? '#111' : '#ccc'}
            strokeWidth="0.8"
          />
          {half && (
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#111" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          )}
        </svg>
      )
    })}
  </div>
)

// ─── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({
  id,
  name,
  imageUrl,
  salesPrice,
  price,
  isNew = false,
  isBestSeller = false,
  rating = 0,
}: Props) {
  const [wished, setWished] = useState(false)
  const [wishBurst, setWishBurst] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [hovered, setHovered] = useState(false)

  const safePrice = price ?? 0
  const safeSalesPrice = salesPrice ?? 0
  const hasDiscount = safeSalesPrice > 0 && safeSalesPrice < safePrice
  const discountPct = hasDiscount
    ? Math.round(((safePrice - safeSalesPrice) / safePrice) * 100)
    : 0

  const fmt = (v: number) => v?.toLocaleString('en-IN') ?? '0'

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault()
    setWished(w => !w)
    setWishBurst(true)
    setTimeout(() => setWishBurst(false), 600)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (addedToCart) return
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <Link href={`/product/${id}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-black/30 rounded-xl">
      <motion.div
        className="group flex flex-col"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      >
        {/* ── Image area ── */}
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-neutral-100 mb-3">

          <Image
            src={imageUrl || '/placeholder.jpg'}
            alt={name || 'Product'}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
            sizes="(max-width: 640px) 50vw, 25vw"
          />

          {/* Gradient — only on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* ── Badges (top-left) ── */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {isNew && (
              <span className="text-[9px] font-bold tracking-[0.16em] uppercase
                bg-black text-white px-2 py-0.5 rounded-md">
                New
              </span>
            )}
            {isBestSeller && (
              <span className="text-[9px] font-bold tracking-[0.16em] uppercase
                bg-white/90 text-black px-2 py-0.5 rounded-md border border-black/10 shadow-sm backdrop-blur-sm">
                Best seller
              </span>
            )}
            {hasDiscount && (
              <span className="text-[9px] font-bold tracking-[0.1em] uppercase
                bg-red-500 text-white px-2 py-0.5 rounded-md shadow-sm">
                −{discountPct}%
              </span>
            )}
          </div>

          {/* ── Wishlist (top-right) ── */}
          <button
            onClick={toggleWish}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-2.5 right-2.5 z-10
              w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
              flex items-center justify-center shadow-sm border border-black/[0.06]
              opacity-0 group-hover:opacity-100
              -translate-y-1 group-hover:translate-y-0
              transition-all duration-300"
          >
            <motion.div
              animate={wishBurst ? { scale: [1, 1.5, 0.9, 1.1, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <Heart
                size={13}
                className={wished
                  ? 'fill-rose-500 stroke-rose-500'
                  : 'stroke-black/50 fill-transparent'
                }
              />
            </motion.div>
          </button>

          {/* ── Bottom action bar — slides up ── */}
          <div
            className="absolute bottom-0 inset-x-0 z-10 p-2.5
              translate-y-full group-hover:translate-y-0
              transition-transform duration-300 ease-out"
          >
            <button
              onClick={handleAddToCart}
              className={`
                w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                text-[11px] font-semibold tracking-[0.1em] uppercase
                shadow-lg transition-all duration-300
                ${addedToCart
                  ? 'bg-black text-white'
                  : 'bg-white/95 text-black hover:bg-white backdrop-blur-sm border border-black/[0.07]'
                }
              `}
            >
              <AnimatePresence mode="wait" initial={false}>
                {addedToCart ? (
                  <motion.span
                    key="added"
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    className="flex items-center gap-1.5"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ShoppingBag size={11} />
                    Add to bag
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="px-0.5 flex flex-col gap-1">
          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-1.5">
              <Stars rating={rating} />
              <span className="text-[10px] text-neutral-400 font-medium">{rating.toFixed(1)}</span>
            </div>
          )}

          {/* Name */}
          <h3 className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em]
            text-neutral-700 leading-snug line-clamp-2
            group-hover:text-black transition-colors duration-200">
            {name || 'Unnamed Product'}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-0.5">
            {hasDiscount ? (
              <>
                <span className="text-sm font-bold text-black">
                  ₹{fmt(safeSalesPrice)}
                </span>
                <span className="text-xs text-neutral-400 line-through font-normal">
                  ₹{fmt(safePrice)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-black">
                ₹{fmt(safePrice)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard
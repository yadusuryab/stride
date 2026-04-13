"use client";
import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Heart } from 'lucide-react'

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
  const [wishAnim, setWishAnim] = useState(false)

  // Add safe checks for prices
  const safePrice = price ?? 0
  const safeSalesPrice = salesPrice ?? 0
  
  const hasDiscount = safeSalesPrice < safePrice
  const discountPct = hasDiscount 
    ? Math.round(((safePrice - safeSalesPrice) / safePrice) * 100) 
    : 0

  // Safe formatting function
  const formatPrice = (value: number) => {
    return value?.toLocaleString() ?? '0'
  }

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault()
    setWished((w) => !w)
    setWishAnim(true)
    setTimeout(() => setWishAnim(false), 400)
  }

  return (
    <Link href={`/product/${id?.toLowerCase() ?? '#'}`} passHref>
      <motion.div
        className="group flex flex-col bg-transparent"
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        {/* ── Image container ── */}
        <div className="relative w-full aspect-[3/4] rounded overflow-hidden bg-gray-50 mb-2.5">

          {/* Image with Ken Burns */}
          <Image
            src={imageUrl || '/placeholder.jpg'} // Add fallback image
            alt={name || 'Product'}
            fill
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Subtle gradient overlay — deepens on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* ── Wishlist button ── */}
          <button
            onClick={toggleWish}
            aria-label="Add to wishlist"
            className="absolute top-2.5 right-2.5 z-10
              w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm
              flex items-center justify-center
              shadow-sm border border-black/[0.06]
              opacity-0 group-hover:opacity-100
              translate-y-[-4px] group-hover:translate-y-0
              transition-all duration-300"
            style={{
              transform: wishAnim ? 'scale(1.3)' : undefined,
              transition: wishAnim ? 'transform 0.15s ease' : undefined,
            }}
          >
            <Heart
              size={13}
              className={wished ? 'fill-black stroke-black' : 'stroke-black/50'}
              style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
            />
          </button>

          {/* ── Badges ── */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {isNew && (
              <span className="text-[9px] font-semibold tracking-[0.14em] uppercase
                bg-black text-white px-2 py-0.5 rounded-sm">
                New
              </span>
            )}
            {isBestSeller && (
              <span className="text-[9px] font-semibold tracking-[0.14em] uppercase
                bg-white text-black px-2 py-0.5 rounded-sm border border-black/10 shadow-sm">
                Best seller
              </span>
            )}
            {hasDiscount && (
              <span className="text-[9px] font-semibold tracking-[0.1em] uppercase
                bg-black/80 text-white px-2 py-0.5 rounded-sm">
                -{discountPct}%
              </span>
            )}
          </div>

          {/* ── Quick view pill — slides up from bottom ── */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center
            translate-y-full group-hover:translate-y-0
            transition-transform duration-300 ease-out pb-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5
              bg-white/95 backdrop-blur-sm rounded-full
              text-[10px] font-semibold tracking-[0.12em] uppercase text-black
              shadow-md border border-black/[0.07]">
              Quick view <ArrowUpRight size={11} />
            </div>
          </div>
        </div>

        {/* ── Info row ── */}
        <div className="flex flex-col gap-0.5 px-0.5">
          {/* Name */}
          <h3 className="text-[11px] sm:text-xs font-medium uppercase tracking-[0.08em]
            text-black/80 leading-snug line-clamp-1
            group-hover:text-black transition-colors duration-200">
            {name || 'Unnamed Product'}
          </h3>

          {/* Price row */}
          <div className="flex items-center gap-1.5 mt-0.5">
            {hasDiscount ? (
              <>
                <span className="text-xs font-semibold text-black">
                  ₹{formatPrice(safeSalesPrice)}
                </span>
                <span className="text-[10px] text-black/35 line-through font-normal">
                  ₹{formatPrice(safePrice)}
                </span>
              </>
            ) : (
              <span className="text-xs font-semibold text-black">
                ₹{formatPrice(safePrice)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default ProductCard
// components/cards/category-card.tsx
'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export type CategoryCardProps = {
  name: string
  image: string
  slug: string
  productCount?: number
}

function CategoryCard({ name, image, slug, productCount }: CategoryCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6
    setTilt({ x, y })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  return (
    <Link
      ref={cardRef}
      href={`/products?category=${slug}`}
      className="block group flex-shrink-0 w-[200px] sm:w-[240px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: hovered
          ? 'transform 0.12s ease-out'
          : 'transform 0.55s cubic-bezier(0.16,1,0.3,1)',
        willChange: 'transform',
      }}
    >
      <div
        className="relative h-[280px] sm:h-[320px] rounded-xl overflow-hidden bg-neutral-100"
        style={{
          boxShadow: hovered
            ? '0 20px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)'
            : '0 2px 10px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.4s ease',
        }}
      >
        {/* Image */}
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          style={{
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 1.6s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
          sizes="(max-width: 640px) 200px, 240px"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=600&fit=crop'
          }}
        />

        {/* Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: hovered
              ? 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)',
            transition: 'background 0.5s ease',
          }}
        />

        {/* Product count badge */}
        {productCount !== undefined && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full
              bg-white/90 backdrop-blur-sm text-[10px] font-medium text-black/60
              tracking-wide shadow-sm"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(-6px)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          >
            {productCount} items
          </div>
        )}

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            className="text-white font-medium text-sm tracking-[0.12em] uppercase"
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(2px)',
              transition: 'transform 0.35s ease',
            }}
          >
            {name}
          </h3>

          <div
            className="flex items-center justify-between mt-2.5"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 0.35s ease 0.05s, transform 0.35s ease 0.05s',
            }}
          >
            <span className="text-white/60 text-[11px] tracking-[0.15em] uppercase font-light">
              Shop now
            </span>
            <div
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center"
              style={{
                transform: hovered ? 'scale(1.1) rotate(8deg)' : 'scale(1)',
                transition: 'transform 0.3s ease',
              }}
            >
              <ArrowUpRight className="w-3 h-3 text-black" />
            </div>
          </div>
        </div>

        {/* Shine sweep */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
            transform: hovered ? 'translateX(100%)' : 'translateX(-100%)',
            transition: hovered ? 'transform 0.65s ease' : 'none',
          }}
        />
      </div>
    </Link>
  )
}

export default CategoryCard
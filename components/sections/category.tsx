'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

export type Category = {
  name: string
  image: string
  slug: string
  productCount?: number
}

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[200px] h-[280px] bg-neutral-100 relative overflow-hidden rounded-none">
      <div
        className="absolute inset-0 -translate-x-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.04), transparent)',
          animation: 'shimmer 1.8s ease-in-out infinite',
        }}
      />
    </div>
  )
}

function CategoryCard({
  cat,
  index,
  visible,
}: {
  cat: Category
  index: number
  visible: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/products?category=${cat.slug}`}
      className="flex-shrink-0 relative overflow-hidden block"
      style={{
        width: '200px',
        height: '300px',
        textDecoration: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${cat.image})`,
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0.0) 100%)',
        }}
      />

      {/* Orange bottom line on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary transition-all duration-300"
        style={{ transform: hovered ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left' }}
      />

      {/* Index — top left */}
      <span
        className="absolute top-4 left-4 text-[9px] font-black tracking-[0.3em] text-white/60"
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Arrow icon top right */}
      <div
        className="absolute top-4 right-4 transition-all duration-300"
        style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translate(0,0)' : 'translate(4px,-4px)' }}
      >
        <ArrowUpRight size={14} className="text-primary" strokeWidth={2.5} />
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3
          className="text-white font-black leading-none tracking-tighter m-0 transition-transform duration-300"
          style={{
            fontSize: '26px',
            transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
          }}
        >
          {cat.name}
        </h3>
        <div
          className="mt-2 transition-all duration-300"
          style={{ opacity: hovered ? 1 : 0.4, transform: hovered ? 'translateY(0)' : 'translateY(4px)' }}
        >
          <span className="text-[8px] font-black tracking-[0.35em] uppercase text-muted">
            {cat.productCount != null ? `${cat.productCount} pieces` : 'Explore'}
          </span>
        </div>
      </div>
    </Link>
  )
}

function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch('/api/categories')
        if (!res.ok) throw new Error(`${res.status}`)
        const data = await res.json()
        if (!Array.isArray(data)) throw new Error('Invalid data')
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed')
        setCategories([
          { name: 'Men',         image: '/category-men.avif',         slug: 'men',         productCount: 84 },
          { name: 'Women',       image: '/category-women.avif',       slug: 'women',       productCount: 112 },
          { name: 'Accessories', image: '/category-accessories.avif', slug: 'accessories', productCount: 56 },
          { name: 'Footwear',    image: '/category-footwear.avif',    slug: 'footwear',    productCount: 39 },
        ])
      } finally {
        setIsLoading(false)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(250%)} }
        .cat-scroll::-webkit-scrollbar { display: none; }
        .cat-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <section ref={sectionRef} className="py-6 relative">

        {/* Header */}
        <div className="px-6 mb-5 flex items-end justify-between">
          <div>
            {/* Eyebrow label */}
            <p
              className="text-xs tracking-wider font-semibold  uppercase text-primary m-0 mb-1 transition-all duration-500"
              style={{ opacity: visible ? 1 : 0, transitionDelay: '50ms' }}
            >
              Shop
            </p>
            <h2
              className="leading-none font-hd tracking-tighter m-0 transition-all duration-500"
              style={{
                fontSize: 'clamp(28px, 6vw, 44px)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: '70ms',
              }}
            >
               Essentials
            </h2>
          </div>

          <Link href="/products">
            <Button>
              View All
              <ArrowRight size={12} strokeWidth={2.5} />
            </Button>
          </Link>
        </div>

        {/* Horizontal scroll strip */}
        {isLoading ? (
          <div className="flex gap-[3px] px-6 overflow-hidden">
            {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground text-center py-12 text-[11px] font-black tracking-widest uppercase">
            No collections found
          </p>
        ) : (
          <div
            ref={scrollRef}
            className="cat-scroll flex gap-[3px] overflow-x-auto px-6"
            style={{ paddingRight: '24px' }}
          >
            {categories.map((cat, i) => (
              <CategoryCard key={cat.slug} cat={cat} index={i} visible={visible} />
            ))}

            {/* "See all" terminal card */}
            <Link
              href="/products"
              className="flex-shrink-0 flex flex-col items-center justify-center border border hover:border-primary transition-colors duration-300"
              style={{ width: '80px', height: '300px', textDecoration: 'none' }}
            >
              <ArrowRight size={16} className="text-primary mb-2" strokeWidth={2} />
              <span className="text-[7px] font-black tracking-[0.3em] uppercase text-neutral-400 rotate-90 whitespace-nowrap mt-3">
                All
              </span>
            </Link>
          </div>
        )}

        {/* Bottom border */}

        {error && process.env.NODE_ENV === 'development' && (
          <div className="mx-6 mt-4 px-4 py-3 bg-orange-50 border border-orange-200">
            <p className="text-primary text-[11px] m-0 font-black tracking-wider">
              Fallback data: {error}
            </p>
          </div>
        )}
      </section>
    </>
  )
}

export default CategorySection
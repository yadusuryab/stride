'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'

export type Category = {
  name: string
  image: string
  slug: string
  productCount?: number
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard({ tall }: { tall?: boolean }) {
  return (
    <div className={`relative w-full overflow-hidden bg-neutral-100 ${tall ? 'h-[480px]' : 'h-[280px]'}`}>
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

// ── Category Row ──────────────────────────────────────────────────────────────
function CategoryRow({
  cat,
  index,
  visible,
  tall,
}: {
  cat: Category
  index: number
  visible: boolean
  tall?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={`/products?category=${cat.slug}`}
      className="block group relative overflow-hidden"
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: tall ? '260px' : '200px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: `opacity 0.6s ease ${index * 100}ms, transform 0.6s ease ${index * 100}ms`,
        }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${cat.image})`,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />

        {/* Dark gradient */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: hovered
              ? 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.10) 100%)'
              : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.30) 55%, rgba(0,0,0,0.05) 100%)',
          }}
        />

        {/* Orange left accent bar */}
        {/* <div
          className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        /> */}

        {/* Index — top left */}
        <div
          className="absolute top-5 left-5 font-black text-[10px] tracking-[0.3em] text-white transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0, transitionDelay: `${index * 100 + 200}ms` }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3
            className=" text-white leading-none tracking-tighter m-0 transition-transform duration-400"
            style={{
              fontSize: tall ? '52px' : '32px',
              transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
            }}
          >
            {cat.name}
          </h3>

          <div
            className="flex items-center justify-between mt-3 transition-all duration-300"
            style={{
              opacity: hovered ? 1 : 0.5,
              transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            }}
          >
            <span className="text-[9px] font-black tracking-[0.35em] uppercase text-muted-foreground">
              {cat.productCount != null ? `${cat.productCount} pieces` : 'Explore'}
            </span>

            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center border transition-all duration-300"
              style={{
                borderColor: hovered ? 'rgba(249,115,22,0.6)' : 'rgba(255,255,255,0.2)',
                background: hovered ? 'rgba(249,115,22,0.15)' : 'transparent',
              }}
            >
              <ArrowRight size={13} className="text-orange-400" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

// ── CategorySection ───────────────────────────────────────────────────────────
function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  const [hero, ...rest] = categories

  return (
    <>
      <style>{`@keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(250%)} }`}</style>

      <section ref={sectionRef} className="bg-white py-16 relative">

        {/* Orange top border */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-primary" />

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="px-6 mb-8 flex items-end justify-between">
          <div>
            {/* Eyebrow */}
            <div
              className="flex items-center gap-2 mb-3 transition-all duration-500"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(8px)' }}
            >
              <span className="text-sm tracking-tighter uppercase text-primary">
                Find by
              </span>
              <div className="h-px w-8 bg-primary" />
            </div>

            {/* Headline */}
            <h2
              className=" leading-none tracking-tighter m-0 transition-all duration-500"
              style={{
                fontSize: 'clamp(32px, 6vw, 48px)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: '70ms',
              }}
            >
            Category
            </h2>
          </div>

          {/* View all */}
          <Link
            href="/products"
          >
           <Button> View All
            <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
          </Button></Link>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="px-6 flex flex-col gap-[3px]">
            <SkeletonCard tall />
            <div className="grid grid-cols-2 gap-[3px]">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-neutral-400 text-center py-12 text-[12px] font-black tracking-widest uppercase">
            No collections found
          </p>
        ) : (
          <div className="flex flex-col gap-[3px] px-6">
            {hero && <CategoryRow cat={hero} index={0} visible={visible} tall />}
            {rest.length > 0 && (
              <div
                className="grid gap-[3px]"
                style={{ gridTemplateColumns: rest.length === 1 ? '1fr' : '1fr 1fr' }}
              >
                {rest.map((cat, i) => (
                  <CategoryRow key={cat.slug} cat={cat} index={i + 1} visible={visible} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom border */}
        <div className="absolute bottom-0 left-6 right-6 h-px bg-neutral-200" />

        {/* Dev error */}
        {error && process.env.NODE_ENV === 'development' && (
          <div className="mx-6 mt-4 px-4 py-3 bg-orange-50 border border-orange-200 rounded-sm">
            <p className="text-orange-600 text-[11px] m-0 font-black tracking-wider">
              Fallback data: {error}
            </p>
          </div>
        )}
      </section>
    </>
  )
}

export default CategorySection
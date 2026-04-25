'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { RainbowButton } from "../ui/rainbow-button";

// ─── Types ────────────────────────────────────────────────────────────────────

type BannerItem = {
  _id: string;
  _type: 'image' | 'video';
  title?: string;
  subtitle?: string;
  mediaType?: 'image' | 'video';
  imageUrl?: string;
  image?: { asset?: { url: string } };
  video?: { url: string; mimeType?: string };
  videoPoster?: string;
  buttonText?: string;
  buttonLink?: string;
  ctaText?: string;
  ctaLink?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SLIDE_DURATION = 6000;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const convertBannerToMediaItem = (banner: BannerItem, index: number) => {
  const isVideo = banner.mediaType === 'video';
  return {
    _key: banner._id || `banner-${index}`,
    _type: isVideo ? 'video' : 'image',
    asset: isVideo ? undefined : { url: banner.imageUrl || banner.image?.asset?.url || '' },
    videoFile: isVideo ? { asset: { url: banner.video?.url || '', mimeType: banner.video?.mimeType } } : undefined,
    poster: isVideo ? { asset: { url: banner.videoPoster || '' } } : undefined,
    alt: banner.title || 'Banner',
  };
};

const getActiveBanners = async (): Promise<BannerItem[]> => {
  try {
    const res = await fetch('/api/banner');
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

// ─── Slide Media ──────────────────────────────────────────────────────────────

const SlideMedia: React.FC<{
  media: ReturnType<typeof convertBannerToMediaItem>;
  isActive: boolean;
  priority?: boolean;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
}> = ({ media, isActive, priority, onVideoPlay, onVideoPause }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const videoUrl = media.videoFile?.asset?.url;

  useEffect(() => {
    if (media._type !== 'video' || !videoRef.current) return;
    if (isActive && playing) {
      videoRef.current.play().catch(() => setPlaying(false));
    } else {
      videoRef.current.pause();
      if (!isActive) {
        setPlaying(false);
        onVideoPause?.();
      }
    }
  }, [playing, isActive, media._type]);

  if (media._type === 'image') {
    return (
      <div className="absolute inset-0">
        {media.asset?.url && (
          <img
            src={media.asset.url}
            alt={media.alt || ''}
            className="w-full h-full object-cover"
            style={{
              transform: isActive ? 'scale(1.06)' : 'scale(1)',
              transition: isActive
                ? `transform ${SLIDE_DURATION + 1000}ms cubic-bezier(0.25,0.46,0.45,0.94)`
                : 'transform 800ms ease',
            }}
            loading={priority ? 'eager' : 'lazy'}
          />
        )}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-black">
      {videoUrl && (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            poster={media.poster?.asset?.url}
            className="w-full h-full object-cover"
            muted={muted}
            playsInline
            onEnded={() => { setPlaying(false); onVideoPause?.(); }}
          />
          {!playing && (
            <button
              onClick={(e) => { e.stopPropagation(); setPlaying(true); onVideoPlay?.(); }}
              className="absolute inset-0 z-10 flex items-center justify-center group"
              aria-label="Play video"
            >
              <span className="w-16 h-16 rounded-full border border-white/30 bg-white/10 backdrop-blur-md
                flex items-center justify-center
                group-hover:bg-white/25 group-hover:scale-110 group-hover:border-white/50
                transition-all duration-300 shadow-xl">
                <Play className="w-6 h-6 text-white ml-1" fill="white" />
              </span>
            </button>
          )}
          {playing && (
            <div className="absolute bottom-5 right-5 z-20 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) { videoRef.current.muted = !muted; setMuted(m => !m); }
                }}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/15
                  flex items-center justify-center text-white
                  hover:bg-black/60 hover:border-white/30 transition-all duration-200"
              >
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setPlaying(false); onVideoPause?.(); }}
                aria-label="Pause"
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/15
                  flex items-center justify-center text-white
                  hover:bg-black/60 hover:border-white/30 transition-all duration-200"
              >
                <Pause size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Progress Bar ─────────────────────────────────────────────────────────────

const ProgressBar: React.FC<{
  total: number;
  current: number;
  progressKey: number;
  isPaused: boolean;
  onDotClick: (i: number) => void;
}> = ({ total, current, progressKey, isPaused, onDotClick }) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        onClick={(e) => { e.stopPropagation(); onDotClick(i); }}
        aria-label={`Go to slide ${i + 1}`}
        className="relative h-[3px] rounded-full overflow-hidden transition-all duration-500"
        style={{ width: current === i ? 40 : 16, background: 'rgba(255,255,255,0.2)' }}
      >
        {current === i && (
          <div
            key={progressKey}
            className="absolute inset-y-0 left-0 rounded-full bg-white"
            style={{
              animation: `progressFill ${SLIDE_DURATION}ms linear forwards`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          />
        )}
        {current !== i && i < current && (
          <div className="absolute inset-0 bg-white/60 rounded-full" />
        )}
      </button>
    ))}
  </div>
);

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);
  const [progressKey, setProgressKey] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  // Touch swipe
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getActiveBanners();
        setBanners(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startAutoSlide = useCallback((count: number) => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    if (count <= 1 || isVideoPlaying) return;
    autoSlideRef.current = setInterval(() => {
      setSelectedIndex(p => (p + 1) % count);
      setProgressKey(k => k + 1);
      setTextVisible(false);
      setTimeout(() => setTextVisible(true), 250);
    }, SLIDE_DURATION);
  }, [isVideoPlaying]);

  useEffect(() => {
    if (!isPaused) startAutoSlide(banners.length);
    else if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    return () => { if (autoSlideRef.current) clearInterval(autoSlideRef.current); };
  }, [banners.length, startAutoSlide, isPaused]);

  const goTo = useCallback((index: number) => {
    setTextVisible(false);
    setTimeout(() => {
      setSelectedIndex(index);
      setProgressKey(k => k + 1);
      setTextVisible(true);
    }, 200);
    startAutoSlide(banners.length);
  }, [banners.length, startAutoSlide]);

  const goPrev = () => selectedIndex > 0 && goTo(selectedIndex - 1);
  const goNext = () => selectedIndex < banners.length - 1 && goTo(selectedIndex + 1);

  const handleSlideClick = useCallback(() => {
    if (isVideoPlaying) return;
    const href = banners[selectedIndex]?.buttonLink || banners[selectedIndex]?.ctaLink;
    if (href) router.push(href);
  }, [banners, selectedIndex, router, isVideoPlaying]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return; // too small — treat as tap
    if (dx < 0) goNext();
    else goPrev();
  };

  // ── Skeleton ──
  if (loading) {
    return (
      <section className={cn("w-full p-4", className)}>
        <div className="relative w-full h-[45vh] md:h-[75vh] rounded-xl bg-neutral-100 overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite]
            bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
        <div className="mt-3 h-24 rounded-xl bg-neutral-100 md:hidden overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite]
            bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
        <style>{`@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
      </section>
    );
  }

  // ── Fallback ──
  if (!banners.length) {
    return (
      <section className={cn("w-full p-4", className)}>
        <div className="relative w-full h-[45vh] md:h-[75vh] rounded-xl bg-neutral-900 overflow-hidden flex items-end">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative z-10 p-8 md:p-16 max-w-2xl">
            <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 mb-4 font-mono">New Collection</p>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-6">
              Welcome to<br />Our Store
            </h1>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white border-b border-white/20 hover:border-white pb-px transition-all duration-300">
              Explore Collection <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const current = banners[selectedIndex];
  const ctaHref = current?.buttonLink || current?.ctaLink;
  const ctaLabel = current?.buttonText || current?.ctaText;
  const hasCta = !!(ctaHref && ctaLabel);

  return (
    <>
      <style>{`
        @keyframes shimmer { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        @keyframes progressFill { from{transform:scaleX(0)} to{transform:scaleX(1)} }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section className={cn("w-full select-none p-4", className)} aria-label="Featured collection">

        {/* ── Main slide ── */}
        <div
          className={cn(
            "relative w-full h-[45vh] md:h-[75vh] rounded-2xl overflow-hidden bg-neutral-950",
            hasCta && !isVideoPlaying && "cursor-pointer"
          )}
          onPointerDown={(e) => { pointerDownPos.current = { x: e.clientX, y: e.clientY }; }}
          onPointerUp={(e) => {
            if (!pointerDownPos.current) return;
            const dx = Math.abs(e.clientX - pointerDownPos.current.x);
            const dy = Math.abs(e.clientY - pointerDownPos.current.y);
            pointerDownPos.current = null;
            if (dx < 6 && dy < 6) handleSlideClick();
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          role={hasCta ? "button" : undefined}
          tabIndex={hasCta ? 0 : undefined}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleSlideClick();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
          }}
          aria-label={hasCta ? ctaLabel : undefined}
        >
          {/* Slides */}
          {banners.map((banner, index) => {
            const media = convertBannerToMediaItem(banner, index);
            const isActive = selectedIndex === index;
            return (
              <div
                key={banner._id || index}
                className="absolute inset-0"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 800ms cubic-bezier(0.4,0,0.2,1)',
                  zIndex: isActive ? 1 : 0,
                }}
                aria-hidden={!isActive}
              >
                <SlideMedia
                  media={media}
                  isActive={isActive}
                  priority={index === 0}
                  onVideoPlay={() => setIsVideoPlaying(true)}
                  onVideoPause={() => setIsVideoPlaying(false)}
                />
              </div>
            );
          })}

          {/* Gradient overlays */}
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/10 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />

          {/* ── Desktop content ── */}
          <div className="hidden md:flex absolute inset-0 z-20 flex-col justify-between p-10 lg:p-14 pointer-events-none">

            {/* Top bar: slide count */}
            <div className="flex items-center justify-between pointer-events-auto">
              <span className="font-mono text-[11px] text-white/30 tracking-widest">
                {String(selectedIndex + 1).padStart(2, '0')} / {String(banners.length).padStart(2, '0')}
              </span>
              {/* Pause indicator */}
              {isPaused && !isVideoPlaying && (
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-mono">Paused</span>
              )}
            </div>

            {/* Bottom: text + controls */}
            <div className="flex items-end justify-between gap-8">
              {/* Text */}
              <div className="p-4 pt-3">
            {/* Title */}
            {current?.title && (
              <h2
                key={`m-title-${selectedIndex}`}
                className="text-3xl font-black tracking-tighter text-white leading-[1.05] mb-1"
                style={{ animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}
              >
                {current.title}
              </h2>
            )}
 
            {/* Subtitle */}
            {current?.subtitle && (
              <p
                key={`m-sub-${selectedIndex}`}
                className="text-[13px] leading-relaxed font-light mt-1 mb-0"
                style={{
                  animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.07s both',
                  color: 'rgba(255,255,255,0.38)',
                }}
              >
                {current.subtitle}
              </p>
            )}
          </div>
              {/* Nav controls */}
              {banners.length > 1 && (
                <div className="flex flex-col items-end gap-4 pointer-events-auto shrink-0">
                  <ProgressBar
                    total={banners.length}
                    current={selectedIndex}
                    progressKey={progressKey}
                    isPaused={isPaused || isVideoPlaying}
                    onDotClick={goTo}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); goPrev(); }}
                      disabled={selectedIndex === 0}
                      className="w-9 h-9 rounded-full border border-white/15 bg-white/5
                        flex items-center justify-center text-white/60
                        hover:bg-white/15 hover:text-white hover:border-white/30
                        disabled:opacity-20 disabled:pointer-events-none
                        backdrop-blur-sm transition-all duration-200 active:scale-95"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); goNext(); }}
                      disabled={selectedIndex === banners.length - 1}
                      className="w-9 h-9 rounded-full border border-white/15 bg-white/5
                        flex items-center justify-center text-white/60
                        hover:bg-white/15 hover:text-white hover:border-white/30
                        disabled:opacity-20 disabled:pointer-events-none
                        backdrop-blur-sm transition-all duration-200 active:scale-95"
                      aria-label="Next slide"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile dot indicators (inside image) ── */}
          {banners.length > 1 && (
            <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <ProgressBar
                total={banners.length}
                current={selectedIndex}
                progressKey={progressKey}
                isPaused={isVideoPlaying}
                onDotClick={goTo}
              />
            </div>
          )}
        </div>

        {/* ── Mobile text panel ── */}
        <div className="md:hidden mt-2 rounded-2xl bg-secondary overflow-hidden">
          {ctaHref ? (
            <Link href={ctaHref} className="block p-4">
              <MobileTextContent
                current={current}
                ctaLabel={ctaLabel}
                selectedIndex={selectedIndex}
              />
            </Link>
          ) : (
            <div className="p-4">
              <MobileTextContent
                current={current}
                ctaLabel={undefined}
                selectedIndex={selectedIndex}
              />
            </div>
          )}

          {/* Mobile nav row */}
          {banners.length > 1 && (
            <div className="flex items-center justify-between px-4 pb-4 pt-1">
              <span className="font-mono text-[11px] text-white/25 tracking-wider">
                {String(selectedIndex + 1).padStart(2, '0')}
                <span className="mx-1.5 text-white/10">/</span>
                {String(banners.length).padStart(2, '0')}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={goPrev}
                  disabled={selectedIndex === 0}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center
                    text-white/40 hover:text-white hover:border-white/30
                    disabled:opacity-20 disabled:pointer-events-none
                    transition-all duration-200 active:scale-95"
                  aria-label="Previous"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={goNext}
                  disabled={selectedIndex === banners.length - 1}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center
                    text-white/40 hover:text-white hover:border-white/30
                    disabled:opacity-20 disabled:pointer-events-none
                    transition-all duration-200 active:scale-95"
                  aria-label="Next"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

      </section>
    </>
  );
};

// ─── Mobile Text Content (extracted to avoid duplication) ─────────────────────

const MobileTextContent: React.FC<{
  current: BannerItem;
  ctaLabel?: string;
  selectedIndex: number;
}> = ({ current, ctaLabel, selectedIndex }) => (
  <div>
    {current?.title && (
      <h2
        key={`m-title-${selectedIndex}`}
        className="text-xl font-black  text-white "
        style={{ animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {current.title}
      </h2>
    )}
    {current?.subtitle && (
      <p
        key={`m-sub-${selectedIndex}`}
        className="text-sm text-muted-foreground leading-relaxed font-bold mt-1"
        style={{ animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.08s both' }}
      >
        {current.subtitle}
      </p>
    )}
    {ctaLabel && (
      <div
        className="mt-3"
        style={{ animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.16s both' }}
      >
        <RainbowButton className="w-full font-hd text-md" size={'lg'}>
          {ctaLabel} <ArrowUpRight size={12} />
        </RainbowButton>
      </div>
    )}
  </div>
);

export default Hero;
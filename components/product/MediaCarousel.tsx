"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { type EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { MinusCircle, PlusCircle, X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

type MediaItem = {
  _type: 'image' | 'video';
  _key: string;
  asset?: {
    url: string;
  };
  alt?: string;
  hotspot?: any;
  videoFile?: {
    asset: {
      url: string;
      mimeType?: string;
      size?: number;
    };
  };
  videoUrl?: string;
  poster?: {
    asset: {
      url: string;
    };
  };
  title?: string;
};

type ThumbPropType = {
  selected: boolean;
  index: number;
  onClick: () => void;
  media: MediaItem;
};

const getAspectRatioClass = (ratio?: string) => {
  switch (ratio) {
    case "square":
      return "aspect-square";
    case "video":
      return "aspect-video";
    case "wide":
      return "aspect-4/3";
    case "auto":
      return "aspect-auto";
    default:
      return "aspect-4/3";
  }
};

// iOS Safari fix: force overflow-hidden to actually clip
const iosSafariOverflowFix: React.CSSProperties = {
  overflow: 'hidden',
  // Force GPU compositing layer — makes overflow-hidden clip correctly on iOS
  WebkitTransform: 'translateZ(0)',
  transform: 'translateZ(0)',
  // The classic iOS rounded-corner overflow fix
  WebkitMaskImage: '-webkit-radial-gradient(white, black)',
};

const MediaContainer: React.FC<{
  media: MediaItem;
  fit?: "cover" | "contain" | "fill";
  aspectRatio?: string;
  showControls?: boolean;
  className?: string;
  isFullscreen?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  isActive?: boolean;
}> = ({
  media,
  aspectRatio,
  className,
  fit = "cover",
  showControls = true,
  isFullscreen = false,
  onPlayStateChange,
  isActive = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const getVideoSource = (item: MediaItem) => {
    if (item.videoUrl) {
      if (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('youtu.be')) {
        return { type: 'youtube', url: item.videoUrl };
      }
      if (item.videoUrl.includes('vimeo.com')) {
        return { type: 'vimeo', url: item.videoUrl };
      }
    }
    if (item.videoFile?.asset?.url) {
      return { type: 'file', url: item.videoFile.asset.url };
    }
    return null;
  };

  const videoSource = getVideoSource(media);

  useEffect(() => {
    if (media._type === 'image') {
      setImageUrl(media.asset?.url);
    }
  }, [media]);

  useEffect(() => {
    if (media._type === 'video' && videoRef.current && isActive) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          console.error("Error playing video:", error);
          setIsPlaying(false);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [media._type, isPlaying, isActive]);

  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  useEffect(() => {
    if (!isActive && media._type === 'video' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive, media._type]);

  const togglePlay = () => {
    if (media._type === 'video') {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (media._type === 'video' && videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoEnded = () => setIsPlaying(false);
  const handleVideoLoaded = () => setIsVideoReady(true);
  const handleVideoError = (error: any) => {
    console.error("Video error:", error);
    setIsPlaying(false);
  };

  if (media._type === 'image') {
    return (
      // FIX: This wrapper must NOT add its own aspect-ratio because the parent
      // slide already has aspect-[3/4]. Adding another aspect-ratio here causes
      // the image to overflow on iOS Safari.
      <div
        className={cn("relative w-full bg-gray-100", className)}
        style={{
          // Fill 100% of the parent's constrained height
          height: '100%',
          ...iosSafariOverflowFix,
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={media.alt || media.title || "Product image"}
            // FIX: Use inline styles instead of Tailwind "absolute inset-0 h-full w-full"
            // because Tailwind's absolute positioning can behave unexpectedly in
            // Safari when the parent uses aspect-ratio (not explicit height/width).
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              // Prevent image from ever being larger than its container on iOS
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: fit,
              display: 'block',
              // GPU layer helps Safari respect the constraint
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
            }}
            loading="lazy"
            draggable="false"
          />
        )}
      </div>
    );
  }

  // Video rendering
  return (
    <div
      className={cn("relative w-full bg-black", className)}
      style={{
        height: '100%',
        ...iosSafariOverflowFix,
      }}
    >
      {videoSource?.type === 'youtube' && (
        <div className="relative w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoSource.url.split('v=')[1]?.split('&')[0]}?autoplay=${isActive && isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={media.title || 'Product video'}
          />
        </div>
      )}

      {videoSource?.type === 'vimeo' && (
        <div className="relative w-full h-full">
          <iframe
            src={`https://player.vimeo.com/video/${videoSource.url.split('vimeo.com/')[1]}?autoplay=${isActive && isPlaying ? 1 : 0}&muted=${isMuted ? 1 : 0}&controls=1&title=0&byline=0&portrait=0`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={media.title || 'Product video'}
          />
        </div>
      )}

      {videoSource?.type === 'file' && (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={videoSource.url}
            poster={media.poster?.asset?.url}
            className="w-full h-full object-cover"
            controls={isPlaying && !isFullscreen}
            muted={isMuted}
            playsInline
            onLoadedData={handleVideoLoaded}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            autoPlay={false}
          />

          {showControls && !isFullscreen && (
            <>
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 group hover:bg-black/30 transition-all z-20"
                  aria-label="Play video"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors shadow-lg">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" />
                  </div>
                </button>
              )}

              {isPlaying && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
                  <button
                    onClick={toggleMute}
                    className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={togglePlay}
                    className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                    aria-label="Pause"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}

          <div className="absolute top-4 left-4 z-10">
            <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">VIDEO</span>
          </div>
        </div>
      )}

      {(videoSource?.type === 'youtube' || videoSource?.type === 'vimeo') && !isPlaying && showControls && !isFullscreen && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 group hover:bg-black/30 transition-all z-20"
          aria-label="Play video"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors shadow-lg">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" />
          </div>
        </button>
      )}
    </div>
  );
};

const Thumb: React.FC<ThumbPropType> = (props) => {
  const { media, index, onClick, selected } = props;

  const getThumbnailUrl = (item: MediaItem) => {
    if (item._type === 'image') return item.asset?.url;
    if (item._type === 'video') return item.poster?.asset?.url || item.asset?.url;
    return '';
  };

  const thumbnailUrl = getThumbnailUrl(media);

  return (
    <div
      className={cn(
        "transition-all duration-200",
        selected ? "opacity-100 scale-105" : "opacity-60 hover:opacity-80 hover:scale-[1.02]",
        "flex-[0_0_22%] pl-3 sm:flex-[0_0_15%]"
      )}
    >
      <button
        onClick={onClick}
        className="relative w-full cursor-pointer touch-manipulation appearance-none overflow-hidden rounded border-0 bg-transparent p-0"
        type="button"
      >
        <div
          className="relative w-full aspect-square bg-gray-100"
          style={{
            borderRadius: '0.5rem',
            ...iosSafariOverflowFix,
          }}
        >
          {thumbnailUrl ? (
            <>
              <img
                src={thumbnailUrl}
                alt={media.alt || media.title || `Thumbnail ${index + 1}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {media._type === 'video' && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              {media._type === 'video' ? (
                <Play className="w-6 h-6 text-gray-500" />
              ) : (
                <div className="text-gray-400 text-xs">No preview</div>
              )}
            </div>
          )}

          {selected && (
            <div className="absolute inset-0 border-2 border-black rounded-lg pointer-events-none" />
          )}
        </div>
      </button>
    </div>
  );
};

interface MediaCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  media: MediaItem[];
  opts?: EmblaOptionsType;
  showControls?: boolean;
  imageFit?: "cover" | "contain" | "fill";
  aspectRatio?: "square" | "video" | "wide" | "auto";
  showThumbs?: boolean;
  selectedIndex?: number;
  onSlideChange?: (index: number) => void;
  className?: string;
}

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  aspectRatio = "wide",
  className,
  imageFit = "contain",
  media,
  onSlideChange,
  opts,
  selectedIndex: controlledIndex,
  showControls = true,
  showThumbs = false,
  ...props
}) => {
  const isControlled = controlledIndex !== undefined;
  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const currentIndex = isControlled ? controlledIndex : internalSelectedIndex;
  const currentMedia = media[currentIndex];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...opts,
    align: "start",
    slidesToScroll: 1,
    axis: "x",
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      setIsVideoPlaying(false);
      if (isControlled && onSlideChange) {
        onSlideChange(index);
      } else {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi, isControlled, onSlideChange]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedSlideIndex = emblaApi.selectedScrollSnap();
    setIsVideoPlaying(false);
    if (!isControlled) {
      setInternalSelectedIndex(selectedSlideIndex);
    } else if (onSlideChange && selectedSlideIndex !== controlledIndex) {
      onSlideChange(selectedSlideIndex);
    }
  }, [emblaApi, isControlled, onSlideChange, controlledIndex]);

  useEffect(() => {
    if (isControlled && emblaApi && emblaApi.selectedScrollSnap() !== controlledIndex) {
      emblaApi.scrollTo(controlledIndex);
    }
  }, [controlledIndex, emblaApi, isControlled]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50 && currentIndex < media.length - 1) onThumbClick(currentIndex + 1);
    else if (distance < -50 && currentIndex > 0) onThumbClick(currentIndex - 1);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  if (!media || media.length === 0) {
    return (
      <div className={cn("relative w-full", className)}>
        <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">No media available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full", className)}
      role="region"
      aria-roledescription="carousel"
      {...props}
    >
      {/* Main Carousel */}
      <div
        className="w-full relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex -ml-4">
            {media?.map((item, index) => (
              <div
                key={item._key || index}
                className={cn(
                  "min-w-0 flex-[0_0_80%] pl-4",
                  currentIndex === index ? "z-10" : "z-0"
                )}
                role="group"
                aria-roledescription="slide"
              >
                {/*
                  FIX: This is the SINGLE source-of-truth for sizing.
                  aspect-[3/4] here controls the height. MediaContainer MUST NOT
                  add another aspect-ratio wrapper on top — it just fills this box.
                  iOS Safari overflows when two nested elements both define aspect-ratio.
                */}
                <div
                  className="relative aspect-[3/4] rounded-lg"
                  style={iosSafariOverflowFix}
                >
                  <MediaContainer
                    media={item}
                    fit={imageFit}
                    // FIX: Don't pass aspectRatio to MediaContainer — the parent
                    // already controls the dimensions. Passing it caused a double
                    // aspect-ratio nesting which breaks iOS Safari.
                    aspectRatio={undefined}
                    showControls={showControls}
                    className="absolute inset-0 w-full h-full rounded-lg"
                    isActive={currentIndex === index}
                    onPlayStateChange={(playing) => {
                      if (currentIndex === index) setIsVideoPlaying(playing);
                    }}
                    isFullscreen={false}
                  />

                  {/* Fullscreen trigger for images */}
                  {item._type === 'image' && (
                    <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
                      <DialogTrigger asChild>
                        <button
                          className="absolute bottom-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label="Open image in fullscreen"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                          </svg>
                        </button>
                      </DialogTrigger>

                      <DialogPortal>
                        <DialogOverlay className="fixed inset-0 z-50 bg-black/80" />
                        <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-0">
                          <DialogTitle className="sr-only">
                            {item.title || "Fullscreen Image"}
                          </DialogTitle>
                          <DialogDescription className="sr-only">
                            {item.alt || "Product image"}
                          </DialogDescription>

                          <div className="relative flex h-screen w-screen items-center justify-center">
                            <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0}>
                              {({ zoomIn, zoomOut }) => (
                                <>
                                  <TransformComponent>
                                    <img
                                      src={item.asset?.url || ''}
                                      alt={item.alt || "Full size"}
                                      className="max-h-[90vh] max-w-[90vw] object-contain"
                                    />
                                  </TransformComponent>
                                  <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                                    <button
                                      onClick={() => zoomOut()}
                                      className="cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                                      aria-label="Zoom out"
                                    >
                                      <MinusCircle className="size-6" />
                                    </button>
                                    <button
                                      onClick={() => zoomIn()}
                                      className="cursor-pointer rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                                      aria-label="Zoom in"
                                    >
                                      <PlusCircle className="size-6" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </TransformWrapper>
                            <DialogClose asChild>
                              <button
                                className="absolute top-4 right-4 z-10 cursor-pointer rounded-full border bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                                aria-label="Close"
                              >
                                <X className="size-6" />
                              </button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </DialogPortal>
                    </Dialog>
                  )}

                  {/* Clickable overlay for peek portions */}
                  {index !== currentIndex && (
                    <div
                      className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-all duration-300 cursor-pointer z-10"
                      onClick={() => onThumbClick(index)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {/* {media.length > 1 && (
          <>
            <button
              onClick={() => onThumbClick(Math.max(0, currentIndex - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
              disabled={currentIndex === 0}
              aria-label="Previous media"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => onThumbClick(Math.min(media.length - 1, currentIndex + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition-all"
              disabled={currentIndex === media.length - 1}
              aria-label="Next media"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )} */}
      </div>

      {/* Media Info */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-medium">
            {currentIndex + 1} / {media.length}
          </span>
          {currentMedia?._type === 'video' && (
            <span className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded">VIDEO</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentIndex === index ? "bg-black" : "bg-gray-300 hover:bg-gray-500"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaCarousel;
export type { MediaItem };
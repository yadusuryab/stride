"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  MinusCircle,
  PlusCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

type ThumbPropType = {
  selected: boolean;
  index: number;
  onClick: () => void;
  imgUrl: string;
  title?: string;
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

const ImageContainer: React.FC<{
  image: { url: string; title?: string };
  alt: string;
  fit?: "cover" | "contain" | "fill";
  aspectRatio?: string;
  showImageControls?: boolean;
  classNameImage?: string;
  classNameThumbnail?: string;
}> = ({
  alt,
  aspectRatio,
  classNameImage,
  classNameThumbnail,
  fit = "cover",
  image,
  showImageControls,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const checkImage = async () => {
      try {
        const response = await fetch(image.url);
        const imageBlob = await response.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImageUrl(imageObjectURL);
      } catch (error) {
        console.error("Error loading image:", error);
        setImageUrl(image.url);
      }
    };

    checkImage();
  }, [image.url]);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-gray-100",
        getAspectRatioClass(aspectRatio)
      )}
    >
      {imageUrl && (
        <Dialog>
          <DialogTrigger asChild>
            <div className="cursor-pointer">
              <img
                src={imageUrl}
                alt={image.title || alt}
                width={400}
                height={600}
                className={cn(
                  "absolute inset-0 h-full w-full",
                  fit === "contain" && "object-contain",
                  fit === "cover" && "object-cover",
                  fit === "fill" && "object-fill",
                  classNameThumbnail
                )}
              />
            </div>
          </DialogTrigger>

          <DialogPortal>
            <DialogOverlay className="fixed inset-0 z-50 bg-black/80" />
            <DialogContent className="bg-background fixed inset-0 z-50 flex flex-col items-center justify-center p-0">
              <DialogTitle className="sr-only">
                {image.title || "Image"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {image.title || "Image"}
              </DialogDescription>

              <div className="relative flex h-screen w-screen items-center justify-center">
                <TransformWrapper
                  initialScale={1}
                  initialPositionX={0}
                  initialPositionY={0}
                >
                  {({ zoomIn, zoomOut }) => (
                    <>
                      <TransformComponent>
                        <img
                          src={imageUrl}
                          alt={image.title || "Full size"}
                          className={cn(
                            "max-h-[90vh] max-w-[90vw] object-contain",
                            classNameImage
                          )}
                        />
                      </TransformComponent>
                      {showImageControls && (
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
                      )}
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
    </div>
  );
};

const Thumb: React.FC<ThumbPropType> = (props) => {
  const { imgUrl, index, onClick, selected, title } = props;

  return (
    <div
      className={cn(
        "transition-opacity duration-200",
        selected ? "opacity-100" : "opacity-50 hover:opacity-70",
        "group-[.thumbs-horizontal]:min-w-0 group-[.thumbs-horizontal]:flex-[0_0_22%] group-[.thumbs-horizontal]:pl-3 sm:group-[.thumbs-horizontal]:flex-[0_0_15%]",
      )}
    >
      <button
        onClick={onClick}
        className="relative w-full cursor-pointer touch-manipulation appearance-none overflow-hidden rounded border-0 bg-transparent p-0"
        type="button"
      >
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-lg bg-gray-100",
            getAspectRatioClass("square")
          )}
        >
          <img
            src={imgUrl}
            alt={title || `Thumbnail ${index + 1}`}
            width={400}
            height={600}
            className={cn("h-full w-full object-cover")}
          />
        </div>
      </button>
    </div>
  );
};

type CarouselImage = {
  title?: string;
  url: string;
};

type CarouselImages = CarouselImage[];

interface ImageCarousel_BasicProps extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImages;
  opts?: EmblaOptionsType;
  showImageControls?: boolean;
  imageFit?: "cover" | "contain" | "fill";
  aspectRatio?: "square" | "video" | "wide" | "auto";
  showThumbs?: boolean;
  selectedIndex?: number;
  showArrows?:boolean;
  showDots?: boolean;
  onSlideChange?: (index: number) => void;
  classNameImage?: string;
  classNameThumbnail?: string;
}

const ImageCarousel_Basic: React.FC<ImageCarousel_BasicProps> = ({
  aspectRatio = "wide",
  className,
  classNameImage,
  classNameThumbnail,

  imageFit = "contain",
  images,
  onSlideChange,
  opts,
  selectedIndex: controlledIndex,
  showImageControls = true,
  showThumbs = true,
  ...props
}) => {
  const isControlled = controlledIndex !== undefined;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    ...opts,
    align: "start",
    slidesToScroll: 1,
    axis: "x",
  });

  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(
    showThumbs
      ? {
          axis: "x",
          containScroll: "keepSnaps",
          dragFree: true,
        }
      : undefined
  );

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi || !emblaThumbsApi) return;

      if (isControlled && onSlideChange) {
        onSlideChange(index);
      } else {
        emblaApi.scrollTo(index);
        emblaThumbsApi.scrollTo(index);
      }
    },
    [emblaApi, emblaThumbsApi, isControlled, onSlideChange]
  );

  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
  const currentIndex = isControlled ? controlledIndex : internalSelectedIndex;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    const selectedSlideIndex = emblaApi.selectedScrollSnap();

    if (!isControlled) {
      setInternalSelectedIndex(selectedSlideIndex);
    } else if (onSlideChange && selectedSlideIndex !== controlledIndex) {
      onSlideChange(selectedSlideIndex);
    }

    if (showThumbs && emblaThumbsApi) {
      emblaThumbsApi.scrollTo(selectedSlideIndex);
    }
  }, [
    emblaApi,
    emblaThumbsApi,
    showThumbs,
    isControlled,
    onSlideChange,
    controlledIndex,
  ]);

  // Effect for controlled mode to update carousel position
  useEffect(() => {
    if (
      isControlled &&
      emblaApi &&
      emblaApi.selectedScrollSnap() !== controlledIndex
    ) {
      emblaApi.scrollTo(controlledIndex);
      if (showThumbs && emblaThumbsApi) {
        emblaThumbsApi.scrollTo(controlledIndex);
      }
    }
  }, [controlledIndex, emblaApi, emblaThumbsApi, isControlled, showThumbs]);

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

  return (
    <div
      className={cn("relative w-full", className)}
      role="region"
      aria-roledescription="carousel"
      {...props}
    >
      {/* Main Carousel with Peek Effect */}
      <div className="w-full relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex -ml-4">
            {images?.map((image, index) => (
              <div
                key={index}
                className="min-w-0 flex-[0_0_80%] pl-4" // 20% peek on mobile
                role="group"
                aria-roledescription="slide"
              >
                <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.title || `Slide ${index + 1}`}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-300 hover:scale-105",
                      imageFit === "contain" && "object-contain",
                      imageFit === "cover" && "object-cover"
                    )}
                    sizes="(max-width: 768px) 80vw, (max-width: 1024px) 66vw, 50vw"
                    priority={index === 0}
                  />
                  
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
      </div>

      {/* Enhanced Thumbnail Indicators */}
      {showThumbs && images.length > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={`
                relative transition-all duration-300 ease-out
                ${currentIndex === index 
                  ? "w-8 h-2 bg-black rounded-full" 
                  : "w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-500 hover:scale-110"
                }
              `}
              aria-label={`Go to image ${index + 1}`}
              aria-current={currentIndex === index ? "true" : "false"}
            >
              {currentIndex === index && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Image {index + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600 font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel_Basic;
export type { CarouselImage, CarouselImages };
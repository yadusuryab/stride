// lib/sanity.image.ts
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-06-01',
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

// Create the image URL builder
const builder = imageUrlBuilder(sanityClient);

/**
 * Generates a Sanity image URL with optional transformations
 * @param source - Sanity image reference
 * @param options - Image transformation options
 * @returns Optimized image URL
 */
export function urlFor(source: any) {
  return builder.image(source);
}

// Extended version with TypeScript types
export function sanityImageBuilder(source: any) {
  return {
    url: () => builder.image(source).url(),
    
    // Size manipulations
    width: (w: number) => sanityImageBuilder(source).size(w),
    height: (h: number) => sanityImageBuilder(source).size(undefined, h),
    size: (w?: number, h?: number) => {
      const img = builder.image(source);
      if (w) img.width(w);
      if (h) img.height(h);
      return sanityImageBuilder(img);
    },
    
    // Quality
    quality: (q: number) => {
      return sanityImageBuilder(builder.image(source).quality(q));
    },
    
    // Cropping
    crop: (mode: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'focalpoint' | 'entropy') => {
      return sanityImageBuilder(builder.image(source).crop(mode));
    },
    
    // Format
    format: (format: 'webp' | 'jpg' | 'png') => {
      return sanityImageBuilder(builder.image(source).format(format));
    },
    
    // Blur
    blur: (amount: number) => {
      return sanityImageBuilder(builder.image(source).blur(amount));
    },
    
    // Flip
    flipHorizontal: () => {
      return sanityImageBuilder(builder.image(source).flipHorizontal());
    },
    flipVertical: () => {
      return sanityImageBuilder(builder.image(source).flipVertical());
    },
    
    // Auto-optimize
    auto: (format: 'format') => {
      return sanityImageBuilder(builder.image(source).auto(format));
    },
    
    // Finalize
    toString: () => builder.image(source).url(),
  };
}

// Example usage types
export type SanityImage = ReturnType<typeof sanityImageBuilder>;
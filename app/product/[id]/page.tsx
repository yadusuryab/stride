import React from "react";
import MediaCarousel from "@/components/product/MediaCarousel"; // Updated
import PriceFormat_Sale from "@/components/commerce-ui/price-format-sale";
import ProductReviewSection from "@/components/sections/reviews";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/utils/add-to-cart";
import ProductBuySection from "@/components/sections/product-add-to-cart";
import StarRating_Basic from "@/components/commerce-ui/star-rating-basic";
import { Metadata, ResolvingMetadata } from "next";
import ProductDetailsClient from "@/components/product/ProductDetailsClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }
    
    const product = await response.json();

    const previousImages = (await parent).openGraph?.images || [];
    // Get first image from media array
    const firstMedia = product.media?.find((item: any) => item._type === 'image');
    const productImage = firstMedia?.asset?.url || '';

    return {
      title: `${product.name} | ${product.category?.title || 'Product'} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: product.description || `${product.name} - Available now at ${process.env.NEXT_PUBLIC_APP_NAME}`,
      keywords: [
        product.name,
        product.category?.title || 'product',
        "buy online",
        "ecommerce",
      ].join(", "),
      openGraph: {
        title: product.name,
        description: product.description || `${product.name} available for purchase`,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`,
        type: "website",
        images: productImage ? [productImage, ...previousImages] : previousImages,
        ...(product.price && {
          'product:price:amount': product.salesPrice || product.price,
          'product:price:currency': 'INR',
        }),
        ...(productImage && {
          'product:image': productImage,
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description || `${product.name} available for purchase`,
        images: productImage ? [productImage] : [],
        ...(product.price && {
          'twitter:label1': 'Price',
          'twitter:data1': `₹${product.salesPrice || product.price}`,
        }),
        ...(product.quantity && {
          'twitter:label2': 'Availability',
          'twitter:data2': product.quantity > 0 ? 'In Stock' : 'Out of Stock',
        }),
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`,
      },
    };
  } catch (error) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
}

const ProductPage = async ({ params }: Props) => {
  const { id } = await params;
  
  let product = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}`, {
      next: { revalidate: 3600 }
    });
    
    if (response.ok) {
      product = await response.json();
    }
    console.log(product)
  } catch (error) {
    console.error('Failed to fetch product:', error);
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[#111111] mb-4">Product Not Found</h1>
          <p className="text-[#666666]">The requested product could not be found.</p>
        </div>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.media?.find((m: any) => m._type === 'image')?.asset?.url || "",
    description: product.description,
    sku: product._id,
    mpn: product._id,
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating.toString(),
        bestRating: "5",
      },
    }),
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`,
      priceCurrency: "INR",
      price: product.salesPrice || product.price,
      priceValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0],
      itemCondition: "https://schema.org/NewCondition",
      availability: product.quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
    },
    ...(product.category && {
      category: product.category.title,
    }),
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumbs */}
      <div className="px-4 md:px-20 lg:px-32 pt-8 pb-4">
        <nav className="text-xs uppercase tracking-wider text-[#666666]">
          SHOP / {product?.category?.title || 'PRODUCTS'} / {product.name.toUpperCase()}
        </nav>
      </div>

      <div className="px-4 md:px-20 lg:px-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Media Carousel */}
          <div className="lg:pr-8">
            <div className="group overflow-hidden bg-[#f4f4f4]">
              <MediaCarousel
                media={product.media || []}
                imageFit="cover"
                className="transition-transform object-cover w-full h-full duration-500"
              />
            </div>
          </div>

          {/* Right Column - Product Info (Client Component) */}
          <ProductDetailsClient product={product} />
        </div>

        {/* Reviews Section */}
        <div className="mt-16 lg:mt-24">
          <ProductReviewSection productId={id} />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
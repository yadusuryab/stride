import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;
  console.log(id)
  // Query for both old schema (just images) and new schema (images + videos)
  const query = `*[_type == "product" && _id == $id][0]{
    _id,
    name,
    images[]{
      _type,
      _key,
      alt,
      // For images
      asset->{_id, url},
      hotspot,
      // For videos (new schema)
      videoFile{
        asset->{
          _id,
          url,
          mimeType,
          size
        }
      },
      videoUrl,
      poster{
        asset->{_id, url}
      },
      title
    },
    price,
    rating,
    salesPrice,
    sizes,
    colors,
    features,
    quantity,
    description,
    soldOut,
    category->{_id, title},
    featured,
    codAvailable
  }`;

  try {
    const product = await sanityClient.fetch(query, { id });
    console.log(product)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Process the images array (which now contains both images and videos)
    const images: any = [];
    const media: any = [];

    if (product.images && product.images.length > 0) {
      product.images.forEach((item: any, index: number) => {
        // Check if it's a video (has videoFile or videoUrl)
        const isVideo = item.videoFile || item.videoUrl;
        
        if (isVideo) {
          // It's a video
          const videoItem = {
            _type: 'video',
            _key: item._key || `video-${index}`,
            title: item.title || '',
            alt: item.alt || '',
            videoFile: item.videoFile?.asset ? {
              asset: {
                url: item.videoFile.asset.url,
                mimeType: item.videoFile.asset.mimeType,
                size: item.videoFile.asset.size,
              }
            } : null,
            videoUrl: item.videoUrl || '',
            poster: item.poster?.asset ? {
              asset: {
                url: item.poster.asset.url,
              }
            } : null,
          };
          
          media.push(videoItem);
          
          // For backward compatibility, also add the video poster as an image
          if (item.poster?.asset?.url) {
            images.push({
              url: item.poster.asset.url,
              alt: item.alt || item.title || 'Video thumbnail',
              isVideo: true,
            });
          }
        } else {
          // It's an image
          if (item.asset?.url) {
            const imageItem = {
              _type: 'image',
              _key: item._key || `img-${index}`,
              asset: {
                url: item.asset.url,
              },
              alt: item.alt || '',
              hotspot: item.hotspot || null,
            };
            
            media.push(imageItem);
            images.push({
              url: item.asset.url,
              alt: item.alt || '',
            });
          }
        }
      });
    }

    // Set default COD availability if not specified (for backward compatibility)
    const codAvailable = product.codAvailable !== undefined ? product.codAvailable : true;
    console.log(product.codAvailable)
    return NextResponse.json({ 
      ...product, 
      codAvailable, // Add COD availability to response
      images, // For backward compatibility (only images)
      media,  // For new components (images + videos)
      // Also include a flag to indicate if there are videos
      hasVideos: media.some((item: any) => item._type === 'video')
    });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
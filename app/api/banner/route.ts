import { sanityClient } from "@/lib/sanity";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `*[_type == "banner" && active == true] | order(order asc) {
      _id,
      title,
      subtitle,
      "imageUrl": image.asset->url,
      ctaText,
      ctaLink,
      mediaType,
      "video": video.asset->{
        url,
        mimeType
      },
      "videoPoster": videoPoster.asset->url,
      textPosition,
      textColor,
      buttonText,
      buttonLink,
      order,
      active
    }`;

    const banners = await sanityClient.fetch(query);
    console.log("Fetched banners:", banners); // Check what's returned
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}
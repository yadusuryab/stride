import { sanityClient } from "@/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ success: false, message: "Missing productId" }, { status: 400 });
    }

    const reviews = await sanityClient.fetch(
      `*[_type == "review" && product._ref == $productId] | order(_createdAt desc){
        name,
        instaId,
        rating,
        review,
        _createdAt
      }`,
      { productId }
    );

    return NextResponse.json({ success: true, reviews });
  } catch (err) {
    console.error("Get Reviews Error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json(
      { success: false, message: "Phone number is required" },
      { status: 400 }
    );
  }

  try {
    const orders = await sanityClient.fetch(
      `*[_type == "order" && phoneNumber == $phone] | order(orderedAt desc)`,
      { phone }
    );
    console.log(orders)
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

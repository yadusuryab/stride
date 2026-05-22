import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";

interface Props {
  params: Promise<{ id: string }>;
}
export async function GET(
  request: Request,
  { params }: Props
) {
  const { id } =await params;

  try {
    const order = await sanityClient.fetch(
      `*[_type == "order" && _id == $id][0]{
        _id,
        customerName,
        phoneNumber,
        address,
        pincode,
        district,
        state,
        landmark,
        instagramId,
        alternatePhone,
        paymentMode,
        paymentStatus,
        transactionId,
        shippingCharges,
        totalAmount,
        orderStatus,
        orderedAt,
        products[] {
          quantity,
          size,
          color,
          product->{
            _id,
            title,
            slug,
            price,
            salesPrice,
            images,
            quantity,
            soldOut
          }
        }
      }`,
      { id }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Fetch order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

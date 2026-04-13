// app/api/create-order/route.ts
import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity";
import { TelegramService } from "@/lib/telegram";

export async function POST(request: Request) {
  try {
    const orderData = await request.json();

    // 1. Create the order in Sanity with size and color
    const createdOrder = await sanityClient.create({
      _type: "order",
      customerName: orderData.customerName,
      phoneNumber: orderData.phoneNumber,
      alternatePhone: orderData.alternatePhone || "",
      instagramId: orderData.instagramId || "",
      address: orderData.address,
      district: orderData.district,
      state: orderData.state,
      pincode: orderData.pincode,
      landmark: orderData.landmark || "",
      paymentMode: orderData.paymentMode,
      shippingCharges: orderData.shippingCharges,
      totalAmount: orderData.totalAmount,
      advanceAmount: orderData.advanceAmount,
      codRemaining: orderData.codRemaining,
      paymentStatus: orderData.paymentStatus,
      transactionId: orderData.transactionId,
      orderedAt: new Date().toISOString(),
      products: orderData.products.map((item: any) => ({
        _type: "products",
        product: {
          _type: "reference",
          _ref: item.product,
        },
        quantity: item.quantity,
        size: item.size || null,      // Include size
        color: item.color || null,    // Include color
      })),
    });

    // 2. Update product quantities
    for (const item of orderData.products) {
      const product = await sanityClient.getDocument(item.product);
      
      if (!product) continue;

      const newQuantity = (product.quantity || 0) - item.quantity;
      const soldOut = newQuantity <= 0;

      await sanityClient
        .patch(item.product)
        .set({
          quantity: newQuantity,
          soldOut: soldOut,
        })
        .commit();
    }

    // 3. Send Telegram notification
    const fullOrder = await sanityClient.fetch(
      `*[_type == "order" && _id == $id][0]{
        ...,
        products[]{
          quantity,
          size,
          color,
          product->{
            _id,
            name,
          }
        }
      }`,
      { id: createdOrder._id }
    );

    await TelegramService.sendOrderNotification(fullOrder);

    return NextResponse.json(
      { success: true, orderId: createdOrder._id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
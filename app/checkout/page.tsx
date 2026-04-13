// app/checkout/page.tsx
"use client";

import { AlertCircle, MessageCircle, Truck, ShieldCheck, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkoutSchema } from "@/lib/validations";
import Link from "next/link";
import Brand from "@/components/utils/brand";

type CartItem = {
  _id: string;
  name: string;
  salesPrice: number;
  cartQty: number;
  size?: string | null;
  color?: string | null;
  image: string;
  slug?: string;
  codAvailable?: boolean;
};

type FormData = z.infer<typeof checkoutSchema>;

function buildWhatsAppMessage(
  data: FormData,
  cart: CartItem[],
  total: number,
  shippingCharges: number,
  paymentMethod: "online" | "cod"
) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "watchz";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yourstore.com";

  const itemLines = cart
    .map((item) => {
      const productUrl = `${baseUrl}/product/${item.slug || item._id}`;
      const variantInfo = [item.size && `Size: ${item.size}`, item.color && `Color: ${item.color}`]
        .filter(Boolean)
        .join(", ");
      return `• ${item.name}${variantInfo ? ` (${variantInfo})` : ""} × ${item.cartQty} = ₹${item.salesPrice * item.cartQty}\n  🔗 ${productUrl}`;
    })
    .join("\n\n");

  const paymentLine =
    paymentMethod === "online"
      ? "💳 Online Payment (UPI/Card)"
      : "💵 Cash on Delivery (₹180 advance)";

  return `🛍️ *New Order — ${appName}*

━━━━━━━━━━━━━━━━━━━━
👤 *Customer Details*
━━━━━━━━━━━━━━━━━━━━
Name: ${data.customerName}
Phone: ${data.phoneNumber}${data.alternatePhone ? `\nAlt Phone: ${data.alternatePhone}` : ""}${data.instagramId ? `\nInstagram: ${data.instagramId}` : ""}

📦 *Delivery Address*
${data.address}
${data.district}, ${data.state} — ${data.pincode}${data.landmark ? `\nLandmark: ${data.landmark}` : ""}

━━━━━━━━━━━━━━━━━━━━
🛒 *Order Items*
━━━━━━━━━━━━━━━━━━━━
${itemLines}

━━━━━━━━━━━━━━━━━━━━
💰 *Order Summary*
━━━━━━━━━━━━━━━━━━━━
Subtotal: ₹${total - shippingCharges}
Shipping: ${shippingCharges === 0 ? "FREE" : `₹${shippingCharges}`}
*Total: ₹${total}*

${paymentLine}

_Please confirm this order. Thank you!_ 🙏`;
}

const inputBase =
  "w-full bg-transparent border-0 border-b-2 border-[#d4c9b8] focus:border-foreground outline-none py-2 text-sm text-foreground placeholder:text-[#b5a898] transition-colors duration-200";

const inputErr =
  "w-full bg-transparent border-0 border-b-2 border-red-400 focus:border-red-500 outline-none py-2 text-sm text-foreground placeholder:text-[#b5a898] transition-colors duration-200";

function Field({
  label, id, error, children,
}: { label: string; id: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="pt-1 pb-1">
      <label htmlFor={id} className="block text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [bagOpen, setBagOpen] = useState(false);
  const [codUnavailableItems, setCodUnavailableItems] = useState<string[]>([]);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
    console.log(savedCart)
    
    // Check for products that don't support COD
    const unavailable = savedCart
      .filter((item: CartItem) => item.codAvailable === false)
      .map((item: CartItem) => item.name);
    setCodUnavailableItems(unavailable);
  }, []);

  useEffect(() => {
    if (paymentMethod === "online") {
      setShippingCharges(0);
      setDeliveryTime("Kerala: 2–3 days · Outside Kerala: 6–7 days");
    } else {
      setShippingCharges(180);
      setDeliveryTime("Estimated delivery in 7 days");
    }
  }, [paymentMethod]);

  const subtotal = cart.reduce((a, i) => a + i.salesPrice * i.cartQty, 0);
  const total = subtotal + shippingCharges;

  // Check if COD is available for all items in cart
  const isCodAvailableForCart = cart.every(item => item.codAvailable !== false);
  const hasCodUnavailableItems = codUnavailableItems.length > 0;

  const handleOrder = (data: FormData) => {
    // Validate COD availability before proceeding
    if (paymentMethod === "cod" && !isCodAvailableForCart) {
      const itemsList = codUnavailableItems.join(", ");
      alert(`Cash on Delivery is not available for these items:\n${itemsList}\n\nPlease select Online Payment or remove these items from your cart.`);
      return;
    }

    const message = buildWhatsAppMessage(data, cart, total, shippingCharges, paymentMethod);
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (cart.length === 0) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');`}</style>
        <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center p-6" style={{ fontFamily: "'Jost', sans-serif" }}>
          <div className="text-center">
            <div className="text-6xl mb-6">🛍</div>
            <h2 className="text-2xl font-bold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Your bag is empty
            </h2>
            <p className="text-sm text-muted-foreground mb-8">Add some items before checking out</p>
            <button
              onClick={() => router.push("/products")}
              className="px-8 py-3 bg-foreground text-[#f5f0e8] text-sm font-medium tracking-wider uppercase hover:bg-[#2d2010] transition-colors"
            >
              Browse Collection
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .co { font-family: 'Jost', sans-serif; color: #1a1208; }
        .serif { font-family: 'Playfair Display', serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fu  { animation: fadeUp 0.4s ease both; }
        .fu1 { animation: fadeUp 0.4s 0.06s ease both; }
        .fu2 { animation: fadeUp 0.4s 0.12s ease both; }
        .fu3 { animation: fadeUp 0.4s 0.18s ease both; }
        .fu4 { animation: fadeUp 0.4s 0.24s ease both; }
        .fu5 { animation: fadeUp 0.4s 0.30s ease both; }

        @keyframes bagSlide {
          from { opacity: 0; max-height: 0; }
          to   { opacity: 1; max-height: 700px; }
        }
        .bag-slide { animation: bagSlide 0.3s ease both; overflow: hidden; }

        .pay-card input[type=radio] { display: none; }
        .pay-card { cursor: pointer; }

        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className=" min-h-screen ">

        {/* ── Header ── */}
        <header className="  border-b  px-6 py-4 flex items-center justify-between">
         <Brand/>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wider uppercase">Secure Checkout</span>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

          {/* ── COD UNAVAILABLE WARNING ── */}
          {hasCodUnavailableItems && paymentMethod === "cod" && (
            <div className="fu1 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-semibold mb-1">Cash on Delivery not available</p>
                <p className="text-xs">
                  These items don't support COD: <span className="font-medium">{codUnavailableItems.join(", ")}</span>
                  <br />Please select <span className="font-semibold">Online Payment</span> to continue.
                </p>
              </div>
            </div>
          )}

          {/* ── BAG CARD ── */}
          <div className="fu1 bg-white rounded-2xl shadow-[0_2px_20px_rgba(26,18,8,0.07)] overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-6 py-4"
              onClick={() => setBagOpen((o) => !o)}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-foreground text-[#f5f0e8] text-xs font-bold flex items-center justify-center">
                  {cart.reduce((a, i) => a + i.cartQty, 0)}
                </span>
                <span className="text-sm font-semibold tracking-wide text-foreground">Your Bag</span>
                {bagOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
                <p className=" text-lg font-bold ">₹{total}</p>
              </div>
            </button>

            {bagOpen && (
              <div className="bag-slide border-t border-[#f0ebe0]">
                <div className="px-6 py-4 space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-4 items-start">
                      <div className="relative shrink-0">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-foreground text-[#f5f0e8] text-[10px] font-bold flex items-center justify-center">
                          {item.cartQty}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{item.name}</p>
                        <div className="flex gap-2 mt-1 flex-wrap">
                          {item.size && <span className="text-[10px] text-muted-foreground border border-[#e0d8cb] px-2 py-0.5 rounded-full">{item.size}</span>}
                          {item.color && <span className="text-[10px] text-muted-foreground border border-[#e0d8cb] px-2 py-0.5 rounded-full">{item.color}</span>}
                          {item.codAvailable === false && (
                            <span className="text-[10px] text-red-500 border border-red-200 bg-red-50 px-2 py-0.5 rounded-full">
                              No COD
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-semibold text-foreground">₹{item.salesPrice * item.cartQty}</span>
                        {item.codAvailable === false && (
                          <p className="text-[9px] text-red-400 mt-1">Online only</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mx-6 border-t border-dashed border-[#e0d8cb] py-4 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span><span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{paymentMethod === "online" ? "Shipping" : "COD charges"}</span>
                    <span className={shippingCharges === 0 ? "text-emerald-600 font-medium" : ""}>
                      {shippingCharges === 0 ? "Free" : `₹${shippingCharges}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#e0d8cb]">
                    <span className="text-sm font-semibold text-foreground">Total</span>
                    <span className="serif text-base font-bold text-foreground">₹{total}</span>
                  </div>
                </div>
                <div className="mx-6 mb-5 flex items-center gap-2 text-muted-foreground">
                  <Truck className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-[11px]">{deliveryTime}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── SHIPPING CARD ── */}
          <div className="fu2 bg-white rounded-2xl shadow-[0_2px_20px_rgba(26,18,8,0.07)] px-6 py-6">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="serif text-2xl font-bold italic text-[#d4c9b8]">01</span>
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground">Delivery Details</h2>
            </div>

            <form id="order-form" onSubmit={handleSubmit(handleOrder)}>
              <div className="space-y-5">
                <Field label="Full Name *" id="customerName" error={errors.customerName?.message}>
                  <input id="customerName" {...register("customerName")} placeholder="Your name"
                    className={errors.customerName ? inputErr : inputBase} />
                </Field>

                <div className="grid grid-cols-2 gap-6">
                  <Field label="Phone *" id="phoneNumber" error={errors.phoneNumber?.message}>
                    <input id="phoneNumber" {...register("phoneNumber")} placeholder="9562124798"
                      className={errors.phoneNumber ? inputErr : inputBase} />
                  </Field>
                  <Field label="Alternate Phone" id="alternatePhone">
                    <input id="alternatePhone" {...register("alternatePhone")} placeholder="Optional" className={inputBase} />
                  </Field>
                </div>

                <Field label="Instagram ID" id="instagramId">
                  <input id="instagramId" {...register("instagramId")} placeholder="@username" className={inputBase} />
                </Field>

                <Field label="Full Address *" id="address" error={errors.address?.message}>
                  <textarea id="address" {...register("address")} rows={2}
                    placeholder="House no., Building, Street, Area…"
                    className={`${errors.address ? inputErr : inputBase} resize-none`} />
                </Field>

                <div className="grid grid-cols-3 gap-4">
                  <Field label="District *" id="district" error={errors.district?.message}>
                    <input id="district" {...register("district")} placeholder="District"
                      className={errors.district ? inputErr : inputBase} />
                  </Field>
                  <Field label="State *" id="state" error={errors.state?.message}>
                    <input id="state" {...register("state")} placeholder="State"
                      className={errors.state ? inputErr : inputBase} />
                  </Field>
                  <Field label="Pincode *" id="pincode" error={errors.pincode?.message}>
                    <input id="pincode" {...register("pincode")} placeholder="Pincode"
                      className={errors.pincode ? inputErr : inputBase} />
                  </Field>
                </div>

                <Field label="Landmark" id="landmark">
                  <input id="landmark" {...register("landmark")} placeholder="Near school, temple…" className={inputBase} />
                </Field>
              </div>
            </form>
          </div>

          {/* ── PAYMENT CARD ── */}
          <div className="fu3 bg-white rounded-2xl shadow-[0_2px_20px_rgba(26,18,8,0.07)] px-6 py-6">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="serif text-2xl font-bold italic text-[#d4c9b8]">02</span>
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-foreground">Payment Method</h2>
            </div>

            <div className="space-y-3">
              {/* Online */}
              <label className={`pay-card flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200
                ${paymentMethod === "online" ? "border-foreground bg-foreground" : "border-[#e0d8cb] bg-[#faf7f2] hover:border-[#c4b8a4]"}`}>
                <input type="radio" name="payment" value="online" checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")} />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                  ${paymentMethod === "online" ? "border-[#f5f0e8]" : "border-[#c4b8a4]"}`}>
                  {paymentMethod === "online" && <div className="w-2 h-2 rounded-full bg-[#f5f0e8]" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${paymentMethod === "online" ? "text-[#f5f0e8]" : "text-foreground"}`}>
                    Online Payment
                  </p>
                  <p className={`text-xs mt-0.5 ${paymentMethod === "online" ? "text-[#c8bfb0]" : "text-muted-foreground"}`}>
   Shipping charges apply for some items.
   
</p>
                </div>
                {/* <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full
                  ${paymentMethod === "online" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}>
                  
                </span> */}
              </label>

              {/* COD - Disabled if any product doesn't support it */}
              <label className={`pay-card flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200
                ${!isCodAvailableForCart ? "opacity-50 cursor-not-allowed" : ""}
                ${paymentMethod === "cod" && isCodAvailableForCart ? "border-foreground bg-foreground" : "border-[#e0d8cb] bg-[#faf7f2] hover:border-[#c4b8a4]"}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === "cod"}
                  onChange={() => isCodAvailableForCart && setPaymentMethod("cod")}
                  disabled={!isCodAvailableForCart}
                />
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                  ${paymentMethod === "cod" && isCodAvailableForCart ? "border-[#f5f0e8]" : "border-[#c4b8a4]"}`}>
                  {paymentMethod === "cod" && isCodAvailableForCart && <div className="w-2 h-2 rounded-full bg-[#f5f0e8]" />}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${paymentMethod === "cod" && isCodAvailableForCart ? "text-[#f5f0e8]" : "text-foreground"}`}>
                    Cash on Delivery
                  </p>
                  <p className={`text-xs mt-0.5 ${paymentMethod === "cod" && isCodAvailableForCart ? "text-[#c8bfb0]" : "text-muted-foreground"}`}>
                    ₹180 advance + rest on delivery
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full
                  ${paymentMethod === "cod" && isCodAvailableForCart ? "bg-amber-400 text-foreground" : "bg-amber-50 text-amber-600"}`}>
                  +₹180 extra
                </span>
              </label>

              {/* COD Unavailable Message */}
              {!isCodAvailableForCart && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-xs text-amber-700 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Cash on Delivery is not available for some items in your cart. Please choose Online Payment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── POLICY ── */}
          <div className="fu4 flex items-start gap-3 bg-[#fffdf7] border border-[#f0e6c4] rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-[#7a6540] leading-relaxed">
              By proceeding you agree to our{" "}
              <Link href="/terms" target="_blank" className="font-semibold underline underline-offset-2 hover:text-foreground">
                return policy
              </Link>
              . All sales are final unless specified.
            </p>
          </div>

          {/* ── SUBMIT ── */}
          <div className="fu5 pb-8">
            <button
              type="submit"
              form="order-form"
              className="w-full py-4 bg-[#25d366] text-white font-bold text-sm tracking-widest uppercase rounded-2xl
                hover:bg-[#1fc25d] active:scale-[0.98] transition-all duration-200
                flex items-center justify-center gap-3
                shadow-[0_8px_30px_rgba(37,211,102,0.35)]
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={paymentMethod === "cod" && !isCodAvailableForCart}
            >
              <MessageCircle className="w-5 h-5" />
              Order via WhatsApp
            </button>
            <p className="text-center text-[11px] text-[#b5a898] mt-3 tracking-wide">
              WhatsApp will open with your complete order details pre-filled
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
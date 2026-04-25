// app/checkout/page.tsx
"use client";

import {
  AlertCircle, MessageCircle, Truck, ShieldCheck,
  ChevronDown, ChevronUp, Zap, Sparkles, CheckCircle2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
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
      const variantInfo = [
        item.size && `Size: ${item.size}`,
        item.color && `Color: ${item.color}`,
      ]
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

// ── Field wrapper ──────────────────────────────────────────────
function Field({
  label,
  id,
  error,
  children,
  optional,
}: {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="gz-field">
      <label htmlFor={id} className="gz-label">
        {label}
        {optional && <span className="gz-optional">optional</span>}
      </label>
      {children}
      {error && (
        <p className="gz-err-msg" role="alert">
          ↳ {error}
        </p>
      )}
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="checkout-root">
      <div className="content-wrap max-w-xl mx-auto px-4 py-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="gz-card" style={{ height: 80, opacity: 0.4 }}>
            <div className="skeleton-shimmer" style={{ height: "100%", borderRadius: 16 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [bagOpen, setBagOpen] = useState(false);
  const [codUnavailableItems, setCodUnavailableItems] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const firstErrorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur", // validate on blur for better UX
  });

  // ── Load cart ────────────────────────────────────────────────
  useEffect(() => {
    try {
      const savedCart: CartItem[] = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      setCart(savedCart);
      const unavailable = savedCart
        .filter((item) => item.codAvailable === false)
        .map((item) => item.name);
      setCodUnavailableItems(unavailable);
    } catch {
      setCart([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Payment method side-effects ──────────────────────────────
  useEffect(() => {
    if (paymentMethod === "online") {
      setShippingCharges(0);
      setDeliveryTime("Kerala: 2–3 days · Outside: 6–7 days");
    } else {
      setShippingCharges(180);
      setDeliveryTime("Estimated 7 days delivery");
    }
  }, [paymentMethod]);

  // ── Scroll to first error on submit ─────────────────────────
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors]);

  const subtotal = cart.reduce((a, i) => a + i.salesPrice * i.cartQty, 0);
  const total = subtotal + shippingCharges;
  const isCodAvailableForCart = cart.every((item) => item.codAvailable !== false);
  const hasCodUnavailableItems = codUnavailableItems.length > 0;
  const totalItems = cart.reduce((a, i) => a + i.cartQty, 0);

  // ── Order handler ────────────────────────────────────────────
  const handleOrder = (data: FormData) => {
    if (paymentMethod === "cod" && !isCodAvailableForCart) return;
    setSending(true);
    const message = buildWhatsAppMessage(
      data, cart, total, shippingCharges, paymentMethod
    );
    const url = `https://wa.me/919495642846?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    // Brief sent state
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    }, 800);
  };

  // ── Loading ─────────────────────────────────────────────────
  if (isLoading) return <Skeleton />;

  // ── Empty cart ───────────────────────────────────────────────
  if (!isLoading && cart.length === 0) {
    return (
      <>
        <GlobalStyles />
        <div className="checkout-root">
          <div className="glow-blob" />
          <div className="content-wrap min-h-screen flex items-center justify-center p-6">
            <div className="text-center" style={{ animation: "slideUp 0.5s ease both" }}>
              <div style={{ fontSize: 72, marginBottom: 24 }}>🛒</div>
              <h2
                className="syne"
                style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}
              >
                bag&apos;s empty bestie
              </h2>
              <p style={{ fontSize: 13, opacity: 0.4, marginBottom: 32 }}>
                fill it up with something cute first
              </p>
              <button
                onClick={() => router.push("/products")}
                className="wa-btn"
                style={{ maxWidth: 200, margin: "0 auto" }}
              >
                shop now →
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="checkout-root">
        <div className="glow-blob" />
        <div className="content-wrap">

          {/* ── Header ───────────────────────────────────────── */}
          <header
            className="s0"
            style={{
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #1a1a1a",
              position: "sticky",
              top: 0,
              background: "rgba(10,10,10,0.92)",
              backdropFilter: "blur(12px)",
              zIndex: 50,
            }}
          >
            <Brand />
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#444" }}>
              <ShieldCheck size={13} />
              <span
                className="syne"
                style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}
              >
                secure checkout
              </span>
            </div>
          </header>

          <div style={{ maxWidth: 520, margin: "0 auto", padding: "20px 16px 40px", display: "flex", flexDirection: "column", gap: 12 }}>

            {/* ── COD unavailable global banner ────────────────── */}
            {hasCodUnavailableItems && paymentMethod === "cod" && (
              <div
                className="s0"
                role="alert"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(255,59,92,0.08)",
                  border: "1px solid rgba(255,59,92,0.2)",
                }}
              >
                <AlertCircle size={14} style={{ color: "#ff3b5c", marginTop: 1, flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: "#ff8099", lineHeight: 1.5 }}>
                  <strong style={{ color: "#ff3b5c" }}>COD unavailable</strong> for:{" "}
                  {codUnavailableItems.join(", ")}. Switch to Online Payment.
                </p>
              </div>
            )}

            {/* ── Your Bag ─────────────────────────────────────── */}
            <div className="gz-card s1">
              <button
                type="button"
                aria-expanded={bagOpen}
                aria-controls="bag-contents"
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "inherit",
                }}
                onClick={() => setBagOpen((o) => !o)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="syne" style={{ fontSize: 13, fontWeight: 800, color: "#f0f0f0" }}>
                    your bag
                  </span>
                  <span className="pill" style={{ background: "#1e1e1e", color: "#666" }}>
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                  {bagOpen
                    ? <ChevronUp size={13} style={{ color: "#444" }} />
                    : <ChevronDown size={13} style={{ color: "#444" }} />}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#444", marginBottom: 2 }}>
                    total
                  </p>
                  <p className="syne" style={{ fontSize: 18, fontWeight: 900, color: "#ff3b5c" }}>
                    ₹{total}
                  </p>
                </div>
              </button>

              {bagOpen && (
                <div
                  id="bag-contents"
                  className="bag-expand"
                  style={{ borderTop: "1px solid #1a1a1a" }}
                >
                  <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
                    {cart.map((item, idx) => (
                      <div
                        key={`${item._id}-${item.size ?? ""}-${item.color ?? ""}-${idx}`}
                        style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
                      >
                        <div style={{ position: "relative", flexShrink: 0 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt={item.name}
                            width={56}
                            height={56}
                            style={{ borderRadius: 8, objectFit: "cover", display: "block" }}
                          />
                          <span
                            style={{
                              position: "absolute",
                              top: -6,
                              right: -6,
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: "#ff3b5c",
                              color: "#fff",
                              fontSize: 10,
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.cartQty}
                          </span>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: "#e0e0e0", lineHeight: 1.4 }}>
                            {item.name}
                          </p>
                          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                            {item.size && (
                              <span className="pill" style={{ background: "#1a1a1a", color: "#555", border: "1px solid #2a2a2a" }}>
                                {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="pill" style={{ background: "#1a1a1a", color: "#555", border: "1px solid #2a2a2a" }}>
                                {item.color}
                              </span>
                            )}
                            {item.codAvailable === false && (
                              <span className="pill badge-nocod">no COD</span>
                            )}
                          </div>
                        </div>
                        <span className="syne" style={{ fontSize: 13, fontWeight: 800, color: "#f0f0f0", flexShrink: 0 }}>
                          ₹{item.salesPrice * item.cartQty}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order summary inside bag */}
                  <div style={{ margin: "0 20px", padding: "14px 0", borderTop: "1px dashed #1e1e1e", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#444" }}>subtotal</span>
                      <span style={{ fontSize: 12, color: "#777" }}>₹{subtotal}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#444" }}>
                        {paymentMethod === "online" ? "shipping" : "COD charges"}
                      </span>
                      {shippingCharges === 0 ? (
                        <span className="pill badge-free" style={{ fontSize: 10 }}>FREE</span>
                      ) : (
                        <span style={{ fontSize: 12, color: "#f7c948", fontWeight: 700 }}>
                          ₹{shippingCharges}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: 10,
                        borderTop: "1px dashed #1e1e1e",
                      }}
                    >
                      <span className="syne" style={{ fontSize: 13, fontWeight: 800, color: "#f0f0f0" }}>
                        total
                      </span>
                      <span className="syne" style={{ fontSize: 18, fontWeight: 900, color: "#ff3b5c" }}>
                        ₹{total}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px 16px", color: "#333" }}>
                    <Truck size={11} />
                    <span style={{ fontSize: 11 }}>{deliveryTime}</span>
                  </div>
                </div>
              )}
            </div>

            {/* ── Delivery Details ──────────────────────────────── */}
            <div className="gz-card s2" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <span className="step-num">01</span>
                <h2 className="syne" style={{ fontSize: 13, fontWeight: 800, color: "#f0f0f0", letterSpacing: "0.05em" }}>
                  delivery details
                </h2>
              </div>

              {/* The form wraps all fields + submit button via id attribute */}
              <form
                id="order-form"
                onSubmit={handleSubmit(handleOrder)}
                noValidate
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Name */}
                  <div ref={errors.customerName ? firstErrorRef : undefined}>
                    <Field label="Full Name *" id="customerName" error={errors.customerName?.message}>
                      <input
                        id="customerName"
                        autoComplete="name"
                        autoCapitalize="words"
                        placeholder="your name"
                        className={`gz-input ${errors.customerName ? "err" : ""}`}
                        {...register("customerName")}
                      />
                    </Field>
                  </div>

                  {/* Phone row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <Field label="Phone *" id="phoneNumber" error={errors.phoneNumber?.message}>
                      <input
                        id="phoneNumber"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="9562xxxxxx"
                        maxLength={10}
                        className={`gz-input ${errors.phoneNumber ? "err" : ""}`}
                        {...register("phoneNumber")}
                      />
                    </Field>
                    <Field label="Alt Phone" id="alternatePhone" optional>
                      <input
                        id="alternatePhone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="optional"
                        maxLength={10}
                        className="gz-input"
                        {...register("alternatePhone")}
                      />
                    </Field>
                  </div>

                  {/* Instagram */}
                  <Field label="Instagram ID" id="instagramId" optional>
                    <input
                      id="instagramId"
                      placeholder="@yourhandle"
                      autoCapitalize="none"
                      className="gz-input"
                      {...register("instagramId")}
                    />
                  </Field>

                  {/* Address */}
                  <Field label="Full Address *" id="address" error={errors.address?.message}>
                    <textarea
                      id="address"
                      rows={2}
                      placeholder="house no., street, area…"
                      autoComplete="street-address"
                      className={`gz-input ${errors.address ? "err" : ""}`}
                      style={{ resize: "none" }}
                      {...register("address")}
                    />
                  </Field>

                  {/* District / State / Pincode */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <Field label="District *" id="district" error={errors.district?.message}>
                      <input
                        id="district"
                        placeholder="district"
                        autoComplete="address-level2"
                        className={`gz-input ${errors.district ? "err" : ""}`}
                        {...register("district")}
                      />
                    </Field>
                    <Field label="State *" id="state" error={errors.state?.message}>
                      <input
                        id="state"
                        placeholder="state"
                        autoComplete="address-level1"
                        className={`gz-input ${errors.state ? "err" : ""}`}
                        {...register("state")}
                      />
                    </Field>
                    <Field label="Pincode *" id="pincode" error={errors.pincode?.message}>
                      <input
                        id="pincode"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="postal-code"
                        placeholder="000000"
                        maxLength={6}
                        className={`gz-input ${errors.pincode ? "err" : ""}`}
                        {...register("pincode")}
                      />
                    </Field>
                  </div>

                  {/* Landmark */}
                  <Field label="Landmark" id="landmark" optional>
                    <input
                      id="landmark"
                      placeholder="near school, temple…"
                      className="gz-input"
                      {...register("landmark")}
                    />
                  </Field>
                </div>
              </form>
            </div>

            {/* ── Payment Method ────────────────────────────────── */}
            <div className="gz-card s3" style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span className="step-num">02</span>
                <h2 className="syne" style={{ fontSize: 13, fontWeight: 800, color: "#f0f0f0", letterSpacing: "0.05em" }}>
                  payment method
                </h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Online */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === "online"}
                  className={`pay-opt ${paymentMethod === "online" ? "active-online" : ""}`}
                  onClick={() => setPaymentMethod("online")}
                >
                  <div className={`radio-dot ${paymentMethod === "online" ? "active-online" : ""}`}>
                    {paymentMethod === "online" && <div className="radio-inner-online" />}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <p className="syne" style={{ fontSize: 13, fontWeight: 800, color: "#f0f0f0" }}>
                      Online Payment
                    </p>
                    <p style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                      UPI / Card · free shipping
                    </p>
                  </div>
                  <span className="pill badge-free">FREE ship</span>
                </button>

                {/* COD */}
                <button
                  type="button"
                  role="radio"
                  aria-checked={paymentMethod === "cod"}
                  disabled={!isCodAvailableForCart}
                  className={`pay-opt
                    ${paymentMethod === "cod" && isCodAvailableForCart ? "active-cod" : ""}
                    ${!isCodAvailableForCart ? "disabled-opt" : ""}
                  `}
                  onClick={() => isCodAvailableForCart && setPaymentMethod("cod")}
                >
                  <div
                    className={`radio-dot ${
                      paymentMethod === "cod" && isCodAvailableForCart ? "active-cod" : ""
                    }`}
                  >
                    {paymentMethod === "cod" && isCodAvailableForCart && (
                      <div className="radio-inner-cod" />
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <p
                      className="syne"
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: !isCodAvailableForCart ? "#333" : "#f0f0f0",
                      }}
                    >
                      Cash on Delivery
                    </p>
                    <p style={{ fontSize: 11, color: "#555", marginTop: 2 }}>
                      {!isCodAvailableForCart
                        ? "not available for items in cart"
                        : "₹180 advance · rest on delivery"}
                    </p>
                  </div>
                  <span
                    className="pill"
                    style={
                      !isCodAvailableForCart
                        ? { background: "#1a1a1a", color: "#333" }
                        : { background: "rgba(247,201,72,0.1)", color: "#f7c948", border: "1px solid rgba(247,201,72,0.25)" }
                    }
                  >
                    {!isCodAvailableForCart ? "N/A" : "+₹180"}
                  </span>
                </button>
              </div>

              {hasCodUnavailableItems && (
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: "rgba(255,59,92,0.06)",
                    border: "1px solid rgba(255,59,92,0.15)",
                  }}
                >
                  <AlertCircle size={12} style={{ color: "#ff3b5c", flexShrink: 0 }} />
                  <p style={{ fontSize: 11, color: "#ff8099" }}>
                    Some items are online-only. COD disabled.
                  </p>
                </div>
              )}
            </div>

            {/* ── Policy notice ─────────────────────────────────── */}
            <div
              className="s4"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "12px 16px",
                borderRadius: 12,
                background: "#0d0d0d",
                border: "1px solid #1a1a1a",
              }}
            >
              <Zap size={12} style={{ color: "#f7c948", marginTop: 1, flexShrink: 0 }} />
              <p style={{ fontSize: 11, color: "#444", lineHeight: 1.6 }}>
                by ordering you agree to our{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#666", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  return policy
                </Link>
                . all sales final unless stated otherwise.
              </p>
            </div>

            {/* ── Submit ────────────────────────────────────────── */}
            <div className="s5" style={{ paddingBottom: 8 }}>
              <button
                type="submit"
                form="order-form"
                className="wa-btn"
                disabled={
                  (paymentMethod === "cod" && !isCodAvailableForCart) ||
                  sending
                }
                aria-busy={sending}
              >
                {sent ? (
                  <>
                    <CheckCircle2 size={18} />
                    whatsapp opened ✓
                  </>
                ) : sending ? (
                  <>
                    <span className="spinner" />
                    opening whatsapp…
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    order via WhatsApp
                  </>
                )}
              </button>
              <p
                style={{
                  textAlign: "center",
                  fontSize: 11,
                  marginTop: 10,
                  color: "#2a2a2a",
                  letterSpacing: "0.05em",
                }}
              >
                your order details will be pre-filled ✨
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ── Styles ──────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .checkout-root {
        background: #0a0a0a;
        color: #f0f0f0;
        font-family: 'DM Sans', sans-serif;
        min-height: 100vh;
      }

      .syne { font-family: 'Syne', sans-serif; }

      /* Noise */
      .checkout-root::before {
        content: '';
        position: fixed;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 0;
        opacity: 0.4;
      }

      .content-wrap { position: relative; z-index: 1; }

      .glow-blob {
        position: fixed;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, rgba(255,59,92,0.1) 0%, transparent 70%);
        top: -100px;
        right: -200px;
        pointer-events: none;
        z-index: 0;
        border-radius: 50%;
      }

      /* Cards */
      .gz-card {
        background: #111;
        border: 1px solid #1c1c1c;
        border-radius: 16px;
        overflow: hidden;
        transition: border-color 0.25s;
      }
      .gz-card:hover { border-color: #252525; }

      /* Payment buttons */
      .pay-opt {
        border: 2px solid #1c1c1c;
        border-radius: 12px;
        padding: 14px 16px;
        cursor: pointer;
        transition: border-color 0.2s, background 0.2s;
        background: #0d0d0d;
        display: flex;
        align-items: center;
        gap: 14px;
        width: 100%;
        font-family: 'DM Sans', sans-serif;
        color: inherit;
      }
      .pay-opt:hover:not(.disabled-opt) { border-color: #2a2a2a; }
      .pay-opt.active-online { border-color: #ff3b5c; background: rgba(255,59,92,0.06); }
      .pay-opt.active-cod { border-color: #f7c948; background: rgba(247,201,72,0.05); }
      .pay-opt.disabled-opt { opacity: 0.3; cursor: not-allowed; }

      /* Radio */
      .radio-dot {
        width: 18px; height: 18px; border-radius: 50%;
        border: 2px solid #2a2a2a;
        display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; transition: border-color 0.2s;
      }
      .radio-dot.active-online { border-color: #ff3b5c; }
      .radio-dot.active-cod { border-color: #f7c948; }
      .radio-inner-online { width: 8px; height: 8px; border-radius: 50%; background: #ff3b5c; }
      .radio-inner-cod { width: 8px; height: 8px; border-radius: 50%; background: #f7c948; }

      /* Pills */
      .pill {
        font-size: 10px;
        padding: 2px 9px;
        border-radius: 999px;
        font-weight: 700;
        letter-spacing: 0.04em;
        font-family: 'Syne', sans-serif;
      }
      .badge-free { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
      .badge-nocod { background: rgba(255,59,92,0.1); color: #ff3b5c; border: 1px solid rgba(255,59,92,0.2); }

      /* Inputs */
      .gz-field { position: relative; }

      .gz-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: #555;
        font-family: 'Syne', sans-serif;
        margin-bottom: 8px;
      }

      .gz-optional {
        font-size: 9px;
        letter-spacing: 0.08em;
        color: #333;
        text-transform: lowercase;
        font-weight: 500;
        font-family: 'DM Sans', sans-serif;
        border: 1px solid #222;
        border-radius: 4px;
        padding: 1px 6px;
      }

      .gz-input {
        width: 100%;
        background: transparent;
        border: none;
        border-bottom: 2px solid #1e1e1e;
        outline: none;
        padding: 10px 0;
        font-size: 14px;
        font-weight: 400;
        color: #f0f0f0;
        font-family: 'DM Sans', sans-serif;
        transition: border-color 0.2s;
        display: block;
      }
      .gz-input::placeholder { color: #2e2e2e; }
      .gz-input:focus { border-color: #ff3b5c; }
      .gz-input.err { border-color: rgba(255,59,92,0.6); }
      .gz-input.err:focus { border-color: #ff3b5c; }
      textarea.gz-input { resize: none; line-height: 1.5; }

      .gz-err-msg {
        font-size: 11px;
        margin-top: 5px;
        color: #ff3b5c;
        font-weight: 600;
        font-family: 'DM Sans', sans-serif;
      }

      /* Step badge */
      .step-num {
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.1em;
        color: #ff3b5c;
        font-family: 'Syne', sans-serif;
        border: 1px solid rgba(255,59,92,0.25);
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(255,59,92,0.08);
      }

      /* WhatsApp button */
      .wa-btn {
        width: 100%;
        background: #25d366;
        color: #fff;
        border: none;
        border-radius: 12px;
        padding: 18px;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: 'Syne', sans-serif;
        box-shadow: 0 0 40px rgba(37,211,102,0.2);
      }
      .wa-btn:hover:not(:disabled) {
        filter: brightness(1.08);
        transform: translateY(-1px);
        box-shadow: 0 0 50px rgba(37,211,102,0.32);
      }
      .wa-btn:active:not(:disabled) { transform: scale(0.98); }
      .wa-btn:disabled { opacity: 0.35; cursor: not-allowed; }

      /* Spinner */
      .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
        flex-shrink: 0;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* Skeleton shimmer */
      .skeleton-shimmer {
        background: linear-gradient(90deg, #111 25%, #1a1a1a 50%, #111 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
      }
      @keyframes shimmer {
        from { background-position: 200% 0; }
        to   { background-position: -200% 0; }
      }

      /* Entrance animations */
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .s0 { animation: slideUp 0.45s ease both; }
      .s1 { animation: slideUp 0.45s 0.06s ease both; }
      .s2 { animation: slideUp 0.45s 0.12s ease both; }
      .s3 { animation: slideUp 0.45s 0.18s ease both; }
      .s4 { animation: slideUp 0.45s 0.24s ease both; }
      .s5 { animation: slideUp 0.45s 0.30s ease both; }

      /* Bag expand */
      @keyframes bagExpand {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .bag-expand { animation: bagExpand 0.28s ease both; }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: #0a0a0a; }
      ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
    `}</style>
  );
}
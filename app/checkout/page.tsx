// app/checkout/page.tsx
"use client";

import {
  AlertCircle, MessageCircle, Truck, ShieldCheck,
  ChevronDown, ChevronUp, Zap, CheckCircle2, Lock,
  CreditCard, Banknote, ArrowLeft, Tag, Info
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

// ── Progress Steps ─────────────────────────────────────────────
function ProgressBar({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Cart", "Information", "Payment"];
  return (
    <nav aria-label="Checkout progress" className="progress-bar">
      {steps.map((s, i) => {
        const num = i + 1;
        const active = num === step;
        const done = num < step;
        return (
          <div key={s} className={`step-item ${active ? "active" : done ? "done" : "upcoming"}`}>
            {i > 0 && <span className={`step-line ${done || active ? "filled" : ""}`} />}
            <span className="step-circle">
              {done ? <CheckCircle2 size={12} /> : num}
            </span>
            <span className="step-label">{s}</span>
          </div>
        );
      })}
    </nav>
  );
}

// ── Field ──────────────────────────────────────────────────────
function Field({
  label, id, error, children, optional, hint,
}: {
  label: string; id: string; error?: string; children: React.ReactNode;
  optional?: boolean; hint?: string;
}) {
  return (
    <div className="field-wrap">
      <label htmlFor={id} className="field-label">
        {label}
        {optional && <span className="field-opt">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && (
        <p className="field-err" role="alert">
          <AlertCircle size={11} style={{ flexShrink: 0, marginTop: 1 }} />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Trust badges ───────────────────────────────────────────────
function TrustBadges() {
  return (
    <div className="trust-strip">
      {[
        { icon: <Lock size={13} />, text: "Secure Checkout" },
        { icon: <Truck size={13} />, text: "Fast Delivery" },
        { icon: <ShieldCheck size={13} />, text: "Easy Returns" },
      ].map(({ icon, text }) => (
        <div key={text} className="trust-item">
          {icon}
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}

// ── Order summary sidebar item ─────────────────────────────────
function OrderItem({ item }: { item: CartItem }) {
  return (
    <div className="order-item">
      <div className="order-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image} alt={item.name} width={64} height={64} className="order-img" />
        <span className="order-qty-badge">{item.cartQty}</span>
      </div>
      <div className="order-item-info">
        <p className="order-item-name">{item.name}</p>
        {(item.size || item.color) && (
          <p className="order-item-variant">
            {[item.size, item.color].filter(Boolean).join(" · ")}
          </p>
        )}
        {item.codAvailable === false && (
          <span className="badge badge-nocod">Online only</span>
        )}
      </div>
      <span className="order-item-price">₹{item.salesPrice * item.cartQty}</span>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="checkout-root">
      <div className="skeleton-layout">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-block" style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shippingCharges, setShippingCharges] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [codUnavailableItems, setCodUnavailableItems] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2 | 3>(2);
  const firstErrorRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    try {
      const savedCart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
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

  useEffect(() => {
    if (paymentMethod === "online") {
      setShippingCharges(0);
      setDeliveryTime("Kerala: 2–3 days · Rest of India: 6–7 days");
    } else {
      setShippingCharges(180);
      setDeliveryTime("Estimated 7 days delivery");
    }
  }, [paymentMethod]);

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

  const handleOrder = (data: FormData) => {
    if (paymentMethod === "cod" && !isCodAvailableForCart) return;
    setSending(true);
    const message = buildWhatsAppMessage(data, cart, total, shippingCharges, paymentMethod);
    const url = `https://wa.me/919495642846?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }, 800);
  };

  if (isLoading) return <Skeleton />;

  if (!isLoading && cart.length === 0) {
    return (
      <>
        <GlobalStyles />
        <div className="checkout-root">
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h2 className="empty-title">Your cart is empty</h2>
            <p className="empty-sub">Looks like you haven&apos;t added anything yet.</p>
            <button onClick={() => router.push("/products")} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <div className="checkout-root">

        {/* ── Header ─────────────────────────────────────────── */}
        <header className="co-header">
          <div className="co-header-inner">
            <button
              className="back-btn"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            <Brand />
            <div className="secure-badge">
              <Lock size={12} />
              <span>Secure</span>
            </div>
          </div>
          <ProgressBar step={formStep} />
        </header>

        {/* ── Mobile order summary toggle ─────────────────────── */}
        <div className="mobile-summary-toggle">
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            className="summary-toggle-btn"
            aria-expanded={summaryOpen}
          >
            <div className="summary-toggle-left">
              <Tag size={14} />
              <span>{summaryOpen ? "Hide" : "Show"} order summary</span>
              {summaryOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
            <span className="summary-toggle-total">₹{total}</span>
          </button>

          {summaryOpen && (
            <div className="mobile-summary-panel">
              {cart.map((item, idx) => (
                <OrderItem key={`${item._id}-${idx}`} item={item} />
              ))}
              <div className="summary-divider" />
              <SummaryLines subtotal={subtotal} shippingCharges={shippingCharges} total={total} paymentMethod={paymentMethod} deliveryTime={deliveryTime} />
            </div>
          )}
        </div>

        {/* ── Two-column layout ───────────────────────────────── */}
        <div className="co-layout">

          {/* LEFT: Form ────────────────────────────────────────── */}
          <main className="co-main">

            {/* Contact info */}
            <section className="form-section">
              <h2 className="section-title">Contact Information</h2>
              <form id="order-form" onSubmit={handleSubmit(handleOrder)} noValidate>
                <div className="fields-grid">

                  <div ref={errors.customerName ? firstErrorRef : undefined} className="field-full">
                    <Field label="Full Name" id="customerName" error={errors.customerName?.message}>
                      <input
                        id="customerName"
                        autoComplete="name"
                        autoCapitalize="words"
                        placeholder="Enter your full name"
                        className={`co-input ${errors.customerName ? "input-err" : ""}`}
                        {...register("customerName")}
                      />
                    </Field>
                  </div>

                  <Field label="Phone Number" id="phoneNumber" error={errors.phoneNumber?.message}>
                    <div className="input-with-prefix">
                      <span className="input-prefix">+91</span>
                      <input
                        id="phoneNumber"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="9562xxxxxx"
                        maxLength={10}
                        className={`co-input prefixed ${errors.phoneNumber ? "input-err" : ""}`}
                        {...register("phoneNumber")}
                      />
                    </div>
                  </Field>

                  <Field label="Alternate Phone" id="alternatePhone" optional>
                    <div className="input-with-prefix">
                      <span className="input-prefix">+91</span>
                      <input
                        id="alternatePhone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="Optional"
                        maxLength={10}
                        className="co-input prefixed"
                        {...register("alternatePhone")}
                      />
                    </div>
                  </Field>

                  <div className="field-full">
                    <Field label="Instagram Handle" id="instagramId" optional hint="We'll tag you when your order ships!">
                      <div className="input-with-prefix">
                        <span className="input-prefix">@</span>
                        <input
                          id="instagramId"
                          placeholder="yourhandle"
                          autoCapitalize="none"
                          className="co-input prefixed"
                          {...register("instagramId")}
                        />
                      </div>
                    </Field>
                  </div>
                </div>
              </form>
            </section>

            {/* Shipping address */}
            <section className="form-section">
              <h2 className="section-title">Shipping Address</h2>
              <div className="fields-grid">

                <div className="field-full">
                  <Field label="Full Address" id="address" error={errors.address?.message}>
                    <textarea
                      id="address"
                      rows={2}
                      placeholder="House no., street name, area…"
                      autoComplete="street-address"
                      form="order-form"
                      className={`co-input co-textarea ${errors.address ? "input-err" : ""}`}
                      {...register("address")}
                    />
                  </Field>
                </div>

                <Field label="District" id="district" error={errors.district?.message}>
                  <input
                    id="district"
                    placeholder="e.g. Thrissur"
                    autoComplete="address-level2"
                    form="order-form"
                    className={`co-input ${errors.district ? "input-err" : ""}`}
                    {...register("district")}
                  />
                </Field>

                <Field label="State" id="state" error={errors.state?.message}>
                  <input
                    id="state"
                    placeholder="e.g. Kerala"
                    autoComplete="address-level1"
                    form="order-form"
                    className={`co-input ${errors.state ? "input-err" : ""}`}
                    {...register("state")}
                  />
                </Field>

                <Field label="Pincode" id="pincode" error={errors.pincode?.message}>
                  <input
                    id="pincode"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="postal-code"
                    placeholder="000000"
                    maxLength={6}
                    form="order-form"
                    className={`co-input ${errors.pincode ? "input-err" : ""}`}
                    {...register("pincode")}
                  />
                </Field>

                <div className="field-full">
                  <Field label="Landmark" id="landmark" optional>
                    <input
                      id="landmark"
                      placeholder="Near school, temple, metro…"
                      form="order-form"
                      className="co-input"
                      {...register("landmark")}
                    />
                  </Field>
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section className="form-section">
              <h2 className="section-title">Payment Method</h2>

              {hasCodUnavailableItems && paymentMethod === "cod" && (
                <div className="alert-warn" role="alert">
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <p>
                    <strong>COD not available</strong> for:{" "}
                    {codUnavailableItems.join(", ")}. Please switch to Online Payment.
                  </p>
                </div>
              )}

              <div className="payment-options">
                {/* Online */}
                <label
                  className={`pay-card ${paymentMethod === "online" ? "pay-active" : ""}`}
                  htmlFor="pay-online"
                >
                  <input
                    type="radio"
                    id="pay-online"
                    name="payment"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="sr-only"
                  />
                  <span className={`pay-radio ${paymentMethod === "online" ? "pay-radio-active" : ""}`} />
                  <div className="pay-icon-wrap pay-online-icon">
                    <CreditCard size={16} />
                  </div>
                  <div className="pay-info">
                    <span className="pay-title">Online Payment</span>
                    <span className="pay-sub">UPI, Credit / Debit Card</span>
                  </div>
                  <span className="pay-tag free-tag">FREE Shipping</span>
                </label>

                {/* COD */}
                <label
                  className={`pay-card ${paymentMethod === "cod" && isCodAvailableForCart ? "pay-active pay-cod-active" : ""} ${!isCodAvailableForCart ? "pay-disabled" : ""}`}
                  htmlFor="pay-cod"
                >
                  <input
                    type="radio"
                    id="pay-cod"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    disabled={!isCodAvailableForCart}
                    onChange={() => isCodAvailableForCart && setPaymentMethod("cod")}
                    className="sr-only"
                  />
                  <span className={`pay-radio ${paymentMethod === "cod" && isCodAvailableForCart ? "pay-radio-cod-active" : ""}`} />
                  <div className="pay-icon-wrap pay-cod-icon">
                    <Banknote size={16} />
                  </div>
                  <div className="pay-info">
                    <span className="pay-title">Cash on Delivery</span>
                    <span className="pay-sub">
                      {!isCodAvailableForCart
                        ? "Not available for selected items"
                        : "₹180 advance · rest paid on delivery"}
                    </span>
                  </div>
                  {isCodAvailableForCart && (
                    <span className="pay-tag cod-tag">+₹180</span>
                  )}
                </label>
              </div>

              {paymentMethod === "online" && (
                <div className="payment-note">
                  <Info size={12} style={{ flexShrink: 0 }} />
                  <span>Payment link will be shared on WhatsApp after order confirmation.</span>
                </div>
              )}
            </section>

            {/* Policy */}
            <p className="policy-text">
              By placing this order, you agree to our{" "}
              <Link href="/terms" target="_blank" rel="noopener noreferrer" className="policy-link">
                Return Policy
              </Link>
              . All sales are final unless stated otherwise.
            </p>

            {/* Submit */}
            <div className="submit-wrap">
              <button
                type="submit"
                form="order-form"
                className={`btn-primary wa-submit ${sent ? "btn-sent" : ""}`}
                disabled={(paymentMethod === "cod" && !isCodAvailableForCart) || sending}
                aria-busy={sending}
                onClick={() => setFormStep(3)}
              >
                {sent ? (
                  <>
                    <CheckCircle2 size={18} />
                    WhatsApp Opened — Check Your Phone
                  </>
                ) : sending ? (
                  <>
                    <span className="btn-spinner" />
                    Opening WhatsApp…
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    Place Order via WhatsApp
                  </>
                )}
              </button>
              <p className="submit-sub">
                <Zap size={11} />
                Order details will be pre-filled — just hit send
              </p>
            </div>

          </main>

          {/* RIGHT: Order summary sidebar ──────────────────────── */}
          <aside className="co-sidebar">
            <div className="sidebar-inner">
              <h3 className="sidebar-title">Order Summary</h3>

              <div className="sidebar-items">
                {cart.map((item, idx) => (
                  <OrderItem key={`${item._id}-${idx}`} item={item} />
                ))}
              </div>

              <div className="sidebar-divider" />
              <SummaryLines subtotal={subtotal} shippingCharges={shippingCharges} total={total} paymentMethod={paymentMethod} deliveryTime={deliveryTime} />

              <div className="sidebar-divider" />
              <TrustBadges />
            </div>
          </aside>
        </div>

      </div>
    </>
  );
}

// ── Reusable summary lines ─────────────────────────────────────
function SummaryLines({
  subtotal, shippingCharges, total, paymentMethod, deliveryTime
}: {
  subtotal: number; shippingCharges: number; total: number;
  paymentMethod: "online" | "cod"; deliveryTime: string;
}) {
  return (
    <div className="summary-lines">
      <div className="summary-row">
        <span>Subtotal</span>
        <span>₹{subtotal}</span>
      </div>
      <div className="summary-row">
        <span>{paymentMethod === "online" ? "Shipping" : "COD Charges"}</span>
        {shippingCharges === 0
          ? <span className="free-label">FREE</span>
          : <span>₹{shippingCharges}</span>
        }
      </div>
      <div className="summary-row summary-total">
        <span>Total</span>
        <span>₹{total}</span>
      </div>
      <div className="delivery-est">
        <Truck size={12} />
        <span>{deliveryTime}</span>
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .sr-only {
        position: absolute; width: 1px; height: 1px;
        padding: 0; margin: -1px; overflow: hidden;
        clip: rect(0,0,0,0); border: 0;
      }

      :root {
        --co-bg: #f5f5f0;
        --co-surface: #ffffff;
        --co-border: #e8e8e3;
        --co-border-hover: #d0d0c8;
        --co-text: #1a1a1a;
        --co-text-muted: #6b6b65;
        --co-text-light: #9b9b93;
        --co-accent: #1a1a1a;
        --co-accent-hover: #333;
        --co-green: #1a8a4a;
        --co-green-bg: #f0faf4;
        --co-red: #c0392b;
        --co-red-bg: #fff5f4;
        --co-wa: #25d366;
        --co-wa-hover: #22c35e;
        --co-sidebar-bg: #f9f9f6;
        --co-radius: 8px;
        --co-radius-lg: 12px;
        --co-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
        --co-shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
      }

      .checkout-root {
        background: var(--co-bg);
        color: var(--co-text);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        min-height: 100vh;
        font-size: 14px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }

      /* ── Header ──────────────────────────────────────────────── */
      .co-header {
        background: var(--co-surface);
        border-bottom: 1px solid var(--co-border);
        position: sticky;
        top: 0;
        z-index: 50;
      }
      .co-header-inner {
        max-width: 1100px;
        margin: 0 auto;
        padding: 14px 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .back-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--co-text-muted);
        font-size: 13px;
        font-family: inherit;
        padding: 6px 0;
        transition: color 0.15s;
      }
      .back-btn:hover { color: var(--co-text); }
      .secure-badge {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        color: var(--co-text-light);
        font-weight: 500;
        letter-spacing: 0.02em;
      }

      /* ── Progress ─────────────────────────────────────────────── */
      .progress-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        padding: 10px 24px;
        max-width: 1100px;
        margin: 0 auto;
      }
      .step-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 500;
      }
      .step-item.active .step-label { color: var(--co-text); }
      .step-item.done .step-label { color: var(--co-text-muted); }
      .step-item.upcoming .step-label { color: var(--co-text-light); }
      .step-circle {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        flex-shrink: 0;
        transition: all 0.2s;
      }
      .step-item.active .step-circle {
        background: var(--co-accent);
        color: #fff;
      }
      .step-item.done .step-circle {
        background: var(--co-green);
        color: #fff;
      }
      .step-item.upcoming .step-circle {
        background: var(--co-border);
        color: var(--co-text-light);
      }
      .step-line {
        display: block;
        width: 40px;
        height: 1px;
        background: var(--co-border);
        margin: 0 8px;
        transition: background 0.3s;
      }
      .step-line.filled { background: var(--co-text-muted); }

      /* ── Mobile summary toggle ────────────────────────────────── */
      .mobile-summary-toggle {
        display: none;
        background: var(--co-sidebar-bg);
        border-bottom: 1px solid var(--co-border);
      }
      @media (max-width: 900px) {
        .mobile-summary-toggle { display: block; }
      }
      .summary-toggle-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 20px;
        background: none;
        border: none;
        cursor: pointer;
        font-family: inherit;
        color: var(--co-text);
        font-size: 13px;
      }
      .summary-toggle-left {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #1a73e8;
        font-weight: 500;
      }
      .summary-toggle-total {
        font-weight: 700;
        font-size: 16px;
      }
      .mobile-summary-panel {
        padding: 0 20px 16px;
        animation: fadeDown 0.2s ease;
      }
      @keyframes fadeDown {
        from { opacity: 0; transform: translateY(-6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* ── Layout ────────────────────────────────────────────────── */
      .co-layout {
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 380px;
        gap: 40px;
        padding: 32px 24px 80px;
        align-items: start;
      }
      @media (max-width: 900px) {
        .co-layout {
          grid-template-columns: 1fr;
          gap: 0;
          padding: 20px 16px 60px;
        }
        .co-sidebar { display: none; }
      }

      /* ── Form sections ────────────────────────────────────────── */
      .form-section {
        background: var(--co-surface);
        border: 1px solid var(--co-border);
        border-radius: var(--co-radius-lg);
        padding: 24px;
        margin-bottom: 16px;
        box-shadow: var(--co-shadow);
      }
      .section-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--co-text);
        margin-bottom: 20px;
        padding-bottom: 14px;
        border-bottom: 1px solid var(--co-border);
      }

      /* ── Fields ───────────────────────────────────────────────── */
      .fields-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .field-full { grid-column: 1 / -1; }
      .field-wrap { display: flex; flex-direction: column; gap: 6px; }
      .field-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--co-text-muted);
        letter-spacing: 0.03em;
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
      }
      .field-opt {
        font-size: 10px;
        font-weight: 500;
        color: var(--co-text-light);
        text-transform: none;
        letter-spacing: 0;
        background: var(--co-bg);
        padding: 1px 6px;
        border-radius: 4px;
      }
      .field-hint {
        font-size: 11px;
        color: var(--co-text-light);
        margin-top: 2px;
      }
      .field-err {
        font-size: 12px;
        color: var(--co-red);
        display: flex;
        align-items: flex-start;
        gap: 5px;
        font-weight: 500;
      }

      /* ── Inputs ───────────────────────────────────────────────── */
      .co-input {
        width: 100%;
        height: 44px;
        padding: 0 14px;
        background: var(--co-surface);
        border: 1.5px solid var(--co-border);
        border-radius: var(--co-radius);
        font-size: 14px;
        font-family: inherit;
        color: var(--co-text);
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
        -webkit-appearance: none;
      }
      .co-input::placeholder { color: #c0c0b8; }
      .co-input:hover { border-color: var(--co-border-hover); }
      .co-input:focus {
        border-color: var(--co-accent);
        box-shadow: 0 0 0 3px rgba(0,0,0,0.07);
      }
      .co-input.input-err { border-color: var(--co-red); }
      .co-input.input-err:focus {
        border-color: var(--co-red);
        box-shadow: 0 0 0 3px rgba(192,57,43,0.1);
      }
      .co-textarea {
        height: auto;
        padding: 12px 14px;
        resize: none;
        line-height: 1.5;
      }
      .input-with-prefix {
        position: relative;
        display: flex;
        align-items: center;
      }
      .input-prefix {
        position: absolute;
        left: 14px;
        font-size: 14px;
        color: var(--co-text-muted);
        font-weight: 500;
        pointer-events: none;
        z-index: 1;
      }
      .co-input.prefixed { padding-left: 40px; }

      /* ── Payment cards ────────────────────────────────────────── */
      .payment-options { display: flex; flex-direction: column; gap: 10px; }
      .pay-card {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 16px;
        border: 1.5px solid var(--co-border);
        border-radius: var(--co-radius);
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s;
        background: var(--co-surface);
        position: relative;
      }
      .pay-card:hover:not(.pay-disabled) {
        border-color: var(--co-border-hover);
        background: #fafafa;
      }
      .pay-active {
        border-color: var(--co-accent) !important;
        background: #fafafa !important;
      }
      .pay-cod-active {
        border-color: #d4a017 !important;
        background: #fffbef !important;
      }
      .pay-disabled { opacity: 0.45; cursor: not-allowed; }
      .pay-radio {
        width: 18px; height: 18px;
        border: 2px solid var(--co-border-hover);
        border-radius: 50%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: border-color 0.15s;
      }
      .pay-radio-active {
        border-color: var(--co-accent);
        background: var(--co-accent);
        box-shadow: inset 0 0 0 3px white;
      }
      .pay-radio-cod-active {
        border-color: #d4a017;
        background: #d4a017;
        box-shadow: inset 0 0 0 3px white;
      }
      .pay-icon-wrap {
        width: 36px; height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .pay-online-icon { background: #eef2ff; color: #4f46e5; }
      .pay-cod-icon { background: #fef9ee; color: #d4a017; }
      .pay-info { flex: 1; }
      .pay-title { display: block; font-size: 14px; font-weight: 600; color: var(--co-text); }
      .pay-sub { display: block; font-size: 12px; color: var(--co-text-muted); margin-top: 2px; }
      .pay-tag {
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 20px;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .free-tag { background: var(--co-green-bg); color: var(--co-green); }
      .cod-tag { background: #fef9ee; color: #b8860b; border: 1px solid #f0d060; }
      .payment-note {
        display: flex;
        align-items: flex-start;
        gap: 6px;
        margin-top: 12px;
        padding: 10px 12px;
        background: #f8f9ff;
        border-radius: var(--co-radius);
        font-size: 12px;
        color: #5c6bc0;
        border: 1px solid #e0e4ff;
      }

      /* ── Alert ────────────────────────────────────────────────── */
      .alert-warn {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 14px;
        border-radius: var(--co-radius);
        background: var(--co-red-bg);
        border: 1px solid #fad0cc;
        color: var(--co-red);
        margin-bottom: 14px;
        font-size: 13px;
        line-height: 1.5;
      }

      /* ── Sidebar ──────────────────────────────────────────────── */
      .co-sidebar {
        position: sticky;
        top: 80px;
      }
      .sidebar-inner {
        background: var(--co-sidebar-bg);
        border: 1px solid var(--co-border);
        border-radius: var(--co-radius-lg);
        padding: 20px;
        box-shadow: var(--co-shadow);
      }
      .sidebar-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--co-text);
        margin-bottom: 16px;
      }
      .sidebar-items { display: flex; flex-direction: column; gap: 14px; }
      .sidebar-divider {
        height: 1px;
        background: var(--co-border);
        margin: 16px 0;
      }
      .summary-divider {
        height: 1px;
        background: var(--co-border);
        margin: 12px 0;
      }

      /* ── Order items ──────────────────────────────────────────── */
      .order-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }
      .order-img-wrap { position: relative; flex-shrink: 0; }
      .order-img {
        width: 60px; height: 60px;
        border-radius: 8px;
        object-fit: cover;
        border: 1px solid var(--co-border);
        display: block;
        background: var(--co-bg);
      }
      .order-qty-badge {
        position: absolute;
        top: -7px;
        right: -7px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--co-accent);
        color: #fff;
        font-size: 10px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid var(--co-surface);
      }
      .order-item-info { flex: 1; min-width: 0; }
      .order-item-name { font-size: 13px; font-weight: 500; color: var(--co-text); line-height: 1.4; }
      .order-item-variant { font-size: 12px; color: var(--co-text-muted); margin-top: 3px; }
      .order-item-price { font-size: 14px; font-weight: 600; color: var(--co-text); flex-shrink: 0; }

      /* ── Badges ───────────────────────────────────────────────── */
      .badge {
        display: inline-block;
        font-size: 10px;
        font-weight: 600;
        padding: 2px 7px;
        border-radius: 20px;
        margin-top: 5px;
      }
      .badge-nocod { background: #fff5f4; color: var(--co-red); border: 1px solid #fad0cc; }

      /* ── Summary lines ────────────────────────────────────────── */
      .summary-lines { display: flex; flex-direction: column; gap: 10px; }
      .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        color: var(--co-text-muted);
      }
      .summary-row span:last-child { color: var(--co-text); font-weight: 500; }
      .summary-total {
        font-size: 16px;
        font-weight: 700;
        color: var(--co-text) !important;
        padding-top: 10px;
        border-top: 1px solid var(--co-border);
        margin-top: 4px;
      }
      .summary-total span { color: var(--co-text) !important; }
      .free-label {
        font-size: 12px;
        font-weight: 700;
        color: var(--co-green);
        background: var(--co-green-bg);
        padding: 2px 8px;
        border-radius: 20px;
      }
      .delivery-est {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--co-text-light);
        margin-top: 6px;
      }

      /* ── Trust ────────────────────────────────────────────────── */
      .trust-strip {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .trust-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: var(--co-text-muted);
        font-weight: 500;
      }
      .trust-item svg { color: var(--co-green); }

      /* ── Policy ───────────────────────────────────────────────── */
      .policy-text {
        font-size: 12px;
        color: var(--co-text-light);
        margin-bottom: 16px;
        line-height: 1.6;
      }
      .policy-link {
        color: var(--co-text-muted);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .policy-link:hover { color: var(--co-text); }

      /* ── Submit button ────────────────────────────────────────── */
      .btn-primary {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
        height: 52px;
        background: var(--co-wa);
        color: #fff;
        border: none;
        border-radius: var(--co-radius);
        font-size: 15px;
        font-weight: 700;
        font-family: inherit;
        cursor: pointer;
        transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
        letter-spacing: 0.01em;
        box-shadow: 0 2px 8px rgba(37,211,102,0.35);
      }
      .btn-primary:hover:not(:disabled) {
        background: var(--co-wa-hover);
        box-shadow: 0 4px 14px rgba(37,211,102,0.4);
        transform: translateY(-1px);
      }
      .btn-primary:active:not(:disabled) {
        transform: translateY(0) scale(0.99);
        box-shadow: 0 1px 4px rgba(37,211,102,0.25);
      }
      .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
      .wa-submit.btn-sent { background: var(--co-green); box-shadow: 0 2px 8px rgba(26,138,74,0.3); }
      .submit-wrap { padding-bottom: 8px; }
      .submit-sub {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        font-size: 12px;
        color: var(--co-text-light);
        margin-top: 10px;
      }
      .btn-spinner {
        width: 18px; height: 18px;
        border: 2px solid rgba(255,255,255,0.35);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
        flex-shrink: 0;
      }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* ── Empty state ──────────────────────────────────────────── */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        padding: 40px;
        text-align: center;
      }
      .empty-icon { font-size: 64px; margin-bottom: 20px; }
      .empty-title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
      .empty-sub { color: var(--co-text-muted); margin-bottom: 28px; }
      .empty-state .btn-primary { max-width: 220px; }

      /* ── Skeleton ─────────────────────────────────────────────── */
      .skeleton-layout {
        max-width: 520px;
        margin: 40px auto;
        padding: 0 24px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .skeleton-block {
        height: 80px;
        background: linear-gradient(90deg, #ebebea 25%, #f5f5f3 50%, #ebebea 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s ease infinite;
        border-radius: var(--co-radius-lg);
      }
      @keyframes shimmer {
        from { background-position: 200% 0; }
        to { background-position: -200% 0; }
      }

      /* ── Responsive ───────────────────────────────────────────── */
      @media (max-width: 560px) {
        .fields-grid { grid-template-columns: 1fr; }
        .field-full { grid-column: 1; }
        .co-header-inner { padding: 12px 16px; }
        .form-section { padding: 18px 16px; }
      }
    `}</style>
  );
}
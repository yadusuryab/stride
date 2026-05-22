// app/order/[id]/page.tsx
"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Package, MapPin, CreditCard, MessageCircle, Printer, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  price: number;
  salesPrice: number;
  images: any[];
  slug?: { current: string };
};

type OrderItem = {
  product: Product;
  quantity: number;
  size: string;
  color?: string;
};

type Order = {
  _id: string;
  customerName: string;
  phoneNumber: string;
  alternatePhone?: string;
  instagramId?: string;
  address: string;
  landmark?: string;
  district: string;
  state: string;
  pincode: string;
  products: OrderItem[];
  paymentMode: "cod" | "online";
  transactionId?: string;
  shippingCharges: number;
  orderStatus: string;
  orderedAt: string;
  totalAmount: number;
};

interface Props {
  params: Promise<{ id: string }>;
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:    { label: "Order Placed",   color: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
  confirmed:  { label: "Confirmed",      color: "#2563eb", bg: "#eff6ff", dot: "#3b82f6" },
  processing: { label: "Processing",     color: "#7c3aed", bg: "#f5f3ff", dot: "#8b5cf6" },
  shipped:    { label: "Shipped",        color: "#0891b2", bg: "#ecfeff", dot: "#06b6d4" },
  delivered:  { label: "Delivered",      color: "#16a34a", bg: "#f0fdf4", dot: "#22c55e" },
  cancelled:  { label: "Cancelled",      color: "#dc2626", bg: "#fef2f2", dot: "#ef4444" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[#f3f4f6] last:border-0">
      <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#9ca3af] shrink-0">{label}</span>
      <span className="text-sm text-[#374151] text-right">{value}</span>
    </div>
  );
}

export default function OrderPage({ params }: Props) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [itemsOpen, setItemsOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/order/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch order");
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch order");
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#2563eb]" />
          <p className="text-sm text-[#6b7280]">Loading your order…</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-base font-semibold text-[#111827] mb-1">
            {error ? "Failed to load order" : "Order not found"}
          </h2>
          <p className="text-sm text-[#6b7280] mb-5">{error}</p>
          <button onClick={() => router.push("/track-order")}
            className="px-5 py-2.5 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors">
            Track Orders
          </button>
        </div>
      </div>
    );
  }

  const subtotal = order.products.reduce((sum, item) => sum + item.product.salesPrice * item.quantity, 0);
  const orderId = order._id.slice(-6).toUpperCase();

  const whatsAppMsg = encodeURIComponent(
    `Hi, I have a question about my order #${orderId}\n\n` +
    order.products.map(i => `${i.product.name} (Qty: ${i.quantity}, Size: ${i.size}${i.color ? `, Color: ${i.color}` : ""}) - ₹${i.product.salesPrice * i.quantity}`).join("\n") +
    `\n\nTotal: ₹${order.totalAmount}\nStatus: ${order.orderStatus}`
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .order-root { font-family: 'DM Sans', sans-serif; }
        @keyframes successPop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .success-icon { animation: successPop 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .d1 { animation-delay: 0.1s; }
        .d2 { animation-delay: 0.2s; }
        .d3 { animation-delay: 0.3s; }
        .d4 { animation-delay: 0.4s; }
      `}</style>

      <div className="order-root min-h-screen bg-[#f3f4f6]">

        {/* ── Top bar ── */}
        <div className="bg-white border-b border-[#e5e7eb] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => router.push("/products")}
            className="flex items-center gap-1.5 text-sm text-[#6b7280] hover:text-[#111827] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
          <div className="flex items-center gap-2">
            {order.paymentMode === "online" && (
              <button onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#374151]
                  border border-[#e5e7eb] rounded-lg hover:bg-[#f9fafb] transition-colors">
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Invoice</span>
              </button>
            )}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE}?text=${whatsAppMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white
                bg-[#22c55e] rounded-lg hover:bg-[#16a34a] transition-colors">
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">

          {/* ── Success banner ── */}
          <div className="fade-up bg-white rounded-2xl p-6 text-center border border-[#e5e7eb] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            <div className="success-icon w-14 h-14 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7 text-[#22c55e]" />
            </div>
            <h1 className="text-lg font-semibold text-[#111827]">Order Placed Successfully!</h1>
            <p className="text-sm text-[#6b7280] mt-1">
              Thank you, <span className="font-medium text-[#374151]">{order.customerName}</span>. We've received your order.
            </p>
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              <div className="flex items-center gap-2 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg px-4 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">Order</span>
                <span className="text-sm font-bold text-[#111827] font-mono">#{orderId}</span>
              </div>
              <StatusBadge status={order.orderStatus} />
            </div>
          </div>

          {/* ── Order items ── */}
          <div className="fade-up d1 bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#fafafa] transition-colors"
              onClick={() => setItemsOpen(o => !o)}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-[#6b7280]" />
                <span className="text-sm font-semibold text-[#111827]">
                  {order.products.length} item{order.products.length > 1 ? "s" : ""}
                </span>
              </div>
              {itemsOpen ? <ChevronUp className="w-4 h-4 text-[#9ca3af]" /> : <ChevronDown className="w-4 h-4 text-[#9ca3af]" />}
            </button>

            {itemsOpen && (
              <div className="border-t border-[#f3f4f6]">
                {order.products.map((item: any, i) => (
                  <div key={i} className="flex gap-4 px-5 py-4 border-b border-[#f3f4f6] last:border-0">
                    <Link href={`/product/${item.product.id}`} className="shrink-0">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#e5e7eb] bg-[#f9fafb]">
                        <Image
                          src={urlFor(item.product.images[0])?.url()}
                          alt={item.product.name}
                          width={64} height={64}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.id}`}>
                        <p className="text-sm font-medium text-[#111827] hover:text-[#2563eb] transition-colors truncate">
                          {item.product.name}
                        </p>
                      </Link>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[11px] text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded">
                          Qty: {item.quantity}
                        </span>
                        {item.size && (
                          <span className="text-[11px] text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-[11px] text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded">
                            {item.color}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-[#111827] mt-1.5">
                        ₹{item.product.salesPrice * item.quantity}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] text-[#9ca3af]">₹{item.product.salesPrice} each</p>
                    </div>
                  </div>
                ))}

                {/* Totals */}
                <div className="px-5 py-4 bg-[#fafafa] space-y-2">
                  <div className="flex justify-between text-sm text-[#6b7280]">
                    <span>Subtotal</span><span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6b7280]">
                    <span>Shipping</span>
                    <span className={order.shippingCharges === 0 ? "text-[#22c55e] font-medium" : ""}>
                      {order.shippingCharges === 0 ? "Free" : `₹${order.shippingCharges}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#111827] pt-1 border-t border-[#e5e7eb]">
                    <span>Total</span><span>₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Two-column cards ── */}
          <div className="fade-up d2 grid sm:grid-cols-2 gap-4">

            {/* Shipping */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[#eff6ff] rounded-lg flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5 text-[#2563eb]" />
                </div>
                <span className="text-sm font-semibold text-[#111827]">Delivery Address</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-[#111827]">{order.customerName}</p>
                <p className="text-sm text-[#6b7280]">{order.phoneNumber}{order.alternatePhone && ` · ${order.alternatePhone}`}</p>
                <p className="text-sm text-[#6b7280] mt-1.5 leading-relaxed">
                  {order.address}
                  {order.landmark && `, Near ${order.landmark}`}
                </p>
                <p className="text-sm text-[#6b7280]">
                  {order.district}, {order.state} – {order.pincode}
                </p>
                {order.instagramId && (
                  <p className="text-xs text-[#9ca3af] mt-2">Instagram: {order.instagramId}</p>
                )}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_1px_4px_rgba(0,0,0,0.06)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[#f0fdf4] rounded-lg flex items-center justify-center">
                  <CreditCard className="w-3.5 h-3.5 text-[#22c55e]" />
                </div>
                <span className="text-sm font-semibold text-[#111827]">Payment</span>
              </div>
              <InfoRow
                label="Method"
                value={order.paymentMode === "cod" ? "Cash on Delivery" : "Online Payment"}
              />
              {order.transactionId && <InfoRow label="Txn ID" value={order.transactionId} />}
              <InfoRow
                label="Date"
                value={new Date(order.orderedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              />
              {order.paymentMode === "cod" && (
                <div className="mt-3 bg-[#fffbeb] border border-[#fde68a] rounded-lg px-3 py-2.5">
                  <p className="text-xs text-[#92400e] leading-relaxed">
                    <span className="font-semibold">COD:</span> Advance ₹100 paid · ₹{order.totalAmount - 100} due on delivery
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Support CTA ── */}
          <div className="fade-up d3 bg-[#1e293b] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Need help with your order?</p>
              <p className="text-xs text-white/45 mt-0.5">We typically reply within an hour on WhatsApp</p>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_PHONE}?text=${whatsAppMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#22c55e] text-white
                text-sm font-semibold rounded-xl hover:bg-[#16a34a] active:scale-95 transition-all duration-150"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
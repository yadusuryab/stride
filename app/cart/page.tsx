"use client";

import { CartItem } from "@/components/utils/add-to-cart";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Trash2, X, Plus, Minus, ArrowRight, ShoppingBag, Lock } from "lucide-react";
import { toast } from "sonner";

function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartQty = (id: string, newQty: number) => {
    if (newQty < 1) return;
    const product = cart.find((item) => item._id === id);
    if (!product) return;
    const limited = Math.min(newQty, product.maxQty);
    const updated = cart.map((item) =>
      item._id === id ? { ...item, cartQty: limited } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    if (limited !== newQty) toast(`Max quantity is ${product.maxQty}`);
  };

  const removeFromCart = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      const updated = cart.filter((item) => item._id !== id);
      setCart(updated);
      localStorage.setItem("cart", JSON.stringify(updated));
      setRemoving(null);
      toast("Item removed");
    }, 280);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", JSON.stringify([]));
    toast("Cart cleared");
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.salesPrice ?? item.price) * item.cartQty, 0);

  // ── Skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f4f6]">
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-3" style={{ fontFamily: "'DM Sans',sans-serif" }}>
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-4 flex gap-4 animate-pulse border border-[#e5e7eb]">
              <div className="w-20 h-20 bg-[#f3f4f6] rounded-xl shrink-0" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-4 bg-[#f3f4f6] rounded w-2/3" />
                <div className="h-3 bg-[#f3f4f6] rounded w-1/3" />
                <div className="h-8 bg-[#f3f4f6] rounded w-28 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Empty ──
  if (cart.length === 0) {
    return (
      <>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
        <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-6"
          style={{ fontFamily: "'DM Sans',sans-serif" }}>
          <div className="text-center">
            <div className="w-20 h-20 bg-white border border-[#e5e7eb] rounded-full
              flex items-center justify-center mx-auto mb-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <ShoppingBag className="w-9 h-9 text-[#d1d5db]" />
            </div>
            <h2 className="text-lg font-semibold text-[#111827] mb-1">Your cart is empty</h2>
            <p className="text-sm text-[#6b7280] mb-6">Add some products to get started</p>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white
                text-sm font-semibold rounded-xl hover:bg-[#1d4ed8] active:scale-95
                transition-all duration-150 shadow-[0_4px_14px_rgba(37,99,235,0.3)]">
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .cart-root { font-family: 'DM Sans', sans-serif; }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateX(-16px); }
        }
        .removing { animation: fadeOut 0.28s ease forwards; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div className="cart-root min-h-screen bg-[#f3f4f6]">
        <div className="max-w-2xl mx-auto px-4 py-7 lg:max-w-5xl">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-[#111827]">Shopping Cart</h1>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-xs font-medium text-[#ef4444]
                hover:text-[#dc2626] px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-150"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear all
            </button>
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_360px] lg:gap-6 lg:items-start">

            {/* ── Cart items ── */}
            <div className="space-y-3 mb-4 lg:mb-0">
              {cart.map((item: any, i) => (
                <div
                  key={item._id}
                  className={`fade-up bg-white rounded-2xl border border-[#e5e7eb]
                    shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden
                    ${removing === item._id ? "removing" : ""}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <Link href={`/product/${item._id}`} className="shrink-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f9fafb] border border-[#f3f4f6]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/product/${item._id}`}>
                          <p className="text-sm font-medium text-[#111827] hover:text-primary
                            transition-colors leading-snug line-clamp-2">
                            {item.name}
                          </p>
                        </Link>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg
                            text-[#9ca3af] hover:text-[#ef4444] hover:bg-red-50
                            transition-all duration-150"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variants */}
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        {item.size && (
                          <span className="text-[10px] font-medium text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-[10px] font-medium text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded">
                            {item.color}
                          </span>
                        )}
                      </div>

                      {/* Price + qty row */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Qty stepper */}
                        <div className="flex items-center gap-1 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartQty(item._id, item.cartQty - 1)}
                            disabled={item.cartQty <= 1}
                            className="w-7 h-7 flex items-center justify-center rounded-md
                              text-[#374151] hover:bg-white hover:shadow-sm
                              disabled:opacity-30 disabled:cursor-not-allowed
                              transition-all duration-150 active:scale-90"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold text-[#111827]">
                            {item.cartQty}
                          </span>
                          <button
                            onClick={() => updateCartQty(item._id, item.cartQty + 1)}
                            disabled={item.cartQty >= item.maxQty}
                            className="w-7 h-7 flex items-center justify-center rounded-md
                              text-[#374151] hover:bg-white hover:shadow-sm
                              disabled:opacity-30 disabled:cursor-not-allowed
                              transition-all duration-150 active:scale-90"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Item total */}
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#111827]">
                            ₹{((item.salesPrice ?? item.price) * item.cartQty)?.toLocaleString("en-IN")}
                          </p>
                          {item.cartQty > 1 && (
                            <p className="text-[10px] text-[#9ca3af]">
                              ₹{(item.salesPrice ?? item.price)?.toLocaleString("en-IN")} each
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order summary ── */}
            <div className="lg:sticky lg:top-6">
              <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-[0_1px_4px_rgba(0,0,0,0.05)] overflow-hidden">

                {/* Header */}
                <div className="px-5 py-4 border-b border-[#f3f4f6]">
                  <h2 className="text-sm font-semibold text-[#111827]">Order Summary</h2>
                </div>

                <div className="px-5 py-4 space-y-3">
                  <div className="flex justify-between text-sm text-[#6b7280]">
                    <span>Subtotal ({cart.length} item{cart.length !== 1 ? "s" : ""})</span>
                    <span className="text-[#374151]">₹{subtotal?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6b7280]">
                    <span>Shipping</span>
                    <span className="text-[#22c55e] font-medium">Free</span>
                  </div>
                  <div className="pt-3 border-t border-[#f3f4f6] flex justify-between">
                    <span className="text-sm font-semibold text-[#111827]">Total</span>
                    <span className="text-lg font-bold text-[#111827]">
                      ₹{subtotal?.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5 space-y-2.5">
                  <Link href="/checkout" className="block">
                    <button className="w-full py-3.5 bg-primary text-white text-sm font-semibold
                      rounded-xl hover:bg-[#1d4ed8] active:scale-[0.98]
                      transition-all duration-150 flex items-center justify-center gap-2
                      shadow-[0_4px_14px_rgba(37,99,235,0.3)]">
                      <Lock className="w-3.5 h-3.5" />
                      Proceed to Checkout
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <Link href="/products" className="block">
                    <button className="w-full py-3 border border-[#e5e7eb] text-sm font-medium
                      text-[#374151] rounded-xl hover:bg-[#f9fafb]
                      active:scale-[0.98] transition-all duration-150">
                      Continue Shopping
                    </button>
                  </Link>

                  {/* Trust line */}
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <Lock className="w-3 h-3 text-[#9ca3af]" />
                    <span className="text-[10px] text-[#9ca3af]">Secure & encrypted checkout</span>
                  </div>
                </div>
              </div>

              {/* Free shipping notice */}
              {/* <div className="mt-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl px-4 py-3 flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" className="w-4 h-4 shrink-0">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <p className="text-xs text-[#16a34a] font-medium">
                  You qualify for free shipping on this order!
                </p>
              </div> */}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;
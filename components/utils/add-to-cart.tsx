"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart, Check, Loader2, Zap, ShoppingBag } from "lucide-react";
import { Button } from "../ui/button";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  salesPrice: number;
  image: string;
  images?: { url: string }[];
  quantity: number;
  cartQty: number;
  maxQty: number;
  size?: string | null;
  color?: string | null;
  slug?: string;
  codAvailable?: boolean;
};

type Props = {
  product: Omit<CartItem, "cartQty" | "size" | "color">;
  selectedSize?: string | null;
  selectedColor?: string | null;
  className?: string;
  hasSizes?: boolean;
  hasColors?: boolean;
  disabled?: boolean;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  showBuyNow?: boolean;
};

const AddToCartButton = ({
  product,
  selectedSize,
  selectedColor,
  className = "",
  hasSizes,
  hasColors,
  disabled = false,
  showBuyNow = false,
}: Props) => {
  const [inCart, setInCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cartItems.some(
      (item: CartItem) =>
        item._id === product._id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );
    setInCart(exists);
  }, [product._id, selectedSize, selectedColor]);

  const addToCart = (redirectToCart = false) => {
    if (hasSizes && !selectedSize) {
      toast.warning("Please select a size before adding to cart.");
      return false;
    }
    if (hasColors && !selectedColor) {
      toast.warning("Please select a color before adding to cart.");
      return false;
    }
    if (product.quantity <= 0) {
      toast.error("This product is out of stock.");
      return false;
    }
    if (product.codAvailable === false && !redirectToCart) {
      toast.info("This product is not available for Cash on Delivery.", { duration: 5000 });
    }

    redirectToCart ? setIsBuyNowLoading(true) : setIsLoading(true);

    try {
      const cartItems: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = cartItems.findIndex(
        (item) =>
          item._id === product._id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingIndex >= 0) {
        if (cartItems[existingIndex].cartQty >= cartItems[existingIndex].maxQty) {
          toast.error(`Maximum quantity (${cartItems[existingIndex].maxQty}) reached.`);
          return false;
        }
        cartItems[existingIndex].cartQty += 1;
        if (!redirectToCart) toast.success("Quantity increased in cart.");
      } else {
        cartItems.push({
          ...product,
          image: product.image || product.images?.[0]?.url || "",
          size: selectedSize || null,
          color: selectedColor || null,
          cartQty: 1,
          maxQty: product.quantity,
          codAvailable: product.codAvailable,
        });
        if (!redirectToCart) toast.success("Added to cart!");
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
      setInCart(true);

      if (!redirectToCart) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2000);
      }

      window.dispatchEvent(new Event("cart-updated"));
      return true;
    } catch (error) {
      toast.error("Failed to add to cart.");
      console.error(error);
      return false;
    } finally {
      redirectToCart ? setIsBuyNowLoading(false) : setIsLoading(false);
    }
  };

  const handleBuyNow = () => {
    const success = addToCart(true);
    if (success) router.push("/cart");
  };

  const isOutOfStock = product.quantity <= 0;

  return (
    <>
      <style>{`
        @keyframes cartPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(0.94); }
          70%  { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes slideCheck {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .atc-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          height: 52px;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          overflow: hidden;
          transition: background 0.25s, color 0.25s, opacity 0.2s, transform 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .atc-btn:active:not(:disabled) { transform: scale(0.98); }
        .atc-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .atc-btn-primary {
          background: #111;
          color: #fff;
        }
        .atc-btn-primary:hover:not(:disabled) { background: #222; }
        .atc-btn-primary.just-added {
          animation: cartPop 0.4s ease;
          background: #1a1a1a;
        }

        .atc-btn-incart {
          background: transparent;
          color: #111;
          border: 1.5px solid #111;
        }
        .atc-btn-incart:hover:not(:disabled) { background: #f5f5f5; }
        .atc-btn-incart .check-icon {
          animation: slideCheck 0.3s ease;
        }

        .atc-btn-buynow {
          background: #b8933f;
          color: #fff;
        }
        .atc-btn-buynow:hover:not(:disabled) {
          background: #a07c32;
        }
        .atc-btn-buynow::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%);
          background-size: 200%;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .atc-btn-buynow:hover:not(:disabled)::after {
          opacity: 1;
          animation: shimmer 0.7s linear;
        }

        .atc-btn-disabled {
          background: #f0f0f0;
          color: #999;
          cursor: not-allowed;
          border: none;
        }

        .atc-wrap { display: flex; flex-direction: column; gap: 10px; }
        @media (min-width: 640px) {
          .atc-wrap-row { flex-direction: row; }
        }
      `}</style>

      <div className={`atc-wrap ${showBuyNow ? "atc-wrap-row" : ""} ${className}`}>

        {/* Add to Cart / View in Cart / Out of Stock */}
        {isOutOfStock ? (
          <Button  disabled>
            Out of Stock
          </Button>
        ) : inCart ? (
          <Button
          variant={'outline'}
            onClick={() => router.push("/cart")}
          >
            <Check size={16} strokeWidth={2} className="check-icon" />
            View in Cart
          </Button>
        ) : (
          <Button
          variant={'secondary'}
            onClick={() => addToCart(false)}
            disabled={isLoading || disabled}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ShoppingCart size={16} strokeWidth={1.75} />
            )}
            {isLoading ? "Adding..." : "Add to Cart"}
          </Button>
        )}

        {/* Buy Now */}
        {showBuyNow && (
          <Button
            onClick={handleBuyNow}
            disabled={isBuyNowLoading || disabled || isOutOfStock}
          >
            {isBuyNowLoading && (
              <Loader2 size={16} className="animate-spin" />
            ) }
            {isBuyNowLoading ? "Processing..." : "Buy Now"}
          </Button>
        )}

      </div>
    </>
  );
};

export default AddToCartButton;
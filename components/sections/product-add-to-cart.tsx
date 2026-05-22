"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/utils/add-to-cart";
import { Check, X, ShoppingCart, Zap } from "lucide-react";

type Props = {
  product: {
    _id: string;
    name: string;
    price: number;
    salesPrice: number;
    maxQty: number;
    image: string;
    quantity: number;
    sizes: string[];
    colors: string[];
    images: any;
  };
};

const ProductBuySection = ({ product }: Props) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isInCart, setIsInCart] = useState(false);
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  // Check if product with size/color is already in cart
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const match = cart.find(
      (item: any) =>
        item._id === product._id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );
    
    setIsInCart(!!match);
    
    // If no selection yet, try to pre-select based on cart
    if (!selectedSize || !selectedColor) {
      const cartItem = cart.find((item: any) => item._id === product._id);
      if (cartItem) {
        if (cartItem.size && !selectedSize) setSelectedSize(cartItem.size);
        if (cartItem.color && !selectedColor) setSelectedColor(cartItem.color);
      }
    }
  }, [product._id, selectedSize, selectedColor]);

  const handleSizeSelect = (size: string) => {
    if (selectedSize === size) {
      setSelectedSize(null);
    } else {
      setSelectedSize(size);
    }
  };

  const handleColorSelect = (color: string) => {
    if (selectedColor === color) {
      setSelectedColor(null);
    } else {
      setSelectedColor(color);
    }
  };

  const clearSelection = () => {
    setSelectedSize(null);
    setSelectedColor(null);
  };

  const handleBuyNow = () => {
    // Validate selections
    if (product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size before buying now.");
      return;
    }
    
    if (product.colors?.length > 0 && !selectedColor) {
      alert("Please select a color before buying now.");
      return;
    }
    
    if (product.quantity <= 0) {
      alert("This product is out of stock.");
      return;
    }

    setIsBuyNowLoading(true);

    try {
      const cartItems: any[] = JSON.parse(localStorage.getItem("cart") || "[]");

      const existingIndex = cartItems.findIndex(
        (item) =>
          item._id === product._id &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingIndex >= 0) {
        // Check if we can add more of this item
        if (cartItems[existingIndex].cartQty >= cartItems[existingIndex].maxQty) {
          alert(`Maximum quantity (${cartItems[existingIndex].maxQty}) reached for this item.`);
          return;
        }
        
        cartItems[existingIndex].cartQty += 1;
      } else {
        const newProduct = {
          ...product,
          image: product.image || product.images?.[0]?.url || "",
          size: product.sizes?.length > 0 ? selectedSize : null,
          color: product.colors?.length > 0 ? selectedColor : null,
          cartQty: 1,
          maxQty: product.quantity,
        };

        cartItems.push(newProduct);
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
      setIsInCart(true);
      window.dispatchEvent(new Event("cart-updated"));
      
      // Redirect to cart page
      window.location.href = "/cart";
    } catch (error) {
      alert("Failed to add product to cart.");
      console.error("Buy now error:", error);
    } finally {
      setIsBuyNowLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Sizes */}
      {product.sizes?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Select Size</h4>
            {selectedSize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSize(null)}
                className="h-8 px-2 text-xs text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                className={`relative min-w-[60px] h-10 ${
                  selectedSize === size ? "border-2 border-primary" : ""
                }`}
                onClick={() => handleSizeSelect(size)}
              >
                {size}
                {selectedSize === size && (
                  <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {product.colors?.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold">Select Color</h4>
            {selectedColor && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedColor(null)}
                className="h-8 px-2 text-xs text-muted-foreground"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <Button
                key={color}
                variant={selectedColor === color ? "default" : "outline"}
                className={`relative min-w-[80px] h-10 ${
                  selectedColor === color ? "border-2 border-primary" : ""
                }`}
                onClick={() => handleColorSelect(color)}
              >
                {color}
                {selectedColor === color && (
                  <div className="absolute -top-1 -right-1 bg-primary rounded-full p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {(selectedSize || selectedColor) && (
        <div className="bg-muted/30 p-3 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Your Selection</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            {selectedSize && (
              <span className="bg-background px-3 py-1 rounded-full border">
                Size: {selectedSize}
              </span>
            )}
            {selectedColor && (
              <span className="bg-background px-3 py-1 rounded-full border">
                Color: {selectedColor}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 space-y-3">
        {/* Buy Now Button - Always shown */}
        <Button
          className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
          onClick={handleBuyNow}
          disabled={isBuyNowLoading || product.quantity <= 0}
          size="lg"
        >
          {isBuyNowLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5" />
              Buy Now
            </>
          )}
        </Button>

        {/* Add to Cart Button */}
        <AddToCartButton
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          hasSizes={product.sizes?.length > 0}
          hasColors={product.colors?.length > 0}
          className="py-3"
          variant="default"
        />
        
        {isInCart && (
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <Check className="h-4 w-4 mr-1" />
            This item is in your cart
          </p>
        )}
      </div>

      {/* Help Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        {product.sizes?.length > 0 && product.colors?.length > 0 ? (
          <p>Please select both size and color before purchasing</p>
        ) : product.sizes?.length > 0 ? (
          <p>Please select a size before purchasing</p>
        ) : product.colors?.length > 0 ? (
          <p>Please select a color before purchasing</p>
        ) : null}
        
        {/* Buy Now explanation */}
        <p className="text-green-600 font-medium">
          <Zap className="h-3 w-3 inline mr-1" />
          <strong>Buy Now:</strong> Add to cart and proceed to checkout immediately
        </p>
        
        {/* Add to Cart explanation */}
        <p className="text-blue-600 font-medium">
          <ShoppingCart className="h-3 w-3 inline mr-1" />
          <strong>Add to Cart:</strong> Add to cart and continue shopping
        </p>
      </div>
    </div>
  );
};

export default ProductBuySection;
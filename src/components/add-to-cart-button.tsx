"use client";

import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (product.stock === 0) {
    return (
      <Button size="lg" disabled className="flex-1">
        Sold Out
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={handleAdd}
      className="flex-1"
    >
      {added ? "✓ Added to Cart" : "Add to Cart"}
    </Button>
  );
}

"use client";

import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Your Cart</h1>
        <p className="mt-4 text-muted-foreground text-lg font-sans">Your cart is empty.</p>
        <p className="mt-2 text-sm text-muted-foreground font-sans">Discover handcrafted pieces waiting for you.</p>
        <div className="mt-8"><Link href="/products"><Button size="lg">Browse Collection</Button></Link></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-28 pt-8 sm:px-6 sm:py-16">
      <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-2">Your Cart</h1>
      <p className="mb-6 font-sans text-muted-foreground sm:mb-10">{totalItems} {totalItems === 1 ? "item" : "items"}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="flex gap-3 border-border/60 p-3 sm:gap-4 sm:p-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-secondary/30 flex-shrink-0">
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-sm leading-tight truncate">{item.name}</h3>
                <p className="mt-1 text-lg font-bold">${item.price.toFixed(2)}</p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center border border-border/60 rounded-md">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-3 py-1.5 text-sm hover:bg-secondary transition-colors sm:px-2.5 sm:py-1">−</button>
                    <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1.5 text-sm hover:bg-secondary transition-colors sm:px-2.5 sm:py-1">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-xs text-muted-foreground hover:text-destructive transition-colors">Remove</button>
                </div>
              </div>
              <div className="hidden text-right flex-shrink-0 sm:block">
                <p className="text-sm text-muted-foreground">Subtotal</p>
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 border-border/60 sticky top-24">
            <h2 className="text-lg font-semibold font-sans">Order Summary</h2>
            <div className="mt-4 space-y-3 text-sm font-sans">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${totalPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{totalPrice >= 150 ? <span className="text-green-600">Free</span> : "Calculated at checkout"}</span></div>
              <Separator />
              <div className="flex justify-between text-base font-bold"><span>Total</span><span>${totalPrice.toFixed(2)}</span></div>
            </div>
            <Button size="lg" className="w-full mt-6" asChild><Link href="/checkout">Proceed to Checkout</Link></Button>
            <p className="mt-4 text-xs text-center text-muted-foreground font-sans">Free worldwide shipping on orders over $150</p>
          </Card>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
            <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
          </div>
          <Button size="lg" className="w-[10rem]" asChild><Link href="/checkout">Checkout</Link></Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">Free worldwide shipping over $150</p>
      </div>
    </div>
  );
}

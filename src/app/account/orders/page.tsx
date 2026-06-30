"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";

export default function OrdersPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.user) router.push("/auth/login");
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <h1 className="text-2xl font-serif font-bold mb-8">My Orders</h1>

        <div className="text-center py-16 border rounded-xl bg-muted/30">
          <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">No orders yet.</p>
          <Link href="/products" className="inline-block mt-4 text-sm text-primary font-medium hover:underline">
            Start shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}

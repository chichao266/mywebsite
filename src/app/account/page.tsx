"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, LogOut, Package } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          router.push("/auth/login");
        }
      })
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[60vh] py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold">Hello, {user.name}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/account/orders"
            className="p-6 rounded-xl border hover:border-primary/30 hover:shadow-sm transition-all flex items-center gap-4"
          >
            <Package className="w-6 h-6 text-primary shrink-0" />
            <div>
              <p className="font-medium">Orders</p>
              <p className="text-sm text-muted-foreground">View your order history</p>
            </div>
          </Link>

          <Link
            href="/account/settings"
            className="p-6 rounded-xl border hover:border-primary/30 hover:shadow-sm transition-all flex items-center gap-4"
          >
            <User className="w-6 h-6 text-primary shrink-0" />
            <div>
              <p className="font-medium">Settings</p>
              <p className="text-sm text-muted-foreground">Manage your profile</p>
            </div>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

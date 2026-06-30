"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value?.trim();
    if (!name) return;
    setSaving(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setMsg("Profile updated successfully!");
        setUser((prev) => prev ? { ...prev, name } : null);
      } else {
        setMsg("Failed to update profile.");
      }
    } catch {
      setMsg("Network error.");
    } finally {
      setSaving(false);
    }
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
      <div className="container mx-auto px-4 sm:px-6 max-w-xl">
        <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <h1 className="text-2xl font-serif font-bold mb-8">Account Settings</h1>

        <form onSubmit={handleSave} className="space-y-6">
          {msg && (
            <p className={`text-sm p-3 rounded-lg ${msg.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {msg}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Name</label>
            <input
              ref={nameRef}
              type="text"
              defaultValue={user.name}
              required
              className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2.5 border rounded-lg text-sm bg-muted/50 text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

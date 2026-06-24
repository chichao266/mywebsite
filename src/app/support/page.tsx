"use client";

import { useState, useRef } from "react";
import { MessageCircle, Mail, Clock } from "lucide-react";

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value?.trim();
    const email = emailRef.current?.value?.trim();
    const subject = subjectRef.current?.value?.trim();
    const message = msgRef.current?.value?.trim();

    if (!name || !email || !subject || !message) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-serif font-bold mb-3">Thank you!</h1>
          <p className="text-muted-foreground">
            Your message has been received. We typically respond within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold mb-4">How can we help?</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Send us a message and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Quick info */}
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          <div className="flex items-center gap-3 p-4 rounded-xl border">
            <Mail className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground">support@lumeajewelry.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border">
            <Clock className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-medium">Response Time</p>
              <p className="text-xs text-muted-foreground">Within 24 hours</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Name</label>
              <input
                ref={nameRef}
                type="text"
                required
                placeholder="Your name"
                className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                ref={emailRef}
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Subject</label>
            <input
              ref={subjectRef}
              type="text"
              required
              placeholder="What's this about?"
              className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Message</label>
            <textarea
              ref={msgRef}
              required
              rows={5}
              placeholder="Tell us how we can help..."
              className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

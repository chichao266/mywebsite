import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm font-medium tracking-widest uppercase text-primary/80 mb-4">
          Get in Touch
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Contact Us
        </h1>
        <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
          Have a question about a piece? Want to inquire about custom orders?
          We&apos;d love to hear from you.
        </p>

        {/* Contact Methods */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: "Email",
              detail: "hello@agatelier.com",
              desc: "We typically respond within 24 hours.",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              ),
            },
            {
              title: "WhatsApp",
              detail: "+86 138 0000 0000",
              desc: "Available 9:00 – 18:00 Beijing time (UTC+8).",
              icon: (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
              ),
            },
          ].map((method) => (
            <Card key={method.title} className="border-border/60">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-4">
                  {method.icon}
                </div>
                <h3 className="font-semibold">{method.title}</h3>
                <p className="mt-1 text-sm font-mono text-foreground">
                  {method.detail}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {method.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 border-t border-border/40 pt-12">
          <h2 className="text-xl font-bold tracking-tight mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Are your stones natural or treated?",
                a: "All Agatelier pieces are 100% natural stone — no dyes, no heat treatment, no synthetic materials. Each piece comes with a certificate of authenticity.",
              },
              {
                q: "Do you ship internationally?",
                a: "Yes. We ship worldwide. Orders over $150 qualify for free shipping. Delivery typically takes 5–12 business days depending on your location.",
              },
              {
                q: "What is your return policy?",
                a: "We accept returns within 30 days of delivery. The piece must be unworn and in its original packaging. Custom orders are final sale.",
              },
              {
                q: "Can I request a custom piece?",
                a: "Absolutely. Contact us via WhatsApp or email with your requirements — preferred stone type, size, budget — and we'll work with our artisans to create something unique for you.",
              },
            ].map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-sm">{faq.q}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Or explore our collection
          </p>
          <Link href="/products">
            <Button variant="outline" size="lg">
              Browse Collection
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

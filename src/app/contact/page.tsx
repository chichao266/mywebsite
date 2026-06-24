import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const methods = [
    {
      title: "Email",
      detail: "hello@lumeajewelry.com",
      desc: "For product questions, order support, and wholesale inquiries.",
    },
    {
      title: "Studio hours",
      detail: "Mon-Fri",
      desc: "We typically respond within one business day.",
    },
  ];

  const faqs = [
    {
      q: "Are your diamonds real diamonds?",
      a: "Yes. Lab-grown diamonds have the same optical, physical, and chemical properties as mined diamonds. We clearly disclose them as lab-grown.",
    },
    {
      q: "Are your sapphires, rubies, and emeralds natural?",
      a: "Our colored gemstone line is built around lab-grown stones. Product pages use clear terms such as lab-grown sapphire or lab-grown ruby.",
    },
    {
      q: "Do you ship internationally?",
      a: "Yes. We plan the site for customers outside Mainland China, with international checkout and shipping language.",
    },
    {
      q: "Can I request a custom piece?",
      a: "For launch, we recommend focusing on ready-to-ship essentials. Custom work can be added later once product operations are stable.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.28em] text-primary/70">Contact</p>
        <h1 className="font-serif text-4xl font-bold tracking-tight">How can we help?</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
          Questions about lab-grown diamonds, colored gemstones, sizing, or shipping? Send us a note.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {methods.map((method) => (
            <Card key={method.title} className="rounded-md border-border/60 shadow-none">
              <CardContent className="p-6">
                <h2 className="font-serif text-xl font-semibold">{method.title}</h2>
                <p className="mt-2 text-sm font-medium text-foreground">{method.detail}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{method.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div id="faq" className="mt-16 border-t pt-12">
          <h2 className="mb-8 font-serif text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-7">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 text-sm text-muted-foreground">Ready to browse the collection?</p>
          <Button asChild variant="outline" size="lg">
            <Link href="/products">Shop Jewelry</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

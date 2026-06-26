import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSetting } from "@/lib/settings";
import { sanitizeHtml } from "@/lib/sanitize-html";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { content } = await getSetting("our_story");

  const standards = [
    {
      title: "Clearly lab-grown",
      desc: "We label every diamond and colored gemstone by origin so customers know exactly what they are buying.",
    },
    {
      title: "Daily proportions",
      desc: "Our settings are designed to sit comfortably, layer easily, and bring fine jewelry into ordinary days.",
    },
    {
      title: "Color with restraint",
      desc: "Sapphire, ruby, emerald, and diamond pieces are edited for clean color rather than loud trend cycles.",
    },
  ];

  return (
    <div>
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary/70">Our Standards</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Fine jewelry for a more transparent generation.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Avoryne is built around lab-grown diamonds and colored gemstones: brilliant materials,
            modern proportions, and clear language from first glance to checkout.
          </p>
        </div>
      </section>

      <section className="border-y bg-background">
        <div className="container mx-auto grid gap-0 px-4 sm:px-6 md:grid-cols-3">
          {standards.map((item) => (
            <div key={item.title} className="border-border/60 py-10 md:border-r md:px-8 md:last:border-r-0">
              <h2 className="font-serif text-xl font-semibold">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div
            className="space-y-6 text-base leading-8 text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-3xl border-t pt-12 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight">Explore the new direction</h2>
          <p className="mt-3 text-muted-foreground">
            Start with lab diamonds, then add sapphire, ruby, and emerald color as your everyday wardrobe evolves.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/products">Shop Jewelry</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

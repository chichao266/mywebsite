import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSetting } from "@/lib/settings";
import { sanitizeHtml } from "@/lib/sanitize-html";

export default async function AboutPage() {
  const { title, content } = await getSetting("about");

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <section className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
        <p className="text-sm font-medium tracking-widest uppercase text-primary/80 mb-4">Our Story</p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-[1.15]">
          Stones are not just found.<br /><span className="text-primary">They are chosen.</span>
        </h1>
      </section>

      <section className="max-w-3xl mx-auto">
        <div className="text-muted-foreground leading-relaxed space-y-6 font-sans" dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
      </section>

      <section className="max-w-3xl mx-auto mt-20 sm:mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { title: "Natural Only", desc: "We never sell dyed, treated, or synthetic stones. What you see is what the earth made." },
            { title: "Direct Sourcing", desc: "No middlemen. We buy directly from the artisans who carve each piece." },
            { title: "Quiet Luxury", desc: "We don't shout. Our stones speak for themselves — in the cool weight of a well-cut agate, in the way light moves across its bands." },
          ].map((v) => (
            <div key={v.title} className="text-center p-6">
              <h3 className="text-lg font-serif font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-sans">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto mt-20 sm:mt-24 text-center border-t border-border/40 pt-16">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">Ready to find your stone?</h2>
        <p className="mt-3 text-muted-foreground font-sans">Browse our collection of handcrafted agate jewelry.</p>
        <div className="mt-8"><Link href="/products"><Button size="lg">Explore Collection</Button></Link></div>
      </section>
    </div>
  );
}

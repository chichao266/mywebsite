import { getSetting } from "@/lib/settings";
import { sanitizeHtml } from "@/lib/sanitize-html";

export default async function ReturnsPage() {
  const { title, content } = await getSetting("returns");

  return (
    <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-18 max-w-3xl">
      <p className="text-xs font-medium tracking-[0.25em] uppercase text-primary/60 mb-4 font-sans">Customer Care</p>
      <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-10">{title}</h1>
      <div className="text-muted-foreground leading-relaxed font-sans space-y-6" dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
    </div>
  );
}

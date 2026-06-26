import { getSetting } from "@/lib/settings";
import { sanitizeHtml } from "@/lib/sanitize-html";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const { title, content } = await getSetting("terms");

  return (
    <div className="container mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-18">
      <p className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.25em] text-primary/60">
        Legal
      </p>
      <h1 className="mb-10 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <div
        className="space-y-6 font-sans leading-relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
      />
    </div>
  );
}

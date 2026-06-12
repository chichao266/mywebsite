import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
      <p className="text-sm font-medium tracking-widest uppercase text-primary/80 mb-4">
        404
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        This stone is still in the earth
      </h1>
      <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-md mx-auto leading-relaxed">
        The page you&apos;re looking for hasn&apos;t been found yet — like a
        gem that&apos;s still waiting to be uncovered.
      </p>
      <div className="mt-10">
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={cn("shrink-0 bg-border border-0 h-px w-full", className)}
      {...props}
    />
  );
}

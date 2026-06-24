export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M12 3.25 4.25 10.5 12 20.75l7.75-10.25L12 3.25Z" stroke="currentColor" strokeWidth="1.45" className="text-primary" />
      <path d="M8.1 10.5h7.8M12 3.25 8.1 10.5 12 20.75l3.9-10.25L12 3.25Z" stroke="currentColor" strokeWidth="1.1" className="text-foreground/70" />
    </svg>
  );
}

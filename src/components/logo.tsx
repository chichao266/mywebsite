export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M12 3L3 12L12 21L21 12L12 3Z" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
      <path d="M12 7L7 12L12 17L17 12L12 7Z" fill="currentColor" className="text-accent" fillOpacity="0.6" />
    </svg>
  );
}

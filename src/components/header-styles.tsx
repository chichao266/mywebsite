"use client";

export function HeaderStyles() {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        header nav a { color: #374151 !important; }
        header nav a:hover { color: #111827 !important; }
        header a[aria-label] { color: #374151 !important; }
        header a[aria-label]:hover { color: #111827 !important; }
        header button[aria-label] { color: #374151 !important; }
        header button[aria-label]:hover { color: #111827 !important; }
        @media (max-width: 767px) {
          header[data-over-image="true"] span,
          header[data-over-image="true"] svg path,
          header[data-over-image="true"] a[aria-label],
          header[data-over-image="true"] button[aria-label] {
            color: #ffffff !important;
            stroke: #ffffff !important;
            text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
          }
          header[data-over-image="true"] a[aria-label]:hover,
          header[data-over-image="true"] button[aria-label]:hover {
            color: #ffffff !important;
            background: rgba(255, 255, 255, 0.14) !important;
          }
        }
      `
    }} />
  );
}

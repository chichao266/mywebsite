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
      `
    }} />
  );
}

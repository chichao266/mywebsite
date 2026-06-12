const BLOCKED_TAGS = /<\/?(script|style|iframe|object|embed|link|meta|base|form|input|button|textarea|select)[^>]*>/gi;
const EVENT_HANDLERS = /\s+on[a-z]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi;
const UNSAFE_URLS = /\s+(href|src)\s*=\s*(["'])\s*(javascript:|data:text\/html)[\s\S]*?\2/gi;

export function sanitizeHtml(html: string): string {
  return html
    .replace(BLOCKED_TAGS, "")
    .replace(EVENT_HANDLERS, "")
    .replace(UNSAFE_URLS, "");
}

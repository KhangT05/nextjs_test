// Lightweight behavior tracking → webhook. No PII, fire-and-forget, fails silently.
// Replace WEBHOOK_URL with a real endpoint (e.g. https://webhook.site/your-id for testing,
// or your own /api/track route in production).
const WEBHOOK_URL = process.env.NEXT_PUBLIC_TRACKING_WEBHOOK_URL ?? "";

type TrackEvent =
  | { type: "scroll_depth"; depth: 25 | 50 | 75 | 100 }
  | { type: "section_view"; section: string }
  | { type: "cta_click"; cta: string }
  | { type: "newsletter_submit"; success: boolean };

export function track(event: TrackEvent) {
  if (typeof window === "undefined") return;

  const payload = {
    ...event,
    path: window.location.pathname,
    ts: new Date().toISOString(),
  };

  // eslint-disable-next-line no-console
  console.debug("[track]", payload);

  if (!WEBHOOK_URL) return;

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(WEBHOOK_URL, new Blob([body], { type: "application/json" }));
    } else {
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // tracking must never break the page
  }
}

let firedDepths = new Set<number>();
export function initScrollTracking() {
  if (typeof window === "undefined") return () => {};
  firedDepths = new Set();

  const onScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const pct = (scrollTop / docHeight) * 100;

    [25, 50, 75, 100].forEach((mark) => {
      if (pct >= mark && !firedDepths.has(mark)) {
        firedDepths.add(mark);
        track({ type: "scroll_depth", depth: mark as 25 | 50 | 75 | 100 });
      }
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

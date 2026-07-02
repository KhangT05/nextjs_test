"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { RingMotif } from "./RingMotif";
import { track } from "@/lib/analytics";
import { useRipple } from "@/lib/useRipple";

// Each beat = one narrative step in the scrollytelling reveal. Kept to 3 to
// match the existing Sleep/Recovery/Strain copy already established below
// in the body text, rather than inventing a new taxonomy.
const BEATS = [
  { metric: "58", unit: "bpm", label: "Nhịp tim nghỉ", kicker: "Sleep", percent: 87, accent: "#5EEAD4" },
  { metric: "98", unit: "%", label: "SpO2 trung bình", kicker: "Recovery", percent: 92, accent: "#5EEAD4" },
  { metric: "14.2", unit: "", label: "Strain hôm nay", kicker: "Strain", percent: 71, accent: "#E8A858" },
] as const;

export function Hero() {
  const ripple = useRipple();
  const containerRef = useRef<HTMLDivElement>(null);
  // null during SSR/first client render (matches server, avoids hydration
  // mismatch), resolves to a boolean after mount.
  const prefersReducedMotion = useReducedMotion();
  const scrollytellingEnabled = prefersReducedMotion !== true;
  const [activeBeat, setActiveBeat] = useState(0);

  // ── Parallax (background glow layer only) ──────────────────────────────
  // useScroll's listener is passive and framer writes the result straight
  // to a motion value / DOM style — it does NOT trigger a React re-render
  // per frame like a naive `onScroll={() => setState(...)}` would. That's
  // what keeps this cheap enough to run continuously on scroll. Restricted
  // to `y` transform on an aria-hidden decorative div — never applied to
  // text, so no CLS/reflow and no accessibility conflict.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const glowY = useTransform(scrollYProgress, [0, 1], scrollytellingEnabled ? [0, 160] : [0, 0]);

  // ── Narrative beats (discrete, not continuous) ──────────────────────────
  // Deliberately IntersectionObserver-driven instead of scroll-math-driven:
  // IO only fires on threshold crossings (3 times across the whole 300vh
  // range), vs. a scroll handler recomputing every frame. For a stepped
  // narrative reveal (not a continuous scrub), this is strictly cheaper on
  // mobile main-thread/TBT and is the reason this part isn't also on
  // useScroll.
  useEffect(() => {
    if (!scrollytellingEnabled) return;
    const markers = containerRef.current?.querySelectorAll<HTMLElement>("[data-beat]");
    if (!markers?.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveBeat(Number(entry.target.getAttribute("data-beat")));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    markers.forEach((m) => observer.observe(m));
    return () => observer.disconnect();
  }, [scrollytellingEnabled]);

  const beat = BEATS[activeBeat];

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative"
      style={{ height: scrollytellingEnabled ? "300vh" : undefined }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden pt-16">
        {/* Parallax layer — decorative only, never text */}
        <motion.div
          aria-hidden
          style={{ y: glowY }}
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-aqua/20 blur-[120px]"
        />

        <div className="container-x section-pad relative grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center w-full">
          <div>
            <p className="num text-xs uppercase tracking-[0.2em] text-aqua mb-5">
              Titan · 2.4g · 7 ngày pin
            </p>

            {/* LCP element: plain markup, paints on first server-rendered HTML,
                no opacity:0→1 JS gate before it becomes visible. */}
            <h1 className="font-semibold tracking-tightest text-5xl sm:text-6xl lg:text-7xl leading-[0.98]">
              Cơ thể bạn
              <br />
              đang nói.
              <br />
              <span className="text-aqua">Hãy đeo nó.</span>
            </h1>

            <p className="mt-7 text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              AuraRing đo nhịp tim, SpO2 và nhiệt độ da mỗi đêm — chuyển thành ba con số
              bạn thực sự cần: <strong className="text-midnight dark:text-bone font-medium">Sleep</strong>,{" "}
              <strong className="text-midnight dark:text-bone font-medium">Recovery</strong>,{" "}
              <strong className="text-midnight dark:text-bone font-medium">Strain</strong>.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#newsletter"
                onClick={(e) => { ripple(e); track({ type: "cta_click", cta: "hero_preorder" }); }}
                className="relative overflow-hidden inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-midnight text-bone dark:bg-aqua dark:text-midnight font-medium hover:scale-[1.03] active:scale-[0.98] transition-transform"
              >
                Đặt trước — 4.990.000đ
              </a>
              <a
                href="#specs"
                onClick={() => track({ type: "cta_click", cta: "hero_specs" })}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-midnight/15 dark:border-bone/15 font-medium hover:border-aqua transition-colors"
              >
                Xem thông số →
              </a>
            </div>

            <p className="mt-6 text-xs text-slate-400 num">
              Giao hàng Q3/2026 · Hoàn tiền 100% nếu hủy trước khi xuất xưởng
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="animate-float">
              <RingMotif
                percent={beat.percent}
                size={300}
                stroke={3}
                value={beat.metric}
                label={beat.label}
                color={beat.accent}
              />
            </div>

            {/* Narrative callout — swaps per beat, CSS-only transition (key
                remount replays the keyframe; no framer-motion needed here) */}
            <div
              key={activeBeat}
              className="absolute -left-2 bottom-4 hidden sm:block bg-bone dark:bg-midnight2 border border-midnight/10 dark:border-bone/10 rounded-2xl px-4 py-3 shadow-lg animate-[fadeUp_0.4s_ease-out]"
            >
              <p className="num text-2xl tabular-nums">
                {beat.metric}<span className="text-sm text-slate-400 ml-1">{beat.unit}</span>
              </p>
              <p className="text-[11px] uppercase tracking-widest text-slate-400">{beat.kicker}</p>
            </div>

            <div className="absolute -right-2 top-6 hidden sm:block bg-bone dark:bg-midnight2 border border-midnight/10 dark:border-bone/10 rounded-2xl px-4 py-3 shadow-lg">
              <p className="num text-2xl tabular-nums">98<span className="text-sm text-slate-400 ml-1">%</span></p>
              <p className="text-[11px] uppercase tracking-widest text-slate-400">SpO2</p>
            </div>
          </div>
        </div>

        {scrollytellingEnabled && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400 text-xs">
            <span>Cuộn để xem số liệu</span>
            <span className="w-px h-8 bg-current opacity-30 animate-pulse" />
          </div>
        )}
      </div>

      {/* Invisible markers driving the 3 narrative beats via IntersectionObserver */}
      {scrollytellingEnabled &&
        BEATS.map((_, i) => (
          <div
            key={i}
            data-beat={i}
            aria-hidden
            className="absolute w-full h-px"
            style={{ top: `${(i / BEATS.length) * 100 + 15}%` }}
          />
        ))}
    </section>
  );
}

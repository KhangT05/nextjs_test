"use client";

import { motion } from "framer-motion";
import { RingMotif } from "./RingMotif";
import { track } from "@/lib/analytics";

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-aqua/20 blur-[120px]"
      />

      <div className="container-x section-pad relative grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="num text-xs uppercase tracking-[0.2em] text-aqua mb-5"
          >
            Titan · 2.4g · 7 ngày pin
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-semibold tracking-tightest text-5xl sm:text-6xl lg:text-7xl leading-[0.98]"
          >
            Cơ thể bạn
            <br />
            đang nói.
            <br />
            <span className="text-aqua">Hãy đeo nó.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-7 text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed"
          >
            AuraRing đo nhịp tim, SpO2 và nhiệt độ da mỗi đêm — chuyển thành ba con số
            bạn thực sự cần: <strong className="text-midnight dark:text-bone font-medium">Sleep</strong>,{" "}
            <strong className="text-midnight dark:text-bone font-medium">Recovery</strong>,{" "}
            <strong className="text-midnight dark:text-bone font-medium">Strain</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#newsletter"
              onClick={() => track({ type: "cta_click", cta: "hero_preorder" })}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-midnight text-bone dark:bg-aqua dark:text-midnight font-medium hover:scale-[1.03] active:scale-[0.98] transition-transform"
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
          </motion.div>

          <p className="mt-6 text-xs text-slate-400 num">
            Giao hàng Q3/2026 · Hoàn tiền 100% nếu hủy trước khi xuất xưởng
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative flex items-center justify-center"
        >
          <div className="animate-float">
            <RingMotif percent={87} size={300} stroke={3} value="87" label="Readiness" />
          </div>
          {/* satellite micro-stats */}
          <div className="absolute -left-2 bottom-4 hidden sm:block bg-bone dark:bg-midnight2 border border-midnight/10 dark:border-bone/10 rounded-2xl px-4 py-3 shadow-lg">
            <p className="num text-2xl tabular-nums">58<span className="text-sm text-slate-400 ml-1">bpm</span></p>
            <p className="text-[11px] uppercase tracking-widest text-slate-400">Nhịp tim nghỉ</p>
          </div>
          <div className="absolute -right-2 top-6 hidden sm:block bg-bone dark:bg-midnight2 border border-midnight/10 dark:border-bone/10 rounded-2xl px-4 py-3 shadow-lg">
            <p className="num text-2xl tabular-nums">98<span className="text-sm text-slate-400 ml-1">%</span></p>
            <p className="text-[11px] uppercase tracking-widest text-slate-400">SpO2</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

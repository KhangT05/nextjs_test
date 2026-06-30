"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/lib/analytics";

const schema = z.object({
  email: z.string().trim().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  ringSize: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

// Real webhook for integration testing — drop your own endpoint here.
// webhook.site gives you a live URL instantly for verifying payloads.
const NEWSLETTER_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_NEWSLETTER_WEBHOOK_URL ?? "";

type Status = "idle" | "loading" | "success" | "error";

export function Newsletter() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setStatus("loading");
    try {
      if (NEWSLETTER_WEBHOOK_URL) {
        const res = await fetch(NEWSLETTER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, source: "auraring-landing", ts: new Date().toISOString() }),
        });
        if (!res.ok) throw new Error(`Webhook trả về ${res.status}`);
      } else {
        // No webhook configured — simulate latency so UX states are visible/testable.
        await new Promise((r) => setTimeout(r, 600));
      }
      setStatus("success");
      track({ type: "newsletter_submit", success: true });
      reset();
    } catch {
      setStatus("error");
      track({ type: "newsletter_submit", success: false });
    }
  }

  return (
    <section
      id="newsletter"
      className="py-24 md:py-32 border-t border-midnight/5 dark:border-bone/5"
    >
      <div className="container-x section-pad">
        <div className="relative rounded-3xl bg-midnight dark:bg-midnight2 text-bone px-8 py-16 md:px-16 md:py-20 overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -right-20 w-[420px] h-[420px] rounded-full bg-aqua/15 blur-[100px]"
          />
          <div className="relative max-w-lg">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-aqua mb-4">
              Đợt đặt trước giới hạn 500 chiếc
            </p>
            <h2 className="font-display font-semibold text-3xl md:text-4xl tracking-tightest mb-4">
              Nhận thông báo khi mở bán.
            </h2>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Không spam. Chỉ một email khi AuraRing sẵn sàng giao hàng, kèm ưu đãi sớm 15% cho
              người đăng ký.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="ban@email.com"
                    aria-label="Email"
                    aria-invalid={!!errors.email}
                    {...register("email")}
                    className="w-full px-5 py-3.5 rounded-full bg-bone/10 border border-bone/15 placeholder:text-slate-400 focus:bg-bone/15 outline-none transition-colors"
                  />
                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-amber text-xs mt-2 ml-5"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-7 py-3.5 rounded-full bg-aqua text-midnight font-medium hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 whitespace-nowrap"
                >
                  {status === "loading" ? "Đang gửi…" : "Đăng ký"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-aqua text-sm"
                  >
                    Đã đăng ký. Hẹn gặp lại khi AuraRing lên kệ.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-amber text-sm"
                  >
                    Gửi thất bại. Vui lòng thử lại sau ít phút.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

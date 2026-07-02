"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { fmt } from "@/lib/products";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartTotal, removeFromCart, updateQty } = useStore();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[60] bg-midnight/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[70] w-full sm:w-[400px] bg-bone dark:bg-midnight2 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-midnight/5 dark:border-bone/5">
              <h2 className="font-semibold text-lg">
                Giỏ hàng
                {cart.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-slate-400">({cart.reduce((s, i) => s + i.qty, 0)} sản phẩm)</span>
                )}
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Đóng giỏ hàng"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-midnight/5 dark:hover:bg-bone/5 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-3 text-center py-16">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-slate-300">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <p className="text-slate-400 text-sm">Giỏ hàng trống</p>
                  <button
                    onClick={() => { setCartOpen(false); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
                    className="text-aqua text-sm underline underline-offset-2"
                  >
                    Xem sản phẩm →
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.product.id}-${item.size}`} className="flex gap-4 items-start py-3 border-b border-midnight/5 dark:border-bone/5 last:border-0">
                    {/* Ring preview */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${item.product.ringColor}22` }}
                    >
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke={item.product.ringColor} strokeWidth="4"/>
                        <circle cx="18" cy="18" r="14" fill="none" stroke={item.product.accentColor} strokeWidth="4"
                          strokeDasharray="65" strokeDashoffset="20" strokeLinecap="round" transform="rotate(-90 18 18)"/>
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-snug">{item.product.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Size {item.size}</p>
                      <p className="text-sm font-semibold mt-1 text-aqua num">{fmt(item.product.price)}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        aria-label="Xóa"
                        className="text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M18 6 6 18M6 6l12 12"/>
                        </svg>
                      </button>
                      <div className="flex items-center gap-2 border border-midnight/10 dark:border-bone/10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.product.id, item.size, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-midnight dark:hover:text-bone transition-colors text-lg"
                        >
                          −
                        </button>
                        <span className="num text-sm w-5 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product.id, item.size, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-midnight dark:hover:text-bone transition-colors text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-midnight/5 dark:border-bone/5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-slate-500">Tổng</span>
                  <span className="text-xl font-semibold num">{fmt(cartTotal)}</span>
                </div>
                <button className="w-full py-3.5 rounded-full bg-midnight text-bone dark:bg-aqua dark:text-midnight font-medium hover:opacity-90 transition-opacity">
                  Thanh toán
                </button>
                <p className="text-center text-xs text-slate-400">
                  Chuyển hướng đến trang thanh toán bảo mật
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

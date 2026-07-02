"use client";

import { useStore } from "@/lib/store";
import { fmt } from "@/lib/products";
import { RingMotif } from "./RingMotif";

export function RecentlyViewed() {
  const { recentlyViewed, addToCart, toggleFavorite, isFavorite } = useStore();

  if (recentlyViewed.length === 0) return null;

  return (
    <section className="py-12 border-t border-midnight/5 dark:border-bone/5">
      <div className="container-x section-pad">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-5">Đã xem gần đây</p>
        <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none snap-x snap-mandatory">
          {recentlyViewed.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[200px] snap-start rounded-xl border border-midnight/5 dark:border-bone/5 bg-bone dark:bg-midnight2 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <RingMotif percent={82} size={44} stroke={3} color={product.accentColor} />
                <div className="min-w-0">
                  <p className="text-xs font-medium leading-snug truncate">{product.name}</p>
                  <p className="text-xs num text-slate-400 mt-0.5">{fmt(product.price)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart(product, product.sizes[2] ?? product.sizes[0])}
                  className="flex-1 text-[11px] py-1.5 rounded-full bg-midnight text-bone dark:bg-bone dark:text-midnight font-medium hover:opacity-90 transition-opacity"
                >
                  Thêm vào giỏ
                </button>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  aria-label="Yêu thích"
                  className="w-7 h-7 flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    fill={isFavorite(product.id) ? "#E8A858" : "none"} stroke={isFavorite(product.id) ? "#E8A858" : "#8B93A6"}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

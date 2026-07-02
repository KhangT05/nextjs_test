"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PRODUCTS, fmt } from "@/lib/products";
import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { RingMotif } from "./RingMotif";
import { useRipple } from "@/lib/useRipple";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      fill={filled ? "currentColor" : "none"} stroke="currentColor"
      className={filled ? "text-amber" : "text-slate-400"}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite, trackView } = useStore();
  const [selectedSize, setSelectedSize] = useState(product.sizes[2] ?? product.sizes[0]);
  const [addedFlash, setAddedFlash] = useState(false);
  const ripple = useRipple();
  const fav = isFavorite(product.id);

  function handleAddToCart(e: React.MouseEvent<HTMLButtonElement>) {
    ripple(e);
    addToCart(product, selectedSize);
    trackView(product);
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45 }}
      className="ring-pulse-trigger group relative flex flex-col bg-bone dark:bg-midnight2 rounded-2xl overflow-hidden border border-midnight/5 dark:border-bone/5 hover:border-aqua/30 transition-colors"
      onClick={() => trackView(product)}
    >
      {/* Badge */}
      {product.badgeLabel && (
        <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-widest font-medium px-2.5 py-1 rounded-full"
          style={{ background: `${product.accentColor}22`, color: product.accentColor }}>
          {product.badgeLabel}
        </span>
      )}

      {/* Favorite */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
        aria-label={fav ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-bone/80 dark:bg-midnight/60 backdrop-blur-sm hover:scale-110 transition-transform"
      >
        <HeartIcon filled={fav} />
      </button>

      {/* Product visual — RingMotif as product image */}
      <div
        className="flex items-center justify-center py-10"
        style={{ background: `linear-gradient(135deg, ${product.ringColor}18 0%, ${product.accentColor}0a 100%)` }}
      >
        <div
          className="ring-pulse-target animate-float rounded-full"
          style={{ "--pulse-color": product.accentColor } as React.CSSProperties}
        >
          <RingMotif
            percent={88}
            size={140}
            stroke={5}
            color={product.accentColor}
            trackColor={product.ringColor}
          />
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="font-semibold text-base leading-tight">{product.name}</h3>
          <p className="text-sm text-slate-400 mt-0.5">{product.subtitle}</p>
        </div>

        {/* Size picker */}
        <div>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-2">Size</p>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); setSelectedSize(s); }}
                className={`w-8 h-8 text-xs rounded-lg border transition-all num ${
                  selectedSize === s
                    ? "border-aqua bg-aqua/10 text-aqua font-medium"
                    : "border-midnight/10 dark:border-bone/10 text-slate-400 hover:border-aqua/50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="font-semibold num" style={{ color: product.accentColor }}>
            {fmt(product.price)}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(e); }}
            className={`relative overflow-hidden text-sm font-medium px-4 py-2 rounded-full transition-all ${
              addedFlash
                ? "bg-aqua text-midnight scale-95"
                : "bg-midnight text-bone dark:bg-bone dark:text-midnight hover:opacity-90"
            }`}
          >
            {addedFlash ? "Đã thêm ✓" : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-bone dark:bg-midnight2 rounded-2xl overflow-hidden border border-midnight/5 dark:border-bone/5">
      <div className="skeleton h-[216px]" />
      <div className="p-5 flex flex-col gap-4">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="flex gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton w-8 h-8 rounded-lg" />)}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="skeleton h-4 w-20 rounded" />
          <div className="skeleton h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function Products() {
  // PRODUCTS is static local data — no real fetch latency, so this skeleton
  // is purely a first-paint→mount visual treatment (one animation frame),
  // not gating on async data. Fixed skeleton height == real card height, so
  // there's no CLS from the swap. If product data ever moves to a real API
  // call (inventory/pricing), this same `mounted` boolean should be replaced
  // by the actual fetch's loading state instead of a mount flag.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="products" className="py-24 md:py-32 border-t border-midnight/5 dark:border-bone/5">
      <div className="container-x section-pad">
        <div className="max-w-xl mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-aqua mb-4">Bộ sưu tập</p>
          <h2 className="font-semibold text-3xl md:text-4xl tracking-tightest">
            Chọn phiên bản của bạn.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mounted
            ? PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)
            : PRODUCTS.map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </section>
  );
}

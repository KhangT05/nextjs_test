"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { Product } from "./products";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CartItem = {
  product: Product;
  size: string;
  qty: number;
};

type StoreState = {
  cart: CartItem[];
  favorites: Set<string>;          // product ids
  recentlyViewed: Product[];       // ordered newest-first, max 8

  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;

  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  trackView: (product: Product) => void;

  cartCount: number;
  cartTotal: number;

  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
};

const Ctx = createContext<StoreState | null>(null);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Hydrate once on mount
  useEffect(() => {
    setCart(load<CartItem[]>("ar-cart", []));
    setFavorites(new Set(load<string[]>("ar-favs", [])));
    setRecentlyViewed(load<Product[]>("ar-recent", []));
    setHydrated(true);
  }, []);

  // Persist whenever state changes (after hydration)
  useEffect(() => { if (hydrated) save("ar-cart", cart); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) save("ar-favs", [...favorites]); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) save("ar-recent", recentlyViewed); }, [recentlyViewed, hydrated]);

  // ── Cart actions ──────────────────────────────────────────────────────────

  const addToCart = useCallback((product: Product, size: string) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { product, size, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((prev) => prev.filter((i) => !(i.product.id === productId && i.size === size)));
  }, []);

  const updateQty = useCallback((productId: string, size: string, delta: number) => {
    setCart((prev) => {
      const next = prev
        .map((i) =>
          i.product.id === productId && i.size === size
            ? { ...i, qty: i.qty + delta }
            : i
        )
        .filter((i) => i.qty > 0);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Favorites ─────────────────────────────────────────────────────────────

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.has(productId),
    [favorites]
  );

  // ── Recently viewed ───────────────────────────────────────────────────────

  const trackView = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cart.reduce((acc, i) => acc + i.product.price * i.qty, 0);

  return (
    <Ctx.Provider
      value={{
        cart, favorites, recentlyViewed,
        addToCart, removeFromCart, updateQty, clearCart,
        toggleFavorite, isFavorite,
        trackView,
        cartCount, cartTotal,
        cartOpen, setCartOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

"use client";

import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useStore } from "@/lib/store";
import { track } from "@/lib/analytics";
import { useRipple } from "@/lib/useRipple";

const LINKS = [
  { href: "#features", label: "Tính năng" },
  { href: "#products", label: "Sản phẩm" },
  { href: "#specs", label: "Thông số" },
  { href: "#newsletter", label: "Đăng ký" },
];

function CartIcon({ count }: { count: number }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
      {count > 0 && (
        <circle cx="18" cy="5" r="5" fill="#5EEAD4" stroke="none"/>
      )}
    </svg>
  );
}

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, setCartOpen } = useStore();
  const ripple = useRipple();

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-bone/80 dark:bg-midnight/80 border-b border-midnight/5 dark:border-bone/5">
        <div className="container-x section-pad flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#top" className="font-semibold text-lg tracking-tightest shrink-0">
            AURA<span className="text-aqua">RING</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500 dark:text-slate-400">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-aqua transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Cart button — always visible */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Giỏ hàng${cartCount > 0 ? ` (${cartCount})` : ""}`}
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-midnight/5 dark:hover:bg-bone/5 transition-colors"
            >
              <CartIcon count={cartCount} />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className="badge-bounce absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-aqua text-midnight text-[10px] font-semibold px-1 num"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Desktop CTA */}
            <a
              href="#newsletter"
              onClick={(e) => { ripple(e); track({ type: "cta_click", cta: "nav_preorder" }); }}
              className="relative overflow-hidden hidden sm:inline-flex items-center text-sm font-medium px-4 py-2 rounded-full bg-midnight text-bone dark:bg-aqua dark:text-midnight hover:opacity-90 transition-opacity"
            >
              Đặt trước
            </a>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileOpen}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full hover:bg-midnight/5 dark:hover:bg-bone/5 transition-colors"
            >
              <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-80 border-t border-midnight/5 dark:border-bone/5" : "max-h-0"
          }`}
        >
          <nav className="section-pad py-4 flex flex-col gap-1 bg-bone dark:bg-midnight">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="py-2.5 text-base font-medium text-slate-500 dark:text-slate-400 hover:text-aqua transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#newsletter"
              onClick={() => { setMobileOpen(false); track({ type: "cta_click", cta: "mobile_nav_preorder" }); }}
              className="mt-3 inline-flex items-center justify-center py-3 rounded-full bg-midnight text-bone dark:bg-aqua dark:text-midnight font-medium text-sm"
            >
              Đặt trước — 4.990.000đ
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}

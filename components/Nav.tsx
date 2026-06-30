"use client";

import { ThemeToggle } from "./ThemeToggle";
import { track } from "@/lib/analytics";

const LINKS = [
  { href: "#features", label: "Tính năng" },
  { href: "#specs", label: "Thông số" },
  { href: "#newsletter", label: "Đăng ký" },
];

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-bone/70 dark:bg-midnight/70 border-b border-midnight/5 dark:border-bone/5">
      <div className="container-x section-pad flex items-center justify-between h-16">
        <a href="#top" className="font-display font-semibold text-lg tracking-tightest">
          AURA<span className="text-aqua">RING</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-500 dark:text-slate-400">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-aqua transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a
            href="#newsletter"
            onClick={() => track({ type: "cta_click", cta: "nav_preorder" })}
            className="hidden sm:inline-flex items-center text-sm font-medium px-4 py-2 rounded-full bg-midnight text-bone dark:bg-aqua dark:text-midnight hover:opacity-90 transition-opacity"
          >
            Đặt trước
          </a>
        </div>
      </div>
    </header>
  );
}

"use client";

import dynamic from "next/dynamic";

// Neither is needed for first paint or LCP: CartDrawer only renders once
// cartOpen flips true, Chatbot only mounts its message UI once opened.
// ssr:false + no loading fallback means their JS chunk isn't fetched/parsed
// until the browser is idle after hydration (Next lazy-loads on mount),
// keeping them off the initial bundle entirely.
const CartDrawer = dynamic(() => import("./CartDrawer").then((m) => m.CartDrawer), { ssr: false });
const Chatbot = dynamic(() => import("./Chatbot").then((m) => m.Chatbot), { ssr: false });

export function LazyWidgets() {
  return (
    <>
      <CartDrawer />
      <Chatbot />
    </>
  );
}

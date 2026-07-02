"use client";

import { useEffect } from "react";
import { StoreProvider } from "@/lib/store";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Products } from "@/components/Products";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { Specs } from "@/components/Specs";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Chatbot } from "@/components/Chatbot";
import { initScrollTracking, track } from "@/lib/analytics";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "AuraRing",
  description: "Nhẫn thông minh theo dõi nhịp tim, SpO2, nhiệt độ da và giấc ngủ 24/7.",
  brand: { "@type": "Brand", name: "AuraRing" },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "VND",
    lowPrice: "4990000",
    highPrice: "5490000",
    availability: "https://schema.org/PreOrder",
  },
};

function PageContent() {
  useEffect(() => {
    const cleanup = initScrollTracking();
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) track({ type: "section_view", section: e.target.id }); }),
      { threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => { cleanup(); observer.disconnect(); };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Products />
        <RecentlyViewed />
        <Specs />
        <Newsletter />
      </main>
      <Footer />
      <CartDrawer />
      <Chatbot />
    </>
  );
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StoreProvider>
        <PageContent />
      </StoreProvider>
    </>
  );
}

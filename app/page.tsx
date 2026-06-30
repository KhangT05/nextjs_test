"use client";

import { useEffect } from "react";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Specs } from "@/components/Specs";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { initScrollTracking, track } from "@/lib/analytics";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "AuraRing",
  description:
    "Nhẫn thông minh theo dõi nhịp tim, SpO2, nhiệt độ da và giấc ngủ 24/7.",
  brand: { "@type": "Brand", name: "AuraRing" },
  offers: {
    "@type": "Offer",
    priceCurrency: "VND",
    price: "4990000",
    availability: "https://schema.org/PreOrder",
  },
};

export default function Page() {
  useEffect(() => {
    const cleanup = initScrollTracking();

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            track({ type: "section_view", section: entry.target.id });
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));

    return () => {
      cleanup();
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <Hero />
        <Features />
        <Specs />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}

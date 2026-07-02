import { StoreProvider } from "@/lib/store";
import { ScrollToastProvider } from "@/components/ScrollToast";
import { ScrollTracker } from "@/components/ScrollTracker";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Products } from "@/components/Products";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { Specs } from "@/components/Specs";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { LazyWidgets } from "@/components/LazyWidgets";

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

// Server Component: page.tsx itself ships zero extra client JS. StoreProvider,
// Nav, Hero, etc. remain client components internally (they need
// context/hooks), but the page shell + JSON-LD render without wrapping
// the whole tree in a client boundary.
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StoreProvider>
        <ScrollToastProvider>
          <ScrollTracker />
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
          <LazyWidgets />
        </ScrollToastProvider>
      </StoreProvider>
    </>
  );
}

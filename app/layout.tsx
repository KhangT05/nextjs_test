import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Self-hosted at build time via next/font — zero runtime request to
// fonts.googleapis.com/fonts.gstatic.com, zero render-blocking chain,
// automatic font-display:swap + fallback-metric matching (no CLS on swap).
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = "https://auraring.example.com";
const TITLE = "AuraRing — Smart Ring Theo Dõi Sleep, Recovery & Strain";
const DESCRIPTION =
  "AuraRing đo nhịp tim, SpO2, nhiệt độ da và chất lượng giấc ngủ 24/7 trong một chiếc nhẫn titan 2.4g. Pin 7 ngày, chống nước 100m.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["smart ring", "AuraRing", "wearable sức khỏe", "theo dõi giấc ngủ", "recovery tracker"],
  authors: [{ name: "AuraRing" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "AuraRing",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AuraRing smart ring" }],
    locale: "vi_VN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        {/* Dark mode: set class before paint to avoid FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="vi">
      <head>
        {/* Google Fonts — browser fetches at runtime, not build time */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
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

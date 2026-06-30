import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://auraring.example.com";
const TITLE = "AuraRing — Smart Ring Theo Dõi Sleep, Recovery & Strain";
const DESCRIPTION =
  "AuraRing đo nhịp tim, SpO2, nhiệt độ da và chất lượng giấc ngủ 24/7 trong một chiếc nhẫn titan 2.4g. Pin 7 ngày, chống nước 100m, đồng bộ realtime qua app.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "smart ring",
    "AuraRing",
    "wearable sức khỏe",
    "theo dõi giấc ngủ",
    "đo nhịp tim",
    "recovery tracker",
  ],
  authors: [{ name: "AuraRing" }],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "AuraRing",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AuraRing smart ring",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        {/* Prevent dark-mode flash: set class before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

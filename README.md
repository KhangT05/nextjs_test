# AuraRing Landing Page

Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion.

## Chạy local

```bash
npm install
npm run dev
```

Mở http://localhost:3000.

## Env vars (tuỳ chọn — điểm cộng webhook)

Tạo `.env.local`:

```
NEXT_PUBLIC_NEWSLETTER_WEBHOOK_URL=https://webhook.site/<your-id>
NEXT_PUBLIC_TRACKING_WEBHOOK_URL=https://webhook.site/<your-id>
```

- Không set → form vẫn hoạt động (giả lập latency, validate đầy đủ bằng Zod), chỉ không gửi đi đâu.
- Set → form POST JSON thật đến webhook; `lib/analytics.ts` POST scroll-depth (25/50/75/100%), section-view (IntersectionObserver), cta-click qua `navigator.sendBeacon` (không block unload).

## Quyết định kỹ thuật đáng nói

- **Rendering**: toàn bộ trang static (SSG) — không có data động phụ thuộc request, nên build-time render là tối ưu nhất cho TTFB + cacheable ở CDN edge. Không cần ISR vì nội dung không đổi theo thời gian thực.
- **Fonts**: `next/font/google` tự host font tại build time → không có request runtime tới Google Fonts, loại bỏ render-blocking + layout shift (CLS). `display: swap` tránh FOIT.
- **JS payload**: First Load JS ~154kB (đã verify bằng `next build`, xem log). Framer Motion là phần nặng nhất — chấp nhận trade-off vì motion là signature element của design, không phải decoration thừa.
- **Ảnh**: chưa có ảnh sản phẩm thật → dùng SVG (RingMotif) thay vì raster image cho hero, loại bỏ hoàn toàn LCP-image risk. Nếu thêm ảnh thật, bắt buộc dùng `next/image` với `priority` cho ảnh above-the-fold.
- **Dark mode**: set class trước paint bằng inline script trong `<head>` (xem `app/layout.tsx`) để tránh FOUC — đọc `localStorage` đồng bộ trước khi React hydrate.
- **Reduced motion**: `prefers-reduced-motion` được respect ở `globals.css`, override toàn bộ animation-duration về gần 0.

## Đạt PageSpeed 85+ (mobile) — checklist khi deploy thật

1. Deploy lên Vercel (zero-config cho Next.js, có Edge CDN + image optimization built-in).
2. Nếu thêm ảnh sản phẩm thật: convert sang AVIF/WebP, dùng `next/image`, set kích thước cố định tránh CLS.
3. Chạy `npm run build` xem bundle size trong log trước khi deploy — nếu First Load JS > 200kB, cân nhắc dynamic import cho Framer Motion ở section không above-the-fold.
4. Sau khi deploy, chạy PageSpeed Insights nhắm vào URL production (không phải localhost — Lighthouse local không phản ánh CDN/edge caching thật).

## Git workflow đề xuất

```bash
git init
git checkout -b main
git add .
git commit -m "feat: initial AuraRing landing page (hero, features, specs, newsletter)"

git checkout -b feat/dark-mode
# ... nếu tách riêng theo feature
git checkout main && git merge feat/dark-mode

git remote add origin https://github.com/<you>/auraring-landing.git
git push -u origin main
```

Nhánh gợi ý: `main` (production) ← `develop` ← `feat/*`. Với scope 1 trang như thế này, `main` + feature branches ngắn hạn là đủ — không cần gitflow đầy đủ.

## Deploy lên Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Hoặc connect repo GitHub trực tiếp trong dashboard Vercel → auto-deploy mỗi push vào `main`.

## Cấu trúc

```
app/
  layout.tsx      # fonts, metadata SEO/OG, dark-mode anti-FOUC script
  page.tsx         # ghép section + scroll/section-view tracking
  globals.css
  robots.ts        # robots.txt động
  sitemap.ts        # sitemap.xml động
components/
  Hero.tsx Features.tsx Specs.tsx Newsletter.tsx Nav.tsx Footer.tsx
  RingMotif.tsx     # signature SVG progress ring, dùng lại xuyên suốt
  ThemeToggle.tsx
lib/
  analytics.ts      # scroll-depth + section-view + cta-click → webhook
```


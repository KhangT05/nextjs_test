export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  ringColor: string;      // SVG fill for ring body
  accentColor: string;    // progress stroke + CTA accent
  sizes: string[];
  badgeLabel?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "stealth",
    name: "AuraRing Stealth",
    subtitle: "PVD đen mờ · Titan cấp 5",
    price: 4_990_000,
    ringColor: "#1C2026",
    accentColor: "#5EEAD4",
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
  },
  {
    id: "silver",
    name: "AuraRing Silver",
    subtitle: "Titan đánh bóng · Phiên bản tiêu chuẩn",
    price: 4_990_000,
    ringColor: "#A8B8C8",
    accentColor: "#5EEAD4",
    sizes: ["6", "7", "8", "9", "10", "11", "12", "13"],
  },
  {
    id: "heritage",
    name: "AuraRing Heritage",
    subtitle: "PVD vàng · Phiên bản giới hạn",
    price: 5_490_000,
    ringColor: "#C8A045",
    accentColor: "#E8A858",
    sizes: ["7", "8", "9", "10", "11"],
    badgeLabel: "Giới hạn",
  },
];

export function fmt(price: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
}

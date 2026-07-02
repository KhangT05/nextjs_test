"use client";

import { motion } from "framer-motion";

const SPEC_GROUPS = [
  {
    group: "Phần cứng",
    rows: [
      ["Vật liệu", "Titan cấp 5 (Ti-6Al-4V)"],
      ["Trọng lượng", "2.4g – 2.8g tùy size (size 6–13)"],
      ["Độ dày", "2.55mm"],
      ["Chống nước", "10ATM / 100m"],
    ],
  },
  {
    group: "Cảm biến",
    rows: [
      ["Nhịp tim", "PPG 6 LED, lấy mẫu 100Hz"],
      ["SpO2", "Hồng ngoại + đỏ, độ chính xác ±2%"],
      ["Nhiệt độ da", "NTC thermistor, độ phân giải 0.1°C"],
      ["Chuyển động", "Accelerometer 3 trục + gyroscope"],
    ],
  },
  {
    group: "Pin & kết nối",
    rows: [
      ["Dung lượng pin", "22mAh Li-Po"],
      ["Thời lượng", "7 ngày sử dụng liên tục"],
      ["Sạc", "Dock từ tính, đầy trong 80 phút"],
      ["Kết nối", "Bluetooth 5.3 LE"],
    ],
  },
  {
    group: "Phần mềm",
    rows: [
      ["Nền tảng", "iOS 15+ / Android 10+"],
      ["Đồng bộ", "Tự động khi mở app, độ trễ <5s"],
      ["Xuất dữ liệu", "JSON, CSV, Apple Health, Google Fit"],
      ["API", "REST API cho nhà phát triển (beta)"],
    ],
  },
];

export function Specs() {
  return (
    <section id="specs" className="py-24 md:py-32 border-t border-midnight/5 dark:border-bone/5">
      <div className="container-x section-pad">
        <div className="max-w-xl mb-16">
          <p className="num text-xs uppercase tracking-[0.2em] text-aqua mb-4">
            Thông số kỹ thuật
          </p>
          <h2 className="font-semibold text-3xl md:text-4xl tracking-tightest">
            Đo đạc, không phải marketing.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-12">
          {SPEC_GROUPS.map((g, gi) => (
            <motion.div
              key={g.group}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: gi * 0.05 }}
            >
              <h3 className="font-semibold font-medium text-lg mb-4 text-aqua">{g.group}</h3>
              <dl className="divide-y divide-midnight/5 dark:divide-bone/5">
                {g.rows.map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between py-3 gap-4">
                    <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
                    <dd className="num text-sm text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

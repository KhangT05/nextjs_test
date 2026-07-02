"use client";

import { motion } from "framer-motion";
import { RingMotif } from "./RingMotif";

const FEATURES = [
  {
    percent: 94,
    metric: "94%",
    title: "Độ chính xác nhịp tim",
    desc:
      "Cảm biến PPG 6 LED lấy mẫu 100Hz, đối chiếu với ECG y tế trong thử nghiệm lâm sàng độc lập.",
    color: "#5EEAD4",
  },
  {
    percent: 100,
    metric: "100m",
    title: "Chống nước thực sự",
    desc:
      "Không phải 'chống ẩm' — bơi, tắm, sauna đều an toàn. Vỏ titan cấp 5, không khe hở.",
    color: "#5EEAD4",
  },
  {
    percent: 70,
    metric: "7 ngày",
    title: "Một lần sạc",
    desc:
      "Chip công suất thấp tùy biến + pin 22mAh. Sạc đầy trong 80 phút qua dock từ tính.",
    color: "#E8A858",
  },
  {
    percent: 88,
    metric: "0.3°C",
    title: "Độ phân giải nhiệt độ da",
    desc:
      "Phát hiện sớm dấu hiệu ốm hoặc chu kỳ kinh nguyệt từ biến động nhiệt độ ban đêm.",
    color: "#5EEAD4",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 border-t border-midnight/5 dark:border-bone/5">
      <div className="container-x section-pad">
        <div className="max-w-xl mb-16">
          <p className="num text-xs uppercase tracking-[0.2em] text-aqua mb-4">
            Tính năng
          </p>
          <h2 className="font-semibold text-3xl md:text-4xl tracking-tightest">
            Không phải app nào cũng cần. Chỉ cần đeo.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-midnight/5 dark:bg-bone/5 rounded-3xl overflow-hidden">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
              className="bg-bone dark:bg-midnight p-8 md:p-10 flex flex-col gap-6"
            >
              <RingMotif percent={f.percent} size={88} stroke={6} value="" color={f.color} />
              <div>
                <p className="num text-xl mb-2" style={{ color: f.color }}>
                  {f.metric}
                </p>
                <h3 className="font-semibold font-medium text-xl mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

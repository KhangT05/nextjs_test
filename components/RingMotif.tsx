"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function RingMotif({
  percent,
  size = 220,
  stroke = 10,
  color = "#5EEAD4",
  trackColor,
  label,
  value,
  className = "",
}: {
  percent: number; // 0-100
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  value?: string;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      ref={ref}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor ?? "currentColor"}
          strokeOpacity={0.12}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={inView ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
        />
      </svg>
      {(label || value) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {value && (
            <span className="num text-2xl md:text-3xl font-medium tabular-nums">
              {value}
            </span>
          )}
          {label && (
            <span className="text-[11px] uppercase tracking-widest text-slate-400 mt-1">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const RULES: [RegExp, string][] = [
  [/size|cỡ|số|ngón/i,       "Đo chu vi ngón tay buổi tối (khi tay nở nhất), chia cho 3.14 ra size. Phân vân giữa 2 size → chọn size lớn hơn."],
  [/pin|battery|sạc|dùng.*lâu|bao lâu/i, "Pin 22mAh dùng được 7 ngày, sạc đầy trong 80 phút qua dock từ tính."],
  [/nước|bơi|swim|waterproof|chống.*nước/i, "Chống nước 10ATM (100m) — bơi, tắm, sauna đều ổn."],
  [/giá|price|bao nhiêu|tiền|cost/i, "Stealth & Silver: 4.990.000₫. Heritage (giới hạn): 5.490.000₫."],
  [/nhịp tim|heart|bpm|mạch/i,  "Cảm biến PPG 6 LED, lấy mẫu 100Hz. Độ chính xác 94% so với ECG y tế."],
  [/spo2|oxy|oxygen|máu/i,      "Đo SpO2 hồng ngoại + đỏ, độ chính xác ±2%."],
  [/nhiệt|temp|sốt/i,           "Cảm biến nhiệt độ da độ phân giải 0.1°C — phát hiện sớm ốm hoặc biến động chu kỳ sinh lý."],
  [/giao hàng|ship|khi nào|bán|mua/i, "Đặt trước Q3/2026, hoàn tiền 100% nếu hủy trước xuất xưởng. Chỉ bán online."],
  [/oura|garmin|fitbit|so sánh|khác|vs/i, "AuraRing mỏng hơn (2.55mm), giá thấp hơn Oura ~30%, có REST API xuất dữ liệu cho developer."],
  [/app|ios|android|điện thoại|sync|đồng bộ/i, "App iOS 15+ / Android 10+. Xuất: JSON, CSV, Apple Health, Google Fit."],
  [/nặng|trọng lượng|mỏng|kích thước/i, "Trọng lượng 2.4–2.8g tùy size, độ dày 2.55mm — nhẹ hơn hầu hết nhẫn thường."],
  [/bluetooth|kết nối|connect/i, "Bluetooth 5.3 LE — sync tự động khi mở app, độ trễ <5s."],
  [/stealth|đen|black/i,        "AuraRing Stealth: PVD đen mờ, titan cấp 5, size 6–13, giá 4.990.000₫."],
  [/silver|bạc|trắng/i,         "AuraRing Silver: titan đánh bóng, size 6–13, giá 4.990.000₫."],
  [/heritage|vàng|gold|giới hạn|limited/i, "AuraRing Heritage: PVD vàng, phiên bản giới hạn, size 7–11, giá 5.490.000₫."],
  [/ngủ|sleep|giấc/i,           "AuraRing phân tích giấc ngủ qua nhịp tim + nhiệt độ da + chuyển động, cho điểm Sleep Score mỗi sáng."],
  [/bảo hành|warranty|đổi trả/i,"Hiện tại chưa công bố chính sách bảo hành. Hoàn tiền 100% nếu hủy đặt trước trước khi xuất xưởng."],
];

const DEFAULT =
  "Tôi chỉ tư vấn về AuraRing. Bạn có thể hỏi về size, pin, giá, cảm biến, chống nước, hoặc so sánh với sản phẩm khác.";

export function ruleBasedReply(input: string): string {
  for (const [pattern, reply] of RULES) {
    if (pattern.test(input)) return reply;
  }
  return DEFAULT;
}

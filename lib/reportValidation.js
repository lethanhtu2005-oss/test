// RV02: báo thông tin tiếp cận chưa đúng. Không nhận thông tin cá nhân, chỉ nội dung cần kiểm tra lại.
export const REPORT_TOPICS = {
  entrance: "Lối vào",
  route: "Đường đi, di chuyển bên trong",
  support: "Hỗ trợ tại chỗ",
  hours_price: "Giờ mở cửa, giá vé",
  other: "Thông tin khác",
};
export function validateReport(body) {
  if (!body || typeof body !== "object") return { error: "Dữ liệu gửi lên không hợp lệ." };
  const { itemId, topic, detail } = body;
  if (typeof itemId !== "string" || !itemId.trim()) return { error: "Thiếu địa điểm cần báo." };
  if (typeof topic !== "string" || !Object.hasOwn(REPORT_TOPICS, topic)) return { error: "Hãy chọn loại thông tin chưa đúng." };
  if (typeof detail !== "string") return { error: "Hãy mô tả điều chưa đúng." };
  const text = detail.trim();
  if (text.length < 10) return { error: "Mô tả cần ít nhất 10 ký tự để quản trị viên kiểm tra được." };
  if (text.length > 1000) return { error: "Mô tả tối đa 1000 ký tự." };
  return { value: { itemId: itemId.trim(), topic, detail: text } };
}

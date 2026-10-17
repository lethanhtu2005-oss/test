// Kiểm tra dữ liệu đầu vào cho các API route. Tách riêng để unit test được (xem tests/).

// Đọc body JSON an toàn: body hỏng trả về null thay vì làm route ném lỗi 500.
export async function readJson(req) {
  try {
    if (!req.body) return null;
    const reader = req.body.getReader();
    const chunks=[];let size=0;
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>65536){await reader.cancel();return null;}chunks.push(value);}
    const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
    const body = JSON.parse(new TextDecoder().decode(bytes));
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch (_) {
    return null;
  }
}

export function badRequest(message) {
  return Response.json({ error: message }, { status: 400 });
}

// Chuỗi tự do từ người dùng: ép kiểu, cắt khoảng trắng, giới hạn độ dài.
export function cleanText(value, max = 500) {
  if (value === undefined || value === null) return "";
  return String(value).trim().slice(0, max);
}

// Số nguyên trong khoảng [min, max]; giá trị không hợp lệ trả về null.
export function intInRange(value, min, max) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

export const MAX_GUESTS = 20;

// Điểm tiếp cận 1–5; 0 nghĩa là "không đánh giá tiêu chí này".
export function rating(value) {
  if (value === undefined || value === null || value === "" || Number(value) === 0) return 0;
  return intInRange(value, 1, 5);
}

// Luồng trạng thái booking hợp lệ. Booking đã kết thúc không được đổi trạng thái nữa.
const BOOKING_TRANSITIONS = {
  pending: ["confirmed", "rejected", "cancelled"],
  demo: ["cancelled"],
  confirmed: ["cancelled"],
  rejected: [],
  cancelled: [],
};

export function canTransitionBooking(from, to) {
  return (BOOKING_TRANSITIONS[from] || []).includes(to);
}

export const REQUEST_STATUSES = ["accepted", "rejected"];
export const NOTIFICATION_ROLES = ["traveler", "business", "guide", "admin"];

// Ngày hôm nay theo giờ Việt Nam (UTC+7, không đổi giờ theo mùa), dạng YYYY-MM-DD.
export function todayInVietnam(now = new Date()) {
  return new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
}
export function isPastBookingDate(value, now = new Date()) {
  return value < todayInVietnam(now);
}
export function validBookingDate(value) {
  if(typeof value!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const date=new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value;
}

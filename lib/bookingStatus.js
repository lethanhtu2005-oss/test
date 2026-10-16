const STATES = {
  pending: ["DEMO — đang chờ xử lý", "bg-amber-100 text-amber-900"],
  demo: ["Đặt chỗ DEMO", "bg-neutral-100 text-neutral-800"],
  confirmed: ["DEMO — đã xác nhận trong hệ thống", "bg-green-100 text-green-900"],
  rejected: ["DEMO — đã từ chối", "bg-red-100 text-red-900"],
  cancelled: ["DEMO — đã hủy", "bg-neutral-100 text-neutral-800"],
};
export function bookingStatus(status) {
  return STATES[status] || ["Chưa rõ trạng thái", "bg-neutral-100 text-neutral-800"];
}

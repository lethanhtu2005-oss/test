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

const REQUEST_STATES = {
  pending: "Yêu cầu hỗ trợ: đang chờ doanh nghiệp phản hồi (DEMO)",
  accepted: "Yêu cầu hỗ trợ: doanh nghiệp đã chấp nhận (DEMO)",
  rejected: "Yêu cầu hỗ trợ: doanh nghiệp đã từ chối",
};
export function requestStatus(status) {
  return REQUEST_STATES[status] || "Yêu cầu hỗ trợ: chưa rõ trạng thái";
}

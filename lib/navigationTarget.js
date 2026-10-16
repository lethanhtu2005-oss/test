export function validCoordinates(c) {
  return !!c && Number.isFinite(c.lat) && Number.isFinite(c.lng) && Math.abs(c.lat) <= 90 && Math.abs(c.lng) <= 180;
}
export function navigationTarget(to, destinations) {
  const fallback = { center: [21.032, 105.846], zoom: 13 };
  if (!to) return { ...fallback, message: "" };
  const d = destinations.find((x) => x.slug === to || x.id === to);
  if (!d) return { ...fallback, message: "Không tìm thấy điểm đến. Bản đồ đang hiển thị tổng quan Hà Nội." };
  if (!validCoordinates(d.coordinates)) return { ...fallback, message: `${d.name}: chưa có tọa độ hợp lệ. Bản đồ giữ ở tổng quan Hà Nội.` };
  return { center: [d.coordinates.lat, d.coordinates.lng], zoom: 16, message: `Đang xem vị trí ${d.name}. Chưa có tuyến đường thực tế tới điểm này.` };
}

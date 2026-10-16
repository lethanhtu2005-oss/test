// Phiên đăng nhập Guide ở mức prototype: chỉ lưu cờ trong sessionStorage của trình duyệt.
// Khi có backend, thay bằng API xác thực + cookie httpOnly kiểm tra ở server.
const KEY = "we-guide-session";

export function hasGuideSession() {
  try { return sessionStorage.getItem(KEY) === "1"; } catch (_) { return false; }
}

export function startGuideSession() {
  try { sessionStorage.setItem(KEY, "1"); } catch (_) {}
}

export function endGuideSession() {
  try { sessionStorage.removeItem(KEY); } catch (_) {}
}

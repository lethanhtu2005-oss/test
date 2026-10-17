import { fail } from "./auth.js";
export function canRead(user, record) {
  if (!record.ownerId) return false; // dữ liệu legacy được giữ, chưa gán owner
  if (user.role === "admin") return true;
  if (user.role === "business") return !!user.businessId && record.businessId === user.businessId;
  if (user.role === "guide") return !!user.guideId && record.guideId === user.guideId;
  return record.ownerId === user.id;
}
export function findVisible(user, records, id) {
  const record = records.find(x=>x.id===id && canRead(user,x));
  if (!record) fail(404,"Không tìm thấy dữ liệu hoặc bạn không có quyền truy cập.");
  return record;
}
export function filterBusiness(user, records, business) {
  if (business && user.role !== "admin" && (user.role !== "business" || user.businessId !== business)) fail(403,"Không có quyền xem doanh nghiệp này.");
  return records.filter(x=>canRead(user,x) && (!business || x.businessId===business));
}

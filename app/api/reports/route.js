import { list, transaction, insert } from "@/lib/store";
import { secured, fail, json } from "@/lib/auth";
import { readJson } from "@/lib/validate";
import { getItem } from "@/data/catalog";
import { validateReport, REPORT_TOPICS } from "@/lib/reportValidation";
export const dynamic = "force-dynamic";

// Hộp thư chỉ Admin đọc; không trả ownerId để không lộ ai đã báo.
export const GET = secured(async () => json((await list("reports")).map(({ ownerId: _ownerId, ...r }) => ({ ...r, topicLabel: REPORT_TOPICS[r.topic] || r.topic }))), ["admin"]);

export const POST = secured(async (req, user) => {
  const { value, error } = validateReport(await readJson(req));
  if (error) fail(400, error);
  const item = getItem(value.itemId);
  if (!item) fail(400, "Địa điểm không tồn tại.");
  const record = await transaction(db => {
    const recent = db.reports.filter(r => r.ownerId === user.id && Date.parse(r.createdAt) > Date.now() - 60 * 60 * 1000);
    if (recent.length >= 10) fail(429, "Bạn đã gửi nhiều báo cáo trong giờ này. Hãy thử lại sau.");
    return insert(db, "reports", { ownerId: user.id, itemId: item.id, itemName: item.name, topic: value.topic, detail: value.detail, status: "received" });
  });
  return json({ id: record.id, status: record.status }, 201);
}, ["traveler"], { guest: true });

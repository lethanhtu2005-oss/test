// Business Partner demo. Không có doanh nghiệp nào trong danh sách này được tuyên bố là đối tác thật.
export const DEMO_BUSINESS_ID = "b1";

export const businesses = [
  { id: "b1", name: "Business lưu trú — DEMO", type: "Lưu trú", area: "Hà Nội", rep: "Tài khoản demo", verified: false, logo: "/assets/images/cafe-street.jpg", declaration: { blind: "Chưa xác minh", lowVision: "Chưa xác minh", staff: "Chưa xác minh", audio: "Chưa xác minh", braille: "Chưa xác minh", elevator: "Chưa xác minh", stepFree: "Chưa xác minh", checkinAssist: "Chưa xác minh", accessibleRoom: "Chưa xác minh" }, items: ["demo-hotel"] },
  { id: "b2", name: "Business hoạt động — DEMO", type: "Tour & Guide", area: "Hà Nội", rep: "Tài khoản demo", verified: false, logo: "/assets/images/cyclo-street.jpg", declaration: { blind: "Chưa xác minh", lowVision: "Chưa xác minh", staff: "Chưa xác minh", audio: "Chưa xác minh", braille: "Chưa xác minh", elevator: "Không áp dụng", stepFree: "Chưa xác minh", checkinAssist: "Không áp dụng", accessibleRoom: "Không áp dụng" }, items: ["demo-guide-tour"] },
  { id: "b3", name: "Business vận chuyển — DEMO", type: "Transport", area: "Hà Nội", rep: "Tài khoản demo", verified: false, logo: "/assets/images/street-bikes.jpg", declaration: { blind: "Chưa xác minh", lowVision: "Chưa xác minh", staff: "Chưa xác minh", audio: "Không áp dụng", braille: "Không áp dụng", elevator: "Không áp dụng", stepFree: "Chưa xác minh", checkinAssist: "Không áp dụng", accessibleRoom: "Không áp dụng" }, items: ["demo-transport"] },
];

const itemToBiz = {};
businesses.forEach((b) => b.items.forEach((it) => { itemToBiz[it] = b.id; }));
export function getBusiness(id) { return businesses.find((b) => b.id === id) || null; }
export function businessIdForItem(itemId) { return itemToBiz[itemId] || null; }
export function getBusinessForItem(itemId) { return getBusiness(itemToBiz[itemId]); }

export function itemA11y(item) {
  const d = getBusinessForItem(item.id)?.declaration;
  const yes = (v) => v === "Có" || v === "Tốt";
  const suit = (v) => v === "Có" || v === "Tốt" || v === "Trung bình";
  if (d) return { blind: suit(d.blind), lowVision: suit(d.lowVision), staff: yes(d.staff), audio: yes(d.audio), braille: yes(d.braille), elevator: yes(d.elevator), stepFree: yes(d.stepFree) };
  return { blind: false, lowVision: false, staff: false, audio: item.id === "van-mieu" || item.id === "ve-van-mieu", braille: false, elevator: false, stepFree: false };
}

export const A11Y_FILTERS = [
  { key: "blind", label: "Phù hợp người mù (đã xác minh)" },
  { key: "lowVision", label: "Phù hợp nhìn kém (đã xác minh)" },
  { key: "staff", label: "Có nhân viên hỗ trợ (đã xác minh)" },
  { key: "audio", label: "Có audio guide / thiết bị thuyết minh" },
  { key: "elevator", label: "Có thang máy (đã xác minh)" },
  { key: "stepFree", label: "Lối không bậc (đã xác minh)" },
];

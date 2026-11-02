// Business Partner demo. Không có doanh nghiệp nào trong danh sách này được tuyên bố là đối tác thật.
export const DEMO_BUSINESS_ID = "b1";

export const businesses = [
  { id: "b1", name: "Doanh nghiệp Lưu trú Phố Cổ — DEMO", type: "Lưu trú", area: "Phố Cổ, Hoàn Kiếm", rep: "Tài khoản demo", verified: false, logo: "/assets/images/cafe-street.jpg", declaration: { blind: "Chưa xác minh", lowVision: "Chưa xác minh", staff: "Chưa xác minh", audio: "Chưa xác minh", braille: "Chưa xác minh", elevator: "Chưa xác minh", stepFree: "Chưa xác minh", checkinAssist: "Chưa xác minh", accessibleRoom: "Chưa xác minh" }, items: ["demo-hotel", "la-siesta-classic-ma-may", "tirant-hotel-gia-ngu", "the-oriental-jade-hang-trong", "apricot-hotel-hang-trong", "old-quarter-view-hostel"] },
  { id: "b2", name: "Đơn vị Trải nghiệm & Hướng dẫn Phố Cổ — DEMO", type: "Tour & Guide", area: "Phố Cổ, Hoàn Kiếm", rep: "Tài khoản demo", verified: false, logo: "/assets/images/cyclo-street.jpg", declaration: { blind: "Chưa xác minh", lowVision: "Chưa xác minh", staff: "Chưa xác minh", audio: "Chưa xác minh", braille: "Chưa xác minh", elevator: "Không áp dụng", stepFree: "Chưa xác minh", checkinAssist: "Không áp dụng", accessibleRoom: "Không áp dụng" }, items: ["demo-guide-tour", "tuyen-bo-hang-bac-ma-may", "tuyen-bo-ngoc-son-quan-chuong", "tour-xich-lo-tro-nang-pho-co", "workshop-nghe-bac-hang-bac", "bieu-dien-ca-tru-dinh-kim-ngan"] },
  { id: "b3", name: "Hợp tác xã Vận tải & Xích lô Phố Cổ — DEMO", type: "Transport", area: "Phố Cổ, Hoàn Kiếm", rep: "Tài khoản demo", verified: false, logo: "/assets/images/street-bikes.jpg", declaration: { blind: "Chưa xác minh", lowVision: "Chưa xác minh", staff: "Chưa xác minh", audio: "Không áp dụng", braille: "Không áp dụng", elevator: "Không áp dụng", stepFree: "Chưa xác minh", checkinAssist: "Không áp dụng", accessibleRoom: "Không áp dụng" }, items: ["demo-transport", "xich-lo-tro-nang-pho-co", "xe-dien-ho-guom-pho-co", "tram-don-tra-28-hang-buom", "tram-don-tra-tuong-dai-cam-tu", "tram-xe-dien-dong-xuan"] },
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
  return { blind: false, lowVision: false, staff: false, audio: item.id === "ho-guom" || item.id === "ve-den-ngoc-son" || item.id === "mua-roi-thang-long" || item.id === "ve-mua-roi-thang-long", braille: false, elevator: false, stepFree: false };
}

export const A11Y_FILTERS = [
  { key: "blind", label: "Phù hợp người mù (đã xác minh)" },
  { key: "lowVision", label: "Phù hợp nhìn kém (đã xác minh)" },
  { key: "staff", label: "Có nhân viên hỗ trợ (đã xác minh)" },
  { key: "audio", label: "Có audio guide / thiết bị thuyết minh" },
  { key: "elevator", label: "Có thang máy (đã xác minh)" },
  { key: "stepFree", label: "Lối không bậc (đã xác minh)" },
];

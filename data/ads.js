// Source-controlled campaign records. Partner campaigns stay inactive until verified.
export const ads = [
  {
    id: "wayecho-prepare",
    type: "intro",
    title: "Một chuyến đi bắt đầu từ thông tin rõ ràng",
    description:
      "Chuẩn bị câu hỏi về lối vào, hỗ trợ và cách tiếp cận trải nghiệm trước khi bạn lên đường.",
    image: "/assets/images/van-mieu-verified.webp",
    alt: "Cổng mái ngói và sân gạch trong Văn Miếu – Quốc Tử Giám.",
    label: "Nội dung giới thiệu · WayEcho",
    partner: null,
    href: "/articles/hoi-ve-kha-nang-tiep-can",
    cta: "Đọc hướng dẫn",
    contexts: ["destination", "hanoi", "activity", "ticket"],
    active: true,
    verified: true,
    demo: false,
  },
  {
    id: "wayecho-choices",
    type: "intro",
    title: "Chọn cách tiếp cận thông tin phù hợp với bạn",
    description:
      "Tìm hiểu nút nghe, tìm kiếm giọng nói và các tùy chọn hiển thị đang có trên WayEcho.",
    image: "/assets/images/ho-tay-verified.webp",
    alt: "Mặt nước Hồ Tây nhìn từ dưới tán cây.",
    label: "Nội dung giới thiệu · WayEcho",
    partner: null,
    href: "/explore/assistive-technology",
    cta: "Khám phá công cụ",
    contexts: ["accommodation", "restaurant", "transport"],
    active: true,
    verified: true,
    demo: false,
  },
  {
    id: "partner-demo",
    type: "partner",
    title: "Khung giới thiệu dịch vụ đối tác — DEMO",
    description:
      "Bản xem thử bố cục. Chưa có đối tác thật hoặc ưu đãi được xác minh.",
    image: "/assets/images/hoang-thanh.webp",
    alt: "Cổng Đoan Môn tại Hoàng thành Thăng Long; ảnh minh họa bố cục quảng cáo, không đại diện đối tác.",
    label: "Quảng cáo đối tác · DEMO",
    partner: "Đối tác minh họa — chưa xác minh",
    href: "/about",
    cta: "Tìm hiểu WayEcho",
    contexts: ["hanoi"],
    active: false,
    verified: false,
    demo: true,
  },
];
export const adDestinations = [
  "/articles/hoi-ve-kha-nang-tiep-can",
  "/explore/assistive-technology",
  "/about",
];
export function validAd(ad) {
  return !!(
    ad &&
    ad.id &&
    ad.title &&
    ad.description &&
    ad.image &&
    ad.alt &&
    ad.cta &&
    Array.isArray(ad.contexts) &&
    adDestinations.includes(ad.href) &&
    ["intro", "partner"].includes(ad.type)
  );
}
export function adsForContext(context, records = ads) {
  return records.filter(
    (ad) =>
      validAd(ad) &&
      ad.active &&
      !ad.demo &&
      (ad.type !== "partner" || (ad.verified && ad.partner)) &&
      ad.contexts.includes(context),
  );
}

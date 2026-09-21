// Guide / Assistant demo. Tất cả tên, lịch và trạng thái dưới đây là dữ liệu mô phỏng cho prototype.
export const DEMO_GUIDE_ID = "g1";

export const guides = [
  {
    id: "g1",
    name: "Lê Thanh Tú",
    role: "Personal Assistant",
    exp: "3 năm hỗ trợ khách du lịch tại Hà Nội",
    languages: ["Tiếng Việt", "English"],
    area: "Hà Nội",
    services: ["Hỗ trợ di chuyển", "Hỗ trợ tại điểm tham quan", "Navigation assistance"],
    price: "Theo lịch hỗ trợ",
    rating: 4.9,
    verified: true,
    active: true,
    avatar: "T",
  },
  {
    id: "g2",
    name: "Guide Demo B",
    role: "Tour Guide",
    exp: "Hồ sơ minh họa",
    languages: ["Tiếng Việt", "English"],
    area: "Hà Nội",
    services: ["Dẫn tour", "Thuyết minh"],
    price: "Giá demo",
    rating: null,
    verified: false,
    active: false,
    avatar: "B",
  },
];

export const guideAssignments = [
  {
    id: "as1",
    traveler: "Khách khiếm thị (Blind)",
    service: "Hỗ trợ đi bộ phố cổ",
    date: "2026-09-28",
    time: "08:00",
    period: "Sáng",
    location: "Phố cổ Hà Nội",
    note: "Cần hỗ trợ tìm đường và đồng hành tại các điểm dừng.",
    accessibility: ["Navigation assistance", "Staff assistance"],
    status: "pending",
    image: "/assets/images/old-quarter-street.jpg",
    imageAlt: "Phố cổ Hà Nội với các dãy nhà và đường phố đông người, ảnh minh họa cho lịch hỗ trợ đi bộ.",
  },
  {
    id: "as2",
    traveler: "Khách nhìn kém (Low Vision)",
    service: "Thuyết minh Văn Miếu",
    date: "2026-09-28",
    time: "14:00",
    period: "Chiều",
    location: "Văn Miếu – Quốc Tử Giám",
    note: "Cần mô tả bằng lời các chi tiết kiến trúc và hỗ trợ định hướng.",
    accessibility: ["Cultural explanation", "Audio description"],
    status: "accepted",
    image: "/assets/images/van-mieu-temple.jpg",
    imageAlt: "Khuôn viên Văn Miếu – Quốc Tử Giám tại Hà Nội, ảnh minh họa cho lịch thuyết minh.",
  },
];

export function getGuide(id) {
  return guides.find((g) => g.id === id) || guides[0];
}

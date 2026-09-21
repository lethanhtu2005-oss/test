import { destinations } from "./destinations";

export const CATEGORIES = [
  { id: "destination", label: "Điểm đến", href: "/explore?cat=destination", icon: "MapPin" },
  { id: "accommodation", label: "Lưu trú", href: "/explore?cat=accommodation", icon: "Bed" },
  { id: "restaurant", label: "Ăn uống", href: "/explore?cat=restaurant", icon: "Food" },
  { id: "activity", label: "Hoạt động", href: "/explore?cat=activity", icon: "Activity" },
  { id: "ticket", label: "Vé", href: "/explore?cat=ticket", icon: "Ticket" },
  { id: "transport", label: "Di chuyển", href: "/explore?cat=transport", icon: "Compass" },
];

const destinationItems = destinations.map((d) => ({
  id: d.slug,
  cat: "destination",
  name: d.name,
  area: d.area,
  image: d.image,
  imageFallback: d.imageFallback,
  alt: d.alt,
  price: d.visit?.price || "Xem chi tiết",
  level: d.access.level,
  note: d.access.status,
  audio: d.audio,
  summary: d.summary,
  verifiedPlace: true,
  destinationSlug: d.slug,
}));

// Các mục dưới đây chỉ để minh hoạ workflow booking/Business theo requirement.
// Không đại diện cho một nhà cung cấp thực tế và không được gắn nhãn "verified".
const demoServices = [
  { id: "demo-hotel", cat: "accommodation", name: "Phòng lưu trú tiếp cận — DEMO", area: "Hà Nội", image: "/assets/images/cafe-street.jpg", alt: "Ảnh minh họa một mặt tiền dịch vụ trong bản demo; không đại diện cho khách sạn cụ thể.", price: "Giá demo", level: "Chưa xác minh", note: "Dữ liệu mô phỏng để thử luồng Accommodation Booking và Accessibility Request.", audio: "Đây là dịch vụ lưu trú minh họa. Thông tin giá, phòng và tiện ích chưa phải dữ liệu của một cơ sở thật.", summary: "Mục minh họa luồng tìm phòng, accessibility request và booking.", isDemo: true },
  { id: "demo-restaurant", cat: "restaurant", name: "Nhà hàng tiếp cận — DEMO", area: "Hà Nội", image: "/assets/images/pho-bowl.jpg", alt: "Bát phở dùng làm ảnh minh họa cho danh mục ăn uống; không đại diện cho nhà hàng cụ thể.", price: "Giá demo", level: "Chưa xác minh", note: "Dữ liệu mô phỏng; Business phải khai báo và Admin có thể kiểm duyệt trước khi hiển thị thật.", audio: "Đây là mục ăn uống minh họa. Không có tuyên bố accessibility nào được coi là đã xác minh.", summary: "Mục minh họa dịch vụ ăn uống trong nền tảng.", isDemo: true },
  { id: "demo-guide-tour", cat: "activity", name: "Tour có Guide/Assistant — DEMO", area: "Hà Nội", image: "/assets/images/cyclo-street.jpg", alt: "Ảnh đường phố Hà Nội dùng minh họa cho hoạt động tour demo; không đại diện cho một đơn vị tour cụ thể.", price: "Giá demo", level: "Chưa xác minh", note: "Minh họa chức năng tìm Guide/Assistant, xem availability và gửi nhu cầu hỗ trợ.", audio: "Đây là tour minh họa để thử luồng Guide và Personal Assistant.", summary: "Mục minh họa đặt Guide/Personal Assistant.", isDemo: true },
  { id: "ve-van-mieu", cat: "ticket", name: "Vé Văn Miếu – Quốc Tử Giám", area: "Đống Đa, Hà Nội", image: destinations[1].image, imageFallback: destinations[1].imageFallback, alt: destinations[1].alt, price: "70.000đ vé tiêu chuẩn (theo nguồn chính thức đã đối chiếu)", level: "Dữ liệu một phần", note: "Nguồn chính thức liệt kê thiết bị thuyết minh; các tiêu chí accessibility khác cần xác minh.", audio: destinations[1].audio, summary: "Mục vé gắn với địa điểm thật; kiểm tra lại chính sách tại thời điểm đặt.", verifiedPlace: true, destinationSlug: "van-mieu" },
  { id: "ve-mua-roi", cat: "ticket", name: "Nhà hát Múa rối Thăng Long", area: "Hoàn Kiếm, Hà Nội", image: destinations[5].image, imageFallback: destinations[5].imageFallback, alt: destinations[5].alt, price: "Tùy hạng vé / suất diễn", level: "Cần xác minh", note: "Địa chỉ đã đối chiếu; không mặc định có audio description hoặc lối tiếp cận nếu chưa được nhà hát xác nhận.", audio: destinations[5].audio, summary: "Kiểm tra lịch diễn và hạng vé trên kênh chính thức trước khi đặt.", verifiedPlace: true, destinationSlug: "mua-roi-thang-long" },
  { id: "demo-transport", cat: "transport", name: "Phương tiện hỗ trợ — DEMO", area: "Hà Nội", image: "/assets/images/street-bikes.jpg", alt: "Ảnh đường phố Hà Nội dùng minh họa cho chức năng đặt phương tiện; không đại diện cho nhà cung cấp cụ thể.", price: "Giá demo", level: "Chưa xác minh", note: "Minh họa pickup/drop-off, accessibility request và trạng thái chuyến.", audio: "Đây là dịch vụ phương tiện minh họa, không phải một hãng vận tải thật.", summary: "Mục minh họa Transport Booking.", isDemo: true },
];

export const catalog = [...destinationItems, ...demoServices];
export function byCategory(cat) { return cat ? catalog.filter((x) => x.cat === cat) : catalog; }
export function getItem(id) { return catalog.find((x) => x.id === id) || null; }
export function catLabel(cat) { return CATEGORIES.find((c) => c.id === cat)?.label || "Mục"; }

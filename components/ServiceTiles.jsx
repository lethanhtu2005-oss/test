import Link from "next/link";
import {
  MapPinIcon,
  BedIcon,
  BusIcon,
  FoodIcon,
  UserIcon,
  MicIcon,
  BookmarkIcon,
  AccessibleIcon,
} from "./Icons";
export const serviceTiles = [
  {
    title: "Điểm đến",
    description: "Tìm hiểu địa danh và trạng thái thông tin tiếp cận.",
    href: "/explore?cat=destination",
    icon: MapPinIcon,
  },
  {
    title: "Lưu trú",
    description:
      "Xem luồng chọn nơi ở và những điều cần xác nhận trước khi đặt.",
    href: "/explore?cat=accommodation",
    icon: BedIcon,
  },
  {
    title: "Di chuyển",
    description: "Chuẩn bị điểm đón trả và nhu cầu hỗ trợ trên hành trình.",
    href: "/explore?cat=transport",
    icon: BusIcon,
  },
  {
    title: "Ăn uống",
    description: "Khám phá danh mục và thử yêu cầu hỗ trợ tại nơi dùng bữa.",
    href: "/explore?cat=restaurant",
    icon: FoodIcon,
  },
  {
    title: "Hỗ trợ tại điểm đến",
    description: "Thống nhất điểm gặp và cách nhận hỗ trợ bạn mong muốn.",
    href: "/explore/support",
    icon: UserIcon,
  },
  {
    title: "Chó dẫn đường",
    description: "Kiến thức, cách ứng xử và chuẩn bị trước chuyến đi.",
    href: "/explore/guide-dogs",
    icon: AccessibleIcon,
  },
  {
    title: "Công nghệ hỗ trợ",
    description: "Dùng giọng nói, nghe nội dung và điều chỉnh cách hiển thị.",
    href: "/explore/assistive-technology",
    icon: MicIcon,
  },
  {
    title: "Cẩm nang du lịch",
    description:
      "Những gợi ý cụ thể để chuẩn bị và khám phá theo cách của bạn.",
    href: "/articles",
    icon: BookmarkIcon,
  },
];
export default function ServiceTiles({ compact = false }) {
  const items = compact
    ? [serviceTiles[4], serviceTiles[5], serviceTiles[6], serviceTiles[7]]
    : serviceTiles;
  return (
    <div className="services-grid">
      {items.map((s) => (
        <article key={s.title} className="service-tile">
          <span className="tile-icon" aria-hidden="true">
            <s.icon size={23} />
          </span>
          <h3>
            <Link href={s.href}>{s.title}</Link>
          </h3>
          <p>{s.description}</p>
          <Link
            href={s.href}
            className="text-link"
            aria-label={`Tìm hiểu ${s.title.toLowerCase()}`}
          >
            Tìm hiểu <span aria-hidden="true">↗</span>
          </Link>
        </article>
      ))}
    </div>
  );
}

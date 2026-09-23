import Link from "next/link";
import { GridIcon } from "@/components/Icons";

const GROUPS = [
  {
    title: "1. Giao diện chính",
    items: [
      ["Trang chủ", "/"], ["Tìm kiếm", "/search"], ["Điểm đến", "/explore?cat=destination"],
      ["Lưu trú", "/explore?cat=accommodation"], ["Ăn uống", "/explore?cat=restaurant"],
      ["Di chuyển", "/explore?cat=transport"], ["Vé", "/explore?cat=ticket"],
      ["Hoạt động", "/explore?cat=activity"], ["Bản đồ", "/navigation"],
      ["Lập kế hoạch", "/my-trip"], ["Chuyến đi của tôi", "/my-trip"],
      ["Đặt chỗ", "/my-booking"], ["Đã lưu", "/my-trip"], ["Hỗ trợ", "/help"],
    ],
  },
  {
    title: "2. Thông tin & nội dung",
    items: [
      ["Chi tiết điểm đến", "/destination?d=ho-guom"], ["Lưu trú demo", "/item?id=demo-hotel"],
      ["Ăn uống demo", "/item?id=demo-restaurant"], ["Di chuyển demo", "/item?id=demo-transport"],
      ["Chi tiết vé", "/item?id=ve-van-mieu"], ["Guide/Assistant demo", "/item?id=demo-guide-tour"],
      ["Trợ lý tại điểm đến", "/assistant"], ["Tải app", "/app"], ["SOS", "/sos"], ["Giới thiệu", "/help"],
      ["Cách hoạt động", "/help"], ["Tuyên bố tiếp cận", "/help"],
    ],
  },
  {
    title: "3. Hỗ trợ khả năng tiếp cận",
    items: [
      ["Accessibility Menu ♿", null], ["Tùy chọn tiếp cận", null], ["Cỡ chữ", null],
      ["Tương phản cao", null], ["Điều chỉnh màu", null], ["Giảm chuyển động", null],
      ["Screen reader", null], ["Text-to-Speech", null], ["Mô tả âm thanh", null],
      ["Voice Search", "/search"], ["Điều hướng bàn phím", null], ["Nghe nội dung 🔊", null],
    ],
  },
];

const JOURNEY = [
  ["Discover", "Tìm kiếm, voice search, khám phá điểm đến"],
  ["Explore", "Xem chi tiết, ảnh, nghe mô tả, thông tin tiếp cận, đánh giá"],
  ["Plan", "Thêm vào chuyến, lưu, trip planner, bản đồ, chỉ đường"],
  ["Book", "Chọn ngày/giờ/số khách, xác nhận đặt chỗ"],
  ["Travel", "My Trip, chỉ đường, mô tả âm thanh, hỗ trợ khẩn cấp"],
  ["After", "Viết đánh giá tiếp cận: lối vào, di chuyển, nhân viên, WC…"],
];

export const metadata = { title: "Sơ đồ website" };

export default function SitemapPage() {
  return (
    <div className="container-page py-10">
      <h1 className="flex items-center gap-3 text-4xl sm:text-5xl"><GridIcon size={36} /> Sơ đồ website</h1>
      <p className="hc-muted mt-3 max-w-2xl text-lg text-ink-soft">
        Kiến trúc thông tin (IA) của WayEcho. Các điểm chạm ♿ Accessibility · 🔊 Nghe · 🎙️ Voice
        xuất hiện xuyên suốt mọi trang, không tách thành website riêng.
      </p>

      {/* Flow hành trình */}
      <section className="mt-8" aria-labelledby="flow">
        <h2 id="flow" className="text-2xl">Luồng hành trình người dùng</h2>
        <div className="mt-4 flex flex-wrap items-stretch gap-2">
          {JOURNEY.map(([t, d], i) => (
            <div key={t} className="flex items-center gap-2">
              <div className="w-40 rounded-2xl border border-line bg-white p-3 hc-surface hc-border">
                <p className="font-display text-lg text-primary">{t}</p>
                <p className="hc-muted text-xs text-ink-soft">{d}</p>
              </div>
              {i < JOURNEY.length - 1 && <span aria-hidden="true" className="text-2xl text-primary">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Nhóm IA */}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <section key={g.title} className="rounded-[18px] border border-line bg-white p-6 shadow-card hc-surface hc-border" aria-label={g.title}>
            <h2 className="text-xl">{g.title}</h2>
            <ul className="mt-4 space-y-1">
              {g.items.map(([label, href]) => (
                <li key={label}>
                  {href ? (
                    <Link href={href} className="block rounded-lg px-3 py-2 font-medium text-ink hover:bg-surface-alt hover:text-accent-dark hc-surface">{label}</Link>
                  ) : (
                    <span className="block rounded-lg px-3 py-2 text-ink-soft hc-muted">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="hc-muted mt-8 text-sm text-ink-soft">
        Ghi chú: các mục chưa gắn liên kết là thành phần/tính năng nằm trong Accessibility Menu hoặc trang nội dung sẽ bổ sung.
      </p>
    </div>
  );
}

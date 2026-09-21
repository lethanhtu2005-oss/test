import Link from "next/link";
import { AccessibleIcon, PhoneIcon, MicIcon, SpeakerIcon } from "@/components/Icons";

export const metadata = { title: "Hỗ trợ & giới hạn demo — WayEcho" };

const STEPS = [
  ["Tạo Accessibility Profile", "Chọn Blind/Low Vision và các nhu cầu như screen reader, audio description, staff assistance."],
  ["Tìm & kiểm tra dữ liệu", "Xem rõ đâu là thông tin đã đối chiếu và đâu là accessibility data còn cần Business/Admin xác minh."],
  ["Booking & Request", "Profile chỉ gợi ý; Traveler chọn Accessibility Request sẽ chia sẻ trong booking cụ thể."],
  ["Trải nghiệm & Feedback", "Dùng voice/map/AI như công cụ hỗ trợ, sau đó đánh giá hoặc report dữ liệu accessibility sai."],
];

export default function HelpPage() {
  return (
    <div className="container-page py-10">
      <h1 className="text-4xl sm:text-5xl">Hỗ trợ & giới hạn bản demo</h1>
      <section className="mt-8 max-w-3xl" aria-labelledby="about"><h2 id="about" className="text-2xl">Về WayEcho</h2><p className="hc-muted mt-2 text-lg text-ink-soft">WayEcho là prototype nền tảng du lịch tiếp cận cho người mù và người nhìn kém. Bản web này minh họa luồng tìm kiếm, accessibility data, booking/request, My Trip, map/voice, AI camera, Human Support, SOS và các cổng Business/Guide/Admin.</p></section>

      <section className="mt-10" aria-labelledby="how"><h2 id="how" className="text-2xl">Cách hoạt động</h2><ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{STEPS.map(([t,d],i) => <li key={t} className="card hc-surface hc-border border border-line p-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-ink">{i+1}</span><h3 className="mt-3 text-lg">{t}</h3><p className="hc-muted mt-1 text-ink-soft">{d}</p></li>)}</ol></section>

      <section id="a11y" className="mt-10 max-w-3xl" aria-labelledby="a11y-title"><h2 id="a11y-title" className="flex items-center gap-2 text-2xl"><AccessibleIcon size={24} /> Accessibility</h2><p className="hc-muted mt-2 text-lg text-ink-soft">Giao diện được xây theo hướng hỗ trợ WCAG: semantic HTML, alt cho ảnh có ý nghĩa, điều hướng bàn phím, focus rõ, tương phản cao, chữ lớn, giảm chuyển động, screen reader và Text-to-Speech. Đây là mục tiêu thiết kế của prototype, <strong>không phải chứng nhận WCAG chính thức</strong>.</p><ul className="mt-4 space-y-2 text-ink-soft hc-muted"><li className="flex items-center gap-2"><MicIcon size={18} /> Voice Search — phụ thuộc hỗ trợ của trình duyệt và quyền micro.</li><li className="flex items-center gap-2"><SpeakerIcon size={18} /> Text-to-Speech — dùng Web Speech API nếu thiết bị hỗ trợ.</li><li className="flex items-center gap-2"><AccessibleIcon size={18} /> Accessibility Profile — lưu preference cục bộ trong bản demo.</li></ul></section>

      <section className="mt-10 rounded-[18px] border border-amber-300 bg-amber-50 p-6 text-amber-950" aria-labelledby="limits"><h2 id="limits" className="text-2xl">Những gì chưa phải dịch vụ thật</h2><p className="mt-2">Booking/payment, nhân sự hỗ trợ, doanh nghiệp, Guide/Assistant, dữ liệu route, cảnh báo chướng ngại và SOS backend hiện là mô phỏng. Không có tổng đài WayEcho 24/7 trong bản demo và không được dùng prototype thay cho dịch vụ khẩn cấp.</p></section>

      <section id="contact" className="mt-6 rounded-[18px] bg-black p-6 text-white" aria-labelledby="contact-title"><h2 id="contact-title" className="flex items-center gap-2 text-2xl"><PhoneIcon size={24} /> Human Support / SOS</h2><p className="mt-2 text-neutral-300">Trong sản phẩm thật, request hỗ trợ phải có trạng thái rõ ràng và chỉ chia sẻ location/thông tin theo quyền Traveler đã cấp.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/assistant" className="btn-primary">Xem AI Camera demo</Link><Link href="/sos" className="btn-dark border border-white">Mở SOS demo</Link></div></section>

      <section id="credits" className="mt-10 max-w-4xl" aria-labelledby="credits-title">
        <h2 id="credits-title" className="text-2xl">Nguồn hình ảnh</h2>
        <p className="hc-muted mt-2 text-ink-soft">Trang chủ sử dụng ảnh chụp thật, không dùng ảnh AI/generated cho các khối ảnh. Mỗi ảnh có mô tả alt; ảnh địa điểm được chọn từ nguồn có chú thích rõ để không gắn nhầm địa danh.</p>
        <ul className="hc-muted mt-4 grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
          <li><a className="underline" href="https://commons.wikimedia.org/wiki/File:Huc_Bridge.jpg" target="_blank" rel="noreferrer">Hồ Gươm & Cầu Thê Húc — Wikimedia Commons</a></li>
          <li><a className="underline" href="https://commons.wikimedia.org/wiki/File:Temple_of_Literature,_Hanoi_by_Xiquinho_Silva_02.jpg" target="_blank" rel="noreferrer">Văn Miếu – Quốc Tử Giám — Wikimedia Commons</a></li>
          <li><a className="underline" href="https://commons.wikimedia.org/wiki/File:Vietnam_hanoi_old_quarter.jpg" target="_blank" rel="noreferrer">Phố cổ Hà Nội — Wikimedia Commons</a></li>
          <li><a className="underline" href="https://commons.wikimedia.org/wiki/File:West_Lake_Hanoi.jpg" target="_blank" rel="noreferrer">Hồ Tây — Wikimedia Commons</a></li>
          <li><a className="underline" href="https://commons.wikimedia.org/wiki/File:Hanoi_train_street.jpg" target="_blank" rel="noreferrer">Phố đường tàu Hà Nội — Wikimedia Commons</a></li>
          <li><a className="underline" href="https://commons.wikimedia.org/wiki/File:Ph%E1%BB%9F_b%C3%A1t_%C4%91%C3%A1.jpg" target="_blank" rel="noreferrer">Phở chụp tại Hà Nội — Wikimedia Commons</a></li>
          <li><a className="underline" href="https://commons.wikimedia.org/wiki/File:Smartphone_with_navigation_map_app.jpg" target="_blank" rel="noreferrer">Ảnh minh họa bản đồ trên điện thoại — Wikimedia Commons</a></li>
          <li><a className="underline" href="https://commons.wikimedia.org/wiki/File:O%26M_instructor.jpg" target="_blank" rel="noreferrer">Ảnh minh họa hỗ trợ định hướng & gậy trắng — Wikimedia Commons</a></li>
        </ul>
      </section>
    </div>
  );
}

import InstallAppCard from "@/components/InstallAppCard";
import { AccessibleIcon, SpeakerIcon, CompassIcon, CameraIcon, PhoneIcon } from "@/components/Icons";

const FEATURES = [
  [AccessibleIcon, "Accessibility profile", "Giữ các tùy chọn Blind/Low Vision, chữ lớn, tương phản và nhu cầu hỗ trợ trên thiết bị."],
  [SpeakerIcon, "Text-to-Speech", "Đọc mô tả điểm đến, trạng thái và nội dung quan trọng bằng giọng nói."],
  [CompassIcon, "My Trip & Navigation", "Truy cập nhanh hành trình và bản đồ từ giao diện tối ưu cho màn hình điện thoại."],
  [CameraIcon, "Camera assistant", "Mở trợ lý mô tả hình ảnh demo, luôn kèm cảnh báo khi AI không chắc chắn."],
  [PhoneIcon, "SOS shortcut", "Nút SOS nằm trong thanh điều hướng mobile; bản demo không tự gọi dịch vụ khẩn cấp."],
];

export const metadata = { title: "Tải app" };

export default function AppDownloadPage() {
  return (
    <div className="container-page py-10">
      <p className="font-semibold text-accent-dark">WayEcho Mobile</p>
      <h1 className="mt-1 text-4xl sm:text-5xl">Tải app của chúng tôi</h1>
      <p className="hc-muted mt-3 max-w-3xl text-lg text-ink-soft">WayEcho hiện được đóng gói dưới dạng Progressive Web App (PWA). Khi website chạy trên HTTPS, bạn có thể cài trực tiếp lên màn hình chính và mở ở chế độ gần giống một ứng dụng độc lập.</p>

      <div className="mt-7"><InstallAppCard /></div>

      <section className="mt-10" aria-labelledby="app-features">
        <h2 id="app-features" className="text-3xl">Có gì trên bản điện thoại?</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(([Icon, title, desc]) => <article key={title} className="rounded-[18px] border border-line bg-white p-5 shadow-card hc-surface hc-border"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary"><Icon size={22} /></span><h3 className="mt-3 text-2xl">{title}</h3><p className="hc-muted mt-2 text-ink-soft">{desc}</p></article>)}
        </div>
      </section>

      <section className="mt-10 rounded-[18px] border border-amber-300 bg-amber-50 p-5 text-amber-950" aria-labelledby="pwa-note">
        <h2 id="pwa-note" className="text-2xl">Phân biệt PWA và app native</h2>
        <p className="mt-2">Bản giao này cài được lên điện thoại qua trình duyệt nhưng chưa phải APK/IPA và chưa được phát hành trên Google Play hoặc App Store. Nếu phát triển thành sản phẩm thật, có thể dùng cùng API/backend để xây app native hoặc wrapper sau.</p>
      </section>
    </div>
  );
}

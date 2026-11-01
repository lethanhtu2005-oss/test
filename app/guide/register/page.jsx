import InterestForm from "@/components/InterestForm";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function GuideRegisterPage() {
  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <header className="border-b border-line bg-white"><div className="container-page flex min-h-[70px] items-center justify-between"><Link href="/"><Logo height={38}/></Link><Link href="/guide/login" className="font-semibold text-[#1267a5] hover:underline">Đã có tài khoản? Đăng nhập</Link></div></header>
      <div className="container-page py-14"><div className="mx-auto max-w-3xl rounded-[28px] border border-line bg-white p-8 shadow-card"><p className="text-sm font-bold uppercase tracking-[.2em] text-[#d96812]">WayEcho Guide</p><h1 className="mt-3 text-5xl">Trở thành Guide / Personal Assistant</h1><p className="mt-4 text-lg text-ink-soft">Đăng ký quan tâm và giới thiệu phạm vi hỗ trợ mong muốn. Chưa có quy trình xét duyệt, xác minh hoặc phân công Guide thực tế; biểu mẫu không tự tạo tài khoản.</p><div className="mt-7 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#fff7e8] p-4"><b>1. Tạo hồ sơ</b><p className="mt-1 text-sm text-ink-soft">Thông tin cá nhân và dịch vụ.</p></div><div className="rounded-2xl bg-[#fff7e8] p-4"><b>2. Xác minh</b><p className="mt-1 text-sm text-ink-soft">WayEcho kiểm tra hồ sơ.</p></div><div className="rounded-2xl bg-[#fff7e8] p-4"><b>3. Nhận lịch</b><p className="mt-1 text-sm text-ink-soft">Mở lịch rảnh và nhận booking.</p></div></div><InterestForm kind="guide" enabled={process.env.WAYECHO_INQUIRIES_ENABLED === "1"}/><Link href="/guide/login" className="btn-primary mt-6">Quay lại đăng nhập</Link></div></div>
    </div>
  );
}

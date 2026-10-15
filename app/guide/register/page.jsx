import Link from "next/link";
import Logo from "@/components/Logo";

export default function GuideRegisterPage() {
  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="border-b border-line bg-white">
        <div className="container-page flex min-h-[70px] items-center justify-between">
          <Link href="/">
            <Logo height={38} />
          </Link>
          <Link
            href="/guide/login"
            className="font-semibold text-accent-dark hover:underline"
          >
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </header>
      <div className="container-page py-14">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-line bg-white p-8 shadow-card">
          <p className="text-sm font-bold uppercase tracking-[.2em] text-accent-dark">
            WayEcho Guide
          </p>
          <h1 className="mt-3 text-5xl">
            Trở thành Guide / Personal Assistant
          </h1>
          <p className="mt-4 text-lg text-ink-soft">
            Đăng ký hồ sơ, khai báo kinh nghiệm, khu vực, dịch vụ và lịch rảnh.
            Hồ sơ cần được WayEcho xác minh trước khi có thể nhận booking.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-surface-alt p-4">
              <b>1. Tạo hồ sơ</b>
              <p className="mt-1 text-sm text-ink-soft">
                Thông tin cá nhân và dịch vụ.
              </p>
            </div>
            <div className="rounded-2xl bg-surface-alt p-4">
              <b>2. Xác minh</b>
              <p className="mt-1 text-sm text-ink-soft">
                WayEcho kiểm tra hồ sơ.
              </p>
            </div>
            <div className="rounded-2xl bg-surface-alt p-4">
              <b>3. Nhận lịch</b>
              <p className="mt-1 text-sm text-ink-soft">
                Mở lịch rảnh và nhận booking.
              </p>
            </div>
          </div>
          <p className="mt-7 rounded-xl border border-line p-4 text-sm text-ink-soft">
            Form đăng ký chi tiết sẽ được nối ở bước hoàn thiện tiếp theo. Trang
            này hiện dùng để thể hiện đúng luồng sản phẩm trong prototype.
          </p>
          <Link href="/guide/login" className="btn-primary mt-6">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

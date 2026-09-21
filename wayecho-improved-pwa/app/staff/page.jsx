import Link from "next/link";
export const metadata = { title: "Staff Portal — WayEcho" };
export default function StaffPage() {
  return <div className="container-page py-14"><div className="mx-auto max-w-md rounded-[22px] border border-line bg-white p-7 shadow-sm"><p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">WayEcho Staff</p><h1 className="mt-2 text-4xl">Đăng nhập nội bộ</h1><p className="hc-muted mt-2 text-ink-soft">Khu vực dành cho nhân viên được cấp tài khoản. Prototype chưa kết nối hệ thống xác thực thật.</p><div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-950">Bản demo không cung cấp tài khoản Staff công khai. Trong sản phẩm thật, Staff dùng tài khoản nội bộ, mật khẩu và 2FA theo quyền được cấp.</div><Link href="/" className="btn-ghost mt-6 w-full">← Về WayEcho</Link></div></div>;
}

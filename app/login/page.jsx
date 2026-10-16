import LoginForm from "@/components/LoginForm";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";
export const metadata={title:"Đăng nhập",robots:{index:false,follow:false}};
export default function Login(){return <div className="container-page py-12"><section className="mx-auto max-w-lg rounded-2xl border border-line bg-white p-6 hc-surface hc-border"><h1 className="text-4xl">Đăng nhập WayEcho</h1><p className="mt-3 text-ink-soft">Dùng tài khoản được quản trị cấp. Chưa hỗ trợ tự đăng ký hoặc khôi phục mật khẩu. Hồ sơ tiếp cận trên thiết bị vẫn dùng được độc lập.</p><LoginForm/><div className="mt-6 flex flex-wrap gap-3"><Link href="/profile" className="btn-ghost">Hồ sơ trên thiết bị</Link><LogoutButton/></div></section></div>;}

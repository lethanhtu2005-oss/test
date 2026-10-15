import AdminNav from "@/components/AdminNav";

export const metadata = {
  description:
    "admin trên WayEcho prototype. Trang công cụ minh họa, không phải giao dịch hoặc dịch vụ thực tế.",
  robots: { index: false, follow: false },
  title: { default: "Quản trị", template: "%s · Quản trị · WayEcho" },
};

export default function AdminLayout({ children }) {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
}

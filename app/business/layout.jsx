import BusinessNav from "@/components/BusinessNav";

export const metadata = {
  description:
    "business trên WayEcho prototype. Trang công cụ minh họa, không phải giao dịch hoặc dịch vụ thực tế.",
  robots: { index: false, follow: false },
  title: {
    default: "Cổng doanh nghiệp",
    template: "%s · Doanh nghiệp · WayEcho",
  },
};

export default function BusinessLayout({ children }) {
  return (
    <div>
      <BusinessNav />
      {children}
    </div>
  );
}

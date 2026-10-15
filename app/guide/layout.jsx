import GuideShell from "@/components/GuideShell";

export const metadata = {
  description:
    "guide trên WayEcho prototype. Trang công cụ minh họa, không phải giao dịch hoặc dịch vụ thực tế.",
  robots: { index: false, follow: false },
  title: { default: "Cổng hướng dẫn viên", template: "%s · Guide · WayEcho" },
};

export default function GuideLayout({ children }) {
  return <GuideShell>{children}</GuideShell>;
}

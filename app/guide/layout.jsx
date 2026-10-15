import GuideShell from "@/components/GuideShell";

export const metadata = { title: { default: "Cổng hướng dẫn viên", template: "%s · Guide · WayEcho" } };

export default function GuideLayout({ children }) {
  return <GuideShell>{children}</GuideShell>;
}

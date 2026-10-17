import BusinessShell from "@/components/BusinessShell";

export const metadata = { robots:{index:false,follow:false}, title: { default: "Cổng doanh nghiệp", template: "%s · Doanh nghiệp · WayEcho" } };

export default function BusinessLayout({ children }) {
  return (
    <BusinessShell>{children}</BusinessShell>
  );
}

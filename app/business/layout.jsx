import BusinessShell from "@/components/BusinessShell";

export const metadata = { robots:{index:false,follow:false}, title: { default: "Cổng doanh nghiệp", template: "%s · Doanh nghiệp · WayEcho" } };

export default function BusinessLayout({ children }) {
  return (
    <div className="pb-24 md:pb-20"><BusinessShell>{children}</BusinessShell></div>
  );
}

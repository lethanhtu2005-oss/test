import BusinessNav from "@/components/BusinessNav";

export const metadata = { title: { default: "Cổng doanh nghiệp", template: "%s · Doanh nghiệp · WayEcho" } };

export default function BusinessLayout({ children }) {
  return (
    <div>
      <BusinessNav />
      {children}
    </div>
  );
}

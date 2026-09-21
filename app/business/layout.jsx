import BusinessNav from "@/components/BusinessNav";

export const metadata = { title: "Cổng doanh nghiệp — WayEcho" };

export default function BusinessLayout({ children }) {
  return (
    <div>
      <BusinessNav />
      {children}
    </div>
  );
}

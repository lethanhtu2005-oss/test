import AdminNav from "@/components/AdminNav";

export const metadata = { robots:{index:false,follow:false}, title: { default: "Quản trị", template: "%s · Quản trị · WayEcho" } };

export default function AdminLayout({ children }) {
  return (<div className="pb-24 md:pb-20"><AdminNav />{children}</div>);
}

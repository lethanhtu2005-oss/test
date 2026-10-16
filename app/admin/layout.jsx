import AdminNav from "@/components/AdminNav";

export const metadata = { robots:{index:false,follow:false}, title: { default: "Quản trị", template: "%s · Quản trị · WayEcho" } };

export default function AdminLayout({ children }) {
  return (<div><AdminNav />{children}</div>);
}

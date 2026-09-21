import AdminNav from "@/components/AdminNav";

export const metadata = { title: "Quản trị — WayEcho" };

export default function AdminLayout({ children }) {
  return (<div><AdminNav />{children}</div>);
}

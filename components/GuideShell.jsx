"use client";
import { usePathname } from "next/navigation";
import GuideNav from "@/components/GuideNav";
export default function GuideShell({children}) {
 const path=usePathname();
 if(path==="/guide/login" || path==="/guide/register")return <div>{children}</div>;
 return <div><GuideNav/><p className="container-page pt-4" role="note">DEMO: hồ sơ và lịch minh họa; chưa có phân công hoặc xác minh Guide thực tế.</p>{children}</div>;
}

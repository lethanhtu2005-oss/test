"use client";

import { usePathname } from "next/navigation";
import GuideNav from "@/components/GuideNav";

export default function GuideLayout({ children }) {
  const pathname = usePathname();
  const isPublicGuidePage = pathname === "/guide/login" || pathname === "/guide/register";
  return <div>{!isPublicGuidePage && <GuideNav />}{children}</div>;
}

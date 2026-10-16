"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import GuideNav from "@/components/GuideNav";
import { hasGuideSession } from "@/lib/guideSession";

export default function GuideShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicGuidePage = pathname === "/guide/login" || pathname === "/guide/register";
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isPublicGuidePage) return;
    if (hasGuideSession()) setAllowed(true);
    else router.replace(`/guide/login?next=${encodeURIComponent(pathname)}`);
  }, [isPublicGuidePage, pathname, router]);

  if (isPublicGuidePage) return <div>{children}</div>;
  if (!allowed) return <p className="container-page py-16 text-lg" role="status">Đang kiểm tra đăng nhập…</p>;
  return <div><GuideNav />{children}</div>;
}

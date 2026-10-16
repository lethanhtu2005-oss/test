import { NextResponse } from "next/server";
import { authenticate, errorResponse } from "@/lib/auth";
export async function proxy(req) {
  const p = req.nextUrl.pathname;
  if (p === "/guide/login" || p === "/guide/register") return NextResponse.next();
  const role = p.startsWith("/business") ? "business" : p.startsWith("/admin") ? "admin" : p.startsWith("/guide") ? "guide" : "traveler";
  try {
    const user = await authenticate(req);
    if (user.role !== role) return new NextResponse("Bạn không có quyền truy cập khu vực này. Mở /sos nếu cần hỗ trợ khẩn cấp.", { status:403, headers:{"Content-Type":"text/plain; charset=utf-8","Cache-Control":"no-store"} });
    const res=NextResponse.next();res.headers.set("Cache-Control","private, no-store");return res;
  } catch(e) {
    if(e.status !== 401) return errorResponse(e);
    const url=new URL(role === "guide" ? "/guide/login" : "/login",req.url);
    url.searchParams.set("next",p+req.nextUrl.search);
    return NextResponse.redirect(url);
  }
}
export const config = { matcher: ["/business/:path*","/admin/:path*","/guide/:path*","/my-booking/:path*","/my-trip/:path*","/notifications/:path*"] };

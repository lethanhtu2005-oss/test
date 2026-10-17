import { NextResponse } from "next/server";
import { authenticate, errorResponse } from "@/lib/auth";
// Chỉ chặn portal nội bộ. Trang Traveler dùng phiên khách và được giới hạn dữ liệu ở API.
export async function proxy(req) {
  const p = req.nextUrl.pathname;
  if (p === "/guide/login" || p === "/guide/register") return NextResponse.next();
  const role = p.startsWith("/business") ? "business" : p.startsWith("/admin") ? "admin" : "guide";
  const toLogin = () => {
    const url=new URL(role === "guide" ? "/guide/login" : "/login",req.url);
    url.searchParams.set("next",p+req.nextUrl.search);
    return NextResponse.redirect(url);
  };
  try {
    const user = await authenticate(req);
    // Phiên khách chưa phải tài khoản được cấp: đưa tới trang đăng nhập thay vì báo lỗi.
    if (user.guest) return toLogin();
    if (user.role !== role) {
      const login = `${role === "guide" ? "/guide/login" : "/login"}?next=${encodeURIComponent(p)}`;
      const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Không có quyền truy cập · WayEcho</title></head><body style="font:18px/1.6 system-ui,sans-serif;max-width:40rem;margin:3rem auto;padding:0 1rem"><main><h1>Bạn không có quyền truy cập khu vực này</h1><p>Tài khoản đang đăng nhập không thuộc khu vực này.</p><ul><li><a href="${login}">Đăng nhập bằng tài khoản khác</a></li><li><a href="/sos" style="color:#b91c1c;font-weight:700">SOS — hỗ trợ khẩn cấp</a></li><li><a href="/">Về trang chủ WayEcho</a></li></ul></main></body></html>`;
      return new NextResponse(html, { status:403, headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"} });
    }
    const res=NextResponse.next();res.headers.set("Cache-Control","private, no-store");return res;
  } catch(e) {
    if(e.status !== 401) return errorResponse(e);
    return toLogin();
  }
}
export const config = { matcher: ["/business/:path*","/admin/:path*","/guide/:path*"] };

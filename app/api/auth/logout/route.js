import { logout, checkOrigin, errorResponse, clearSessionCookies, json } from "@/lib/auth";
export async function POST(req) {
  try {
    checkOrigin(req);
    await logout(req);
    const res = json({ ok: true });
    for (const cookie of clearSessionCookies()) {
      res.headers.append("Set-Cookie", cookie);
    }
    return res;
  } catch(e) { return errorResponse(e); }
}

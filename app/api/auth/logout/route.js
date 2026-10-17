import { logout, checkOrigin, errorResponse, sessionCookie, json } from "@/lib/auth";
export async function POST(req) {
  try {
    checkOrigin(req); await logout(req);
    const res=json({ok:true});res.headers.set("Set-Cookie",sessionCookie("",true));return res;
  } catch(e) { return errorResponse(e); }
}

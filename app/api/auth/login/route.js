import { trustedLoginSource } from "@/lib/loginLimiter";
import { login, checkOrigin, errorResponse, sessionCookie, json } from "@/lib/auth";
import { readJson } from "@/lib/validate";
export async function POST(req) {
  try {
    checkOrigin(req);
    const body = await readJson(req);
    const result = await login(body?.email, body?.password, body?.requiredRole, trustedLoginSource(req));
    const res = json(result.user);
    res.headers.set("Set-Cookie",sessionCookie(result.token));
    return res;
  } catch(e) { return errorResponse(e); }
}

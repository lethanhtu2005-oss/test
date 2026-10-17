import { randomBytes, scrypt as rawScrypt, timingSafeEqual, createHash, createHmac } from "node:crypto";
import { promisify } from "node:util";
import { takeLoginPermit } from "./loginLimiter.js";
import { list, transaction, storageModeName } from "./store.js";
const scrypt = promisify(rawScrypt);
export const COOKIE = "we_session";
export const SESSION_MS = 8 * 60 * 60 * 1000;
export const GUEST_SESSION_MS = 30 * 24 * 60 * 60 * 1000;
export const ROLES = ["traveler", "business", "guide", "admin"];
export class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
export function fail(status, message) { throw new HttpError(status, message); }
export const digest = value => createHash("sha256").update(value).digest("hex");
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `${salt}:${hash.toString("hex")}`;
}
export async function verifyPassword(password, encoded) {
  const [salt, hex] = (encoded || "").split(":");
  const actual = await scrypt(password, salt || "invalid-account-salt", 64);
  const expected = /^[a-f0-9]{128}$/.test(hex || "") ? Buffer.from(hex, "hex") : Buffer.alloc(64);
  return timingSafeEqual(actual, expected) && !!salt && !!hex;
}

// Phiên không lưu ở server: cookie = claims + chữ ký HMAC, nên proxy và API ở
// instance serverless nào cũng tự kiểm được. Đánh đổi: không thu hồi từng phiên;
// đổi mật khẩu hoặc khóa tài khoản sẽ vô hiệu mọi phiên cũ (xem passwordMark).
function sessionSecret() {
  const secret = process.env.WAYECHO_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") fail(503, "Chưa cấu hình WAYECHO_SESSION_SECRET cho phiên đăng nhập.");
  // Dev: secret ngẫu nhiên theo tiến trình; khởi động lại server thì phải đăng nhập lại.
  globalThis.__WAYECHO_DEV_SESSION_SECRET ??= randomBytes(32).toString("hex");
  return globalThis.__WAYECHO_DEV_SESSION_SECRET;
}
const sign = body => createHmac("sha256", sessionSecret()).update(body).digest("base64url");
export function signSession(claims) {
  const body = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${body}.${sign(body)}`;
}
export function readSession(token) {
  const [body, signature] = typeof token === "string" ? token.split(".") : [];
  if (!body || !signature) return null;
  const expected = Buffer.from(sign(body)), actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const claims = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return claims && typeof claims === "object" && Number.isFinite(claims.exp) && claims.exp > Date.now() ? claims : null;
  } catch { return null; }
}
export function tokenFrom(req) {
  const value = (req.headers.get("cookie") || "").split(";").map(s=>s.trim()).find(s=>s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1);
  return /^[A-Za-z0-9_-]{16,1024}\.[A-Za-z0-9_-]{43}$/.test(value || "") ? value : null;
}
const passwordMark = hash => digest(hash || "").slice(0, 16);

// Tài khoản được cấp: WAYECHO_USERS (JSON, dùng được trên Vercel) + collection users (CLI local).
export async function listUsers() {
  let fromEnv = [];
  if (process.env.WAYECHO_USERS) {
    try { fromEnv = JSON.parse(process.env.WAYECHO_USERS); } catch { fail(503, "WAYECHO_USERS không phải JSON hợp lệ."); }
    if (!Array.isArray(fromEnv)) fail(503, "WAYECHO_USERS phải là mảng tài khoản.");
  }
  const normalized = fromEnv.map(u => ({ ...u, id: u.id || `env_${digest(String(u.email || "")).slice(0, 16)}`, email: String(u.email || "").trim().toLowerCase(), active: u.active !== false }));
  return normalized.concat(await list("users"));
}

export async function authenticate(req) {
  const token = tokenFrom(req);
  if (!token) fail(401, "Bạn cần đăng nhập để tiếp tục.");
  const claims = readSession(token);
  if (!claims || !ROLES.includes(claims.role)) fail(401, "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
  if (claims.guest) {
    if (claims.role !== "traveler" || !/^guest_[a-f0-9]{32}$/.test(claims.uid)) fail(401, "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
    return { id: claims.uid, role: "traveler", guest: true, businessId: null, guideId: null };
  }
  const user = (await listUsers()).find(u=>u.id===claims.uid && u.active === true);
  if (!user || user.role !== claims.role || passwordMark(user.passwordHash) !== claims.pw) fail(401, "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
  return { id: user.id, role: user.role, businessId: user.businessId || null, guideId: user.guideId || null };
}
// Traveler chưa có phiên được cấp một phiên khách gắn với trình duyệt, không cần tài khoản.
export function newGuest() {
  return { id: `guest_${randomBytes(16).toString("hex")}`, role: "traveler", guest: true, businessId: null, guideId: null };
}
export function guestCookie(user) {
  return sessionCookie(signSession({ uid: user.id, role: "traveler", guest: true, exp: Date.now() + GUEST_SESSION_MS }), false, GUEST_SESSION_MS);
}
export function requireRole(user, roles) { if (!roles.includes(user.role)) fail(403, "Bạn không có quyền thực hiện thao tác này."); }
export function checkOrigin(req) {
  if (["GET", "HEAD"].includes(req.method)) return;
  let allowed = (process.env.WAYECHO_ORIGIN || "").split(",").map(s=>s.trim()).filter(Boolean);
  if (!allowed.length) {
    if (process.env.NODE_ENV === "production" && !process.env.VERCEL) fail(503, "Chưa cấu hình địa chỉ website cho xác thực.");
    // Dev và Vercel: Origin phải trùng chính domain đang nhận request (kể cả domain preview).
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    allowed = [new URL(req.url).origin, ...(host ? [`https://${host}`] : [])];
  }
  if (!allowed.includes(req.headers.get("origin"))) fail(403, "Nguồn yêu cầu không hợp lệ.");
}
export function secured(fn, roles = ROLES, { guest = false } = {}) {
  return async req => {
    try {
      checkOrigin(req);
      let user, cookie = null;
      try { user = await authenticate(req); }
      catch (e) {
        if (e.status !== 401 || !guest) throw e;
        user = newGuest(); cookie = guestCookie(user);
      }
      requireRole(user, roles);
      const res = await fn(req, user);
      if (cookie) res.headers.append("Set-Cookie", cookie);
      return res;
    }
    catch (e) { return errorResponse(e); }
  };
}
export function errorResponse(e) {
  if (!e.status) console.error("WayEcho request failed", { code: "INTERNAL_ERROR" });
  return Response.json({ error: e.status ? e.message : "Không thể xử lý yêu cầu. Vui lòng thử lại." }, { status: e.status || 500, headers: { "Cache-Control": "no-store" } });
}
// Header cho client biết dữ liệu chỉ lưu tạm trong bộ nhớ (bản demo trên Vercel).
export const json = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store", ...(storageModeName() === "memory" ? { "X-WayEcho-Storage": "memory" } : {}) } });
export async function login(email, password, requiredRole, source) {
  if (typeof email !== "string" || typeof password !== "string" || password.length > 256 || email.length > 254) fail(400, "Tài khoản hoặc mật khẩu không hợp lệ.");
  const normalized = email.trim().toLowerCase();
  const key = digest(normalized);
  if (!source) {
    if (process.env.NODE_ENV === "production") fail(503,"Chưa có nguồn đăng nhập được xác thực.");
    source="development-local";
  }
  const permit = await transaction(db=>takeLoginPermit(db,key,source));
  if(!permit.allowed) fail(429,"Quá nhiều lần đăng nhập từ nguồn này. Hãy chờ rồi thử lại.");
  const user = (await listUsers()).find(u=>u.email === normalized);
  if (!(await verifyPassword(password, user?.passwordHash)) || !user?.active || !ROLES.includes(user.role) || (requiredRole && user.role !== requiredRole)) fail(401, "Tài khoản hoặc mật khẩu không đúng, hoặc chưa được cấp quyền.");
  const token = signSession({ uid: user.id, role: user.role, pw: passwordMark(user.passwordHash), exp: Date.now() + SESSION_MS });
  await transaction(db => { db.loginAttempts = db.loginAttempts.filter(a=>a.key!==permit.pairKey); });
  return { token, user: { id: user.id, role: user.role } };
}
// Phiên ký không lưu ở server nên đăng xuất = xóa cookie trên trình duyệt (route logout đặt Max-Age=0).
export async function logout() {}
export function sessionCookie(token, clear=false, maxMs=SESSION_MS) {
  return `${COOKIE}=${clear ? "" : token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${clear ? 0 : Math.floor(maxMs/1000)}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

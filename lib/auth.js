import { randomBytes, scrypt as rawScrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { takeLoginPermit } from "./loginLimiter.js";
import { list, transaction, insert } from "./store.js";
const scrypt = promisify(rawScrypt);
export const COOKIE = "we_session";
export const SESSION_MS = 8 * 60 * 60 * 1000;
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
export function tokenFrom(req) {
  const value = (req.headers.get("cookie") || "").split(";").map(s=>s.trim()).find(s=>s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length+1);
  return /^[a-f0-9]{64}$/.test(value || "") ? value : null;
}
export async function authenticate(req) {
  const token = tokenFrom(req);
  if (!token) fail(401, "Bạn cần đăng nhập để tiếp tục.");
  const session = (await list("sessions")).find(s=>s.tokenHash === digest(token) && s.expiresAt > Date.now());
  const user = session && (await list("users")).find(u=>u.id===session.userId && u.active === true);
  if (!user || !ROLES.includes(user.role)) fail(401, "Phiên đăng nhập không hợp lệ hoặc đã hết hạn.");
  return { id: user.id, role: user.role, businessId: user.businessId || null, guideId: user.guideId || null };
}
export function requireRole(user, roles) { if (!roles.includes(user.role)) fail(403, "Bạn không có quyền thực hiện thao tác này."); }
export function checkOrigin(req) {
  if (["GET", "HEAD"].includes(req.method)) return;
  const configured = process.env.WAYECHO_ORIGIN;
  if (process.env.NODE_ENV === "production" && !configured) fail(503, "Chưa cấu hình địa chỉ website cho xác thực.");
  if (req.headers.get("origin") !== (configured || new URL(req.url).origin)) fail(403, "Nguồn yêu cầu không hợp lệ.");
}
export function secured(fn, roles = ROLES) {
  return async req => {
    try { checkOrigin(req); const user = await authenticate(req); requireRole(user, roles); return await fn(req, user); }
    catch (e) { return errorResponse(e); }
  };
}
export function errorResponse(e) {
  if (!e.status) console.error("WayEcho request failed", { code: "INTERNAL_ERROR" });
  return Response.json({ error: e.status ? e.message : "Không thể xử lý yêu cầu. Vui lòng thử lại." }, { status: e.status || 500, headers: { "Cache-Control": "no-store" } });
}
export const json = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
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
  const user = (await list("users")).find(u=>u.email === normalized);
  if (!(await verifyPassword(password, user?.passwordHash)) || !user?.active || (requiredRole && user.role !== requiredRole)) fail(401, "Tài khoản hoặc mật khẩu không đúng, hoặc chưa được cấp quyền.");
  const token = randomBytes(32).toString("hex");
  await transaction(db => {
    const current = db.users.find(u=>u.id===user.id && u.active && u.passwordHash===user.passwordHash);
    if (!current) fail(401, "Tài khoản đã thay đổi. Vui lòng đăng nhập lại.");
    db.sessions = db.sessions.filter(s=>s.expiresAt > Date.now());
    const own = db.sessions.filter(s=>s.userId===user.id).slice(0,19);
    db.sessions = db.sessions.filter(s=>s.userId!==user.id).concat(own);
    insert(db,"sessions",{userId:user.id, tokenHash:digest(token), expiresAt:Date.now()+SESSION_MS});
    db.loginAttempts = db.loginAttempts.filter(a=>a.key!==permit.pairKey);
  });
  return { token, user: { id: user.id, role: user.role } };
}
export async function logout(req) {
  const token = tokenFrom(req);
  if (token) await transaction(db => { db.sessions = db.sessions.filter(s=>s.tokenHash!==digest(token)); });
}
export function sessionCookie(token, clear=false) {
  return `${COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${clear ? 0 : SESSION_MS/1000}${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
}

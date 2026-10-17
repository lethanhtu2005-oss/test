// Hai chế độ lưu:
// - "file": JSON trên một host có filesystem bền vững (dev, hoặc WAYECHO_STORAGE_MODE=local-single-host).
// - "memory": chỉ lưu tạm trong bộ nhớ instance (mặc định trên Vercel). Dữ liệu mất khi instance
//   khởi động lại và không đồng bộ giữa instance; giao diện hiển thị cảnh báo này (StorageNotice).
import { promises as fs } from "node:fs";
import path from "node:path";
import {hostname} from "node:os";
import { randomUUID } from "node:crypto";

const COLLECTIONS = ["bookings", "saved", "trip", "reviews", "requests", "notifications", "users", "loginAttempts", "inquiries"];
export class StorageError extends Error {
  constructor() { super("Không thể đọc/ghi dữ liệu. Chưa xác nhận thao tác thành công."); this.status = 503; }
}
export function storageMode() {
  const configured = process.env.WAYECHO_STORAGE_MODE;
  if (configured === "memory" || (!configured && process.env.VERCEL)) return "memory";
  // Filesystem của Vercel không bền; production tự quản phải chọn chế độ rõ ràng.
  if (process.env.VERCEL || (process.env.NODE_ENV === "production" && configured !== "local-single-host")) throw new StorageError();
  return "file";
}
export function storageModeName() { try { return storageMode(); } catch { return "unavailable"; } }
function dbPath() {
  storageMode();
  return process.env.WAYECHO_DATA_PATH || path.join(process.cwd(), "data", "db.json");
}
function normalize(db) {
  if (!db || typeof db !== "object" || Array.isArray(db)) throw new StorageError();
  for (const key of COLLECTIONS) {
    if (db[key] !== undefined && !Array.isArray(db[key])) throw new StorageError();
    db[key] ??= [];
  }
  return db;
}
async function memoryDB() {
  if (!globalThis.__WAYECHO_MEMORY_DB) {
    let seed = {};
    try { seed = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", "db.seed.json"), "utf8")); } catch { /* seed lỗi: bắt đầu rỗng */ }
    globalThis.__WAYECHO_MEMORY_DB ??= normalize(seed);
  }
  return globalThis.__WAYECHO_MEMORY_DB;
}
// Xếp hàng transaction trong bộ nhớ để các thao tác async không ghi đè nhau.
function memoryTransaction(fn) {
  const run = (globalThis.__WAYECHO_MEMORY_QUEUE || Promise.resolve()).then(async () => {
    const draft = structuredClone(await memoryDB());
    const result = await fn(draft);
    globalThis.__WAYECHO_MEMORY_DB = draft;
    return structuredClone(result);
  });
  globalThis.__WAYECHO_MEMORY_QUEUE = run.catch(() => {});
  return run;
}
async function readDB(file) {
  let raw;
  try { raw = await fs.readFile(file, "utf8"); }
  catch (e) {
    if (e.code !== "ENOENT") throw e;
    try { await fs.access(`${file}.initialized`); throw new StorageError(); }
    catch(markerError) { if(markerError.code !== "ENOENT") throw markerError; }
    raw = await fs.readFile(path.join(process.cwd(), "data", "db.seed.json"), "utf8");
  }
  return normalize(JSON.parse(raw));
}
export function insert(db, collection, item) {
  const record = { ...item, id: randomUUID(), createdAt: new Date().toISOString() };
  db[collection].unshift(record);
  return record;
}
export async function transaction(fn) {
  let lock, file, temp, acquired = false;
  try {
    if (storageMode() === "memory") return await memoryTransaction(fn);
    file = dbPath(); lock = `${file}.lock`;
    await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    for (let i = 0; i < 100; i++) {
      try { await fs.mkdir(lock, { mode: 0o700 }); acquired = true; break; }
      catch (e) { if (e.code !== "EEXIST") throw e; await new Promise(r => setTimeout(r, 20)); }
    }
    if (!acquired) throw new StorageError();
    await fs.writeFile(path.join(lock,"owner.json"),JSON.stringify({pid:process.pid,host:hostname(),startedAt:new Date().toISOString()}),{flag:"wx",mode:0o600});
    const db = await readDB(file);
    const result = await fn(db);
    // Marker ngăn tự tạo seed khi DB đã từng khởi tạo nhưng sau đó biến mất.
    try { await fs.writeFile(`${file}.initialized`,"initialized",{flag:"wx",mode:0o600}); }
    catch(e) { if(e.code!=="EEXIST") throw e; }
    temp = `${file}.${randomUUID()}.tmp`;
    const handle = await fs.open(temp, "wx", 0o600);
    try { await handle.writeFile(JSON.stringify(db, null, 2)); await handle.sync(); } finally { await handle.close(); }
    await fs.rename(temp, file);
    return result;
  } catch (e) {
    if (e.status && e.status !== 503) throw e;
    console.error("WayEcho storage unavailable", { code: e.code || "STORAGE_ERROR" });
    throw new StorageError();
  } finally {
    if (temp) await fs.unlink(temp).catch(() => {});
    if (acquired) { await fs.unlink(path.join(lock,"owner.json")).catch(()=>{}); await fs.rmdir(lock).catch(() => {}); }
  }
}
export async function list(collection) {
  try {
    if (storageMode() === "memory") return structuredClone((await memoryDB())[collection] || []);
    return (await readDB(dbPath()))[collection] || [];
  }
  catch (e) { console.error("WayEcho storage read failed", { code: e.code || "STORAGE_ERROR" }); throw new StorageError(); }
}
// Giữ exports cũ cho code hiện có; nghiệp vụ nhiều thao tác dùng transaction.
export async function add(collection, item) { return transaction(db => insert(db, collection, item)); }
export async function update(collection, id, patch) {
  return transaction(db => { const record = db[collection].find(x => x.id === id); if (!record) return null; Object.assign(record, patch, { id: record.id, updatedAt: new Date().toISOString() }); return record; });
}
export async function remove(collection, id) {
  return transaction(db => { db[collection] = db[collection].filter(x => x.id !== id && x.refId !== id); return { ok: true }; });
}

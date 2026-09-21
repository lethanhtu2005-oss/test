// Store nhẹ dùng file JSON (data/db.json). Nếu ghi file thất bại (ví dụ môi
// trường serverless read-only), tự chuyển sang lưu tạm trong bộ nhớ.
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");
const EMPTY = {
  bookings: [],
  saved: [],
  trip: [],
  reviews: [],
  requests: [],      // accessibility requests (Traveler → Business)
  notifications: [], // thông báo (theo vai trò)
};

// Bộ nhớ tạm dùng chung giữa các request trong cùng tiến trình.
globalThis.__TE_DB = globalThis.__TE_DB || null;

async function readDB() {
  if (globalThis.__TE_DB) return globalThis.__TE_DB;
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    globalThis.__TE_DB = { ...EMPTY, ...JSON.parse(raw) };
  } catch (_) {
    globalThis.__TE_DB = { ...EMPTY };
  }
  return globalThis.__TE_DB;
}

async function writeDB(db) {
  globalThis.__TE_DB = db;
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
  } catch (_) {
    // Không ghi được file → giữ trong bộ nhớ, không làm hỏng luồng.
  }
}

export async function list(collection) {
  const db = await readDB();
  return db[collection] || [];
}

export async function add(collection, item) {
  const db = await readDB();
  const record = { id: `${collection}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString(), ...item };
  db[collection] = [record, ...(db[collection] || [])];
  await writeDB(db);
  return record;
}

export async function update(collection, id, patch) {
  const db = await readDB();
  let updated = null;
  db[collection] = (db[collection] || []).map((x) => {
    if (x.id === id) { updated = { ...x, ...patch, updatedAt: new Date().toISOString() }; return updated; }
    return x;
  });
  await writeDB(db);
  return updated;
}

export async function remove(collection, id) {
  const db = await readDB();
  db[collection] = (db[collection] || []).filter((x) => x.id !== id && x.refId !== id);
  await writeDB(db);
  return { ok: true };
}

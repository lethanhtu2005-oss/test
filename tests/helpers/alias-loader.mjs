// Loader cho test: hiểu alias "@/..." của Next.js và import thiếu đuôi ".js".
// Dùng module.register (có từ Node 20.6) thay cho registerHooks (chỉ có từ Node 22.15).
import path from "node:path";
import { pathToFileURL } from "node:url";
let root;
export function initialize(data) { root = data.root; }
export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) return next(pathToFileURL(path.join(root, specifier.slice(2) + ".js")).href, context);
  try { return await next(specifier, context); }
  catch (e) { if (specifier.startsWith(".") && !path.extname(specifier)) return next(specifier + ".js", context); throw e; }
}

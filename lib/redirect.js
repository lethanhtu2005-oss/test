export function safeNext(value, fallback = "/profile") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || /[\\\x00-\x20]/.test(value)) return fallback;
  try { const u=new URL(value,"https://wayecho.invalid"); return u.origin === "https://wayecho.invalid" && u.pathname !== "/login" ? u.pathname+u.search+u.hash : fallback; } catch { return fallback; }
}

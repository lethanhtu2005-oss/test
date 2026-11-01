// API server là nguồn xác thực; không đọc/ghi sessionStorage.
export async function hasGuideSession() { const res=await fetch("/api/auth/session",{cache:"no-store"});return res.ok && (await res.json()).role === "guide"; }
export async function startGuideSession(email,password) {
 const res=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password,requiredRole:"guide"})});
 const body=await res.json();if(!res.ok)throw Error(body.error || "Không đăng nhập được.");return body;
}
export async function endGuideSession() { const res=await fetch("/api/auth/logout",{method:"POST"});if(!res.ok)throw Error("Chưa đăng xuất được."); }

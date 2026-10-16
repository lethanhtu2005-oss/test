"use client";
import { useState } from "react";
import { safeNext } from "@/lib/redirect";
export default function LoginForm() {
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(event) {
    event.preventDefault();setBusy(true);setError("");
    const form=new FormData(event.currentTarget);
    try {
      const res=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.get("email"),password:form.get("password")})});
      const body=await res.json(); if(!res.ok)throw Error(body.error);
      const fallback={admin:"/admin",business:"/business",guide:"/guide",traveler:"/profile"}[body.role];
      window.location.assign(safeNext(new URLSearchParams(window.location.search).get("next"),fallback));
    }catch(e){setError(e.message || "Không đăng nhập được. Hãy thử lại.");}finally{setBusy(false);}
  }
  return <form onSubmit={submit} className="mt-6 space-y-4"><div><label htmlFor="login-email" className="block font-semibold">Email được cấp tài khoản</label><input id="login-email" name="email" required type="email" autoComplete="username" className="mt-2 w-full rounded-xl border border-line p-3" /></div><div><label htmlFor="login-password" className="block font-semibold">Mật khẩu</label><input id="login-password" name="password" required type="password" autoComplete="current-password" maxLength={256} className="mt-2 w-full rounded-xl border border-line p-3" /></div>{error && <p role="alert" className="text-red-800">{error}</p>}<button className="btn-primary" disabled={busy}>{busy?"Đang đăng nhập…":"Đăng nhập"}</button></form>;
}

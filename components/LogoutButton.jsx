"use client";
import { useState } from "react";
export default function LogoutButton() {
  const [error,setError]=useState("");
  async function logout(){try{const res=await fetch("/api/auth/logout",{method:"POST"});if(!res.ok)throw Error();window.location.assign("/login");}catch{setError("Chưa đăng xuất được. Hãy thử lại.");}}
  return <><button type="button" onClick={logout} className="btn-ghost">Đăng xuất</button>{error && <p role="alert">{error}</p>}</>;
}

"use client";
import {createContext,useContext,useEffect,useState} from "react";
import Link from "next/link";
import BusinessNav from "./BusinessNav";
import LogoutButton from "./LogoutButton";
import {getBusiness} from "@/data/businesses";
const BusinessContext=createContext(null);
export function useBusiness(){const value=useContext(BusinessContext);if(!value)throw Error("Thiếu phạm vi doanh nghiệp.");return value;}
export default function BusinessShell({children}){
 const [user,setUser]=useState(null),[error,setError]=useState("");
 useEffect(()=>{fetch("/api/auth/session",{cache:"no-store"}).then(async res=>{const data=await res.json();if(!res.ok||data.role!=="business")throw Error("Không xác thực được quyền doanh nghiệp.");if(!getBusiness(data.businessId))throw Error("Tài khoản chưa được gán doanh nghiệp có trong dữ liệu hiện tại.");return data;}).then(setUser).catch(e=>setError(e.message));},[]);
 if(error)return <div className="container-page py-10" role="alert">{error} <Link href="/login" className="underline">Đăng nhập</Link></div>;
 if(!user)return <p role="status" className="container-page py-10">Đang kiểm tra phạm vi doanh nghiệp…</p>;
 return <BusinessContext.Provider value={user}><BusinessNav/><div className="container-page pt-4"><p role="note">Dịch vụ và đối tác trong catalog vẫn là DEMO. Booking/request được lưu theo tài khoản; chưa có nhà cung cấp hoặc thanh toán thật.</p><LogoutButton/></div>{children}</BusinessContext.Provider>;
}

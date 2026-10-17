"use client";
import {useState} from "react";
import {api} from "@/lib/api";
import {useA11y} from "./A11yProvider";
export default function DestinationActions({destination}){const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);const {speak}=useA11y();async function save(){setBusy(true);try{await api.savePlace({refId:destination.slug,name:destination.name,cat:"destination",image:destination.image});setMessage("Đã lưu địa điểm cho tài khoản đang đăng nhập.");speak("Đã lưu địa điểm.");}catch(e){setMessage(e.message);speak(e.message);}finally{setBusy(false);}}return <div className="mt-5"><button className="btn-ghost hc-border" disabled={busy} type="button" onClick={save}>{busy?"Đang lưu…":"Lưu điểm đến"}</button>{message&&<p role="status" className="mt-2">{message}</p>}</div>;}
